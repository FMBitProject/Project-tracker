"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Loader2,
    CheckCircle2,
    FolderKanban,
    ExternalLink,
    Clock,
    AlertTriangle,
    ChevronDown,
    ChevronUp,
    Calendar,
    TrendingUp,
    Zap,
    History,
    ArrowLeft,
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
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    tasks: Task[];
    summary: {
        totalTasks: number;
        completedTasks: number;
        criticalTasks: number;
        overdueTasks: number;
        progress: number;
    };
}

const priorityDotColors: Record<string, string> = {
    low: "bg-green-500",
    medium: "bg-yellow-500",
    high: "bg-orange-500",
    critical: "bg-red-500",
};

const priorityBadgeColors: Record<string, string> = {
    low: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-orange-100 text-orange-700",
    critical: "bg-red-100 text-red-700",
};

const statusLabels: Record<string, string> = {
    todo: "To Do",
    in_progress: "In Progress",
    review: "Review",
    done: "Done",
};

const projectGradients = [
    "from-emerald-500 to-teal-600",
    "from-cyan-500 to-blue-600",
    "from-violet-500 to-purple-600",
    "from-amber-500 to-orange-600",
    "from-pink-500 to-rose-600",
    "from-indigo-500 to-blue-600",
];

export default function HistoryPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedProject, setExpandedProject] = useState<string | null>(null);
    const [filter, setFilter] = useState<"all" | "completed" | "active">("all");

    const fetchProjects = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await fetch("/api/projects?includeTasks=true");
            if (!res.ok) {
                if (res.status === 401) {
                    setError("Please log in to view history.");
                    return;
                }
                throw new Error("Failed to fetch projects");
            }
            const data = await res.json();
            setProjects(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const filteredProjects = projects.filter((project) => {
        if (filter === "completed") return project.summary.progress === 100;
        if (filter === "active") return project.summary.progress < 100;
        return true;
    });

    const totalStats = projects.reduce(
        (acc, p) => ({
            projects: acc.projects + 1,
            tasks: acc.tasks + p.summary.totalTasks,
            completed: acc.completed + p.summary.completedTasks,
        }),
        { projects: 0, tasks: 0, completed: 0 }
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-8 text-white shadow-2xl">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10 blur-xl" />
                <div className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-lg">
                            Project History 📜
                        </h1>
                        <p className="text-sm text-white/80 mt-2 max-w-lg">
                            View all your projects and their task details. Track progress, completed work, and more.
                        </p>
                    </div>
                    <Button
                        asChild
                        variant="outline"
                        className="bg-white/20 hover:bg-white/30 text-white border-white/30 shadow-lg backdrop-blur-sm self-start shrink-0 gap-2"
                    >
                        <Link href="/dashboard">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/40">
                    <CardContent className="pt-6">
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </CardContent>
                </Card>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-0 shadow-md bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 hover:shadow-lg transition-all group">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/50 transition-colors">
                                <FolderKanban className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-foreground">Total Projects</p>
                                <p className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">{totalStats.projects}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-md bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/40 dark:to-blue-950/40 hover:shadow-lg transition-all group">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-cyan-100 dark:bg-cyan-900/50 group-hover:bg-cyan-200 dark:group-hover:bg-cyan-800/50 transition-colors">
                                <Zap className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-foreground">Total Tasks</p>
                                <p className="text-2xl font-extrabold text-cyan-700 dark:text-cyan-400">{totalStats.tasks}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-md bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40 hover:shadow-lg transition-all group">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/50 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors">
                                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-foreground">Completed Tasks</p>
                                <p className="text-2xl font-extrabold text-purple-700 dark:text-purple-400">{totalStats.completed}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground mr-2">Filter:</span>
                {(["all", "active", "completed"] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={cn(
                            "px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                            filter === f
                                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md"
                                : "bg-muted dark:bg-slate-800 text-muted-foreground hover:bg-muted/80 dark:hover:bg-slate-700"
                        )}
                    >
                        {f === "all" ? "All" : f === "active" ? "Active" : "Completed"}
                    </button>
                ))}
            </div>

            {/* Projects List */}
            {filteredProjects.length === 0 ? (
                <Card className="flex flex-col items-center justify-center border-0 shadow-xl py-20 px-8 text-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/40 dark:via-teal-950/40 dark:to-cyan-950/40">
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-card dark:bg-slate-800 shadow-lg mb-6">
                        <History className="h-10 w-10 text-emerald-500" />
                    </div>
                    <h3 className="text-3xl font-extrabold text-foreground">No projects found</h3>
                    <p className="mt-3 text-sm text-muted-foreground max-w-sm">
                        {filter !== "all"
                            ? `No ${filter} projects to show. Try changing the filter.`
                            : "Create your first project to see it here."}
                    </p>
                    <Button
                        asChild
                        className="mt-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 shadow-lg"
                    >
                        <Link href="/dashboard">Go to Dashboard</Link>
                    </Button>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredProjects.map((project, index) => {
                        const gradient = projectGradients[index % projectGradients.length];
                        const isExpanded = expandedProject === project.id;
                        const doneTasks = project.tasks?.filter((t) => t.status === "done") || [];
                        const activeTasks = project.tasks?.filter((t) => t.status !== "done") || [];

                        return (
                            <Card
                                key={project.id}
                                className="border-0 shadow-lg overflow-hidden hover:shadow-xl transition-all"
                            >
                                {/* Gradient Top Bar */}
                                <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />

                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <CardTitle className="text-xl font-extrabold text-foreground">
                                                    {project.name}
                                                </CardTitle>
                                                <span className={cn(
                                                    "text-xs px-2.5 py-1 rounded-full font-bold",
                                                    project.summary.progress === 100
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-blue-100 text-blue-700"
                                                )}>
                                                    {project.summary.progress === 100 ? "✓ Completed" : "◷ Active"}
                                                </span>
                                            </div>
                                            {project.description && (
                                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                    {project.description}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <Button asChild variant="outline" size="sm" className="gap-1">
                                                <Link href={`/projects/${project.id}`}>
                                                    <ExternalLink className="h-3.5 w-3.5" />
                                                    View
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="gap-1"
                                                onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                                            >
                                                {isExpanded ? (
                                                    <ChevronUp className="h-3.5 w-3.5" />
                                                ) : (
                                                    <ChevronDown className="h-3.5 w-3.5" />
                                                )}
                                                {isExpanded ? "Less" : "Details"}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Summary Stats Row */}
                                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
                                        <div className="bg-blue-50 rounded-xl p-3 text-center">
                                            <p className="text-lg font-extrabold text-blue-600">{project.summary.totalTasks}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total</p>
                                        </div>
                                        <div className="bg-green-50 rounded-xl p-3 text-center">
                                            <p className="text-lg font-extrabold text-green-600">{project.summary.completedTasks}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Done</p>
                                        </div>
                                        <div className="bg-red-50 rounded-xl p-3 text-center">
                                            <p className="text-lg font-extrabold text-red-600">{project.summary.criticalTasks}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Critical</p>
                                        </div>
                                        <div className="bg-orange-50 rounded-xl p-3 text-center">
                                            <p className="text-lg font-extrabold text-orange-600">{project.summary.overdueTasks}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Overdue</p>
                                        </div>
                                        <div className="bg-purple-50 rounded-xl p-3 text-center">
                                            <p className="text-lg font-extrabold text-purple-600">{project.summary.progress}%</p>
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Progress</p>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mt-3">
                                        <div className="w-full bg-muted dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                                            <div
                                                className={`bg-gradient-to-r ${gradient} h-full rounded-full transition-all duration-700`}
                                                style={{ width: `${project.summary.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                </CardHeader>

                                {/* Expanded Task Details */}
                                {isExpanded && project.tasks && project.tasks.length > 0 && (
                                    <CardContent className="pt-0 pb-6 space-y-6 border-t border-gray-100 mt-2">
                                        {/* Active Tasks */}
                                        {activeTasks.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-blue-500" />
                                                    Active Tasks ({activeTasks.length})
                                                </h4>
                                                <div className="space-y-2">
                                                    {activeTasks.map((task) => (
                                                        <TaskCard key={task.id} task={task} variant="compact" />
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Completed Tasks */}
                                        {doneTasks.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                    Completed Tasks ({doneTasks.length})
                                                </h4>
                                                <div className="space-y-2">
                                                    {doneTasks.map((task) => (
                                                        <TaskCard key={task.id} task={task} variant="compact" />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                )}

                                {isExpanded && (!project.tasks || project.tasks.length === 0) && (
                                    <CardContent className="pt-0 pb-6 text-center text-muted-foreground text-sm">
                                        No tasks in this project yet.
                                    </CardContent>
                                )}
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

/* ── Compact Task Card for History detail ── */
function TaskCard({ task, variant = "compact" }: { task: Task; variant?: "compact" | "full" }) {
    return (
        <Card
            className={cn(
                "border-l-4 hover:shadow-md transition-all",
                task.priority === "low" && "border-l-green-500",
                task.priority === "medium" && "border-l-yellow-500",
                task.priority === "high" && "border-l-orange-500",
                task.priority === "critical" && "border-l-red-500",
                task.status === "done" && "opacity-70"
            )}
        >
            <CardContent className={cn("flex items-center justify-between gap-3", variant === "compact" ? "p-3" : "p-4")}>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn("w-2 h-2 rounded-full flex-shrink-0", priorityDotColors[task.priority])} />
                        <span className={cn(
                            "font-semibold text-foreground truncate",
                            task.status === "done" && "line-through text-muted-foreground"
                        )}>
                            {task.title}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold uppercase", priorityBadgeColors[task.priority])}>
                            {task.priority}
                        </span>
                        <span className={cn(
                            "text-[10px] px-2 py-0.5 rounded-full font-bold",
                            task.status === "done" ? "bg-green-100 text-green-700" :
                            task.status === "in_progress" ? "bg-blue-100 text-blue-700" :
                            task.status === "review" ? "bg-purple-100 text-purple-700" :
                            "bg-slate-100 text-slate-700"
                        )}>
                            {statusLabels[task.status]}
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                            <Calendar className="h-3 w-3" />
                            {new Date(task.endDate).toLocaleDateString()}
                        </span>
                    </div>
                </div>
                <div className="text-right shrink-0">
                    <p className={cn(
                        "text-sm font-extrabold",
                        task.progress === 100 ? "text-green-600" : "text-slate-600"
                    )}>
                        {task.progress}%
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
