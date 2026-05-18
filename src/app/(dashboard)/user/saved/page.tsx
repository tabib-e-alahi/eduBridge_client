"use client";

import { useState } from "react";
import { useMySavedCourses, useToggleSaveCourse, SavedCourse } from "@/hooks/useStudentData";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Search, Trash2, ArrowRight, Clock, BookOpen, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/dashboard/PageHeader";

export default function SavedCoursesPage() {
  const { data, isLoading, isError, refetch } = useMySavedCourses();
  const toggleSave = useToggleSaveCourse();
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading) return <Loading />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  const savedCourses: SavedCourse[] = data?.data || [];
  const filtered = savedCourses.filter((s) =>
    s.course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRemove = (courseId: string) => {
    toggleSave.mutate(courseId);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Saved Courses"
        subtitle={`You have ${savedCourses.length} bookmarked item${savedCourses.length !== 1 ? "s" : ""} for later.`}
        actions={
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search saved..."
              className="pl-10 h-10 rounded-lg bg-card"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        }
      />

      {!filtered.length ? (
        <div className="h-[400px] flex flex-col items-center justify-center text-center gap-4 border-2 border-dashed rounded-3xl p-12 bg-muted/20">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Bookmark className="h-10 w-10 text-primary opacity-20" />
          </div>
          <div>
            <h3 className="text-xl font-bold">No saved courses</h3>
            <p className="text-muted-foreground max-w-sm mt-2">
              Browse the catalog and bookmark courses you find interesting.
            </p>
          </div>
          <Link href="/courses">
            <Button className="mt-4 font-bold gap-2">
              <BookOpen className="h-4 w-4" /> Explore Courses
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((saved) => (
            <Card key={saved.id} className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all bg-card flex flex-col h-full">
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={saved.course.thumbnailUrl || "/no_image.jpg"}
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  alt={saved.course.title || "Course"}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute top-2 right-2">
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    onClick={() => handleRemove(saved.courseId)}
                    disabled={toggleSave.isPending}
                    title="Remove from saved"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute top-2 left-2">
                  <Badge className="bg-background/80 backdrop-blur-sm text-foreground text-[10px] font-bold border-none">
                    {saved.course.level}
                  </Badge>
                </div>
              </div>
              <CardHeader className="p-4 space-y-1 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary border-none">
                    {saved.course.category?.name}
                  </Badge>
                </div>
                <CardTitle className="text-base font-bold group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                  {saved.course.title}
                </CardTitle>
                <p className="text-xs text-muted-foreground font-medium">{saved.course.instructor?.name}</p>
              </CardHeader>
              <CardContent className="px-4 pb-3">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1 font-medium">
                    <Users className="h-3 w-3" />
                    <span>{saved.course._count?.enrollments || 0} enrolled</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 border-t bg-muted/20 flex items-center justify-between">
                <span className="text-lg font-bold">${saved.course.price}</span>
                <Link href={`/courses/${saved.course.slug}`}>
                  <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10 gap-2 font-bold">
                    Details <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
