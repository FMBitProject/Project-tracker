import { z } from "zod";

export const createProjectSchema = z.object({
    name: z.string().min(1, "Project name is required"),
    description: z.string().optional(),
});

export const updateProjectSchema = z.object({
    name: z.string().min(1, "Project name is required").optional(),
    description: z.string().optional(),
});

export const createTaskSchema = z.object({
    projectId: z.string().uuid("Invalid project ID"),
    title: z.string().min(1, "Task title is required"),
    content: z.string().optional(),
    priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
    status: z.enum(["todo", "in_progress", "review", "done"]).default("todo"),
    progress: z.number().min(0).max(100).default(0),
    startDate: z.string().transform((val) => new Date(val)),
    endDate: z.string().transform((val) => new Date(val)),
});

export const updateTaskSchema = z.object({
    title: z.string().min(1, "Task title is required").optional(),
    content: z.string().optional(),
    priority: z.enum(["low", "medium", "high", "critical"]).optional(),
    status: z.enum(["todo", "in_progress", "review", "done"]).optional(),
    progress: z.number().min(0).max(100).optional(),
    startDate: z.preprocess(
        (val) => val === undefined ? undefined : new Date(val as string),
        z.date().optional()
    ),
    endDate: z.preprocess(
        (val) => val === undefined ? undefined : new Date(val as string),
        z.date().optional()
    ),
});
