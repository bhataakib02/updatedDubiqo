import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  FolderKanban, 
  FileText, 
  CheckCircle2,
  MessageSquare, 
  LogOut,
  Plus,
  ArrowRight,
  Download,
  User
} from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { Tables } from "@/integrations/supabase/types";

type Project = Tables<"projects">;
type Invoice = Tables<"invoices">;
type Ticket = Tables<"tickets">;

export default function ClientPortal() {
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState({
    activeProjects: 0,
    pendingInvoices: 0,
    completedProjects: 0,
    openTickets: 0,
    pendingAmount: 0
  });
  
  // New ticket dialog
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({ title: "", description: "", priority: "medium" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (!supabase) {
        toast.error("Authentication not configured");
        navigate("/");
        return;
      }
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      await loadUserData(session.user.id);
      setIsLoading(false);
    };

    checkAuth();

    if (!supabase) return;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadUserData = async (userId: string) => {
    if (!supabase) return;

    try {
      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      setProfile(profileData);

      // Load user's projects
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', userId)
        .order('created_at', { ascending: false });
      
      setProjects(projectsData || []);

      // Load user's invoices
      const { data: invoicesData } = await supabase
        .from('invoices')
        .select('*')
        .eq('client_id', userId)
        .order('created_at', { ascending: false });
      
      setInvoices(invoicesData || []);

      // Load user's tickets
      const { data: ticketsData } = await supabase
        .from('tickets')
        .select('*')
        .eq('client_id', userId)
        .order('created_at', { ascending: false });
      
      setTickets(ticketsData || []);

      // Calculate stats
      const activeProjects = (projectsData || []).filter(p => 
        ['discovery', 'in_progress', 'review'].includes(p.status)
      ).length;
      const completedProjects = (projectsData || []).filter(p => p.status === 'completed').length;
      const pendingInvoices = (invoicesData || []).filter(i => 
        ['pending', 'sent', 'overdue'].includes(i.status)
      );
      const pendingAmount = pendingInvoices.reduce((sum, inv) => sum + Number(inv.total_amount), 0);
      const openTickets = (ticketsData || []).filter(t => 
        ['open', 'in_progress'].includes(t.status)
      ).length;

      setStats({
        activeProjects,
        pendingInvoices: pendingInvoices.length,
        completedProjects,
        openTickets,
        pendingAmount
      });
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load your data');
    }
  };

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleCreateTicket = async () => {
    if (!supabase || !user) return;
    
    if (!newTicket.title.trim() || !newTicket.description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('tickets').insert({
        client_id: user.id,
        title: newTicket.title,
        description: newTicket.description,
        priority: newTicket.priority,
        status: 'open'
      });

      if (error) throw error;

      toast.success("Support ticket created successfully");
      setIsTicketDialogOpen(false);
      setNewTicket({ title: "", description: "", priority: "medium" });
      
      // Reload tickets
      await loadUserData(user.id);
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error("Failed to create ticket");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "paid":
        return "bg-success/10 text-success border-success/20";
      case "in_progress":
      case "pending":
      case "sent":
        return "bg-warning/10 text-warning border-warning/20";
      case "review":
      case "open":
        return "bg-primary/10 text-primary border-primary/20";
      case "overdue":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="pt-28 pb-16 min-h-screen">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-1">Client Portal</h1>
              <p className="text-muted-foreground">
                Welcome back, {profile?.full_name || user?.email}
              </p>
              {profile?.client_code && (
                <p className="text-sm text-muted-foreground mt-1">
                  <User className="w-4 h-4 inline mr-1" />
                  Client ID: <span className="font-mono font-semibold">{profile.client_code}</span>
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <Button asChild>
                <Link to="/quote">
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FolderKanban className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.activeProjects}</p>
                    <p className="text-sm text-muted-foreground">Active Projects</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">₹{(stats.pendingAmount / 100).toLocaleString('en-IN')}</p>
                    <p className="text-sm text-muted-foreground">Pending Invoices</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.completedProjects}</p>
                    <p className="text-sm text-muted-foreground">Completed Projects</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.openTickets}</p>
                    <p className="text-sm text-muted-foreground">Open Tickets</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="projects" className="space-y-6">
            <TabsList className="bg-card/50 border border-border/50">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="space-y-4">
              {projects.length === 0 ? (
                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardContent className="p-8 text-center">
                    <FolderKanban className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">No projects yet</p>
                    <Button asChild>
                      <Link to="/quote">Start Your First Project</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                projects.map((project) => (
                  <Card key={project.id} className="bg-card/50 backdrop-blur border-border/50">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{project.title}</h3>
                            <Badge variant="outline" className={getStatusColor(project.status)}>
                              {formatStatus(project.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                          <p className="text-xs text-muted-foreground">
                            Type: {project.project_type} | Started: {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'TBD'}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="invoices" className="space-y-4">
              {invoices.length === 0 ? (
                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardContent className="p-8 text-center">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No invoices yet</p>
                  </CardContent>
                </Card>
              ) : (
                invoices.map((invoice) => (
                  <Card key={invoice.id} className="bg-card/50 backdrop-blur border-border/50">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                            <FileText className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{invoice.invoice_number}</h3>
                            <p className="text-sm text-muted-foreground">
                              Due: {new Date(invoice.due_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-bold text-lg">
                              ₹{(Number(invoice.total_amount) / 100).toLocaleString('en-IN')}
                            </p>
                            <Badge variant="outline" className={getStatusColor(invoice.status)}>
                              {formatStatus(invoice.status)}
                            </Badge>
                          </div>
                          {['pending', 'sent', 'overdue'].includes(invoice.status) && (
                            <Button size="sm" className="glow-primary">
                              Pay Now
                            </Button>
                          )}
                          {invoice.status === "paid" && invoice.pdf_url && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={invoice.pdf_url} target="_blank" rel="noopener noreferrer">
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="support" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Support Tickets</h3>
                <Dialog open={isTicketDialogOpen} onOpenChange={setIsTicketDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      New Ticket
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Support Ticket</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          placeholder="Brief description of your issue"
                          value={newTicket.title}
                          onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                          id="description"
                          placeholder="Provide details about your issue or request"
                          rows={4}
                          value={newTicket.description}
                          onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                          value={newTicket.priority}
                          onValueChange={(value) => setNewTicket({ ...newTicket, priority: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={handleCreateTicket}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Creating..." : "Create Ticket"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              {tickets.length === 0 ? (
                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardContent className="p-8 text-center">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">No support tickets yet</p>
                    <Button onClick={() => setIsTicketDialogOpen(true)}>
                      Create Your First Ticket
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                tickets.map((ticket) => (
                  <Card key={ticket.id} className="bg-card/50 backdrop-blur border-border/50">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-semibold mb-1">{ticket.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{ticket.description}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getStatusColor(ticket.status)}>
                              {formatStatus(ticket.status)}
                            </Badge>
                            <Badge variant="secondary">{ticket.priority}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(ticket.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}