"use client";

import { useState } from "react";
import { useBlogs, BlogPost } from "@/hooks/useBlogData";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, User, ArrowRight, BookOpen, Clock, Heart, Share2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function BlogListingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading, isError, refetch } = useBlogs({ isPublished: "true" });

  if (isLoading) return <div className="pt-24"><Loading /></div>;
  if (isError) return <div className="pt-24"><ErrorState onRetry={() => refetch()} /></div>;

  const blogs: BlogPost[] = data?.data || [];

  const filtered = blogs.filter((b) =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.author?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredBlog = filtered[0];
  const standardBlogs = filtered.slice(1);

  return (
    <div className="min-h-screen bg-background pt-28 pb-20 animate-in fade-in duration-500">
      <div className="container mx-auto px-4 md:px-6 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <Badge className="bg-primary/10 text-primary border-none font-bold text-xs uppercase tracking-widest px-3 py-1">
            EduBridge Chronicles
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-foreground">
            Insights, Stories & <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">AI Education</span>
          </h1>
          <p className="text-muted-foreground text-lg font-medium">
            Explore articles written by our instructors, designers, and AI researchers to level up your career.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search articles, topics or authors..."
            className="pl-12 h-12 rounded-2xl bg-card border-border shadow-sm text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="py-24 text-center max-w-sm mx-auto space-y-4">
            <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary opacity-30">
              <BookOpen className="h-8 w-8" />
            </div>
            <div>
              <p className="font-bold text-xl">No articles found</p>
              <p className="text-muted-foreground mt-1">Try adjusting your keywords or search for a different topic.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured Blog */}
            {featuredBlog && !searchQuery && (
              <div className="group overflow-hidden rounded-3xl border border-border bg-card/50 hover:bg-card transition-all duration-300 shadow-sm hover:shadow-2xl">
                <div className="grid md:grid-cols-2 gap-6 md:gap-0">
                  <div className="relative aspect-video md:aspect-auto w-full h-full min-h-[300px] overflow-hidden">
                    <Image
                      src={featuredBlog.thumbnailUrl || "/no_image.jpg"}
                      alt={featuredBlog.title}
                      fill
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                    />
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <Badge className="bg-primary text-white border-none font-bold text-[10px] uppercase tracking-widest px-2.5 py-1">
                        Featured Post
                      </Badge>
                      <h2 className="text-2xl md:text-3xl font-black leading-tight group-hover:text-primary transition-colors duration-300">
                        <Link href={`/blog/${featuredBlog.slug}`}>{featuredBlog.title}</Link>
                      </h2>
                      <p className="text-muted-foreground text-sm font-medium line-clamp-3 leading-relaxed">
                        {featuredBlog.content.replace(/<[^>]*>/g, "")}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-border pt-6 flex-wrap gap-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-border shadow-sm">
                          <AvatarImage src={featuredBlog.author?.image} />
                          <AvatarFallback className="font-bold text-xs bg-muted text-muted-foreground">
                            {featuredBlog.author?.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-xs font-bold leading-none">{featuredBlog.author?.name}</p>
                          <p className="text-[10px] text-muted-foreground mt-1 font-semibold uppercase">Author</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                        <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {new Date(featuredBlog.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                        <Link href={`/blog/${featuredBlog.slug}`}>
                          <Button size="sm" className="font-bold gap-2 rounded-xl px-5 h-9 bg-primary text-primary-foreground hover:opacity-90 shadow-md shadow-primary/15">
                            Read Article <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Standard Blogs Grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {(searchQuery ? filtered : standardBlogs).map((blog) => (
                <Card key={blog.id} className="group overflow-hidden border border-border bg-card/30 hover:bg-card hover:shadow-2xl transition-all duration-300 flex flex-col h-full rounded-2xl">
                  <div className="relative aspect-video overflow-hidden border-b">
                    <Image
                      src={blog.thumbnailUrl || "/no_image.jpg"}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardHeader className="p-5 flex-1 space-y-3">
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors leading-tight line-clamp-2">
                      <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium line-clamp-3 leading-relaxed">
                      {blog.content.replace(/<[^>]*>/g, "")}
                    </p>
                  </CardHeader>
                  <CardFooter className="p-5 pt-0 border-t bg-muted/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 border">
                        <AvatarImage src={blog.author?.image} />
                        <AvatarFallback className="font-bold text-[10px] bg-muted text-muted-foreground">
                          {blog.author?.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-[11px] font-bold leading-none">{blog.author?.name}</p>
                        <p className="text-[9px] text-muted-foreground mt-0.5 font-bold uppercase tracking-wider">{new Date(blog.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</p>
                      </div>
                    </div>
                    <Link href={`/blog/${blog.slug}`}>
                      <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/5 gap-1.5 font-bold text-xs h-8 px-3 rounded-lg">
                        Read <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
