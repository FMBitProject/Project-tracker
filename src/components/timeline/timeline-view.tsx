"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    ChevronLeft,
    ChevronRight,
    Loader2,
    X,
    ExternalLink,
    CheckCircle2,
    Clock,
    AlertTriangle,
    FolderKanban,
    Calendar as CalendarIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    priority: "low" | "medium" | "high" | "critical";
    status: "todo" | "in_progress" | "review" | "done";
    progress: number;
    projectId: string;
    project?: {
        id: string;
        name: string;
    };
}

interface TimelineProps {
    view?: "month" | "week";
}

const priorityDotColors: Record<string, string> = {
    low: "bg-green-500",
    medium: "bg-yellow-500",
    high: "bg-orange-500",
    critical: "bg-red-500",
};

const priorityColors: Record<string, string> = {
    low: "from-green-400 to-emerald-500",
    medium: "from-yellow-400 to-amber-500",
    high: "from-orange-400 to-orange-600",
    critical: "from-red-400 to-rose-600",
};

const priorityBorderColors: Record<string, string> = {
    low: "border-l-green-500",
    medium: "border-l-yellow-500",
    high: "border-l-orange-500",
    critical: "border-l-red-500",
};

const priorityBadgeColors: Record<string, string> = {
    low: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-orange-100 text-orange-700",
    critical: "bg-red-100 text-red-700",
};

const statusLabels: Record<string, string> = {
    todo: "To Do",
    in_progress: "In Progress",
    review: "Review",
    done: "Done",
};

const statusIcons: Record<string, React.ReactNode> = {
    todo: <Clock className="h-3 w-3" />,
    in_progress: <Clock className="h-3 w-3" />,
    review: <AlertTriangle className="h-3 w-3" />,
    done: <CheckCircle2 className="h-3 w-3" />,
};

