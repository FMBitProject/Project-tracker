"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { TaskDetailModal } from "@/components/project/task-detail-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    Plus,
    X,
    Pencil,
    Trash2,
    AlertCircle,
    CheckCircle2,
    Loader2,
    Calendar as CalendarIcon,
} from "lucide-react";
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
    critical: "border-l-red-500",
};

const priorityBadgeColors = {
    low: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-orange-100 text-orange-700",
    critical: "bg-red-100 text-red-700",
};

const statusColors = {
    todo: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
    in_progress: "bg-blue-100 text-blue-700",
    review: "bg-purple-100 text-purple-700",
    done: "bg-green-100 text-green-700",
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

    // New task form state
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskContent, setNewTaskContent] = useState("");
    const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high" | "critical">("medium");
    const [newTaskStatus, setNewTaskStatus] = useState<"todo" | "in_progress" | "review" | "done">("todo");
    const [newTaskStartDate, setNewTaskStartDate] = useState("");
    const [newTaskEndDate, setNewTaskEndDate] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchProject();
    }, [projectId]);

    async function fetchProject() {
        try {
            setIsLoading(true);
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
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    projectId,
                    title: newTaskTitle.trim(),
                    content: newTaskContent.trim() || undefined,
                    priority: newTaskPriority,
                    status: newTaskStatus,
                    startDate: new Date(newTaskStartDate).toISOString(),
                    endDate: new Date(newTaskEndDate).toISOString(),
                }),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || "Failed to create task");
            }

            // Reset form
            setNewTaskTitle("");
            setNewTaskContent("");
            setNewTaskPriority("medium");
            setNewTaskStatus("todo");
            setNewTaskStartDate("");
            setNewTaskEndDate("");
            setIsCreatingTask(false);
            fetchProject();
        } catch (error) {
            alert(error instanceof Error ? error.message : "Failed to create task");
        } finally {
            setIsSubmitting(false);
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
        const doneTasks = project.tasks.filter((t) => t.status === "done");
        return Math.round((doneTasks.length / project.tasks.length) * 100);
    };

    const taskCounts = project
        ? {
              total: project.tasks.length,
              todo: project.tasks.filter((t) => t.status === "todo").length,
              inProgress: project.tasks.filter((t) => t.status === "in_progress").length,
              review: project.tasks.filter((t) => t.status === "review").length,
              done: project.tasks.filter((t) => t.status === "done").length,
          }
        : { total: 0, todo: 0, inProgress: 0, review: 0, done: 0 };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Project not found</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                        {project.name}
                    </h1>
                    {project.description && (
                        <p className="text-muted-foreground mt-1">{project.description}</p>
                    )}
                </div>
                <Button
                    onClick={() => setIsCreatingTask(true)}
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white border-0 shadow-md"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    New Task
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <Card className="bg-gradient-to-br from-blue-300 to-blue-400 border-0 shadow-md text-slate-900">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold">Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{taskCounts.total}</div>
                        <p className="text-xs opacity-80 mt-1">All tasks</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-slate-300 to-slate-400 border-0 shadow-md text-slate-900">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold">To Do</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{taskCounts.todo}</div>
                        <p className="text-xs opacity-80 mt-1">Not started</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-cyan-300 to-cyan-400 border-0 shadow-md text-slate-900">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold">In Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{taskCounts.inProgress}</div>
                        <p className="text-xs opacity-80 mt-1">Active</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-300 to-purple-400 border-0 shadow-md text-slate-900">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold">Review</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{taskCounts.review}</div>
                        <p className="text-xs opacity-80 mt-1">Pending review</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-300 to-green-400 border-0 shadow-md text-slate-900">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold">Done</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{taskCounts.done}</div>
                        <p className="text-xs opacity-80 mt-1">Completed</p>
                    </CardContent>
                </Card>
            </div>

            {/* Progress */}
            <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-purple-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-purple-500" />
                        Overall Progress
                    </CardTitle>
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
                <h2 className="text-xl font-bold tracking-tight mb-4 text-foreground">
                    Tasks ({project.tasks.length})
                </h2>
                {project.tasks.length === 0 ? (
                    <Card className="p-12 text-center bg-gradient-to-r from-blue-50 to-purple-100 dark:from-blue-950/40 dark:to-purple-950/40 border-0">
                        <div className="flex flex-col items-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-card dark:bg-slate-800 shadow-md mb-4">
                                <Plus className="h-7 w-7 text-indigo-500" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">No tasks yet</h3>
                            <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                                Create your first task to start tracking progress in this project.
                            </p>
                            <Button
                                onClick={() => setIsCreatingTask(true)}
                                className="mt-6 bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white border-0 shadow-md"
                            >
                                <Plus className="mr-2 h-4 w-4" /> Create Task
                            </Button>
                        </div>
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
                                        "cursor-pointer hover:shadow-lg transition-all border-l-4 hover:-translate-y-0.5",
                                        priorityColors[task.priority],
                                        task.status === "done" && "opacity-70"
                                    )}
                                    onClick={() => setSelectedTask(task)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className={cn(
                                                        "font-semibold truncate",
                                                        task.status === "done" && "line-through text-muted-foreground"
                                                    )}>
                                                        {task.title}
                                                    </h3>
                                                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold uppercase", priorityBadgeColors[task.priority])}>
                                                        {task.priority}
                                                    </span>
                                                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold", statusColors[task.status])}>
                                                        {statusLabels[task.status]}
                                                    </span>
                                                    {isImminent && (
                                                        <span className="flex items-center gap-1 text-[10px] bg-orange-500 text-white px-2 py-0.5 rounded-full font-bold">
                                                            <AlertCircle className="h-3 w-3" />
                                                            IMMINENT
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                    <span>Progress: {task.progress}%</span>
                                                    <span>•</span>
                                                    <span>Due: {new Date(task.endDate).toLocaleDateString()}</span>
                                                </div>
                                                <div className="mt-2 w-full bg-muted dark:bg-slate-700 rounded-full h-1.5">
                                                    <div
                                                        className={cn(
                                                            "h-full rounded-full transition-all",
                                                            task.progress === 100
                                                                ? "bg-green-500"
                                                                : task.progress > 50
                                                                ? "bg-blue-500"
                                                                : "bg-purple-500"
                                                        )}
                                                        style={{ width: `${task.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 ml-4">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
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
                                                    className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50"
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

            {/* Create Task Modal */}
            {isCreatingTask && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60"
                    onClick={() => setIsCreatingTask(false)}
                >
                    <div
                        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 relative z-[70]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setIsCreatingTask(false)}
                            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                        >
                            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        </button>

                        {/* Modal Header */}
                        <h2 className="text-2xl font-bold text-foreground mb-6">Create New Task</h2>

                        {/* Form */}
                        <form onSubmit={handleCreateTask} className="space-y-5">
                            {/* Task Title */}
                            <div className="space-y-2">
                                <label htmlFor="taskTitle" className="text-sm font-medium text-foreground">
                                    Task Title
                                </label>
                                <input
                                    id="taskTitle"
                                    type="text"
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    placeholder="What needs to be done?"
                                    required
                                    disabled={isSubmitting}
                                    className="w-full px-4 py-2.5 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 text-foreground placeholder:text-muted-foreground"
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label htmlFor="taskDesc" className="text-sm font-medium text-foreground">
                                    Description <span className="text-muted-foreground font-normal">(optional)</span>
                                </label>
                                <textarea
                                    id="taskDesc"
                                    value={newTaskContent}
                                    onChange={(e) => setNewTaskContent(e.target.value)}
                                    placeholder="Add details..."
                                    rows={3}
                                    disabled={isSubmitting}
                                    className="w-full px-4 py-2.5 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none disabled:opacity-50 text-foreground placeholder:text-muted-foreground"
                                />
                            </div>

                            {/* Priority & Status Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="taskPriority" className="text-sm font-medium text-foreground">
                                        Priority
                                    </label>
                                    <select
                                        id="taskPriority"
                                        value={newTaskPriority}
                                        onChange={(e) => setNewTaskPriority(e.target.value as any)}
                                        disabled={isSubmitting}
                                        className="w-full px-4 py-2.5 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 text-foreground"
                                    >
                                        <option value="low">🟢 Low</option>
                                        <option value="medium">🟡 Medium</option>
                                        <option value="high">🟠 High</option>
                                        <option value="critical">🔴 Critical</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="taskStatus" className="text-sm font-medium text-foreground">
                                        Status
                                    </label>
                                    <select
                                        id="taskStatus"
                                        value={newTaskStatus}
                                        onChange={(e) => setNewTaskStatus(e.target.value as any)}
                                        disabled={isSubmitting}
                                        className="w-full px-4 py-2.5 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 text-foreground"
                                    >
                                        <option value="todo">To Do</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="review">Review</option>
                                        <option value="done">Done</option>
                                    </select>
                                </div>
                            </div>

                            {/* Dates Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="taskStartDate" className="text-sm font-medium text-foreground">
                                        Start Date
                                    </label>
                                    <input
                                        id="taskStartDate"
                                        type="date"
                                        value={newTaskStartDate}
                                        onChange={(e) => setNewTaskStartDate(e.target.value)}
                                        required
                                        disabled={isSubmitting}
                                        min={new Date().toISOString().split("T")[0]}
                                        className="w-full px-4 py-2.5 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 text-foreground"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="taskEndDate" className="text-sm font-medium text-foreground">
                                        End Date
                                    </label>
                                    <input
                                        id="taskEndDate"
                                        type="date"
                                        value={newTaskEndDate}
                                        onChange={(e) => setNewTaskEndDate(e.target.value)}
                                        required
                                        disabled={isSubmitting}
                                        min={newTaskStartDate || new Date().toISOString().split("T")[0]}
                                        className="w-full px-4 py-2.5 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 text-foreground"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white border-0 shadow-md transition-all mt-2 disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    "Create Task"
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
