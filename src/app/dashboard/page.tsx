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
  AlertTriangle, 
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
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent tracking-tight pb-1">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of your current projects and tasks.
          </p>
        </div>
        <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white border-0 shadow-md transition-all">
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>

      {/* Statistic Cards (Grid Layout) */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Card 1: Total Tasks */}
        <Card className="bg-gradient-to-br from-blue-300 to-blue-400 border-0 shadow-md text-slate-900 transition-transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Total Tasks</CardTitle>
            <LayoutDashboard className="h-5 w-5 opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-xs font-medium opacity-80 mt-1">Tasks</p>
          </CardContent>
        </Card>

        {/* Card 2: Completed */}
        <Card className="bg-gradient-to-br from-green-300 to-green-400 border-0 shadow-md text-slate-900 transition-transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Completed</CardTitle>
            <CheckCircle className="h-5 w-5 opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-xs font-medium opacity-80 mt-1">0% completion rate</p>
          </CardContent>
        </Card>

        {/* Card 3: Critical */}
        <Card className="bg-gradient-to-br from-red-300 to-red-400 border-0 shadow-md text-slate-900 transition-transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Critical</CardTitle>
            <AlertTriangle className="h-5 w-5 opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-xs font-medium opacity-80 mt-1">High priority tasks</p>
          </CardContent>
        </Card>

        {/* Card 4: Overdue */}
        <Card className="bg-gradient-to-br from-orange-300 to-amber-400 border-0 shadow-md text-slate-900 transition-transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Overdue</CardTitle>
            <Clock className="h-5 w-5 opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-xs font-medium opacity-80 mt-1">Past deadline</p>
          </CardContent>
        </Card>

      </div>

      {/* Empty State Projects Section */}
      <div className="mt-10">
        <h2 className="text-xl font-bold tracking-tight mb-4 text-slate-800">Projects</h2>
        
        <Card className="flex flex-col items-center justify-center border-0 shadow-lg py-16 px-4 text-center bg-gradient-to-r from-blue-50 to-purple-100">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-md mb-6">
             <FolderOpen className="h-8 w-8 text-indigo-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">No projects yet</h3>
          <p className="mt-2 text-sm text-slate-600 max-w-sm">
            Create your first project to start tracking tasks and organizing your workflow.
          </p>
          <Button className="mt-8 bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white border-0 shadow-md transition-all hover:scale-105">
            <Plus className="mr-2 h-4 w-4" /> Create Project
          </Button>
        </Card>
      </div>

    </div>
  );
}