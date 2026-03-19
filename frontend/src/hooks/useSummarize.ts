import { useState } from "react";
import { API_CONFIG } from "@/lib/api-config";
import { toast } from "sonner";

export interface MeetingSummary {
  MeetingInfo: { MeetingName: string; Date: string };
  Participants: Array<{ Name: string; Role: string }>;
  Discussion: Array<{ Topic: string; Description: string; Action: string }>;
  ActionItems: Array<{ Assignee: string; Description: string }>;
}

export function useSummarize() {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<MeetingSummary | null>(null);

  const summarize = async (transcript: string) => {
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

      if (!res.ok) {
        let errorMessage = "An unexpected error occurred";
        try {
          const errorData = await res.json();
          errorMessage = errorData.detail || errorMessage;
        } catch (parseError) {
          errorMessage = `Server error (${res.status}): ${res.statusText}`;
        }

        throw new Error(errorMessage);
      }

      const data = await res.json();
      const finalSummary = data.summary || data;
      setSummary(finalSummary);
      toast.success("Summary generated successfully!");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to connect to server";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return { summarize, loading, summary, setSummary };
}
