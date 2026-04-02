import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FolderKanban, AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface ProjectCardProps {
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

export function ProjectCard({ id, name, description, summary }: ProjectCardProps) {
    return (
        <Link href={`/projects/${id}`}>
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FolderKanban className="h-5 w-5 text-primary" />
                            <CardTitle className="text-lg">{name}</CardTitle>
                        </div>
                    </div>
                    {description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {description}
                        </p>
                    )}
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{summary.progress}%</span>
                        </div>
                        <Progress value={summary.progress} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1 text-muted-foreground">
                                <CheckCircle2 className="h-4 w-4" />
                                {summary.completedTasks}/{summary.totalTasks}
                            </span>
                            {summary.criticalTasks > 0 && (
                                <span className="flex items-center gap-1 text-destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    {summary.criticalTasks}
                                </span>
                            )}
                            {summary.overdueTasks > 0 && (
                                <span className="flex items-center gap-1 text-orange-500">
                                    <AlertTriangle className="h-4 w-4" />
                                    {summary.overdueTasks}
                                </span>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
