"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { 
  Loader2, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Save,
  Rocket,
  CheckCircle2,
  ListPlus,
  Info,
  Upload,
  Video
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCategories } from "@/hooks/useCourses";
import { useCreateCourse } from "@/hooks/useInstructorData";

const courseSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().min(5, "Slug must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  level: z.string().min(1, "Please select a level"),
  price: z.string().min(1, "Please enter a price"),
  thumbnailUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
  lessons: z.array(z.object({
    title: z.string().min(2, "Lesson title is required"),
    duration: z.string().optional(),
    videoUrl: z.string().url("Invalid video URL").optional().or(z.literal("")),
  })).min(1, "At least one lesson is required"),
});

export default function CreateCoursePage() {
  const router = useRouter();
  const { data: categoriesData } = useCategories();
  const createCourse = useCreateCourse();
  const isLoading = createCourse.isPending;
  const [isUploading, setIsUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      categoryId: "",
      level: "Beginner",
      price: "0",
      thumbnailUrl: "",
      lessons: [{ title: "", duration: "", videoUrl: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lessons",
  });

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1MB size limit check
    if (file.size > 1024 * 1024) {
      toast.error("Image size must be less than 1MB");
      return;
    }

    setLocalPreview(URL.createObjectURL(file));
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "edubridge_preset");

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/dwx69v7pa/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        form.setValue("thumbnailUrl", data.secure_url);
        toast.success("Thumbnail uploaded successfully!");
      }
    } catch (error) {
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  async function onSubmit(values: z.infer<typeof courseSchema>) {
    createCourse.mutate({
      ...values,
      price: parseFloat(values.price),
    }, {
      onSuccess: () => {
        router.push("/manager/courses");
      }
    });
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Course</h1>
          <p className="text-muted-foreground">Share your knowledge with students worldwide.</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
           <Button onClick={form.handleSubmit(onSubmit)} className="gap-2" disabled={isLoading || isUploading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Publish Course
           </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
           <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Info */}
              <div className="lg:col-span-2 space-y-8">
                 <Card className="border-none shadow-sm">
                    <CardHeader>
                       <CardTitle className="text-lg flex items-center gap-2">
                          <Info className="h-5 w-5 text-primary" />
                          Basic Information
                       </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                       <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Course Title</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Advanced Next.js Mastery" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                       />
                       <FormField
                          control={form.control}
                          name="slug"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Course Slug (URL)</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. advanced-nextjs-mastery" {...field} />
                              </FormControl>
                              <FormDescription>The unique URL part for this course.</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                       />
                       <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea className="h-32" placeholder="Describe what students will learn..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                       />
                    </CardContent>
                 </Card>

                 {/* Curriculum */}
                 <Card className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                       <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                             <ListPlus className="h-5 w-5 text-primary" />
                             Course Curriculum
                          </CardTitle>
                          <CardDescription>Add the lessons for your course.</CardDescription>
                       </div>
                       <Button type="button" variant="outline" size="sm" onClick={() => append({ title: "", duration: "", videoUrl: "" })} className="gap-2">
                          <Plus className="h-4 w-4" /> Add Lesson
                       </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       {fields.map((field, index) => (
                         <div key={field.id} className="flex flex-col gap-4 p-5 bg-muted/20 rounded-xl border group hover:border-primary/20 transition-all">
                            <div className="flex gap-4 items-end w-full">
                               <div className="flex-1 space-y-2">
                                  <FormField
                                     control={form.control}
                                     name={`lessons.${index}.title`}
                                     render={({ field }) => (
                                       <FormItem>
                                         <FormLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Lesson {index + 1} Title</FormLabel>
                                         <FormControl>
                                           <Input placeholder="e.g. Introduction to the course" className="h-11 bg-background" {...field} />
                                         </FormControl>
                                         <FormMessage />
                                       </FormItem>
                                     )}
                                  />
                               </div>
                               <div className="w-28 space-y-2">
                                  <FormField
                                     control={form.control}
                                     name={`lessons.${index}.duration`}
                                     render={({ field }) => (
                                       <FormItem>
                                         <FormLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Duration</FormLabel>
                                         <FormControl>
                                           <Input placeholder="10:00" className="h-11 bg-background" {...field} />
                                         </FormControl>
                                         <FormMessage />
                                       </FormItem>
                                     )}
                                  />
                               </div>
                               <Button 
                                 type="button" 
                                 variant="ghost" 
                                 size="icon" 
                                 className="h-11 w-11 text-destructive hover:bg-destructive/5" 
                                 onClick={() => remove(index)}
                                 disabled={fields.length === 1}
                               >
                                  <Trash2 className="h-4 w-4" />
                               </Button>
                            </div>
                            <div className="w-full">
                               <FormField
                                  control={form.control}
                                  name={`lessons.${index}.videoUrl`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                        <Video className="h-3 w-3" /> Video URL (YouTube, Vimeo, etc.)
                                      </FormLabel>
                                      <FormControl>
                                        <Input placeholder="https://youtube.com/watch?v=..." className="h-11 bg-background" {...field} />
                                      </FormControl>
                                      <FormDescription className="text-[10px]">Direct URL to the video content.</FormDescription>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                               />
                            </div>
                         </div>
                       ))}
                    </CardContent>
                 </Card>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-8">
                 <Card className="border-none shadow-sm">
                    <CardHeader>
                       <CardTitle className="text-lg flex items-center gap-2">
                          <Rocket className="h-5 w-5 text-primary" />
                          Publishing Details
                       </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                       <FormField
                          control={form.control}
                          name="categoryId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {categoriesData?.data.map((cat: any) => (
                                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                       />
                       <FormField
                          control={form.control}
                          name="level"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Target Level</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select level" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                   <SelectItem value="Beginner">Beginner</SelectItem>
                                   <SelectItem value="Intermediate">Intermediate</SelectItem>
                                   <SelectItem value="Advanced">Advanced</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                       />
                       <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price ($)</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormDescription>Set to 0 for a free course.</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                       />
                    </CardContent>
                 </Card>

                 <Card className="border-none shadow-sm overflow-hidden">
                    <CardHeader>
                       <CardTitle className="text-lg flex items-center gap-2">
                          <ImageIcon className="h-5 w-5 text-primary" />
                          Thumbnail
                       </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div 
                         className="aspect-video bg-muted rounded-xl flex flex-col items-center justify-center border-2 border-dashed gap-2 relative overflow-hidden group cursor-pointer"
                         onClick={() => fileInputRef.current?.click()}
                       >
                          {localPreview || form.watch("thumbnailUrl") ? (
                             <>
                                <Image src={(localPreview || form.watch("thumbnailUrl") as string)} className="object-cover" alt="Course thumbnail" fill unoptimized />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                   <Upload className="h-8 w-8 text-white" />
                                </div>
                             </>
                          ) : (
                             <>
                                {isUploading ? (
                                   <Loader2 className="h-10 w-10 text-primary animate-spin" />
                                ) : (
                                   <>
                                      <Upload className="h-10 w-10 text-muted-foreground opacity-50" />
                                      <span className="text-xs text-muted-foreground text-center px-4 font-medium">Click to upload thumbnail</span>
                                      <span className="text-[10px] text-muted-foreground/60 mt-1 italic">Max size: 1MB (Recommended: 1280x720)</span>
                                   </>
                                )}
                             </>
                          )}
                       </div>
                       <input 
                         type="file" 
                         ref={fileInputRef} 
                         className="hidden" 
                         accept="image/*" 
                         onChange={handleThumbnailUpload} 
                       />
                       <FormField
                          control={form.control}
                          name="thumbnailUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Or Paste Image URL</FormLabel>
                              <FormControl>
                                <Input placeholder="https://..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                       />
                    </CardContent>
                 </Card>
              </div>
           </div>
        </form>
      </Form>
    </div>
  );
}
