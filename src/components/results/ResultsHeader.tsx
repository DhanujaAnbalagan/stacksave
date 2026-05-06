import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap, RotateCcw } from "lucide-react";

interface ResultsHeaderProps {
  generatedAt: string;
  onRestart: () => void;
}

export function ResultsHeader({ generatedAt, onRestart }: ResultsHeaderProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const date = mounted 
    ? new Date(generatedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <header className="border-b border-border sticky top-0 z-40 bg-background/90 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/audit" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to audit
            </Link>
            <span className="text-border hidden sm:block">·</span>
            <Link href="/" className="hidden sm:flex items-center gap-1.5 group">
              <div className="w-6 h-6 rounded-md gradient-brand flex items-center justify-center">
                <Zap className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                Stack<span className="text-primary">Save</span>
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground/60 hidden sm:block">
              Generated {date}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs h-7"
              onClick={onRestart}
            >
              <RotateCcw className="w-3 h-3" />
              New audit
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

