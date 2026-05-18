"use client";

import { useState } from "react";
import {
  PlayCircle, Plus, Calendar, Clock, Video, ExternalLink,
  Pencil, Trash2, Search, Link2, AlarmClock, BookOpen, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useInstructorLiveClasses, useCreateLiveClass, useUpdateLiveClass, useDeleteLiveClass,
  InstructorLiveClass,
} from "@/hooks/useInstructorData";
import { useMyCourses } from "@/hooks/useInstructorData";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { cn } from "@/lib/utils";

function getStatus(cls: InstructorLiveClass): "live" | "upcoming" | "completed" {
  const now = new Date();
  const start = new Date(cls.startTime);
  const end = new Date(start.getTime() + cls.duration * 60000);
  if (now >= start && now <= end) return "live";
  if (now < start) return "upcoming";
  return "completed";
}

const EMPTY_FORM = {
  title: "", description: "", meetingUrl: "", startTime: "", duration: "60", courseId: "",
};

export default function ManagerClassesPage() {
  const { data, isLoading, isError, refetch } = useInstructorLiveClasses();
  const { data: coursesData } = useMyCourses();
  const createClass = useCreateLiveClass();
  const updateClass = useUpdateLiveClass();
  const deleteClass = useDeleteLiveClass();

  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<InstructorLiveClass | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  if (isLoading) return <Loading />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  const classes: InstructorLiveClass[] = data?.data || [];
  const courses = coursesData?.data || [];

  const filtered = classes.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.course?.title?.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setShowCreate(true);
  };

  const openEdit = (cls: InstructorLiveClass) => {
    setForm({
      title: cls.title,
      description: cls.description || "",
      meetingUrl: cls.meetingUrl,
      startTime: new Date(cls.startTime).toISOString().slice(0, 16),
      duration: String(cls.duration),
      courseId: cls.courseId,
    });
    setEditTarget(cls);
  };

  const handleSubmit = () => {
    const payload = {
      ...form,
      duration: Number(form.duration),
      startTime: new Date(form.startTime).toISOString(),
    };
    if (editTarget) {
      updateClass.mutate({ id: editTarget.id, payload }, { onSuccess: () => { setEditTarget(null); setForm(EMPTY_FORM); } });
    } else {
      createClass.mutate(payload as any, { onSuccess: () => { setShowCreate(false); setForm(EMPTY_FORM); } });
    }
  };

  const isPending = createClass.isPending || updateClass.isPending;

  const statusBadge = (status: string) => {
    if (status === "live") return (
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">Live Now</span>
      </div>
    );
    if (status === "upcoming") return <Badge variant="outline" className="border-blue-500 text-blue-500 font-bold uppercase text-[10px] bg-blue-500/5">Upcoming</Badge>;
    return <Badge variant="outline" className="font-bold uppercase text-[10px] text-muted-foreground">Completed</Badge>;
  };

  const FormDialog = ({ open, onClose, title }: { open: boolean; onClose: () => void; title: string }) => (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-black flex items-center gap-2">
            <PlayCircle className="h-5 w-5 text-primary" /> {title}
          </DialogTitle>
          <DialogDescription>Fill in the details for the live session.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label className="font-bold">Session Title</Label>
            <Input placeholder="e.g. Introduction to React Hooks" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="h-11" />
          </div>
          <div className="space-y-2">
            <Label className="font-bold">Description <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <Textarea placeholder="What will be covered in this session?" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="resize-none" rows={3} />
          </div>
          <div className="space-y-2">
            <Label className="font-bold flex items-center gap-1.5"><Link2 className="h-3.5 w-3.5" /> Meeting URL</Label>
            <Input placeholder="https://meet.google.com/..." value={form.meetingUrl} onChange={(e) => setForm({ ...form, meetingUrl: e.target.value })} className="h-11 font-mono text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-bold flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Start Time</Label>
              <Input type="datetime-local" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label className="font-bold flex items-center gap-1.5"><AlarmClock className="h-3.5 w-3.5" /> Duration (min)</Label>
              <Input type="number" min="15" max="480" placeholder="60" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="h-11" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="font-bold flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" /> Linked Course</Label>
            <Select value={form.courseId || ""} onValueChange={(v: string | null) => setForm({ ...form, courseId: v || "" })}>
              <SelectTrigger className="h-11"><SelectValue placeholder="Select a course..." /></SelectTrigger>
              <SelectContent>
                {courses.map((c: any) => (
                  <SelectItem key={c.id as string} value={c.id as string}>{c.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isPending || !form.title || !form.meetingUrl || !form.courseId || !form.startTime} className="font-bold">
            {isPending ? "Saving..." : editTarget ? "Update Session" : "Schedule Session"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Live Sessions"
        subtitle="Schedule, manage, and link meeting rooms to your courses."
        actions={
          <Button onClick={openCreate} className="h-10 font-bold gap-2">
            <Plus className="h-4 w-4" /> Schedule Session
          </Button>
        }
      />

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", count: classes.length, color: "text-foreground" },
          { label: "Upcoming", count: classes.filter(c => getStatus(c) === "upcoming").length, color: "text-blue-500" },
          { label: "Live Now", count: classes.filter(c => getStatus(c) === "live").length, color: "text-red-500" },
        ].map((s) => (
          <div key={s.label} className="saas-card text-center py-5">
            <p className={cn("text-3xl font-black", s.color)}>{s.count}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="saas-card p-0 overflow-hidden">
        <div className="p-5 border-b flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search sessions..." className="pl-9 h-10 rounded-[0.625rem] bg-muted/30 border-none" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-24 text-center space-y-4">
            <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
              <Video className="h-8 w-8 text-primary opacity-30" />
            </div>
            <div>
              <p className="font-bold text-lg">No sessions yet.</p>
              <p className="text-muted-foreground text-sm mt-1">Schedule your first live session to get started.</p>
            </div>
            <Button onClick={openCreate} className="font-bold gap-2 mt-2"><Plus className="h-4 w-4" /> Schedule Session</Button>
          </div>
        ) : (
          <div className="divide-y">
            {filtered.map((cls) => {
              const status = getStatus(cls);
              return (
                <div key={cls.id} className="p-5 flex flex-col md:flex-row justify-between gap-4 md:items-center hover:bg-muted/10 transition-colors group">
                  <div className="flex gap-4 items-start">
                    <div className={cn("h-11 w-11 rounded-[0.625rem] flex items-center justify-center shrink-0",
                      status === "live" ? "bg-red-500/10 text-red-500" :
                      status === "upcoming" ? "bg-blue-500/10 text-blue-500" : "bg-muted text-muted-foreground"
                    )}>
                      <Video className="h-5 w-5" />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">{statusBadge(status)}</div>
                      <h3 className="font-bold leading-tight group-hover:text-primary transition-colors">{cls.title}</h3>
                      <p className="text-sm text-muted-foreground font-medium">{cls.course?.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 md:gap-6 flex-wrap md:flex-nowrap">
                    <div className="text-sm text-muted-foreground space-y-0.5">
                      <div className="flex items-center gap-1.5 font-bold text-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(cls.startTime).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(cls.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · {cls.duration}m
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={cls.meetingUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="h-9 rounded-[0.5rem] font-bold gap-1.5 text-xs">
                          <ExternalLink className="h-3.5 w-3.5" /> Open
                        </Button>
                      </a>
                      <Button variant="outline" size="icon" className="h-9 w-9 rounded-[0.5rem]" onClick={() => openEdit(cls)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-9 w-9 rounded-[0.5rem] text-destructive hover:bg-destructive/5 hover:border-destructive/20" onClick={() => setDeleteTarget(cls.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <FormDialog open={showCreate} onClose={() => { setShowCreate(false); setForm(EMPTY_FORM); }} title="Schedule Live Session" />
      <FormDialog open={!!editTarget} onClose={() => { setEditTarget(null); setForm(EMPTY_FORM); }} title="Edit Live Session" />

      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Live Session?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete the scheduled session. Students will no longer see this class.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { if (deleteTarget) deleteClass.mutate(deleteTarget, { onSuccess: () => setDeleteTarget(null) }); }}
              className="bg-destructive hover:bg-destructive/90 font-bold"
            >
              Yes, Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
