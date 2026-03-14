"use client";

import { useState } from "react";
import { API_CONFIG } from "@/lib/api-config";
import { SummaryCard } from "./SummaryCard";
import { toast } from "sonner";
import { Loader2, Sparkles, Trash2, Wand2 } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface MeetingSummary {
  MeetingInfo: { MeetingName: string; Date: string };
  Participants: Array<{ Name: string; Role: string }>;
  Discussion: Array<{ Topic: string; Description: string; Action: string }>;
  ActionItems: Array<{ Assignee: string; Description: string }>;
}

export default function TranscriptForm() {
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<MeetingSummary | null>(null);

  const handleSummarize = async () => {
    if (!transcript.trim()) {
      toast.error("Please paste a transcript first");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SUMMARIZE}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript }),
        },
      );

      if (!res.ok) throw new Error("Server responded with an error");

      const data = await res.json();

      setSummary(data.summary);
      toast.success("Summary generated successfully!");
    } catch (error) {
      toast.error("Failed to generate summary. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setTranscript("");
    setSummary(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          AI Meeting Summarizer
        </h1>
        <p className="text-slate-500 mt-2">
          Turn messy transcripts into structured action items.
        </p>
      </div> */}
      {/* Header Section */}
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

          {transcript && (
            <Button
              onClick={clearForm}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 transition-colors"
              title="Clear text"
            >
              <Trash2 size={20} />
            </Button>
          )}
        </div>

        <div className="mt-6">
          <Button
            onClick={handleSummarize}
            disabled={loading || !transcript}
            className="group w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:opacity-90 active:scale-[0.98] disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed disabled:shadow-none"
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
        {summary && (
          <div className="mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-slate-800">
                Generated Insights
              </h2>
              <div className="h-px flex-1 bg-slate-100 ml-4"></div>
            </div>
            <SummaryCard data={summary} />
          </div>
        )}
      </div>
    </div>
  );
}
