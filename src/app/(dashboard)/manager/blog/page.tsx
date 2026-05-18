"use client";

import { useState } from "react";
import {
  FileText, Plus, Search, Calendar, BadgeAlert, AlertCircle, Pencil, Trash2,
  Eye, CheckCircle2, XCircle, Sparkles, Send, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMyBlogs, useCreateBlog, useUpdateBlog, useDeleteBlog, BlogPost } from "@/hooks/useBlogData";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/dashboard/PageHeader";
import Link from "next/link";
import { cn } from "@/lib/utils";

const Switch = ({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (v: boolean) => void }) => {
  return (
    <button
      type="button"
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
        checked ? "bg-primary" : "bg-muted"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
};

const EMPTY_FORM = {
  title: "",
  content: "",
  thumbnailUrl: "",
  isPublished: false,
};

export default function ManagerBlogPage() {
  const { data, isLoading, isError, refetch } = useMyBlogs();
  const createBlog = useCreateBlog();
  const updateBlog = useUpdateBlog();
  const deleteBlog = useDeleteBlog();

  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<BlogPost | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  if (isLoading) return <Loading />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  const blogs: BlogPost[] = data?.data || [];
  const filtered = blogs.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setShowCreate(true);
  };

  const openEdit = (blog: BlogPost) => {
    setForm({
      title: blog.title,
      content: blog.content,
      thumbnailUrl: blog.thumbnailUrl || "",
      isPublished: blog.isPublished,
    });
    setEditTarget(blog);
  };

  const handleSubmit = () => {
    if (editTarget) {
      updateBlog.mutate(
        { id: editTarget.id, payload: form },
        {
          onSuccess: () => {
            setEditTarget(null);
            setForm(EMPTY_FORM);
            refetch();
          },
        }
      );
    } else {
      createBlog.mutate(form, {
        onSuccess: () => {
          setShowCreate(false);
          setForm(EMPTY_FORM);
          refetch();
        },
      });
    }
  };

  const togglePublishStatus = (blog: BlogPost) => {
    updateBlog.mutate(
      { id: blog.id, payload: { isPublished: !blog.isPublished } },
      { onSuccess: () => refetch() }
    );
  };

  const isPending = createBlog.isPending || updateBlog.isPending;

  const FormDialog = ({ open, onClose, title }: { open: boolean; onClose: () => void; title: string }) => (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" /> {title}
          </DialogTitle>
          <DialogDescription>Write compelling content to share with the EduBridge community.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label className="font-bold">Article Title</Label>
            <Input
              placeholder="e.g. 10 Ways AI is Revolutionizing Next.js Development"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-bold">Cover Image URL <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <Input
              placeholder="https://images.unsplash.com/photo-..."
              value={form.thumbnailUrl}
              onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
              className="h-11 font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-bold">Content Body</Label>
            <Textarea
              placeholder="Write your article markdown or plain text here..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="min-h-[220px]"
            />
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/20 border rounded-xl">
            <div>
              <Label className="font-bold">Publish Instantly</Label>
              <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Toggle to make this article public right away.</p>
            </div>
            <Switch
              checked={form.isPublished}
              onCheckedChange={(checked: boolean) => setForm({ ...form, isPublished: checked })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isPending || !form.title || !form.content} className="font-bold gap-2">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {editTarget ? "Update Article" : "Create Article"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Blog Manager"
        subtitle="Write articles, share insights, and manage published stories."
        actions={
          <Button onClick={openCreate} className="h-10 font-bold gap-2">
            <Plus className="h-4 w-4" /> Write Article
          </Button>
        }
      />

      <div className="saas-card p-0 overflow-hidden">
        <div className="p-5 border-b flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              className="pl-9 h-10 rounded-[0.625rem] bg-muted/30 border-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-24 text-center space-y-4">
            <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary opacity-30">
              <FileText className="h-8 w-8" />
            </div>
            <div>
              <p className="font-bold text-lg">No articles written yet</p>
              <p className="text-muted-foreground text-sm mt-1">Start publishing your ideas and knowledge today.</p>
            </div>
            <Button onClick={openCreate} className="font-bold gap-2 mt-2">
              <Plus className="h-4 w-4" /> Write Article
            </Button>
          </div>
        ) : (
          <div className="divide-y">
            {filtered.map((blog) => (
              <div key={blog.id} className="p-5 flex flex-col md:flex-row justify-between gap-4 md:items-center hover:bg-muted/10 transition-colors group">
                <div className="flex gap-4 items-start min-w-0">
                  <div className={cn("h-11 w-11 rounded-[0.625rem] flex items-center justify-center shrink-0",
                    blog.isPublished ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"
                  )}>
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {blog.isPublished ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-bold">Published</Badge>
                      ) : (
                        <Badge className="bg-muted text-muted-foreground border text-[10px] font-bold">Draft</Badge>
                      )}
                    </div>
                    <h3 className="font-bold leading-tight group-hover:text-primary transition-colors truncate max-w-md">{blog.title}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Written on {new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-wrap md:flex-nowrap shrink-0">
                  <div className="flex items-center gap-2">
                    <Link href={`/blog/${blog.slug}`} target="_blank">
                      <Button variant="outline" size="sm" className="h-9 rounded-[0.5rem] font-bold gap-1.5 text-xs">
                        <Eye className="h-3.5 w-3.5" /> View
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn("h-9 rounded-[0.5rem] font-bold text-xs gap-1.5",
                        blog.isPublished ? "text-amber-500 border-amber-500/20 hover:bg-amber-500/5" : "text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/5"
                      )}
                      onClick={() => togglePublishStatus(blog)}
                    >
                      {blog.isPublished ? <XCircle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                      {blog.isPublished ? "Unpublish" : "Publish"}
                    </Button>
                    <Button variant="outline" size="icon" className="h-9 w-9 rounded-[0.5rem]" onClick={() => openEdit(blog)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-9 w-9 rounded-[0.5rem] text-destructive hover:bg-destructive/5 hover:border-destructive/20" onClick={() => setDeleteTarget(blog.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <FormDialog open={showCreate} onClose={() => { setShowCreate(false); setForm(EMPTY_FORM); }} title="Write Article" />
      <FormDialog open={!!editTarget} onClose={() => { setEditTarget(null); setForm(EMPTY_FORM); }} title="Edit Article" />

      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Article?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete your blog post. Readers will no longer be able to view this article.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { if (deleteTarget) deleteBlog.mutate(deleteTarget, { onSuccess: () => { setDeleteTarget(null); refetch(); } }); }}
              className="bg-destructive hover:bg-destructive/90 font-bold"
            >
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
