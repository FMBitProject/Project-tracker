import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { tasks, projects } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { updateTaskSchema } from "@/app/types";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        const [task] = await db.select().from(tasks).where(and(eq(tasks.id, id), eq(tasks.userId, session.user.id)));

        if (!task) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        // Get project info
        const [project] = await db.select().from(projects).where(eq(projects.id, task.projectId));

        return NextResponse.json({
            ...task,
            project: project ? { id: project.id, name: project.name } : null,
        });
    } catch (error) {
        console.error("Error fetching task:", error);
        return NextResponse.json(
            { error: "Failed to fetch task" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        // Check if task exists and belongs to user
        const [existingTask] = await db.select().from(tasks).where(and(eq(tasks.id, id), eq(tasks.userId, session.user.id)));

        if (!existingTask) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        const validatedData = updateTaskSchema.parse(body);

        const updateData: any = {};
        for (const [key, value] of Object.entries(validatedData)) {
            if (value !== undefined) {
                updateData[key] = value;
            }
        }

        const [updatedTask] = await db.update(tasks).set(updateData).where(eq(tasks.id, id)).returning();

        return NextResponse.json(updatedTask);
    } catch (error) {
        if (error instanceof Error && error.name === "ZodError") {
            const zodError = error as import("zod").ZodError;
            console.error("Zod validation error:", zodError.flatten());
            return NextResponse.json(
                { error: "Validation failed", details: zodError.flatten() },
                { status: 400 }
            );
        }
        const anyErr = error as any;
        console.error("Error updating task:", anyErr?.cause?.message || anyErr?.message);
        return NextResponse.json(
            { error: "Failed to update task", detail: anyErr?.message || "Unknown database error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // Check if task exists and belongs to user
        const [existingTask] = await db.select().from(tasks).where(and(eq(tasks.id, id), eq(tasks.userId, session.user.id)));

        if (!existingTask) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        await db.delete(tasks).where(eq(tasks.id, id));

        return NextResponse.json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("Error deleting task:", error);
        return NextResponse.json(
            { error: "Failed to delete task" },
            { status: 500 }
        );
    }
}
