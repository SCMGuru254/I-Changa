
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, Send, UserCircle, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types";

export function MessageList({ groupId }: { groupId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageInput, setMessageInput] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('group-messages')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `group_id=eq.${groupId}`
      }, (payload) => {
        const newMessage = payload.new as Message;
        setMessages(prevMessages => [...prevMessages, newMessage]);
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [groupId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          sender_id,
          content,
          created_at,
          is_voice,
          audio_url,
          sender:sender_id(full_name)
        `)
        .eq('group_id', groupId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedMessages = data.map(msg => ({
        ...msg,
        sender_name: msg.sender?.full_name || 'Unknown User'
      }));

      setMessages(formattedMessages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!messageInput.trim() && !audioBlob) return;
    
    try {
      if (audioBlob) {
        await sendVoiceMessage();
      } else {
        // Send text message
        const { error } = await supabase
          .from('messages')
          .insert({
            group_id: groupId,
            sender_id: user?.id,
            content: messageInput,
            is_voice: false
          });

        if (error) throw error;
      }
      
      setMessageInput("");
      setAudioBlob(null);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        // Release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendVoiceMessage = async () => {
    if (!audioBlob) return;

    try {
      // Upload audio file to Supabase Storage
      const fileName = `voice-${Date.now()}.webm`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('voice-messages')
        .upload(fileName, audioBlob);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('voice-messages')
        .getPublicUrl(fileName);

      // Save message with audio URL
      const { error } = await supabase
        .from('messages')
        .insert({
          group_id: groupId,
          sender_id: user?.id,
          content: 'Voice message',
          is_voice: true,
          audio_url: publicUrlData.publicUrl
        });

      if (error) throw error;
      
      setAudioBlob(null);
    } catch (error) {
      console.error('Error sending voice message:', error);
      toast({
        title: "Error",
        description: "Failed to send voice message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const playAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play();
  };

  return (
    <Card className="flex flex-col h-[500px]">
      <div className="bg-muted p-3 rounded-t-md">
        <h3 className="font-medium">Group Chat</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p>Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-muted-foreground">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start gap-2 max-w-[80%] ${message.sender_id === user?.id ? 'flex-row-reverse' : ''}`}>
                <Avatar className="h-8 w-8">
                  <UserCircle className="h-8 w-8" />
                </Avatar>
                <div className={`rounded-lg p-3 ${message.sender_id === user?.id ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <div className="text-xs text-muted-foreground mb-1">
                    {message.sender_id === user?.id ? 'You' : message.sender_name}
                  </div>
                  
                  {message.is_voice ? (
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => message.audio_url && playAudio(message.audio_url)}
                        className="h-8 px-2"
                      >
                        <Mic className="h-4 w-4 mr-1" /> Play
                      </Button>
                      {message.audio_url && (
                        <a 
                          href={message.audio_url} 
                          download="voice-message.webm"
                          className="hover:text-primary"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  ) : (
                    <p>{message.content}</p>
                  )}
                  <div className="text-xs mt-1 text-muted-foreground">
                    {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-3 border-t flex items-center gap-2">
        {audioBlob ? (
          <div className="flex-1 flex items-center justify-between bg-muted rounded p-2">
            <span>Voice message ready to send</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setAudioBlob(null)}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Input
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1"
            disabled={isRecording}
          />
        )}
        
        <Button
          variant="ghost"
          size="icon"
          onClick={isRecording ? stopRecording : startRecording}
          title={isRecording ? "Stop recording" : "Start voice message"}
        >
          {isRecording ? <MicOff className="h-5 w-5 text-red-500" /> : <Mic className="h-5 w-5" />}
        </Button>
        
        <Button
          variant="default"
          size="icon"
          onClick={sendMessage}
          disabled={(!messageInput.trim() && !audioBlob) || isRecording}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </Card>
  );
}
