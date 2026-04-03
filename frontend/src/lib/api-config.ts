export const API_CONFIG = {
  // Use the env variable, or fallback to localhost if it's missing
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",

  ENDPOINTS: {
    SUMMARIZE: "/summarize",
    HISTORY: "/history",
  },
};
