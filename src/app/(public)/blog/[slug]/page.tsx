"use client";

import { useBlogBySlug } from "@/hooks/useBlogData";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Share2, Bookmark, MessageSquare } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

export default function BlogDetailsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();

  const { data, isLoading, isError, refetch } = useBlogBySlug(slug);

  if (isLoading) return <div className="pt-24"><Loading /></div>;
  if (isError) return <div className="pt-24"><ErrorState onRetry={() => refetch()} /></div>;

  const blog = data?.data;

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center gap-4 pt-20">
        <h2 className="text-2xl font-black">Article not found</h2>
        <p className="text-muted-foreground">The article you are looking for does not exist or has been removed.</p>
        <Link href="/blog"><Button className="font-bold">Back to Blogs</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-28 pb-20 animate-in fade-in duration-500">
      <article className="container mx-auto px-4 md:px-6 max-w-3xl space-y-8">
        {/* Back navigation */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to all articles
        </Link>

        {/* Title & Metadata */}
        <div className="space-y-6">
          <Badge className="bg-primary/10 text-primary border-none font-bold text-xs uppercase tracking-widest px-3 py-1">
            EduBridge AI
          </Badge>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-foreground">
            {blog.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-y border-border py-5">
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11 border border-border shadow-sm">
                <AvatarImage src={blog.author?.image} />
                <AvatarFallback className="font-bold text-sm bg-muted text-muted-foreground">
                  {blog.author?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-bold leading-none">{blog.author?.name}</p>
                <p className="text-[10px] text-muted-foreground mt-1 font-semibold uppercase tracking-wider capitalize">
                  {blog.author?.role?.toLowerCase()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {new Date(blog.createdAt).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
              </span>
              <div className="w-[1px] h-4 bg-border hidden sm:block" />
              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-muted/80 text-muted-foreground hover:text-foreground" title="Share on X">
                  <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-muted/80 text-muted-foreground hover:text-foreground" title="Share on LinkedIn">
                  <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-muted/80 text-muted-foreground hover:text-foreground" title="Copy Link">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Image */}
        {blog.thumbnailUrl && (
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-border">
            <Image
              src={blog.thumbnailUrl}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Article Body Content */}
        <div className="prose dark:prose-invert prose-slate max-w-none prose-headings:font-black prose-headings:tracking-tight prose-p:leading-relaxed prose-p:text-muted-foreground/90 text-foreground font-medium text-lg leading-relaxed space-y-6 pt-4">
          {blog.content.split("\n\n").map((para: string, i: number) => (
            <p key={i} className="text-muted-foreground leading-relaxed text-lg">
              {para}
            </p>
          ))}
        </div>

        {/* Footer actions */}
        <div className="border-t pt-8 flex items-center justify-between border-border">
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={blog.author?.image} />
              <AvatarFallback className="font-bold text-xs bg-muted text-muted-foreground">
                {blog.author?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs font-bold leading-none">Written by</p>
              <p className="text-sm font-black text-foreground mt-0.5">{blog.author?.name}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="font-bold gap-2 text-xs rounded-xl h-10 px-4">
              <Bookmark className="h-4 w-4" /> Save Article
            </Button>
          </div>
        </div>
      </article>
    </div>
  );
}
