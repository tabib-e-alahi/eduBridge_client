import { motion } from "framer-motion";

export function Loading() {
  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center gap-8 bg-background/50">
      <div className="relative h-12 w-12">
        <motion.div
          animate={{ 
            rotate: 360,
            borderRadius: ["20%", "50%", "20%"]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 border border-primary/30"
        />
        <motion.div
          animate={{ 
            rotate: -360,
            borderRadius: ["50%", "20%", "50%"]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-2 border border-primary/10"
        />
      </div>
      <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground animate-pulse italic">
        Gathering Focus...
      </p>
    </div>
  );
}

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/80 backdrop-blur-md noise-overlay">
      <div className="relative h-16 w-16">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-t border-primary/40 rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
           <div className="h-1 w-1 bg-primary rounded-full animate-ping" />
        </div>
      </div>
      <p className="mt-12 text-[10px] font-bold uppercase tracking-[0.5em] text-primary italic">
        The Vision is Forming
      </p>
    </div>
  );
}
