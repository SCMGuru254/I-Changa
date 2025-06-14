
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
import { Plus, FileText, Calendar, Trash2, Edit } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Task } from "@/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskAssignee, setTaskAssignee] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
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
        .select(`*`)
        .eq('group_id', groupId)
        .order('due_date', { ascending: true });

      if (error) throw error;

      const tasksWithNames = await Promise.all((data || []).map(async (task) => {
        if (task.assignee_id) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', task.assignee_id)
            .single();
          
          return {
            ...task,
            assignee_name: profileData?.full_name || 'Unknown'
          };
        }
        return {
          ...task,
          assignee_name: 'Unassigned'
        };
      }));

      setTasks(tasksWithNames);
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

  const resetForm = () => {
    setTaskTitle("");
    setTaskDescription("");
    setTaskAssignee("");
    setTaskDueDate("");
    setEditingTask(null);
  };

  const handleCreateTask = async () => {
    if (!taskTitle.trim()) {
      toast({
        title: "Validation Error",
        description: "Task title is required",
        variant: "destructive",
      });
      return;
    }
    
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
      
      resetForm();
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

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description || "");
    setTaskAssignee(task.assignee_id || "");
    setTaskDueDate(task.due_date || "");
    setEditDialogOpen(true);
  };

  const handleUpdateTask = async () => {
    if (!editingTask || !taskTitle.trim()) {
      toast({
        title: "Validation Error",
        description: "Task title is required",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          title: taskTitle,
          description: taskDescription,
          assignee_id: taskAssignee || null,
          due_date: taskDueDate || null
        })
        .eq('id', editingTask.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Task updated successfully",
      });
      
      resetForm();
      setEditDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update task",
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

      setTasks(prev => 
        prev.map(task => 
          task.id === taskId 
            ? { ...task, is_completed: !currentStatus } 
            : task
        )
      );

      toast({
        title: "Success",
        description: `Task marked as ${!currentStatus ? 'completed' : 'incomplete'}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      setTasks(prev => prev.filter(task => task.id !== taskId));
      
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  const canCreateTasks = isAdmin || isTreasurer;
  const canEditTasks = isAdmin || isTreasurer;

  const TaskDialog = ({ 
    open, 
    onOpenChange, 
    title, 
    onSubmit, 
    submitText 
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    onSubmit: () => void;
    submitText: string;
  }) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {editingTask ? "Update task details" : "Assign responsibilities to group members"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Task title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              required
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
                <SelectItem value="unassigned">Unassigned</SelectItem>
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
          <Button variant="outline" onClick={() => {
            onOpenChange(false);
            resetForm();
          }}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting || !taskTitle.trim()}>
            <FileText className="h-4 w-4 mr-2" />
            {isSubmitting ? "Saving..." : submitText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

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
            <TaskDialog
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              title="Create New Task"
              onSubmit={handleCreateTask}
              submitText="Create Task"
            />
          </Dialog>
        )}
      </div>
      
      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-muted-foreground py-8">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No tasks created yet</p>
            {canCreateTasks && (
              <p className="text-sm text-muted-foreground mt-2">Create your first task to get started</p>
            )}
          </div>
        ) : (
          tasks.map((task) => {
            const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !task.is_completed;
            
            return (
              <div
                key={task.id}
                className={`flex items-start p-4 rounded-lg border transition-colors ${
                  task.is_completed 
                    ? 'bg-muted/40 border-muted' 
                    : isOverdue 
                    ? 'bg-red-50 border-red-200' 
                    : 'bg-background border-border hover:bg-muted/20'
                }`}
              >
                <Checkbox
                  checked={task.is_completed}
                  onCheckedChange={() => handleToggleComplete(task.id, task.is_completed)}
                  className="mt-1"
                />
                <div className="ml-3 flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className={`font-medium ${task.is_completed ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                        {isOverdue && (
                          <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            Overdue
                          </span>
                        )}
                      </h4>
                      {task.description && (
                        <p className={`text-sm mt-1 ${task.is_completed ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                          {task.description}
                        </p>
                      )}
                      <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                        <span>Assigned to: <span className="font-medium">{task.assignee_name}</span></span>
                        {task.due_date && (
                          <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                            Due: {new Date(task.due_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {canEditTasks && (
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditTask(task)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Task</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{task.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteTask(task.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <TaskDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        title="Edit Task"
        onSubmit={handleUpdateTask}
        submitText="Update Task"
      />
    </Card>
  );
}
