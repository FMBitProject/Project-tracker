import { Timeline } from "@/components/timeline/timeline-view";

export default function TimelinePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Timeline</h1>
                <p className="text-muted-foreground mt-1">
                    Visualize your tasks across time
                </p>
            </div>
            <Timeline />
        </div>
    );
}
