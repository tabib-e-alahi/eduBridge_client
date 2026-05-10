"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCourses, useCategories } from "@/hooks/useCourses";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Bookmark, Star, Clock, Filter, X, ChevronRight, ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ErrorState } from "@/components/shared/ErrorState";
import { cn } from "@/lib/utils";

function CoursesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL States
  const page = Number(searchParams.get("page")) || 1;
  const category = searchParams.get("category") || "";
  const level = searchParams.get("level") || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const searchTerm = searchParams.get("searchTerm") || "";

  // Local state for debounced search
  const [searchValue, setSearchValue] = useState(searchTerm);
  const debouncedSearch = useDebounce(searchValue, 500);

  // Fetching data
  const { data, isLoading, isError, refetch } = useCourses({
    page,
    category,
    level,
    sortBy,
    searchTerm: debouncedSearch,
  });

  const { data: categoriesData } = useCategories();

  // Update URL function
  const updateParams = (newParams: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    router.push(`/courses?${params.toString()}`);
  };

  const getCategoryName = (slug: string) => {
    const cat = categoriesData?.data.find((c: any) => c.slug === slug);
    return cat ? cat.name : slug;
  };

  if (isError) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Header Banner */}
      <div className="bg-card border-b border-border pt-32 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">Explore Courses</h1>
            <p className="text-lg text-muted-foreground">Discover high-quality, industry-standard courses designed to accelerate your career.</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content Area */}
          <div className="flex-1 space-y-6">
            
            {/* Top Filter Bar */}
            <div className="bg-card border border-border rounded-[0.625rem] p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
              <div className="relative w-full md:max-w-md flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by course title, skills, or mentors..."
                  className="pl-10 h-10 border-border bg-background shadow-none"
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    updateParams({ searchTerm: e.target.value, page: 1 });
                  }}
                />
              </div>

              <div className="flex w-full md:w-auto items-center gap-3">
                <div className="flex items-center gap-2 border-r border-border pr-3">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-semibold text-muted-foreground">Filter</span>
                </div>
                
                <Select value={category} onValueChange={(val) => updateParams({ category: val, page: 1 })}>
                  <SelectTrigger className="w-[140px] h-10 bg-background border-border shadow-none">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categoriesData?.data.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={level} onValueChange={(val) => updateParams({ level: val, page: 1 })}>
                  <SelectTrigger className="w-[120px] h-10 bg-background border-border shadow-none">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(val) => updateParams({ sortBy: val, page: 1 })}>
                  <SelectTrigger className="w-[140px] h-10 bg-background border-border shadow-none">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Newest</SelectItem>
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters & Meta */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                {(category && category !== 'all') && (
                  <Badge variant="secondary" className="px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 border-none font-semibold flex items-center gap-1">
                    {getCategoryName(category)}
                    <X className="w-3 h-3 cursor-pointer ml-1" onClick={() => updateParams({ category: null })} />
                  </Badge>
                )}
                {(level && level !== 'all') && (
                  <Badge variant="secondary" className="px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 border-none font-semibold flex items-center gap-1">
                    Level: {level}
                    <X className="w-3 h-3 cursor-pointer ml-1" onClick={() => updateParams({ level: null })} />
                  </Badge>
                )}
                {searchTerm && (
                  <Badge variant="secondary" className="px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 border-none font-semibold flex items-center gap-1">
                    Search: "{searchTerm}"
                    <X className="w-3 h-3 cursor-pointer ml-1" onClick={() => { setSearchValue(""); updateParams({ searchTerm: null }); }} />
                  </Badge>
                )}
                {(category && category !== 'all' || level && level !== 'all' || searchTerm) && (
                  <Button variant="ghost" size="sm" onClick={() => { setSearchValue(""); router.push('/courses'); }} className="text-xs text-muted-foreground h-7">
                    Clear all
                  </Button>
                )}
              </div>
              {!isLoading && data?.meta && (
                <div className="text-sm font-semibold text-muted-foreground">
                  Showing {data.data.length} of <span className="text-foreground">{data.meta.total}</span> courses
                </div>
              )}
            </div>

            {/* Course Grid */}
            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="saas-card rounded-[0.625rem] p-4 flex flex-col gap-4">
                    <Skeleton className="aspect-video w-full rounded-lg" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <div className="flex justify-between mt-auto pt-4 border-t border-border">
                       <Skeleton className="h-8 w-16" />
                       <Skeleton className="h-8 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : data?.data.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center gap-4 bg-card border border-border rounded-[0.625rem] shadow-sm">
                <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-2">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-extrabold text-foreground">No courses found</h3>
                <p className="text-muted-foreground max-w-md">We couldn't find any courses matching your criteria. Try adjusting your search or filters.</p>
                <Button variant="outline" className="mt-2" onClick={() => { setSearchValue(""); router.push('/courses'); }}>Clear All Filters</Button>
              </div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {data?.data.map((course) => (
                    <div key={course.id} className="saas-card flex flex-col rounded-[0.625rem] overflow-hidden group">
                      <Link href={`/courses/${course.slug}`} className="relative aspect-video overflow-hidden block">
                        <Image
                          src={course.thumbnailUrl || "/no_image.jpg"}
                          alt={course.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3">
                           <Badge className="bg-background/90 text-foreground border-none backdrop-blur-md text-[10px] font-bold px-2 py-0.5 shadow-sm">
                             {course.category.name}
                           </Badge>
                        </div>
                        <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/90 text-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:text-primary">
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </Link>
                      <div className="p-5 flex-1 flex flex-col gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                            <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> 12 Weeks</span>
                            <span className="flex items-center gap-1.5">{course.level}</span>
                          </div>
                          <Link href={`/courses/${course.slug}`}>
                            <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                              {course.title}
                            </h3>
                          </Link>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-auto">
                          <div className="flex items-center gap-1 text-amber-500 font-bold">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="text-foreground">4.8</span>
                            <span className="text-muted-foreground font-medium text-xs ml-1">(1.2k)</span>
                          </div>
                          <p className="text-lg font-extrabold text-foreground">${course.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {data?.meta && data.meta.totalPage > 1 && (
                   <div className="flex justify-center items-center mt-12 gap-1 border-t border-border pt-8">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        disabled={page === 1}
                        onClick={() => updateParams({ page: page - 1 })}
                        className="text-muted-foreground"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </Button>
                      
                      <div className="flex items-center gap-1 px-2">
                        {Array.from({ length: Math.min(5, data.meta.totalPage) }).map((_, idx) => {
                          let pageNum = idx + 1;
                          // simple windowing logic for demo
                          if (data.meta.totalPage > 5 && page > 3) {
                             pageNum = page - 2 + idx;
                             if (pageNum > data.meta.totalPage) pageNum = data.meta.totalPage - (4 - idx);
                          }
                          return (
                            <Button
                              key={pageNum}
                              variant={page === pageNum ? "default" : "ghost"}
                              className={cn(
                                "w-10 h-10 rounded-lg font-bold",
                                page === pageNum ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted"
                              )}
                              onClick={() => updateParams({ page: pageNum })}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>

                      <Button 
                        variant="ghost"
                        size="icon"
                        disabled={page === data.meta.totalPage}
                        onClick={() => updateParams({ page: page + 1 })}
                        className="text-muted-foreground"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                   </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExploreCoursesPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-12 text-center text-muted-foreground font-semibold">Loading platform...</div>}>
      <CoursesContent />
    </Suspense>
  );
}
