import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TaskDetailModal } from "@/components/project/task-detail-modal";

const mockTask = {
    id: "test-task-id",
    title: "Test Task",
    content: "Some markdown content",
    priority: "high" as const,
    status: "in_progress" as const,
    progress: 50,
    startDate: "2026-01-01T00:00:00.000Z",
    endDate: "2026-12-31T00:00:00.000Z",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
};

const mockOnUpdate = vi.fn();
const mockOnOpenChange = vi.fn();

describe("TaskDetailModal", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders task title when open", () => {
        render(
            <TaskDetailModal
                task={mockTask}
                open={true}
                onOpenChange={mockOnOpenChange}
                onUpdate={mockOnUpdate}
            />
        );
        expect(screen.getByText("Test Task")).toBeInTheDocument();
    });

    it("shows priority badge", () => {
        render(
            <TaskDetailModal
                task={mockTask}
                open={true}
                onOpenChange={mockOnOpenChange}
                onUpdate={mockOnUpdate}
            />
        );
        expect(screen.getByText("HIGH")).toBeInTheDocument();
    });

    it("shows status label", () => {
        render(
            <TaskDetailModal
                task={mockTask}
                open={true}
                onOpenChange={mockOnOpenChange}
                onUpdate={mockOnUpdate}
            />
        );
        expect(screen.getByText("In Progress")).toBeInTheDocument();
    });

    it("shows IMMINENT badge when deadline is within 24 hours", () => {
        const imminentTask = {
            ...mockTask,
            endDate: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
        };
        render(
            <TaskDetailModal
                task={imminentTask}
                open={true}
                onOpenChange={mockOnOpenChange}
                onUpdate={mockOnUpdate}
            />
        );
        expect(screen.getByText("IMMINENT")).toBeInTheDocument();
    });

    it("does not show IMMINENT badge when task is done", () => {
        const imminentDoneTask = {
            ...mockTask,
            status: "done" as const,
            endDate: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
        };
        render(
            <TaskDetailModal
                task={imminentDoneTask}
                open={true}
                onOpenChange={mockOnOpenChange}
                onUpdate={mockOnUpdate}
            />
        );
        expect(screen.queryByText("IMMINENT")).not.toBeInTheDocument();
    });

    it("shows Edit button in view mode", () => {
        render(
            <TaskDetailModal
                task={mockTask}
                open={true}
                onOpenChange={mockOnOpenChange}
                onUpdate={mockOnUpdate}
            />
        );
        expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    });

    it("shows Close button", () => {
        render(
            <TaskDetailModal
                task={mockTask}
                open={true}
                onOpenChange={mockOnOpenChange}
                onUpdate={mockOnUpdate}
            />
        );
        const closeButtons = screen.getAllByRole("button", { name: /close/i });
        expect(closeButtons.length).toBeGreaterThanOrEqual(1);
    });

    it("displays progress percentage", () => {
        render(
            <TaskDetailModal
                task={mockTask}
                open={true}
                onOpenChange={mockOnOpenChange}
                onUpdate={mockOnUpdate}
            />
        );
        expect(screen.getByText("50%")).toBeInTheDocument();
    });

    it("switches to edit mode when Edit is clicked", () => {
        render(
            <TaskDetailModal
                task={mockTask}
                open={true}
                onOpenChange={mockOnOpenChange}
                onUpdate={mockOnUpdate}
            />
        );
        fireEvent.click(screen.getByRole("button", { name: /edit/i }));
        expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    });

    it("shows Save button in edit mode", () => {
        render(
            <TaskDetailModal
                task={mockTask}
                open={true}
                onOpenChange={mockOnOpenChange}
                onUpdate={mockOnUpdate}
            />
        );
        fireEvent.click(screen.getByRole("button", { name: /edit/i }));
        expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    });

    it("does not render when open is false", () => {
        const { container } = render(
            <TaskDetailModal
                task={mockTask}
                open={false}
                onOpenChange={mockOnOpenChange}
                onUpdate={mockOnUpdate}
            />
        );
        expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
    });
});
