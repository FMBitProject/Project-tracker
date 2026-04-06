import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex flex-col flex-1 ml-64">
                <Header />
                <main className="flex-1 p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
