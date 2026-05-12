"use client";

import { use, useState } from "react";
import { useCourseBySlug } from "@/hooks/useCourses";
import { useCourseReviews, useRelatedCourses, useCreateReview } from "@/hooks/useReviewData";
import { useCourseProgress } from "@/hooks/useStudentData";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import {
  Star, Clock, Users, CheckCircle2, Share2, Bookmark,
  PlayCircle, ShieldCheck, ChevronRight, ThumbsUp, ThumbsDown,
  MessageSquare, BookOpen, Globe, Lock, Trophy, Video,
  FileText, Smartphone, GraduationCap, BarChart2, ChevronDown,
  ChevronUp, Calendar, RefreshCcw, ArrowLeft, Download,
} from "lucide-react";

export default function CourseDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const {
    data: courseData,
    isLoading: isCourseLoading,
    isError: isCourseError,
    refetch: refetchCourse,
  } = useCourseBySlug(slug);

  const course = courseData?.data;
  const courseId = course?.id;

  const { data: reviewsData } = useCourseReviews(courseId || "");
  const { data: relatedCoursesData } = useRelatedCourses(courseId || "");
  const { data: progressData } = useCourseProgress(courseId || "");
  const createReviewMutation = useCreateReview();

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isRecommended, setIsRecommended] = useState(true);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({ 0: true });

  if (isCourseLoading) return <Loading />;
  if (isCourseError || !course) return <ErrorState message="Course not found" onRetry={refetchCourse} />;

  const isEnrolled = !!progressData?.data;
  const { reviews = [], stats } = reviewsData?.data || {};
  const relatedCourses = relatedCoursesData?.data || [];

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) return;
    createReviewMutation.mutate(
      { courseId, payload: { rating: reviewRating, comment: reviewComment, isRecommended } },
      { onSuccess: () => { setReviewComment(""); setReviewRating(5); } }
    );
  };

  const toggleSection = (i: number) =>
    setOpenSections(prev => ({ ...prev, [i]: !prev[i] }));

  // Calculate real duration
  const totalSeconds = course.lessons?.reduce((acc: number, lesson: any) => {
    if (!lesson.duration) return acc;
    const parts = String(lesson.duration).split(':');
    if (parts.length === 2) return acc + (parseInt(parts[0]) * 60) + parseInt(parts[1]);
    return acc + (parseInt(lesson.duration) || 0);
  }, 0) || 0;

  const formattedDuration = totalSeconds > 0 
    ? `${Math.floor(totalSeconds / 3600)}h ${Math.floor((totalSeconds % 3600) / 60)}m` 
    : "Self-paced";

  // Dynamic grouping of lessons into sections
  const lessonsPerSection = 5;
  const sections = [];
  if (course.lessons && course.lessons.length > 0) {
    for (let i = 0; i < course.lessons.length; i += lessonsPerSection) {
      const sectionIndex = Math.floor(i / lessonsPerSection);
      sections.push({
        title: `Section ${sectionIndex + 1}: ${sectionIndex === 0 ? "Foundations & Overview" : "Advanced Implementation"}`,
        lessons: course.lessons.slice(i, i + lessonsPerSection),
        status: sectionIndex === 0 ? "ongoing" : "locked",
        desc: sectionIndex === 0 
          ? "Master the fundamentals and set the stage for your learning journey." 
          : "Deep-dive into professional-grade concepts and project building.",
      });
    }
  } else {
    sections.push({
      title: "Course Curriculum",
      lessons: [],
      status: "ongoing",
      desc: "Coming soon: High-quality modules are being prepared by the instructor.",
    });
  }

  const courseIncludes = [
    { icon: Calendar, label: `Last Updated ${new Date(course.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}` },
    { icon: Globe, label: "English Instruction" },
    { icon: Smartphone, label: "Access on mobile and TV" },
    { icon: ShieldCheck, label: "Verified Certificate of Completion" },
  ];

  return (
    <div className="min-h-screen bg-background max-w-7xl mx-auto text-foreground lg:pt-24">

      {/* ── BREADCRUMB + BACK ── */}
      <div className="border-b border-border/50 bg-card">
        <div className=" px-6 h-12 flex items-center gap-3">
          <Link href="/courses" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <span className="text-muted-foreground/30 text-sm">/</span>
          <Link href="/courses" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Learn</Link>
          <span className="text-muted-foreground/30 text-sm">/</span>
          <Link href="/courses" className="text-sm text-muted-foreground hover:text-foreground transition-colors">All Courses</Link>
          <span className="text-muted-foreground/30 text-sm">/</span>
          <span className="text-sm text-foreground/70 truncate max-w-[160px]">{course.title}</span>
        </div>
      </div>

      {/* ── HERO: Thumbnail + Course Info ── */}
      <div className=" px-2 py-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">

          {/* Thumbnail */}
          <div className="w-full md:w-85 shrink-0">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted group cursor-pointer shadow-sm">
              <Image
                src={course.thumbnailUrl || "/no_image.jpg"}
                alt={course.title}
                fill
                sizes="340px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="h-14 w-14 rounded-full bg-white/90 shadow-lg flex items-center justify-center">
                  <PlayCircle className="h-7 w-7 text-foreground" />
                </div>
              </div>
            </div>
          </div>

          {/* Course info */}
          <div className="flex-1 space-y-4">

            {/* Title */}
            <h1 className="text-2xl md:text-[1.75rem] font-bold leading-snug tracking-tight text-foreground">
              {course.title}
            </h1>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
              {course.description}
            </p>

            {/* Meta pills row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm border-y border-border/40 py-3.5">
              <span className="flex items-center gap-1.5 font-medium text-foreground/80">
                <BarChart2 className="w-4 h-4 text-muted-foreground" />
                {course.level}
              </span>
              <span className="text-muted-foreground/30">|</span>
              <span className="flex items-center gap-1.5 text-foreground/80">
                <Clock className="w-4 h-4 text-muted-foreground" />
                {formattedDuration}
              </span>
              <span className="text-muted-foreground/30">|</span>
              <span className="flex items-center gap-1.5 text-foreground/80">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
                {course.lessons?.length || 0} Lessons
              </span>
              <span className="text-muted-foreground/30">|</span>
              {/* Rating */}
              <span className="flex items-center gap-1.5">
                <span className="font-semibold text-foreground/80">{stats?.averageRating || "0.0"}</span>
                <Star className="w-4 h-4 fill-[#f59e0b] text-[#f59e0b]" />
                <Link href="#reviews" className="text-primary underline underline-offset-2 text-sm">
                  {(stats?.totalReviews || 0).toLocaleString()} Ratings
                </Link>
              </span>
              <span className="text-muted-foreground/30">|</span>
              {/* Learner avatars */}
              <span className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-7 w-7 rounded-full border-2 border-background bg-muted overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} className="w-full h-full object-cover" alt="" />
                    </div>
                  ))}
                </div>
                <span className="text-sm font-medium text-foreground/70">
                  {(course._count?.enrollments || 0) > 1000
                    ? `${((course._count?.enrollments || 0) / 1000).toFixed(1)}K`
                    : course._count?.enrollments || 0} Learners
                </span>
              </span>
            </div>

            {/* CTA row */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Price + enroll */}
              <Link href={isEnrolled ? `/learn/${course.slug}` : `/checkout/${course.slug}`}>
                <button className="h-11 px-7 bg-foreground text-background dark:bg-foreground dark:text-background rounded-xl font-semibold text-sm hover:opacity-85 active:scale-[0.98] transition-all shadow-sm">
                  {isEnrolled ? "Continue Learning" : "Start Learning"}
                </button>
              </Link>

              {/* Icon buttons */}
              <button className="h-11 w-11 rounded-xl border border-border/60 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" title="Save to wishlist">
                <Bookmark className="w-4.5 h-4.5" />
              </button>
              <button className="h-11 w-11 rounded-xl border border-border/60 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" title="Share">
                <Share2 className="w-4.5 h-4.5" />
              </button>

              {/* Instructor inline */}
              <Link href={`/mentors/${course.instructor.id}`} className="flex items-center gap-2.5 ml-1 group">
                <Avatar className="h-9 w-9 border border-border/40">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructor.name}`} />
                  <AvatarFallback className="text-xs font-bold bg-muted">{course.instructor.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="leading-tight">
                  <p className="text-sm font-semibold group-hover:text-primary transition-colors">{course.instructor.name}</p>
                  <p className="text-xs text-muted-foreground">Instructor</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border/40" />

      {/* ── MAIN CONTENT: Curriculum (left) + Sidebar (right) ── */}
      <div className=" px-2 py-8">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">

          {/* ── LEFT: Course Content ── */}
          <div>
            {/* What you'll learn */}
            <div className="mb-12 border border-border/50 rounded-2xl p-6 bg-card">
              <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                What you'll learn
              </h2>
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                {[
                  `Master the core concepts of ${course.category.name}`,
                  `Build professional-grade projects using ${course.title.split(' ')[0]}`,
                  "Implement industry-standard best practices",
                  "Gain confidence in architectural decisions",
                  "Prepare for professional certifications",
                  "Apply knowledge to real-world scenarios"
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 text-sm leading-snug">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-foreground/80">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Course Content</p>

            <div className="space-y-3">
              {sections.map((section, si) => (
                <div key={si} className="border border-border/50 rounded-xl overflow-hidden">

                  {/* Section header */}
                  <button
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors text-left"
                    onClick={() => toggleSection(si)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-[15px]">{section.title}</span>
                      {section.status === "ongoing" && (
                        <span className="text-[11px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 inline-block" />
                          Ongoing
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {section.status === "locked" && (
                        <Lock className="w-4 h-4 text-muted-foreground/40" />
                      )}
                      {openSections[si]
                        ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        : <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      }
                    </div>
                  </button>

                  {/* Section expanded content */}
                  {openSections[si] && (
                    <div className="border-t border-border/40">
                      {/* Section description */}
                      <p className="px-5 py-3 text-sm text-muted-foreground leading-relaxed bg-muted/20 border-b border-border/30">
                        {section.desc}
                      </p>

                      {/* Lesson rows */}
                      <div className="divide-y divide-border/30">
                        {section.lessons.map((lesson: any, li: number) => {
                          const isFree = si === 0 && li === 0;
                          return (
                            <div
                              key={lesson.id}
                              className={cn(
                                "flex items-center gap-3 px-5 py-3.5 transition-colors",
                                isFree
                                  ? "bg-background border-2 border-foreground rounded-lg mx-3 my-2 shadow-sm cursor-pointer hover:bg-muted/20"
                                  : "hover:bg-muted/20"
                              )}
                            >
                              <PlayCircle className={cn("w-5 h-5 shrink-0", isFree ? "text-foreground" : "text-muted-foreground/50")} />
                              <span className={cn("text-sm flex-1 truncate", isFree ? "text-foreground font-medium" : "text-foreground/70")}>
                                {lesson.title}
                              </span>
                              {isFree && (
                                <Link href="#" className="text-sm font-semibold text-foreground underline underline-offset-2 shrink-0">
                                  Preview
                                </Link>
                              )}
                              {!isFree && (
                                <span className="text-xs text-muted-foreground tabular-nums shrink-0">{lesson.duration || "15:00"}</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Reviews section */}
            <div id="reviews" className="mt-12 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg">Student Reviews</h2>
                <div className="flex items-center gap-1.5 text-sm">
                  <span className="font-semibold">{stats?.averageRating || "0.0"}</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} className={cn("w-3.5 h-3.5", i <= Math.round(stats?.averageRating || 0) ? "fill-[#f59e0b] text-[#f59e0b]" : "fill-muted text-muted-foreground/20")} />
                    ))}
                  </div>
                  <span className="text-muted-foreground text-xs">({(stats?.totalReviews || 0).toLocaleString()} ratings)</span>
                </div>
              </div>

              {/* Rating distribution */}
              <div className="flex gap-6 items-start border border-border/40 rounded-xl p-5 bg-card">
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <p className="text-4xl font-bold text-[#f59e0b]">{stats?.averageRating || "0.0"}</p>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} className={cn("w-3.5 h-3.5", i <= Math.round(stats?.averageRating || 0) ? "fill-[#f59e0b] text-[#f59e0b]" : "fill-muted text-muted")} />
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground">Course Rating</p>
                </div>
                <div className="flex-1 space-y-2">
                  {(stats?.distribution || [5, 4, 3, 2, 1].map(s => ({ star: s, percentage: 0 }))).map(dist => (
                    <div key={dist.star} className="flex items-center gap-2.5">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-[#f59e0b] rounded-full transition-all" style={{ width: `${dist.percentage}%` }} />
                      </div>
                      <div className="flex gap-0.5 shrink-0">
                        {[...Array(dist.star)].map((_, i) => (
                          <Star key={i} className="w-2.5 h-2.5 fill-[#f59e0b] text-[#f59e0b]" />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground w-7 text-right tabular-nums shrink-0">{dist.percentage.toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Write review */}
              {isEnrolled && (
                <div className="border border-border/50 rounded-xl p-5 space-y-4 bg-card">
                  <h3 className="font-semibold">Leave a review</h3>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Rating</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Star
                            key={i}
                            className={cn(
                              "w-7 h-7 cursor-pointer transition-transform hover:scale-110",
                              i <= (hoveredRating || reviewRating) ? "fill-[#f59e0b] text-[#f59e0b]" : "text-muted-foreground/25"
                            )}
                            onMouseEnter={() => setHoveredRating(i)}
                            onMouseLeave={() => setHoveredRating(0)}
                            onClick={() => setReviewRating(i)}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setIsRecommended(true)}
                        className={cn("flex items-center gap-2 px-4 h-9 rounded-lg text-sm font-medium border transition-all",
                          isRecommended ? "bg-primary text-primary-foreground border-primary" : "border-border/60 text-muted-foreground hover:border-border"
                        )}>
                        <ThumbsUp className="w-3.5 h-3.5" /> Recommend
                      </button>
                      <button type="button" onClick={() => setIsRecommended(false)}
                        className={cn("flex items-center gap-2 px-4 h-9 rounded-lg text-sm font-medium border transition-all",
                          !isRecommended ? "bg-destructive text-white border-destructive" : "border-border/60 text-muted-foreground hover:border-border"
                        )}>
                        <ThumbsDown className="w-3.5 h-3.5" /> Not for me
                      </button>
                    </div>
                    <Textarea
                      placeholder="What did you like or dislike? How was the instructor?"
                      className="min-h-[100px] text-sm resize-none border-border/60 rounded-lg"
                      value={reviewComment}
                      onChange={e => setReviewComment(e.target.value)}
                      required
                    />
                    <button type="submit" disabled={createReviewMutation.isPending}
                      className="h-9 px-6 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50">
                      {createReviewMutation.isPending ? "Submitting…" : "Submit review"}
                    </button>
                  </form>
                </div>
              )}

              {/* Reviews list */}
              <div className="space-y-6 divide-y divide-border/40">
                {reviews.map(review => (
                  <div key={review.id} className="flex gap-3.5 pt-6 first:pt-0">
                    <Avatar className="h-9 w-9 shrink-0 border border-border/30">
                      <AvatarImage src={review.user.image} />
                      <AvatarFallback className="text-xs font-semibold bg-muted">{review.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-sm">{review.user.name}</span>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={cn("w-3 h-3", i < review.rating ? "fill-[#f59e0b] text-[#f59e0b]" : "fill-muted text-muted")} />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                      {review.isRecommended && (
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Recommends this course
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {!reviews.length && (
                  <div className="text-center py-14 border border-dashed border-border/40 rounded-xl">
                    <MessageSquare className="w-7 h-7 text-muted-foreground/20 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No reviews yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-4">

            {/* Certificate card */}
            <div className="border border-border/50 rounded-xl overflow-hidden bg-card">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/40">
                <h3 className="font-semibold text-sm">Earn Your Certificate</h3>
                <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <Lock className="w-3.5 h-3.5" />
                  Download Certificate
                </button>
              </div>
              {/* Certificate preview */}
              <div className="p-4 bg-muted/20">
                <div className="relative rounded-lg border border-border/40 bg-card overflow-hidden aspect-[4/2.7] flex items-center justify-center shadow-sm">
                  {/* Dotted background pattern */}
                  <div className="absolute inset-0"
                    style={{
                      backgroundImage: "radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)",
                      backgroundSize: "16px 16px",
                      opacity: 0.4
                    }}
                  />
                  {/* Stars decoration */}
                  <Star className="absolute top-3 left-4 w-5 h-5 fill-[#f59e0b] text-[#f59e0b] opacity-70" />
                  <Star className="absolute top-4 left-8 w-3 h-3 fill-[#f59e0b] text-[#f59e0b] opacity-50" />
                  <Star className="absolute top-3 right-4 w-5 h-5 fill-[#f59e0b] text-[#f59e0b] opacity-70" />
                  {/* Certificate content */}
                  <div className="relative z-10 text-center space-y-1 px-6">
                    <p className="font-serif italic text-[11px] text-foreground/60 tracking-wide">Certificate of Completion</p>
                    <p className="font-bold text-sm text-foreground">
                      {course.instructor.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">For successfully completing this program</p>
                    <div className="flex items-center justify-center gap-3 pt-0.5 text-[9px] text-muted-foreground">
                      <span>Given by: {course.instructor.name}</span>
                      <span>Date: {new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: '2-digit' })}</span>
                    </div>
                  </div>
                  {/* Badge decoration */}
                  <div className="absolute bottom-2 right-3 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex gap-0.5 mt-0.5">
                      <div className="w-2.5 h-4 bg-[#f59e0b] rounded-sm opacity-80" />
                      <div className="w-2.5 h-4 bg-primary rounded-sm opacity-80" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Course meta info */}
            <div className="border border-border/50 rounded-xl bg-card divide-y divide-border/40">
              {courseIncludes.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 px-5 py-3.5">
                  <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-sm text-foreground/80">{label}</span>
                </div>
              ))}
            </div>

            {/* Instructor card */}
            <Link href={`/mentors/${course.instructor.id}`}
              className="flex items-center justify-between px-5 py-4 border border-border/50 rounded-xl bg-card hover:bg-muted/20 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-border/40">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructor.name}`} />
                  <AvatarFallback className="font-bold text-sm bg-muted">{course.instructor.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm group-hover:text-primary transition-colors">{course.instructor.name}</p>
                  <p className="text-xs text-muted-foreground">Instructor</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>

            {/* Price + enroll (desktop sidebar CTA) */}
            {!isEnrolled && (
              <div className="border border-border/50 rounded-xl bg-card p-5 space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold">${course.price}</span>
                  <span className="text-xs text-muted-foreground">Full lifetime access</span>
                </div>
                <Link href={`/checkout/${course.slug}`} className="block">
                  <button className="w-full h-11 bg-foreground text-background rounded-xl font-semibold text-sm hover:opacity-85 transition-all">
                    Enroll Now
                  </button>
                </Link>
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  30-day money-back guarantee
                </p>
              </div>
            )}

            {isEnrolled && (
              <Link href={`/learn/${course.slug}`} className="block">
                <button className="w-full h-11 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-all">
                  Continue Learning →
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── RELATED COURSES ── */}
      {relatedCourses.length > 0 && (
        <div className="border-t border-border/40 bg-muted/20">
          <div className="max-w-screen-xl mx-auto px-6 py-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg">Students also bought</h2>
              <Link href="/courses" className="text-sm text-primary hover:underline font-medium">Browse all</Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedCourses.map(related => (
                <Link key={related.id} href={`/courses/${related.slug}`}
                  className="group block border border-border/50 rounded-xl overflow-hidden bg-card hover:shadow-md hover:border-border/80 transition-all"
                >
                  <div className="aspect-video relative overflow-hidden bg-muted">
                    <img src={related.thumbnailUrl || "/no_image.jpg"} alt={related.title}
                      className="object-cover w-full h-full group-hover:scale-[1.04] transition-transform duration-500" />
                  </div>
                  <div className="p-4 space-y-1.5">
                    <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors leading-snug">{related.title}</h3>
                    <p className="text-xs text-muted-foreground">{related.instructor.name}</p>
                    <div className="flex items-center gap-1 text-xs">
                      <span className="font-semibold text-foreground/80">4.8</span>
                      <Star className="w-3 h-3 fill-[#f59e0b] text-[#f59e0b]" />
                      <span className="text-muted-foreground">({(related._count?.reviews || 0).toLocaleString()})</span>
                    </div>
                    <p className="font-bold text-sm pt-0.5">${related.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MOBILE STICKY BAR ── */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border px-4 py-3 flex items-center gap-3 shadow-2xl">
        <div className="shrink-0">
          <p className="text-[10px] text-muted-foreground">Price</p>
          <p className="text-lg font-bold">${course.price}</p>
        </div>
        <Link href={isEnrolled ? `/learn/${course.slug}` : `/checkout/${course.slug}`} className="flex-1">
          <button className="w-full h-11 bg-foreground text-background rounded-xl font-semibold text-sm hover:opacity-85 transition-all">
            {isEnrolled ? "Continue Learning" : "Start Learning"}
          </button>
        </Link>
      </div>
    </div>
  );
}