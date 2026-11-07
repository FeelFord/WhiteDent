export type ContentStatus = "verified" | "requiresVerification" | "demo";

export type ContentFact<T> = {
  value: T;
  status: ContentStatus;
  source: string;
  note?: string;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  status: ContentStatus;
  category: "consultation" | "restoration" | "surgery";
  overview: string;
  questions: { question: string; answer: string }[];
};

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  status: ContentStatus;
  experience: string | null;
  education: string[];
};
