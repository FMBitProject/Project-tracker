"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    priority: "low" | "medium" | "high" | "critical";
    status: "todo" | "in_progress" | "review" | "done";
    progress: number;
    project?: {
        id: string;
        name: string;
    };
}

interface TimelineProps {
    view?: "month" | "week";
}

const priorityColors = {
    low: "bg-green-500",
    medium: "bg-yellow-500",
    high: "bg-orange-500",
    critical: "bg-red-500 task-critical",
};

const statusColors = {
    todo: "opacity-60",
    in_progress: "opacity-80",
    review: "opacity-90",
    done: "opacity-40",
};

export function Timeline({ view = "month" }: TimelineProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [timelineView, setTimelineView] = useState<"month" | "week">(view);

    useEffect(() => {
        fetchTasks();
    }, []);

    async function fetchTasks() {
        try {
            const response = await fetch("/api/tasks");
            if (response.ok) {
                const data = await response.json();
                setTasks(data);
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    }

    const getDaysInPeriod = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        if (timelineView === "month") {
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            return Array.from({ length: daysInMonth }, (_, i) => {
                const date = new Date(year, month, i + 1);
                return {
                    date,
                    day: i + 1,
                    label: date.toLocaleDateString("en-US", { weekday: "short" }),
                };
            });
        } else {
            // Week view - start from Monday
            const dayOfWeek = currentDate.getDay();
            const diff = currentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
            const monday = new Date(currentDate.setDate(diff));

            return Array.from({ length: 7 }, (_, i) => {
                const date = new Date(monday);
                date.setDate(monday.getDate() + i);
                return {
                    date,
                    day: date.getDate(),
                    label: date.toLocaleDateString("en-US", { weekday: "short" }),
                };
            });
        }
    };

    const getTaskPosition = (task: Task) => {
        const days = getDaysInPeriod();
        const taskStart = new Date(task.startDate);
        const taskEnd = new Date(task.endDate);
        const periodStart = days[0].date;
        const periodEnd = days[days.length - 1].date;

        // Clamp task dates to period
        const clampedStart = new Date(Math.max(taskStart.getTime(), periodStart.getTime()));
        const clampedEnd = new Date(Math.min(taskEnd.getTime(), periodEnd.getTime()));

        const totalDays = days.length;
        const startOffset = (clampedStart.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24);
        const duration = (clampedEnd.getTime() - clampedStart.getTime()) / (1000 * 60 * 60 * 24) + 1;

        return {
            left: `${(startOffset / totalDays) * 100}%`,
            width: `${(duration / totalDays) * 100}%`,
        };
    };

    const isImminent = (endDate: string) => {
        const end = new Date(endDate);
        const now = new Date();
        const hoursUntilDeadline = (end.getTime() - now.getTime()) / (1000 * 60 * 60);
        return hoursUntilDeadline > 0 && hoursUntilDeadline < 24;
    };

    const days = getDaysInPeriod();
    const periodLabel = currentDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });

    const navigatePeriod = (direction: "prev" | "next") => {
        const newDate = new Date(currentDate);
        if (timelineView === "month") {
            newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
        } else {
            newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
        }
        setCurrentDate(newDate);
    };

    const visibleTasks = tasks.filter((task) => {
        const taskStart = new Date(task.startDate);
        const taskEnd = new Date(task.endDate);
        const periodStart = days[0].date;
        const periodEnd = days[days.length - 1].date;
        periodEnd.setHours(23, 59, 59, 999);

        return taskStart <= periodEnd && taskEnd >= periodStart;
    });

    return (
        <Card>
            <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" onClick={() => navigatePeriod("prev")}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <h2 className="text-lg font-semibold capitalize">{periodLabel}</h2>
                        <Button variant="outline" size="icon" onClick={() => navigatePeriod("next")}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex items-center gap-4">
                        <Select value={timelineView} onValueChange={(v) => setTimelineView(v as "month" | "week")}>
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="month">Month</SelectItem>
                                <SelectItem value="week">Week</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Timeline Grid */}
                <div className="border rounded-lg overflow-hidden">
                    {/* Days Header */}
                    <div className="grid grid-cols-8 border-b bg-muted/50">
                        <div className="p-3 text-sm font-medium border-r min-w-[200px]">Task</div>
                        {days.map((day, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "p-2 text-center text-sm border-r last:border-r-0",
                                    day.date.toDateString() === new Date().toDateString() && "bg-primary/10"
                                )}
                            >
                                <div className="font-medium">{day.label}</div>
                                <div className="text-muted-foreground">{day.day}</div>
                            </div>
                        ))}
                    </div>

                    {/* Task Rows */}
                    <div className="divide-y">
                        {visibleTasks.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                No tasks in this period
                            </div>
                        ) : (
                            visibleTasks.map((task) => {
                                const position = getTaskPosition(task);
                                const imminent = isImminent(task.endDate) && task.status !== "done";

                                return (
                                    <div key={task.id} className="grid grid-cols-8 min-h-[48px]">
                                        <div className="p-3 border-r text-sm font-medium flex items-center gap-2">
                                            <span className={cn("w-2 h-2 rounded-full", priorityColors[task.priority])} />
                                            <span className="truncate">{task.title}</span>
                                        </div>
                                        <div className="col-span-7 relative border-r last:border-r-0">
                                            {/* Grid lines */}
                                            <div className="absolute inset-0 flex">
                                                {days.map((_, i) => (
                                                    <div key={i} className="flex-1 border-r last:border-r-0 border-muted" />
                                                ))}
                                            </div>
                                            {/* Task Bar */}
                                            <div
                                                className={cn(
                                                    "absolute top-2 bottom-2 rounded-md px-2 text-xs text-white flex items-center",
                                                    priorityColors[task.priority],
                                                    statusColors[task.status],
                                                    imminent && "task-imminent border border-orange-500",
                                                    "overflow-hidden"
                                                )}
                                                style={{
                                                    left: position.left,
                                                    width: `calc(${position.width} - 4px)`,
                                                }}
                                            >
                                                <span className="truncate">{task.progress}%</span>
                                                {imminent && (
                                                    <span className="ml-1 font-bold text-[10px]">IMMINENT</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Legend */}
                <div className="mt-4 flex items-center gap-6 text-sm">
                    <span className="text-muted-foreground">Priority:</span>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded bg-green-500" />
                        <span>Low</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded bg-yellow-500" />
                        <span>Medium</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded bg-orange-500" />
                        <span>High</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded bg-red-500" />
                        <span>Critical</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
