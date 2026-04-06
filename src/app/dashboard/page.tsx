import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  LayoutDashboard, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  FolderOpen, 
  Plus 
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ringkasan status proyek dan tugas kamu saat ini.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>

      {/* Statistic Cards (Grid Layout) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Card 1: Total Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>

        {/* Card 2: Completed */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">0% completion rate</p>
          </CardContent>
        </Card>

        {/* Card 3: Critical */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">High priority tasks</p>
          </CardContent>
        </Card>

        {/* Card 4: Overdue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">Past deadline</p>
          </CardContent>
        </Card>

      </div>

      {/* Empty State Projects Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold tracking-tight mb-4">Projects</h2>
        
        <Card className="flex flex-col items-center justify-center border-dashed py-16 px-4 text-center bg-muted/20">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background shadow-sm mb-4">
             <FolderOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No projects yet</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            Create your first project to start tracking tasks and organizing your workflow.
          </p>
          <Button variant="outline" className="mt-6">
            <Plus className="mr-2 h-4 w-4" /> Create Project
          </Button>
        </Card>
      </div>

    </div>
  );
}