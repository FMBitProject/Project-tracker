import { Timeline } from "@/components/timeline/timeline-view";

export default function TimelinePage() {
    return (
        <div className="space-y-8">
            {/* Header Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 p-8 text-white shadow-2xl">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10 blur-xl" />
                <div className="relative">
                    <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-lg">
                        Timeline 📅
                    </h1>
                    <p className="text-sm text-white/80 mt-2 max-w-lg">
                        Visualize your tasks across time. Navigate between weeks and months to plan your work.
                    </p>
                </div>
            </div>

            <Timeline />
        </div>
    );
}
