"use client";

import { useState } from "react";
import { SummaryCard } from "./SummaryCard";
import { SummaryCardSkeleton } from "@/components/SummaryCardSkeleton";
import { useSummarize } from "@/hooks/useSummarize";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import {
  Loader2,
  Sparkles,
  Wand2,
  Terminal,
  BarChart3,
  Copy,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function TranscriptForm() {
  const [transcript, setTranscript] = useState("");
  const [activeTab, setActiveTab] = useState("live");

  const {
    summarize,
    startStream,
    summary,
    streamedText,
    isStreaming,
    loading,
    isProcessing,
    reset,
  } = useSummarize();

  const handleGenerate = async (mode: "structured" | "stream") => {
    if (!transcript.trim())
      return toast.error("Please paste a transcript first");

    if (mode === "stream") {
      setActiveTab("live");
      await startStream(transcript);
    } else {
      setActiveTab("analysis");
      summarize(transcript);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      {/* --- HEADER --- */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          Meeting Intelligence <span className="text-primary">v2.0</span>
        </h1>
        <p className="text-slate-500">
          Transform raw transcripts into structured corporate insights.
        </p>
      </div>

      {/* --- INPUT SECTION --- */}
      <div className="bg-white border rounded-3xl p-6 shadow-sm">
        <Textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Paste meeting transcript here..."
          className="h-48 resize-none border-none bg-slate-50 focus-visible:ring-0 text-lg"
        />

        <div className="flex gap-3 mt-4">
          <Button
            onClick={() => handleGenerate("stream")}
            disabled={isProcessing}
            className="flex-1 h-12 rounded-xl bg-slate-900"
          >
            {isStreaming ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <Terminal className="mr-2" size={18} />
            )}
            Run Live Stream
          </Button>

          <Button
            onClick={() => handleGenerate("structured")}
            disabled={isProcessing}
            variant="outline"
            className="flex-1 h-12 rounded-xl border-primary text-primary hover:bg-primary/5"
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <BarChart3 className="mr-2" size={18} />
            )}
            Deep Analysis (JSON)
          </Button>
        </div>
      </div>

      {/* --- OUTPUT TABS (The "SaaS" Look) --- */}
      {(summary || streamedText || isProcessing) && (
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full animate-in fade-in slide-in-from-bottom-4"
        >
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-slate-100 p-1 rounded-xl">
              <TabsTrigger
                value="live"
                className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Sparkles size={14} className="mr-2" /> Live Feed
              </TabsTrigger>
              <TabsTrigger
                value="analysis"
                className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <BarChart3 size={14} className="mr-2" /> Structured Analysis
              </TabsTrigger>
            </TabsList>

            {streamedText && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(streamedText);
                  toast.success("Copied stream to clipboard");
                }}
              >
                <Copy size={14} className="mr-2" /> Copy Output
              </Button>
            )}
          </div>

          {/* TAB 1: LIVE STREAM CONTENT */}
          <TabsContent value="live" className="mt-0">
            <div className="bg-slate-900 rounded-2xl p-8 text-slate-300 font-mono text-sm leading-relaxed min-h-[300px] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary/30 overflow-hidden">
                {isStreaming && (
                  <div className="h-full bg-primary animate-progress w-full" />
                )}
              </div>

              {streamedText ? (
                <div className="whitespace-pre-wrap">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {streamedText}
                  </ReactMarkdown>
                  {isStreaming && (
                    <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse" />
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full space-y-4 py-20">
                  <Terminal size={40} className="text-slate-700" />
                  <p className="text-slate-600">Waiting for live signal...</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* TAB 2: STRUCTURED ANALYSIS CONTENT */}
          <TabsContent value="analysis" className="mt-0">
            {loading ? (
              <SummaryCardSkeleton />
            ) : summary ? (
              <SummaryCard data={summary} />
            ) : (
              <div className="border-2 border-dashed rounded-2xl py-20 flex flex-col items-center justify-center text-slate-400">
                <BarChart3 size={40} className="mb-2 opacity-20" />
                <p>Run Deep Analysis to see structured cards.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
