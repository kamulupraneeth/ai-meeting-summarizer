import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_CONFIG } from "@/lib/api-config";
import { toast } from "sonner";

export interface MeetingSummary {
  MeetingInfo: { MeetingName: string; Date: string };
  Participants: Array<{ Name: string; Role: string }>;
  Discussion: Array<{ Topic: string; Description: string; Action: string }>;
  ActionItems: Array<{ Assignee: string; Description: string }>;
}

export function useSummarize() {
  const queryClient = useQueryClient();

  const [streamedText, setStreamedText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const mutation = useMutation({
    mutationFn: async (transcript: string): Promise<MeetingSummary> => {
      const res = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SUMMARIZE}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript }),
        },
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${res.statusText}`);
      }

      const data = await res.json();
      return data.summary || data;
    },
    onSuccess: (data) => {
      toast.success("Structured analysis complete!");
      queryClient.setQueryData(["last-summary"], data);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to generate structured summary");
    },
  });

  const startStream = async (transcript: string) => {
    setIsStreaming(true);
    setStreamedText(""); // Clear previous stream
    mutation.reset(); // Clear previous structured data

    try {
      const res = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SUMMARIZE}/stream`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript }),
        },
      );

      if (!res.body) throw new Error("No response body found");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      // Read the stream chunk by chunk
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        setStreamedText((prev) => prev + chunk);
      }

      toast.success("Live generation finished!");
    } catch (err) {
      toast.error("Streaming failed. Please try the structured summary.");
      console.error(err);
    } finally {
      setIsStreaming(false);
    }
  };

  // Helper to reset everything
  const resetAll = () => {
    mutation.reset();
    setStreamedText("");
    setIsStreaming(false);
  };

  return {
    // Structured Data (TanStack)
    summarize: mutation.mutate,
    summary: mutation.data,
    loading: mutation.isPending,

    // Live Stream Data
    startStream,
    streamedText,
    isStreaming,

    // Controls
    reset: resetAll,
    // Combined loading state for UI buttons
    isProcessing: mutation.isPending || isStreaming,
  };
}
