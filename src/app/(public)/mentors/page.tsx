"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  GraduationCap, 
  Star, 
  Users, 
  Search, 
  ArrowRight,
  MessageSquare,
  Globe,
  Filter,
  Award,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/shared/Loading";
import api from "@/lib/axios";
import { motion, AnimatePresence } from "framer-motion";

export default function MentorsPage() {
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchMentors = async () => {
    try {
      const { data } = await api.get("/mentors");
      setMentors(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  const filteredMentors = mentors.filter(m => 
    m.user.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.expertise.some((e: string) => e.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return <Loading />;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header Section - Modern SaaS */}
      <section className="bg-card border-b border-border pt-28 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">Our Mentors</h1>
            <p className="text-lg text-muted-foreground">Connect with industry professionals who have built systems at top global companies. Get 1-on-1 guidance, code reviews, and career advice.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mt-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search mentors by name, role, or expertise..." 
                className="h-12 pl-10 rounded-[0.625rem] bg-background border-border shadow-sm focus-visible:ring-primary font-medium"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button size="lg" variant="outline" className="h-12 rounded-[0.625rem] font-bold gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" /> Filter
            </Button>
          </div>
        </div>
      </section>

      {/* Mentors Grid */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredMentors.map((mentor, i) => (
                <motion.div 
                  key={mentor.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className="saas-card rounded-[0.625rem] flex flex-col group overflow-hidden"
                >
                  <div className="p-6 flex flex-col gap-5 flex-1">
                     <div className="flex items-start justify-between">
                        <div className="relative h-16 w-16 rounded-full overflow-hidden border border-border shadow-sm">
                           <Image 
                             src={mentor.user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${mentor.user.name}`} 
                             alt={mentor.user.name} 
                             fill 
                             sizes="64px"
                             unoptimized={(mentor.user.image || "").includes(".svg") || !(mentor.user.image)}
                             className="object-cover"
                           />
                        </div>
                        <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 px-2 py-1 rounded-md text-xs font-bold">
                           <Star className="h-3 w-3 fill-current" />
                           {mentor.averageRating}
                        </div>
                     </div>
  
                     <div>
                        <h3 className="font-bold text-lg tracking-tight group-hover:text-primary transition-colors line-clamp-1">{mentor.user.name}</h3>
                        <p className="text-sm font-semibold text-primary line-clamp-1 mt-0.5">{mentor.expertise[0]} Expert</p>
                     </div>
                     
                     <p className="text-muted-foreground text-sm line-clamp-3 font-medium leading-relaxed flex-1">
                       {mentor.bio || "Senior engineer dedicated to mentoring the next generation of developers with practical, industry-aligned insights."}
                     </p>
  
                     <div className="flex flex-wrap gap-2 pt-2">
                        {mentor.expertise.slice(0, 2).map((exp: string, i: number) => (
                          <Badge key={i} variant="secondary" className="bg-muted text-muted-foreground border-none font-semibold text-[10px] tracking-wider uppercase px-2 py-0.5">
                             {exp}
                          </Badge>
                        ))}
                        {mentor.expertise.length > 2 && (
                          <Badge variant="secondary" className="bg-muted text-muted-foreground border-none font-semibold text-[10px] tracking-wider uppercase px-2 py-0.5">
                             +{mentor.expertise.length - 2} More
                          </Badge>
                        )}
                     </div>
                  </div>
                  
                  <div className="p-4 border-t border-border bg-card/50 flex items-center justify-between mt-auto">
                     <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground">
                        <div className="flex items-center gap-1.5" title="Total Students">
                           <Users className="h-4 w-4" />
                           <span>{mentor.totalStudents}</span>
                        </div>
                        <div className="flex items-center gap-1.5" title="Years of Experience">
                           <Award className="h-4 w-4" />
                           <span>{mentor.experienceYears}y</span>
                        </div>
                     </div>
                     <Link href={`/mentors/${mentor.id}`}>
                        <Button size="sm" variant="ghost" className="font-bold text-primary hover:bg-primary/10 gap-1 px-2 h-8">
                           Profile <ChevronRight className="h-4 w-4" />
                        </Button>
                     </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
  
          {filteredMentors.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-32 text-center flex flex-col items-center justify-center saas-card rounded-[0.625rem] mt-6"
            >
               <div className="h-16 w-16 bg-muted rounded-2xl flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
               </div>
               <h3 className="text-xl font-extrabold tracking-tight">No mentors found</h3>
               <p className="text-muted-foreground max-w-md mt-2 mb-6">We couldn't find any mentors matching your search query. Try using different keywords.</p>
               <Button variant="outline" className="font-bold" onClick={() => setSearch("")}>Clear Search</Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-[#FDFCF8] dark:bg-[#262626] border-t border-border mt-auto">
        <div className="container mx-auto px-4 md:px-6">
           <div className="max-w-4xl mx-auto bg-primary rounded-[1rem] p-10 md:p-16 text-center text-primary-foreground shadow-xl shadow-primary/20 space-y-8 relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                 <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Become a Mentor</h2>
                 <p className="text-lg text-primary-foreground/80 font-medium max-w-2xl mx-auto">
                   Share your expertise, guide emerging talent, and earn while shaping the future of tech. Join our network of elite industry professionals.
                 </p>
              </div>
              <div className="flex flex-wrap justify-center gap-4 relative z-10">
                 <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold h-14 px-8 rounded-xl">
                   Apply Now
                 </Button>
                 <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 text-white font-bold h-14 px-8 rounded-xl">
                   Learn More
                 </Button>
              </div>
              {/* Background accent */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
           </div>
        </div>
      </section>
    </div>
  );
}
