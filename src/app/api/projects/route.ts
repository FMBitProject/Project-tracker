import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { projects, tasks } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

export async function GET(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const includeTasks = searchParams.get("includeTasks") === "true";

        const userProjects = await db.select().from(projects).where(eq(projects.userId, session.user.id)).orderBy(projects.createdAt);

        // Fetch tasks for all projects
        const projectIds = userProjects.map(p => p.id);
        let allTasks: any[] = [];

        if (projectIds.length > 0) {
            allTasks = await db.select().from(tasks).where(inArray(tasks.projectId, projectIds));
        }

        // Group tasks by project
        const tasksByProject = allTasks.reduce((acc, task) => {
            if (!acc[task.projectId]) {
                acc[task.projectId] = [];
            }
            acc[task.projectId].push(task);
            return acc;
        }, {} as Record<string, any[]>);

        // Calculate task summary for each project
        const projectsWithSummary = userProjects.map((project) => {
            const projectTasks = tasksByProject[project.id] || [];
            const totalTasks = projectTasks.length;
            const completedTasks = projectTasks.filter((t: any) => t.status === "done").length;
            const criticalTasks = projectTasks.filter((t: any) => t.priority === "critical" && t.status !== "done").length;
            const overdueTasks = projectTasks.filter(
                (t: any) => t.status !== "done" && new Date(t.endDate) < new Date()
            ).length;

            const result: any = {
                ...project,
                summary: {
                    totalTasks,
                    completedTasks,
                    criticalTasks,
                    overdueTasks,
                    progress: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
                },
            };

            if (includeTasks) {
                result.tasks = projectTasks;
            }

            return result;
        });

        return NextResponse.json(projectsWithSummary);
    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json(
            { error: "Failed to fetch projects" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        const { name, description } = body;

        if (!name) {
            return NextResponse.json(
                { error: "Project name is required" },
                { status: 400 }
            );
        }

        const [newProject] = await db.insert(projects).values({
            name,
            description: description || null,
            userId: session.user.id,
        }).returning();

        return NextResponse.json(newProject, { status: 201 });
    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json(
            { error: "Failed to create project" },
            { status: 500 }
        );
    }
}
