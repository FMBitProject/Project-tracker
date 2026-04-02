"use client";

import { useEffect, useState, useCallback } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { AlertCircle } from "lucide-react";
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

interface TaskDetailModalProps {
    task: Task;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdate: () => void;
}

const priorityColors = {
    low: "text-green-500",
    medium: "text-yellow-500",
    high: "text-orange-500",
    critical: "text-red-500",
};

const statusLabels = {
    todo: "To Do",
    in_progress: "In Progress",
    review: "Review",
    done: "Done",
};

export function TaskDetailModal({ task, open, onOpenChange, onUpdate }: TaskDetailModalProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(task.title);
    const [editedContent, setEditedContent] = useState(task.content || "");
    const [editedPriority, setEditedPriority] = useState(task.priority);
    const [editedStatus, setEditedStatus] = useState(task.status);
    const [editedProgress, setEditedProgress] = useState(task.progress);
    const [editedStartDate, setEditedStartDate] = useState(new Date(task.startDate));
    const [editedEndDate, setEditedEndDate] = useState(new Date(task.endDate));
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Reset form when task changes
    useEffect(() => {
        setEditedTitle(task.title);
        setEditedContent(task.content || "");
        setEditedPriority(task.priority);
        setEditedStatus(task.status);
        setEditedProgress(task.progress);
        setEditedStartDate(new Date(task.startDate));
        setEditedEndDate(new Date(task.endDate));
        setIsEditing(false);
    }, [task]);

    // Auto-save content with debounce
    const saveContent = useCallback(async (content: string) => {
        setIsSaving(true);
        try {
            const response = await fetch(`/api/tasks/${task.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content }),
            });

            if (response.ok) {
                setLastSaved(new Date());
                onUpdate();
            }
        } catch (error) {
            console.error("Error auto-saving content:", error);
        } finally {
            setIsSaving(false);
        }
    }, [task.id, onUpdate]);

    // Debounced auto-save effect
    useEffect(() => {
        if (!isEditing || editedContent === task.content) return;

        const timer = setTimeout(() => {
            saveContent(editedContent);
        }, 1000); // Save after 1 second of no changes

        return () => clearTimeout(timer);
    }, [editedContent, isEditing, task.content, saveContent]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch(`/api/tasks/${task.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: editedTitle,
                    priority: editedPriority,
                    status: editedStatus,
                    progress: editedProgress,
                    startDate: editedStartDate.toISOString(),
                    endDate: editedEndDate.toISOString(),
                }),
            });

            if (response.ok) {
                setIsEditing(false);
                setLastSaved(new Date());
                onUpdate();
            }
        } catch (error) {
            console.error("Error saving task:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const isImminent =
        new Date(task.endDate).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000 &&
        task.status !== "done";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <div className="flex items-start justify-between">
                        {isEditing ? (
                            <Input
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                className="text-xl font-bold"
                            />
                        ) : (
                            <DialogTitle className="text-xl">{task.title}</DialogTitle>
                        )}
                        <div className="flex items-center gap-2">
                            {isImminent && (
                                <span className="flex items-center gap-1 text-xs bg-orange-500 text-white px-2 py-1 rounded font-bold">
                                    <AlertCircle className="h-3 w-3" />
                                    IMMINENT
                                </span>
                            )}
                            <Button
                                variant={isEditing ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                    if (isEditing) {
                                        handleSave();
                                    } else {
                                        setIsEditing(true);
                                    }
                                }}
                                disabled={isSaving}
                            >
                                {isSaving ? "Saving..." : isEditing ? "Save" : "Edit"}
                            </Button>
                        </div>
                    </div>
                    <DialogDescription className="flex items-center gap-4 mt-2">
                        <span className={cn("font-medium", priorityColors[task.priority])}>
                            {task.priority.toUpperCase()}
                        </span>
                        <span>•</span>
                        <span>{statusLabels[task.status]}</span>
                        <span>•</span>
                        <span>Updated: {new Date(task.updatedAt).toLocaleString()}</span>
                        {lastSaved && (
                            <>
                                <span>•</span>
                                <span className="text-green-500">Saved: {lastSaved.toLocaleTimeString()}</span>
                            </>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4 overflow-auto">
                    {/* Progress */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>Progress</Label>
                            <span className="text-sm text-muted-foreground">{editedProgress}%</span>
                        </div>
                        {isEditing ? (
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={editedProgress}
                                onChange={(e) => setEditedProgress(Number(e.target.value))}
                                className="w-full"
                            />
                        ) : (
                            <Progress value={task.progress} className="h-2" />
                        )}
                    </div>

                    {/* Status and Priority */}
                    {isEditing && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Status</Label>
                                <Select value={editedStatus} onValueChange={(v) => setEditedStatus(v as any)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todo">To Do</SelectItem>
                                        <SelectItem value="in_progress">In Progress</SelectItem>
                                        <SelectItem value="review">Review</SelectItem>
                                        <SelectItem value="done">Done</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Priority</Label>
                                <Select value={editedPriority} onValueChange={(v) => setEditedPriority(v as any)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="critical">Critical</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {/* Dates */}
                    {isEditing && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Start Date</Label>
                                <Calendar
                                    mode="single"
                                    selected={editedStartDate}
                                    onSelect={(date) => date && setEditedStartDate(date)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>End Date</Label>
                                <Calendar
                                    mode="single"
                                    selected={editedEndDate}
                                    onSelect={(date) => date && setEditedEndDate(date)}
                                />
                            </div>
                        </div>
                    )}

                    {/* Content (Markdown Editor) */}
                    <div className="grid gap-2">
                        <Label htmlFor="content">
                            Description (Markdown)
                            {isSaving && <span className="text-muted-foreground ml-2">(Saving...)</span>}
                            {lastSaved && !isSaving && (
                                <span className="text-green-500 ml-2 text-xs">(Auto-saved)</span>
                            )}
                        </Label>
                        {isEditing ? (
                            <Textarea
                                id="content"
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                placeholder="Add task details in Markdown format..."
                                rows={12}
                                className="font-mono text-sm"
                            />
                        ) : (
                            <ScrollArea className="h-[300px] rounded-md border p-4">
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    {task.content ? (
                                        <pre className="whitespace-pre-wrap font-sans text-sm">{task.content}</pre>
                                    ) : (
                                        <p className="text-muted-foreground">No description added yet.</p>
                                    )}
                                </div>
                            </ScrollArea>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
