export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
  revealDelay?: number;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  content: string;
  role: string;
}

// Interface for the AI chat history
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
