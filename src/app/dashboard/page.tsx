"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/auth/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LayoutDashboard,
  CheckCircle,
  AlertTriangle,
  Clock,
  FolderOpen,
  Plus,
  X,
  Loader2,
  ExternalLink,
  Trash2,
  TrendingUp,
  Zap,
  Target,
  AlertCircle,
  Pencil,
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  summary: {
    totalTasks: number;
    completedTasks: number;
    criticalTasks: number;
    overdueTasks: number;
    progress: number;
  };
}

interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  criticalTasks: number;
  overdueTasks: number;
  completionRate: number;
}

const projectGradients = [
  "from-violet-500 to-purple-600",
  "from-cyan-500 to-blue-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-red-600",
  "from-pink-500 to-rose-600",
  "from-amber-500 to-orange-600",
  "from-indigo-500 to-blue-600",
  "from-teal-500 to-green-600",
];

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const userName = session?.user?.name || "";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch("/api/projects");
      if (!res.ok) {
        if (res.status === 401) {
          setError("Please log in to view your dashboard.");
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

  const stats: DashboardStats = projects.reduce(
    (acc, project) => ({
      totalTasks: acc.totalTasks + project.summary.totalTasks,
      completedTasks: acc.completedTasks + project.summary.completedTasks,
      criticalTasks: acc.criticalTasks + project.summary.criticalTasks,
      overdueTasks: acc.overdueTasks + project.summary.overdueTasks,
      completionRate: 0,
    }),
    { totalTasks: 0, completedTasks: 0, criticalTasks: 0, overdueTasks: 0, completionRate: 0 }
  );

  stats.completionRate =
    stats.totalTasks > 0
      ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: projectName.trim(),
          description: projectDescription.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create project");
      }

      setProjectName("");
      setProjectDescription("");
      setIsModalOpen(false);
      await fetchProjects();
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete project");
      }

      await fetchProjects();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete project");
    }
  };

  const startRename = (project: Project) => {
    setRenamingId(project.id);
    setRenameValue(project.name);
  };

  const cancelRename = () => {
    setRenamingId(null);
    setRenameValue("");
  };

  const submitRename = async (projectId: string) => {
    const trimmed = renameValue.trim();
    if (!trimmed) return;

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });

      if (!res.ok) {
        throw new Error("Failed to rename project");
      }

      await fetchProjects();
      cancelRename();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to rename project");
    }
  };

  return (
    <div className="space-y-8">

      {/* Header Section - Colorful gradient banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white shadow-2xl">
        {/* Decorative circles */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10 blur-xl" />
        <div className="absolute right-1/4 top-1/2 h-20 w-20 rounded-full bg-white/5 blur-lg" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-lg">
              Welcome back, {userName || "there"}! 👋
            </h1>
            <p className="text-sm text-white/80 mt-2 max-w-md">
              Here&apos;s what&apos;s happening with your projects today.
            </p>
          </div>

          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 shadow-lg backdrop-blur-sm transition-all hover:scale-105"
          >
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-sm text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Statistic Cards (Grid Layout) - Enhanced colorful design */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

        {/* Card 1: Total Tasks */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-700 text-white transition-all hover:shadow-xl hover:-translate-y-1 group">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 transition-transform group-hover:scale-125" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Total Tasks</CardTitle>
            <div className="p-2 rounded-lg bg-white/20">
              <LayoutDashboard className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold">
              {isLoading ? <Loader2 className="h-9 w-9 animate-spin" /> : stats.totalTasks}
            </div>
            <p className="text-xs font-medium text-white/80 mt-1">Across all projects</p>
          </CardContent>
        </Card>

        {/* Card 2: Completed */}
        <div
          onClick={() => {
            if (isLoading || projects.length === 0) return;
            // Find project with the most completed tasks
            const best = projects.reduce((a, b) =>
              b.summary.completedTasks > a.summary.completedTasks ? b : a
            );
            router.push(`/projects/${best.id}?status=done`);
          }}
          className="group cursor-pointer"
        >
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-green-700 text-white transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 transition-transform group-hover:scale-125" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold">Completed</CardTitle>
              <div className="p-2 rounded-lg bg-white/20">
                <CheckCircle className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-extrabold">
                {isLoading ? <Loader2 className="h-9 w-9 animate-spin" /> : stats.completedTasks}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-white/80" />
                <p className="text-xs font-medium text-white/80">{stats.completionRate}% completion rate</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Card 3: Critical */}
        <div
          onClick={() => {
            if (isLoading || projects.length === 0) return;
            const best = projects.reduce((a, b) =>
              b.summary.criticalTasks > a.summary.criticalTasks ? b : a
            );
            if (best.summary.criticalTasks === 0) return;
            router.push(`/projects/${best.id}?filter=critical`);
          }}
          className="group cursor-pointer"
        >
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-red-500 to-rose-700 text-white transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 transition-transform group-hover:scale-125" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold">Critical</CardTitle>
              <div className="p-2 rounded-lg bg-white/20">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-extrabold">
                {isLoading ? <Loader2 className="h-9 w-9 animate-spin" /> : stats.criticalTasks}
              </div>
              <p className="text-xs font-medium text-white/80 mt-1">Needs immediate attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Card 4: Overdue */}
        <div
          onClick={() => {
            if (isLoading || projects.length === 0) return;
            const best = projects.reduce((a, b) =>
              b.summary.overdueTasks > a.summary.overdueTasks ? b : a
            );
            if (best.summary.overdueTasks === 0) return;
            router.push(`/projects/${best.id}?filter=overdue`);
          }}
          className="group cursor-pointer"
        >
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-amber-500 to-orange-700 text-white transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 transition-transform group-hover:scale-125" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold">Overdue</CardTitle>
              <div className="p-2 rounded-lg bg-white/20">
                <Clock className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-extrabold">
                {isLoading ? <Loader2 className="h-9 w-9 animate-spin" /> : stats.overdueTasks}
              </div>
              <p className="text-xs font-medium text-white/80 mt-1">Past deadline</p>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/projects" className="group">
          <Card className="border shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-200 cursor-pointer bg-card text-card-foreground h-full">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Quick Stats</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {projects.length} project{projects.length !== 1 ? "s" : ""} • {stats.totalTasks} task{stats.totalTasks !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/projects" className="group">
          <Card className="border shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-200 cursor-pointer bg-card text-card-foreground h-full">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Completion Rate</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {stats.completionRate}% of all tasks completed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/projects" className="group">
          <Card className="border shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-200 cursor-pointer bg-card text-card-foreground h-full">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <AlertCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Attention Needed</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {stats.criticalTasks + stats.overdueTasks} task{stats.criticalTasks + stats.overdueTasks !== 1 ? "s" : ""} need review
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Projects Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <FolderOpen className="h-6 w-6 text-purple-500" />
            Your Projects
          </h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
          </div>
        ) : projects.length === 0 ? (
          <Card className="flex flex-col items-center justify-center border-0 shadow-xl py-20 px-8 text-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/40 dark:via-purple-950/40 dark:to-pink-950/40">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-card dark:bg-slate-800 shadow-lg mb-6">
              <FolderOpen className="h-10 w-10 text-indigo-500" />
            </div>
            <h3 className="text-3xl font-extrabold text-foreground">No projects yet</h3>
            <p className="mt-3 text-sm text-muted-foreground max-w-sm">
              Create your first project to start tracking tasks and organizing your workflow.
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="mt-8 bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white border-0 shadow-lg transition-all hover:scale-105"
            >
              <Plus className="mr-2 h-4 w-4" /> Create Project
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => {
              const gradient = projectGradients[index % projectGradients.length];
              return (
                <Card
                  key={project.id}
                  className="border-0 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 bg-card dark:bg-slate-800/80 overflow-hidden group"
                >
                  {/* Gradient top bar */}
                  <div className={`h-2 bg-gradient-to-r ${gradient}`} />

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      {renamingId === project.id ? (
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <input
                            type="text"
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                submitRename(project.id);
                              }
                              if (e.key === "Escape") cancelRename();
                            }}
                            autoFocus
                            className="w-full px-2 py-1 text-lg font-bold border border-primary/50 rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 text-green-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950/40"
                            onClick={() => submitRename(project.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                            onClick={cancelRename}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <CardTitle className="text-lg font-bold text-foreground line-clamp-1 group-hover:text-purple-500 transition-colors">
                          {project.name}
                        </CardTitle>
                      )}
                      <div className="flex items-center gap-1 shrink-0">
                        {renamingId !== project.id && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
                            onClick={() => startRename(project)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Link href={`/projects/${project.id}`}>
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                          onClick={() => handleDelete(project.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {project.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {project.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    {/* Mini Stats Row */}
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-blue-50 dark:bg-blue-950/40 rounded-xl p-3 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                        <p className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
                          {project.summary.totalTasks}
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
                          Tasks
                        </p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-950/40 rounded-xl p-3 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">
                        <p className="text-xl font-extrabold text-green-600 dark:text-green-400">
                          {project.summary.completedTasks}
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
                          Done
                        </p>
                      </div>
                      <div className="bg-red-50 dark:bg-red-950/40 rounded-xl p-3 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                        <p className="text-xl font-extrabold text-red-600 dark:text-red-400">
                          {project.summary.criticalTasks}
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
                          Critical
                        </p>
                      </div>
                      <div className="bg-orange-50 dark:bg-orange-950/40 rounded-xl p-3 hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors">
                        <p className="text-xl font-extrabold text-orange-600 dark:text-orange-400">
                          {project.summary.overdueTasks}
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
                          Overdue
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                        <span className="font-medium">Progress</span>
                        <span className="font-bold">{project.summary.progress}%</span>
                      </div>
                      <div className="w-full bg-muted dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`bg-gradient-to-r ${gradient} h-full rounded-full transition-all duration-700`}
                          style={{ width: `${project.summary.progress}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal/Dialog Pop-up */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 relative z-[70]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Create New Project
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Fill in the details to get started.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Input Nama Project */}
              <div className="space-y-2">
                <label htmlFor="projectName" className="text-sm font-medium text-foreground">
                  Project Name
                </label>
                <input
                  id="projectName"
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g., Website Redesign"
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-foreground dark:text-white placeholder:text-muted-foreground"
                />
              </div>

              {/* Input Deskripsi */}
              <div className="space-y-2">
                <label htmlFor="projectDescription" className="text-sm font-medium text-foreground">
                  Description <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <textarea
                  id="projectDescription"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Brief description of the project..."
                  rows={3}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed text-foreground dark:text-white placeholder:text-muted-foreground"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white border-0 shadow-md transition-all mt-2 disabled:opacity-50 hover:scale-[1.02]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Project"
                )}
              </Button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
