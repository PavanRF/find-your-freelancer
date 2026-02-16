
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Plus, Truck } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  status: string;
  created_at: string;
  pickup_address: string | null;
  dropoff_address: string | null;
}

interface Application {
  id: string;
  job_id: string;
  freelancer_id: string;
  proposal: string;
  status: string;
  created_at: string;
  profiles: {
    first_name: string;
    last_name: string;
  };
}

const ClientDashboard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
    pickup_address: "",
    dropoff_address: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchJobs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error: any) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // We need to fetch applications for jobs owned by this client
      // This is slightly complex, so we'll fetch all applications for now that match our policy
      const { data, error } = await supabase
        .from("applications")
        .select(`
          *,
          profiles:freelancer_id (first_name, last_name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      // @ts-ignore - Supabase types join handling
      setApplications(data || []);
    } catch (error: any) {
      console.error("Error fetching applications:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("jobs").insert({
        client_id: user.id,
        title: newJob.title,
        description: newJob.description,
        budget: parseFloat(newJob.budget),
        deadline: newJob.deadline,
        pickup_address: newJob.pickup_address,
        dropoff_address: newJob.dropoff_address,
      });

      if (error) throw error;

      toast({
        title: "Job posted successfully!",
        description: "Freelancers can now apply to your job.",
      });
      setIsDialogOpen(false);
      setNewJob({ title: "", description: "", budget: "", deadline: "", pickup_address: "", dropoff_address: "" });
      fetchJobs();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      <header className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚚</span>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Client Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Post New Job
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Post a New Job</DialogTitle>
                </DialogHeader>
                <form onSubmit={handlePostJob} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Job Title</label>
                    <Input
                      required
                      value={newJob.title}
                      onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                      placeholder="e.g. Transport Furniture to NY"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      required
                      value={newJob.description}
                      onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                      placeholder="Describe the load, weight, dimensions..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pickup Address</label>
                    <Input
                      required
                      value={newJob.pickup_address}
                      onChange={(e) => setNewJob({ ...newJob, pickup_address: e.target.value })}
                      placeholder="e.g. 123 Main St, New York, NY"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Drop-off Address</label>
                    <Input
                      required
                      value={newJob.dropoff_address}
                      onChange={(e) => setNewJob({ ...newJob, dropoff_address: e.target.value })}
                      placeholder="e.g. 456 Oak Ave, Los Angeles, CA"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Budget ($)</label>
                      <Input
                        required
                        type="number"
                        value={newJob.budget}
                        onChange={(e) => setNewJob({ ...newJob, budget: e.target.value })}
                        placeholder="500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Deadline</label>
                      <Input
                        required
                        type="date"
                        value={newJob.deadline}
                        onChange={(e) => setNewJob({ ...newJob, deadline: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                    Post Job
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Posted Jobs</h2>
            {loading ? (
              <p>Loading...</p>
            ) : jobs.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No jobs posted yet. Click "Post New Job" to get started!
                </CardContent>
              </Card>
            ) : (
              jobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl text-primary">{job.title}</CardTitle>
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                        ${job.budget}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{job.description}</p>
                    {job.pickup_address && (
                      <p className="text-sm text-muted-foreground mb-1">📍 Pickup: {job.pickup_address}</p>
                    )}
                    {job.dropoff_address && (
                      <p className="text-sm text-muted-foreground mb-3">📍 Drop-off: {job.dropoff_address}</p>
                    )}
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>📅 Deadline: {job.deadline ? format(new Date(job.deadline), 'MMM dd, yyyy') : 'No deadline'}</span>
                      <span>🕒 Posted: {format(new Date(job.created_at), 'MMM dd, yyyy')}</span>
                    </div>
                    
                    {/* Show applications for this job */}
                    <div className="mt-6 pt-4 border-t">
                      <h4 className="font-semibold mb-3">Applications ({applications.filter(a => a.job_id === job.id).length})</h4>
                      <div className="space-y-3">
                        {applications
                          .filter(app => app.job_id === job.id)
                          .map(app => (
                            <div key={app.id} className="bg-gray-50 dark:bg-zinc-800 p-3 rounded-lg text-sm">
                              <div className="flex justify-between font-medium mb-1">
                                <span>{app.profiles?.first_name} {app.profiles?.last_name}</span>
                                <span className="capitalize text-primary">{app.status}</span>
                              </div>
                              <p className="text-gray-600 dark:text-gray-400">{app.proposal}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="space-y-6">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Jobs</span>
                  <span className="font-bold text-xl">{jobs.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Applications</span>
                  <span className="font-bold text-xl">{applications.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientDashboard;
