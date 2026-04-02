"use client";

import { useEffect, useState } from "react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ProjectCard } from "@/components/dashboard/project-card";
import { Button } from "@/components/ui/button";
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
import {
    LayoutDashboard,
    AlertCircle,
    CheckCircle2,
    FolderKanban,
    Plus,
} from "lucide-react";

interface Project {
    id: string;
    name: string;
    description?: string | null;
    summary: {
        totalTasks: number;
        completedTasks: number;
        criticalTasks: number;
        overdueTasks: number;
        progress: number;
    };
}

interface Metrics {
    totalTasks: number;
    completedTasks: number;
    criticalTasks: number;
    overdueTasks: number;
}

export default function DashboardPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [metrics, setMetrics] = useState<Metrics>({
        totalTasks: 0,
        completedTasks: 0,
        criticalTasks: 0,
        overdueTasks: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isCreatingProject, setIsCreatingProject] = useState(false);
    const [newProjectName, setNewProjectName] = useState("");
    const [newProjectDescription, setNewProjectDescription] = useState("");

    useEffect(() => {
        fetchProjects();
    }, []);

    async function fetchProjects() {
        try {
            const response = await fetch("/api/projects");
            if (response.ok) {
                const data = await response.json();
                setProjects(data);

                // Calculate overall metrics
                const totalTasks = data.reduce((acc: number, p: Project) => acc + p.summary.totalTasks, 0);
                const completedTasks = data.reduce((acc: number, p: Project) => acc + p.summary.completedTasks, 0);
                const criticalTasks = data.reduce((acc: number, p: Project) => acc + p.summary.criticalTasks, 0);
                const overdueTasks = data.reduce((acc: number, p: Project) => acc + p.summary.overdueTasks, 0);

                setMetrics({ totalTasks, completedTasks, criticalTasks, overdueTasks });
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleCreateProject(e: React.FormEvent) {
        e.preventDefault();
        try {
            const response = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: newProjectName,
                    description: newProjectDescription,
                }),
            });

            if (response.ok) {
                setNewProjectName("");
                setNewProjectDescription("");
                setIsCreatingProject(false);
                fetchProjects();
            }
        } catch (error) {
            console.error("Error creating project:", error);
        }
    }

    if (isLoading) {
        return <div className="flex items-center justify-center h-64">Loading...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <Dialog open={isCreatingProject} onOpenChange={setIsCreatingProject}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New Project
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <form onSubmit={handleCreateProject}>
                            <DialogHeader>
                                <DialogTitle>Create New Project</DialogTitle>
                                <DialogDescription>
                                    Add a new project to track your tasks and progress.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Project Name</Label>
                                    <Input
                                        id="name"
                                        value={newProjectName}
                                        onChange={(e) => setNewProjectName(e.target.value)}
                                        placeholder="My Awesome Project"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={newProjectDescription}
                                        onChange={(e) => setNewProjectDescription(e.target.value)}
                                        placeholder="Brief description of your project"
                                        rows={3}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsCreatingProject(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">Create Project</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Total Tasks"
                    value={metrics.totalTasks}
                    icon={LayoutDashboard}
                />
                <MetricCard
                    title="Completed"
                    value={metrics.completedTasks}
                    description={`${metrics.totalTasks > 0 ? Math.round((metrics.completedTasks / metrics.totalTasks) * 100) : 0}% completion rate`}
                    icon={CheckCircle2}
                />
                <MetricCard
                    title="Critical"
                    value={metrics.criticalTasks}
                    description="High priority tasks"
                    icon={AlertCircle}
                />
                <MetricCard
                    title="Overdue"
                    value={metrics.overdueTasks}
                    description="Past deadline"
                    icon={AlertCircle}
                />
            </div>

            {/* Projects Grid */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Projects</h2>
                {projects.length === 0 ? (
                    <Card className="p-8 text-center">
                        <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                        <p className="text-muted-foreground mb-4">
                            Create your first project to start tracking tasks
                        </p>
                        <Button onClick={() => setIsCreatingProject(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Project
                        </Button>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project) => (
                            <ProjectCard key={project.id} {...project} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={`rounded-xl border bg-card text-card-foreground shadow ${className}`}>
        {children}
    </div>
);
