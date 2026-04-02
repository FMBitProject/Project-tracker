"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { TaskDetailModal } from "@/components/project/task-detail-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { FolderKanban, Plus, Pencil, Trash2, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
    id: string;
    title: string;
    content?: string | null;
    priority: "low" | "medium" | "high" | "critical";
    status: "todo" | "in_progress" | "review" | "done";
    progress: number;
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string;
}

interface Project {
    id: string;
    name: string;
    description?: string | null;
    tasks: Task[];
}

const priorityColors = {
    low: "border-l-green-500",
    medium: "border-l-yellow-500",
    high: "border-l-orange-500",
    critical: "border-l-red-500 task-critical",
};

const statusLabels = {
    todo: "To Do",
    in_progress: "In Progress",
    review: "Review",
    done: "Done",
};

export default function ProjectDetailPage() {
    const params = useParams();
    const projectId = params.id as string;

    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isCreatingTask, setIsCreatingTask] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskContent, setNewTaskContent] = useState("");
    const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high" | "critical">("medium");
    const [newTaskStartDate, setNewTaskStartDate] = useState<Date>(new Date());
    const [newTaskEndDate, setNewTaskEndDate] = useState<Date>(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

    useEffect(() => {
        fetchProject();
    }, [projectId]);

    async function fetchProject() {
        try {
            const response = await fetch(`/api/projects/${projectId}`);
            if (response.ok) {
                const data = await response.json();
                setProject(data);
            }
        } catch (error) {
            console.error("Error fetching project:", error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleCreateTask(e: React.FormEvent) {
        e.preventDefault();
        try {
            const response = await fetch("/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    projectId,
                    title: newTaskTitle,
                    content: newTaskContent,
                    priority: newTaskPriority,
                    startDate: newTaskStartDate.toISOString(),
                    endDate: newTaskEndDate.toISOString(),
                }),
            });

            if (response.ok) {
                setNewTaskTitle("");
                setNewTaskContent("");
                setNewTaskPriority("medium");
                setIsCreatingTask(false);
                fetchProject();
            }
        } catch (error) {
            console.error("Error creating task:", error);
        }
    }

    async function handleDeleteTask(taskId: string) {
        if (!confirm("Are you sure you want to delete this task?")) return;

        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                fetchProject();
            }
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    }

    const calculateProgress = () => {
        if (!project || project.tasks.length === 0) return 0;
        const totalProgress = project.tasks.reduce((acc, task) => acc + task.progress, 0);
        return Math.round(totalProgress / project.tasks.length);
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-64">Loading...</div>;
    }

    if (!project) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Project not found</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{project.name}</h1>
                    {project.description && (
                        <p className="text-muted-foreground mt-1">{project.description}</p>
                    )}
                </div>
                <Dialog open={isCreatingTask} onOpenChange={setIsCreatingTask}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New Task
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <form onSubmit={handleCreateTask}>
                            <DialogHeader>
                                <DialogTitle>Create New Task</DialogTitle>
                                <DialogDescription>
                                    Add a new task to this project
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="title">Task Title</Label>
                                    <Input
                                        id="title"
                                        value={newTaskTitle}
                                        onChange={(e) => setNewTaskTitle(e.target.value)}
                                        placeholder="Task title"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="content">Description (Markdown)</Label>
                                    <Textarea
                                        id="content"
                                        value={newTaskContent}
                                        onChange={(e) => setNewTaskContent(e.target.value)}
                                        placeholder="Task details in Markdown format"
                                        rows={4}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Priority</Label>
                                    <Select value={newTaskPriority} onValueChange={(v) => setNewTaskPriority(v as any)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                            <SelectItem value="critical">Critical</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Start Date</Label>
                                        <Calendar
                                            mode="single"
                                            selected={newTaskStartDate}
                                            onSelect={(date) => date && setNewTaskStartDate(date)}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>End Date</Label>
                                        <Calendar
                                            mode="single"
                                            selected={newTaskEndDate}
                                            onSelect={(date) => date && setNewTaskEndDate(date)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsCreatingTask(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">Create Task</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Progress */}
            <Card>
                <CardHeader>
                    <CardTitle>Overall Progress</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Progress value={calculateProgress()} className="h-3" />
                        <p className="text-sm text-muted-foreground text-right">
                            {calculateProgress()}% complete
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Tasks */}
            <div>
                <h2 className="text-xl font-semibold mb-4">
                    Tasks ({project.tasks.length})
                </h2>
                {project.tasks.length === 0 ? (
                    <Card className="p-8 text-center">
                        <p className="text-muted-foreground">No tasks yet. Create your first task!</p>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {project.tasks.map((task) => {
                            const isImminent =
                                new Date(task.endDate).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000 &&
                                task.status !== "done";

                            return (
                                <Card
                                    key={task.id}
                                    className={cn(
                                        "cursor-pointer hover:bg-accent/50 transition-colors priority-" + task.priority,
                                        "border-l-4"
                                    )}
                                    onClick={() => setSelectedTask(task)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold">{task.title}</h3>
                                                    {isImminent && (
                                                        <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded font-bold">
                                                            IMMINENT
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                                    <span>{statusLabels[task.status]}</span>
                                                    <span>•</span>
                                                    <span>{task.progress}% complete</span>
                                                    <span>•</span>
                                                    <span>Due: {new Date(task.endDate).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedTask(task);
                                                    }}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteTask(task.id);
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Task Detail Modal */}
            {selectedTask && (
                <TaskDetailModal
                    task={selectedTask}
                    open={!!selectedTask}
                    onOpenChange={(open) => !open && setSelectedTask(null)}
                    onUpdate={() => fetchProject()}
                />
            )}
        </div>
    );
}
