export const VALID_MOODS = new Set(["funny", "sarcastic", "motivational"] as const);
export type Mood = "funny" | "sarcastic" | "motivational";

export const MOOD_PROMPTS: Record<Mood, string> = {
  funny:
    "Write a funny Twitter-style post or thread (~200 words). Make it relatable, witty, and shareable. Use emojis and punchy line breaks.",
  sarcastic:
    "Write a sarcastic Twitter-style post or thread (~200 words). Dry humour, sharp observations, eye-roll energy. Use emojis sparingly for effect.",
  motivational:
    "Write a motivational Twitter-style post or thread (~200 words). Inspiring but not cringe — real talk, not toxic positivity. Use emojis and impactful line breaks.",
};






