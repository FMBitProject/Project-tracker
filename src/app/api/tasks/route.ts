import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { tasks, projects } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { createTaskSchema } from "@/app/types";

export async function GET(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const projectId = searchParams.get("projectId");

        let userTasks;

        if (projectId) {
            userTasks = await db.select().from(tasks).where(and(eq(tasks.projectId, projectId), eq(tasks.userId, session.user.id))).orderBy(desc(tasks.createdAt));
        } else {
            userTasks = await db.select().from(tasks).where(eq(tasks.userId, session.user.id)).orderBy(desc(tasks.createdAt));
            
            // Include project info
            const projectIds = userTasks.map(t => t.projectId);
            let allProjects: any[] = [];
            
            if (projectIds.length > 0) {
                allProjects = await db.select().from(projects).where(eq(projects.id, projectIds[0]));
            }
            
            const projectsMap = allProjects.reduce((acc, p) => {
                acc[p.id] = { id: p.id, name: p.name };
                return acc;
            }, {} as Record<string, { id: string; name: string }>);
            
            userTasks = userTasks.map(t => ({
                ...t,
                project: projectsMap[t.projectId] || null,
            }));
        }

        return NextResponse.json(userTasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return NextResponse.json(
            { error: "Failed to fetch tasks" },
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
        const validatedData = createTaskSchema.parse(body);

        // Verify project exists and belongs to user
        const [project] = await db.select().from(projects).where(and(eq(projects.id, validatedData.projectId), eq(projects.userId, session.user.id)));

        if (!project) {
            return NextResponse.json(
                { error: "Project not found or access denied" },
                { status: 404 }
            );
        }

        const [newTask] = await db.insert(tasks).values({
            ...validatedData,
            userId: session.user.id,
        }).returning();

        return NextResponse.json(newTask, { status: 201 });
    } catch (error) {
        console.error("Error creating task:", error);
        if (error instanceof Error && error.name === "ZodError") {
            return NextResponse.json(
                { error: "Validation failed", details: error },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: "Failed to create task" },
            { status: 500 }
        );
    }
}
