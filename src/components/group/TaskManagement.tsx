
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, FileText, Check, X, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Task {
  id: string;
  title: string;
  description: string;
  assignee_id: string;
  group_id: string;
  is_completed: boolean;
  due_date: string;
  created_at: string;
  assignee_name?: string;
}

interface TaskManagementProps {
  groupId: string;
  isAdmin: boolean;
  isTreasurer: boolean;
  members: any[];
}

export function TaskManagement({ groupId, isAdmin, isTreasurer, members }: TaskManagementProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskAssignee, setTaskAssignee] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('group-tasks')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'tasks',
        filter: `group_id=eq.${groupId}`
      }, () => {
        fetchTasks();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [groupId]);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          profiles:assignee_id(full_name)
        `)
        .eq('group_id', groupId)
        .order('due_date', { ascending: true });

      if (error) throw error;

      const formattedTasks = data.map(task => ({
        ...task,
        assignee_name: task.profiles?.full_name || 'Unassigned'
      }));

      setTasks(formattedTasks);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load tasks. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!taskTitle.trim()) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('tasks')
        .insert({
          title: taskTitle,
          description: taskDescription,
          group_id: groupId,
          assignee_id: taskAssignee || null,
          due_date: taskDueDate || null
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Task created successfully",
      });
      
      setTaskTitle("");
      setTaskDescription("");
      setTaskAssignee("");
      setTaskDueDate("");
      setDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create task",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleComplete = async (taskId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ is_completed: !currentStatus })
        .eq('id', taskId);

      if (error) throw error;

      // Update UI optimistically
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId 
            ? { ...task, is_completed: !currentStatus } 
            : task
        )
      );
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const canCreateTasks = isAdmin || isTreasurer;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Group Tasks</h3>
        
        {canCreateTasks && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>
                  Assign responsibilities to group members
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Task title"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the task..."
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="assignee">Assignee</Label>
                  <Select value={taskAssignee} onValueChange={setTaskAssignee}>
                    <SelectTrigger>
                      <SelectValue placeholder="Assign to..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Unassigned</SelectItem>
                      {members.map(member => (
                        <SelectItem key={member.member_id} value={member.member_id}>
                          {member.profiles?.full_name || 'Unknown'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="due-date">Due Date</Label>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input
                      id="due-date"
                      type="date"
                      value={taskDueDate}
                      onChange={(e) => setTaskDueDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleCreateTask} disabled={isSubmitting || !taskTitle.trim()}>
                  <FileText className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Creating..." : "Create Task"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-muted-foreground">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-center text-muted-foreground">No tasks created yet</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-start p-3 rounded-lg border ${
                task.is_completed ? 'bg-muted/40' : ''
              }`}
            >
              <Checkbox
                checked={task.is_completed}
                onCheckedChange={() => handleToggleComplete(task.id, task.is_completed)}
                className="mt-1"
              />
              <div className="ml-3 flex-1">
                <h4 className={`font-medium ${task.is_completed ? 'line-through text-muted-foreground' : ''}`}>
                  {task.title}
                </h4>
                {task.description && (
                  <p className={`text-sm mt-1 ${task.is_completed ? 'text-muted-foreground' : ''}`}>
                    {task.description}
                  </p>
                )}
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>Assigned to: {task.assignee_name}</span>
                  {task.due_date && (
                    <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
