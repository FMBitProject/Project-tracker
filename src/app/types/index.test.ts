import { describe, it, expect } from "vitest";
import {
    createProjectSchema,
    updateProjectSchema,
    createTaskSchema,
    updateTaskSchema,
} from "./index";

describe("createProjectSchema", () => {
    it("passes with valid data", () => {
        const result = createProjectSchema.safeParse({ name: "My Project", description: "A test" });
        expect(result.success).toBe(true);
    });

    it("passes without description", () => {
        const result = createProjectSchema.safeParse({ name: "My Project" });
        expect(result.success).toBe(true);
    });

    it("fails with empty name", () => {
        const result = createProjectSchema.safeParse({ name: "" });
        expect(result.success).toBe(false);
    });

    it("fails with missing name", () => {
        const result = createProjectSchema.safeParse({});
        expect(result.success).toBe(false);
    });
});

describe("updateProjectSchema", () => {
    it("passes with partial data", () => {
        const result = updateProjectSchema.safeParse({ name: "Updated" });
        expect(result.success).toBe(true);
    });

    it("passes with empty object", () => {
        const result = updateProjectSchema.safeParse({});
        expect(result.success).toBe(true);
    });

    it("fails with empty name", () => {
        const result = updateProjectSchema.safeParse({ name: "" });
        expect(result.success).toBe(false);
    });
});

describe("createTaskSchema", () => {
    const validTask = {
        projectId: "550e8400-e29b-41d4-a716-446655440000",
        title: "Test Task",
        priority: "high" as const,
        status: "todo" as const,
        progress: 50,
        startDate: "2026-01-01",
        endDate: "2026-02-01",
    };

    it("passes with valid data", () => {
        const result = createTaskSchema.safeParse(validTask);
        expect(result.success).toBe(true);
    });

    it("transforms startDate and endDate to Date objects", () => {
        const result = createTaskSchema.safeParse(validTask);
        if (result.success) {
            expect(result.data.startDate).toBeInstanceOf(Date);
            expect(result.data.endDate).toBeInstanceOf(Date);
        }
    });

    it("fails with invalid UUID for projectId", () => {
        const result = createTaskSchema.safeParse({ ...validTask, projectId: "not-a-uuid" });
        expect(result.success).toBe(false);
    });

    it("fails with missing title", () => {
        const { title: _, ...rest } = validTask;
        const result = createTaskSchema.safeParse(rest);
        expect(result.success).toBe(false);
    });

    it("fails with empty title", () => {
        const result = createTaskSchema.safeParse({ ...validTask, title: "" });
        expect(result.success).toBe(false);
    });

    it("fails with invalid priority", () => {
        const result = createTaskSchema.safeParse({ ...validTask, priority: "urgent" });
        expect(result.success).toBe(false);
    });

    it("fails with invalid status", () => {
        const result = createTaskSchema.safeParse({ ...validTask, status: "blocked" });
        expect(result.success).toBe(false);
    });

    it("fails with progress > 100", () => {
        const result = createTaskSchema.safeParse({ ...validTask, progress: 150 });
        expect(result.success).toBe(false);
    });

    it("fails with progress < 0", () => {
        const result = createTaskSchema.safeParse({ ...validTask, progress: -10 });
        expect(result.success).toBe(false);
    });

    it("applies defaults for priority, status, progress", () => {
        const minimal = {
            projectId: "550e8400-e29b-41d4-a716-446655440000",
            title: "Minimal Task",
            startDate: "2026-01-01",
            endDate: "2026-02-01",
        };
        const result = createTaskSchema.safeParse(minimal);
        if (result.success) {
            expect(result.data.priority).toBe("medium");
            expect(result.data.status).toBe("todo");
            expect(result.data.progress).toBe(0);
        }
    });
});

describe("updateTaskSchema", () => {
    it("passes with empty object (all fields optional)", () => {
        const result = updateTaskSchema.safeParse({});
        expect(result.success).toBe(true);
    });

    it("passes with partial update", () => {
        const result = updateTaskSchema.safeParse({ title: "Updated Title" });
        expect(result.success).toBe(true);
    });

    it("transforms date strings to Date objects", () => {
        const result = updateTaskSchema.safeParse({ startDate: "2026-03-01" });
        if (result.success) {
            expect(result.data.startDate).toBeInstanceOf(Date);
        }
    });

    it("fails with empty title", () => {
        const result = updateTaskSchema.safeParse({ title: "" });
        expect(result.success).toBe(false);
    });

    it("fails with invalid priority", () => {
        const result = updateTaskSchema.safeParse({ priority: "super" });
        expect(result.success).toBe(false);
    });

    it("fails with progress > 100", () => {
        const result = updateTaskSchema.safeParse({ progress: 200 });
        expect(result.success).toBe(false);
    });
});
