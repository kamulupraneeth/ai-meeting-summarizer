"use client";

import { useState } from "react";
import { SummaryCard } from "./SummaryCard";
import { toast } from "sonner";
import { Loader2, Sparkles, Trash2, Wand2 } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { SummaryCardSkeleton } from "@/components/SummaryCardSkeleton";
import { useSummarize } from "@/hooks/useSummarize";

export default function TranscriptForm() {
  const [transcript, setTranscript] = useState("");

  const { summarize, loading, summary, setSummary } = useSummarize();

  const handleSummarize = async () => {
    if (!transcript.trim()) {
      toast.error("Please paste a transcript first");
      return;
    }
    await summarize(transcript);
  };

  const clearForm = () => {
    setTranscript("");
    setSummary(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-2 bg-secondary rounded-full mb-2">
          <Sparkles className="w-5 h-5 text-primary mr-2" />
          <span className="text-xs font-bold uppercase tracking-wider text-secondary-foreground">
            AI Powered Analysis
          </span>
        </div>
        <h1 className="text-5xl font-black tracking-tighter text-slate-900 lg:text-6xl">
          Meeting <span className="text-primary">Intelligence</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Leverage LLMs to extract actionable insights from your raw transcripts
          instantly.
        </p>
      </header>
      <div className="bg-card border border-border rounded-3xl p-8 shadow-2xl shadow-slate-200/50 transition-all hover:shadow-primary/5">
        <div className="relative group">
          <Textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste your meeting transcript here (Zoom, Teams, etc.)..."
            className="w-full h-64 p-4 text-slate-900 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
          />

          {transcript && !loading && (
            <Button
              onClick={clearForm}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
              title="Clear text"
              variant="ghost"
            >
              <Trash2 size={20} />
            </Button>
          )}
        </div>

        <div className="mt-6">
          <Button
            onClick={handleSummarize}
            disabled={loading || !transcript.trim()}
            className="group w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:opacity-90 active:scale-[0.98] disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed disabled:shadow-none cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                Summarizing
              </>
            ) : (
              <>
                <Wand2
                  size={20}
                  className="group-hover:rotate-12 transition-transform"
                />
                Summarize Meeting
              </>
            )}
          </Button>
        </div>

        {/* Show Results with a nice entrance animation */}
        {(loading || summary) && (
          <div className="mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-slate-800">
                {loading ? "Analyzing Meeting..." : "Generated Insights"}
              </h2>
              <div className="h-px flex-1 bg-slate-100 ml-4"></div>
            </div>
            {loading ? (
              <SummaryCardSkeleton />
            ) : (
              summary && <SummaryCard data={summary} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
