
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Search } from "lucide-react";
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
  client_id: string;
  pickup_address: string | null;
  dropoff_address: string | null;
}

interface Application {
  id: string;
  job_id: string;
  status: string;
}

const FreelancerDashboard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [myApplications, setMyApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [proposal, setProposal] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("status", "open")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error: any) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyApplications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .eq("freelancer_id", user.id);

      if (error) throw error;
      setMyApplications(data || []);
    } catch (error: any) {
      console.error("Error fetching applications:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchMyApplications();
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobId) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("applications").insert({
        job_id: selectedJobId,
        freelancer_id: user.id,
        proposal: proposal,
      });

      if (error) throw error;

      toast({
        title: "Application submitted!",
        description: "Good luck! The client will review your proposal.",
      });
      setIsDialogOpen(false);
      setProposal("");
      setSelectedJobId(null);
      fetchMyApplications();
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

  const hasApplied = (jobId: string) => {
    return myApplications.some(app => app.job_id === jobId);
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      <header className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚚</span>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Freelancer Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              className="pl-10"
              placeholder="Search for jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p>Loading jobs...</p>
          ) : filteredJobs.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No jobs found matching your search.
            </div>
          ) : (
            filteredJobs.map((job) => (
              <Card key={job.id} className="flex flex-col hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl line-clamp-1">{job.title}</CardTitle>
                    <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                      ${job.budget}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Posted {format(new Date(job.created_at), 'MMM dd')} • Deadline: {job.deadline ? format(new Date(job.deadline), 'MMM dd') : 'None'}
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  {job.pickup_address && (
                    <p className="text-sm text-muted-foreground mb-1">📍 Pickup: {job.pickup_address}</p>
                  )}
                  {job.dropoff_address && (
                    <p className="text-sm text-muted-foreground mb-2">📍 Drop-off: {job.dropoff_address}</p>
                  )}
                  <p className="text-gray-600 dark:text-gray-300 line-clamp-3 text-sm">{job.description}</p>
                </CardContent>
                <CardFooter className="pt-4 border-t bg-gray-50/50 dark:bg-zinc-800/50">
                  {hasApplied(job.id) ? (
                    <Button disabled className="w-full bg-green-600 hover:bg-green-700 text-white opacity-80">
                      Applied ✓
                    </Button>
                  ) : (
                    <Dialog open={isDialogOpen && selectedJobId === job.id} onOpenChange={(open) => {
                      setIsDialogOpen(open);
                      if (open) setSelectedJobId(job.id);
                      else setSelectedJobId(null);
                    }}>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold">
                          Apply Now
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Apply for: {job.title}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleApply} className="space-y-4 mt-4">
                          <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg text-sm mb-4">
                            <p className="font-medium mb-1">Job Budget: ${job.budget}</p>
                            <p className="text-gray-500">{job.description}</p>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Your Proposal / Cover Letter</label>
                            <Textarea
                              required
                              value={proposal}
                              onChange={(e) => setProposal(e.target.value)}
                              placeholder="Explain why you are the best fit for this job..."
                              className="min-h-[150px]"
                            />
                          </div>
                          <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                            Submit Application
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default FreelancerDashboard;