const statusBadgeColors: Record<string, string> = {
    todo: "bg-slate-100 text-slate-700",
    in_progress: "bg-blue-100 text-blue-700",
    review: "bg-purple-100 text-purple-700",
    done: "bg-green-100 text-green-700",
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

export function Timeline({ view = "month" }: TimelineProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [timelineView, setTimelineView] = useState<"month" | "week">(view);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState<{ date: Date; tasks: Task[] } | null>(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    async function fetchTasks() {
        try {
            setIsLoading(true);
            const response = await fetch("/api/tasks");
            if (response.ok) {
                const data = await response.json();
                setTasks(data);
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const isImminent = (endDate: string) => {
        const end = new Date(endDate);
        const now = new Date();
        const hoursUntilDeadline = (end.getTime() - now.getTime()) / (1000 * 60 * 60);
        return hoursUntilDeadline > 0 && hoursUntilDeadline < 24;
    };

    const getTasksForDay = (date: Date) => {
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);

        return tasks.filter((task) => {
            const taskStart = new Date(task.startDate);
            const taskEnd = new Date(task.endDate);
            return taskStart <= dayEnd && taskEnd >= dayStart;
        });
    };

    // Generate calendar grid cells
    const getCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        if (timelineView === "month") {
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const startDate = new Date(firstDay);
            startDate.setDate(startDate.getDate() - startDate.getDay()); // Go to Sunday

            const endDate = new Date(lastDay);
            const daysAfter = 6 - endDate.getDay();
            endDate.setDate(endDate.getDate() + daysAfter);

            const days: Date[] = [];
            const current = new Date(startDate);
            while (current <= endDate) {
                days.push(new Date(current));
                current.setDate(current.getDate() + 1);
            }

            return days;
        } else {
            // Week view
            const dayOfWeek = currentDate.getDay();
            const startDate = new Date(currentDate);
            startDate.setDate(startDate.getDate() - dayOfWeek);

            const days: Date[] = [];
            for (let i = 0; i < 7; i++) {
                const d = new Date(startDate);
                d.setDate(d.getDate() + i);
                days.push(d);
            }
            return days;
        }
    };

    const calendarDays = getCalendarDays();

    const periodLabel = `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    const navigatePeriod = (direction: "prev" | "next") => {
        const newDate = new Date(currentDate);
        if (timelineView === "month") {
            newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
        } else {
            newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
        }
        setCurrentDate(newDate);
    };

    const handleDayClick = (date: Date, e: React.MouseEvent) => {
        e.stopPropagation();
        const dayTasks = getTasksForDay(date);
        setSelectedDay({ date, tasks: dayTasks });
    };

    const today = new Date();
    const isToday = (date: Date) =>
        date.toDateString() === today.toDateString();

    const isCurrentMonth = (date: Date) =>
        date.getMonth() === currentDate.getMonth();

    // Group calendar days into weeks (rows of 7)
    const weeks = useMemo(() => {
        const result: Date[][] = [];
        for (let i = 0; i < calendarDays.length; i += 7) {
            result.push(calendarDays.slice(i, i + 7));
        }
        return result;
    }, [calendarDays]);

    if (isLoading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-20">
                    <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="relative">
            <Card className="border-0 shadow-xl overflow-hidden">
                <CardHeader className="bg-muted/30 dark:bg-slate-800/50 border-b pb-4">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <CardTitle className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-9 w-9 hover:bg-purple-50"
                                    onClick={() => navigatePeriod("prev")}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-9 w-9 hover:bg-purple-50"
                                    onClick={() => navigatePeriod("next")}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="h-5 w-5 text-purple-500" />
                                <h2 className="text-xl font-bold">{periodLabel}</h2>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-xs"
                                onClick={() => setCurrentDate(new Date())}
                            >
                                Today
                            </Button>
                        </CardTitle>
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
                </CardHeader>

                <CardContent className="p-0">
                    {/* ── Calendar Grid ── */}
                    <div className="select-none">
                        {/* Weekday header row */}
                        <div className="grid grid-cols-7 bg-muted/50 dark:bg-slate-800/50 border-b">
                            {WEEKDAYS.map((day) => (
                                <div
                                    key={day}
                                    className="p-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground border-r last:border-r-0"
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar weeks */}
                        {weeks.map((week, weekIdx) => (
                            <div
                                key={weekIdx}
                                className="grid grid-cols-7 border-b last:border-b-0"
                            >
                                {week.map((date, dayIdx) => {
                                    const dayTasks = getTasksForDay(date);
                                    const todayClass = isToday(date);
                                    const currentMonthClass = isCurrentMonth(date);
                                    const isLast = dayIdx === 6;

                                    return (
                                        <button
                                            key={`${weekIdx}-${dayIdx}`}
                                            onClick={(e) => handleDayClick(date, e)}
                                            className={cn(
                                                "relative min-h-[110px] p-2 text-left cursor-pointer transition-all border-r last:border-r-0",
                                                "hover:bg-purple-50/50 dark:hover:bg-purple-950/30 hover:shadow-inner group",
                                                todayClass
                                                    ? "bg-purple-50/80 dark:bg-purple-950/40 ring-2 ring-inset ring-purple-300 dark:ring-purple-700"
                                                    : currentMonthClass
                                                    ? "bg-card"
                                                    : "bg-muted/30 dark:bg-slate-800/30"
                                            )}
                                        >
                                            {/* Day number */}
                                            <div className="flex items-center justify-between mb-2">
                                                <span
                                                    className={cn(
                                                        "inline-flex items-center justify-center w-8 h-8 text-sm font-semibold rounded-full transition-colors",
                                                        todayClass
                                                            ? "bg-purple-600 text-white shadow-md"
                                                            : currentMonthClass
                                                            ? "text-foreground group-hover:bg-purple-100 dark:group-hover:bg-purple-900/40"
                                                            : "text-muted-foreground"
                                                    )}
                                                >
                                                    {date.getDate()}
                                                </span>
                                                {dayTasks.length > 0 && (
                                                    <span className="text-[10px] font-bold text-purple-500 bg-purple-100 px-1.5 py-0.5 rounded-full">
                                                        {dayTasks.length}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Task pills */}
                                            <div className="space-y-1 overflow-hidden">
                                                {dayTasks.slice(0, 3).map((task) => {
                                                    const imminent = isImminent(task.endDate) && task.status !== "done";
                                                    return (
                                                        <div
                                                            key={task.id}
                                                            className={cn(
                                                                "text-[10px] px-1.5 py-0.5 rounded-md truncate font-medium border-l-2",
                                                                priorityBorderColors[task.priority],
                                                                task.status === "done"
                                                                    ? "opacity-50 bg-muted dark:bg-slate-700 line-through"
                                                                    : "bg-muted/50 dark:bg-slate-700/50"
                                                            )}
                                                        >
                                                            <span className="flex items-center gap-1">
                                                                <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", priorityDotColors[task.priority])} />
                                                                <span className="truncate">
                                                                    {task.title}
                                                                </span>
                                                                {imminent && (
                                                                    <span className="text-[8px] bg-orange-500 text-white px-0.5 rounded flex-shrink-0">!</span>
                                                                )}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                                {dayTasks.length > 3 && (
                                                    <div className="text-[10px] text-purple-600 font-semibold pl-1">
                                                        +{dayTasks.length - 3} more
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    {/* Legend */}
                    <div className="mt-4 px-6 py-4 bg-muted/30 dark:bg-slate-800/50 border-t flex items-center gap-6 text-sm flex-wrap">
                        <span className="text-muted-foreground font-medium">Priority:</span>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-green-500 shadow-sm" />
                            <span>Low</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm" />
                            <span>Medium</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-orange-500 shadow-sm" />
                            <span>High</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-red-500 shadow-sm" />
                            <span>Critical</span>
                        </div>
                        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="opacity-40 block w-4 h-4 rounded bg-gray-400"></span>
                            <span>Done</span>
                            <span className="opacity-90 block w-4 h-4 rounded bg-gray-400 ml-2"></span>
                            <span>In Progress</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ── Day Detail Panel ── */}
            {selectedDay && (
                <div
                    className="fixed inset-0 z-[60] bg-black/50"
                    onClick={() => setSelectedDay(null)}
                >
                    <div
                        className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-slate-800 shadow-2xl overflow-y-auto z-[70]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Panel Header */}
                        <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-white/70 font-medium">
                                        {selectedDay.date.toLocaleDateString("en-US", { weekday: "long" })}
                                    </p>
                                    <h2 className="text-2xl font-extrabold mt-1">
                                        {selectedDay.date.toLocaleDateString("en-US", {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setSelectedDay(null)}
                                    className="p-2 rounded-full hover:bg-white/20 transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <p className="text-sm text-white/80 mt-2">
                                {selectedDay.tasks.length} task{selectedDay.tasks.length !== 1 ? "s" : ""} scheduled
                            </p>
                        </div>

                        {/* Tasks List */}
                        <div className="p-6 space-y-4">
                            {selectedDay.tasks.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted dark:bg-slate-700 mx-auto mb-4">
                                        <CheckCircle2 className="h-7 w-7 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-foreground">No tasks</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        No tasks scheduled for this day.
                                    </p>
                                </div>
                            ) : (
                                selectedDay.tasks.map((task) => {
                                    const imminent = isImminent(task.endDate) && task.status !== "done";

                                    return (
                                        <Card
                                            key={task.id}
                                            className={cn(
                                                "border-l-4 hover:shadow-lg transition-all hover:-translate-y-0.5",
                                                priorityBorderColors[task.priority],
                                                task.status === "done" && "opacity-70"
                                            )}
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                                            <span className={cn("w-2 h-2 rounded-full", priorityDotColors[task.priority])} />
                                                            <h4 className={cn(
                                                                "font-semibold text-foreground truncate",
                                                                task.status === "done" && "line-through text-muted-foreground"
                                                            )}>
                                                                {task.title}
                                                            </h4>
                                                        </div>

                                                        {/* Project Link */}
                                                        {task.project && (
                                                            <Link
                                                                href={`/projects/${task.project.id}`}
                                                                className="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 hover:underline mb-2"
                                                            >
                                                                <FolderKanban className="h-3 w-3" />
                                                                {task.project.name}
                                                                <ExternalLink className="h-3 w-3" />
                                                            </Link>
                                                        )}

                                                        {/* Badges */}
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold uppercase", priorityBadgeColors[task.priority])}>
                                                                {task.priority}
                                                            </span>
                                                            <span className={cn("inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold", statusBadgeColors[task.status])}>
                                                                {statusIcons[task.status]}
                                                                {statusLabels[task.status]}
                                                            </span>
                                                            {imminent && (
                                                                <span className="text-[10px] bg-orange-500 text-white px-2 py-0.5 rounded-full font-bold">
                                                                    URGENT
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Progress */}
                                                        <div className="mt-3">
                                                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                                                <span>Progress</span>
                                                                <span className="font-bold">{task.progress}%</span>
                                                            </div>
                                                            <div className="w-full bg-muted dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                                                                <div
                                                                    className={cn(
                                                                        "h-full rounded-full bg-gradient-to-r",
                                                                        priorityColors[task.priority]
                                                                    )}
                                                                    style={{ width: `${task.progress}%` }}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Dates */}
                                                        <p className="text-xs text-muted-foreground mt-2">
                                                            {new Date(task.startDate).toLocaleDateString()} → {new Date(task.endDate).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
