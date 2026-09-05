"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Zap } from "@/components/icons";

export function HomeDropzone() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/tools");
  };

  return (
    <div 
      onClick={handleClick}
      className="max-w-2xl mx-auto bg-surface border-2 border-primary/20 rounded-2xl p-12 mb-8 transition-all hover:border-primary cursor-pointer hover:bg-primary/5 hover:shadow-lg relative overflow-hidden group"
    >
      <div className="flex flex-col items-center justify-center space-y-4 group-hover:scale-105 transition-transform duration-300 pointer-events-none">
        <div className="p-4 bg-primary/10 rounded-full text-primary">
          <Zap size={40} />
        </div>
        <h3 className="text-2xl font-bold">Start Converting Now</h3>
        <p className="text-base text-muted-foreground">Click here to browse all available conversion tools.</p>
      </div>
    </div>
  );
}
