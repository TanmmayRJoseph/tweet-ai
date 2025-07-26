'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {Accordion,AccordionContent, AccordionItem, AccordionTrigger,} from '@/components/ui/accordion';
import { FeatureCard } from '@/components/FeatureCard';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-pink-100 p-6">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl"
      >
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          TweetMuse 🎭
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          AI-powered Tweet Generator that matches your <span className="font-semibold">mood</span>.  
          Generate funny, sarcastic, or motivational tweets with one click.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/pages/dashboard">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow">
              Try Now 🚀
            </Button>
          </Link>
          <Link href="/pages/login">
            <Button variant="outline" size="lg">
              Login / Sign Up
            </Button>
          </Link>
        </div>
      </motion.section>

      {/* Features */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-20 grid sm:grid-cols-3 gap-8 text-center max-w-5xl"
      >
        <FeatureCard
          emoji="🎯"
          title="Mood-Based Tweets"
          desc="Select from moods like Funny, Motivational or Sarcastic."
        />
        <FeatureCard
          emoji="⚡"
          title="Instant Generation"
          desc="Your tweet is crafted instantly using GPT magic."
        />
        <FeatureCard
          emoji="📤"
          title="Share & Copy Easily"
          desc="Copy to clipboard or share directly on X (Twitter)."
        />
        <FeatureCard
          emoji="💾"
          title="Save Your Tweets"
          desc="Your tweets are saved securely for future use."
        />
        <FeatureCard
          emoji="📱"
          title="Responsive & Fast"
          desc="Built for mobile & desktop with smooth UX."
        />
        <FeatureCard
          emoji="🧠"
          title="Powered by GPT-4"
          desc="Smart, context-aware tweets thanks to GPT magic."
        />
      </motion.section>

      {/* Preview */}
      <motion.section
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-24 w-full max-w-2xl"
      >
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Example Tweet</h3>
          <motion.div
            className="border-l-4 border-indigo-500 pl-4 text-gray-800 italic"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            If Mondays had a face, I’d unfollow it.
          </motion.div>
          <p className="text-sm text-gray-500 mt-2">Mood: Sarcastic</p>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="mt-28 w-full max-w-2xl"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="q1">
            <AccordionTrigger>How does tweet generation work?</AccordionTrigger>
            <AccordionContent>
              We use GPT under the hood. You select a mood, and our API generates a tweet tailored to that vibe!
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>Can I share tweets directly to Twitter?</AccordionTrigger>
            <AccordionContent>
              Absolutely! You can copy the tweet or click the Share on X button for instant sharing.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3">
            <AccordionTrigger>Is this free to use?</AccordionTrigger>
            <AccordionContent>
              Yes! The basic version is free. We may introduce pro features in the future.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q4">
            <AccordionTrigger>Can I save or export my tweets?</AccordionTrigger>
            <AccordionContent>
              Yes, your tweets are saved in your dashboard. You can copy or export them anytime.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </motion.section>

      {/* Final CTA */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="mt-20 text-center"
      >
        <h2 className="text-2xl font-bold mb-4">Ready to Tweet with Vibes?</h2>
        <Link href="/pages/dashboard">
          <Button size="lg" className="bg-pink-600 hover:bg-pink-700 text-white">
            Launch TweetMuse 💫
          </Button>
        </Link>
      </motion.section>

      <footer className="mt-24 text-sm text-gray-500 text-center">
        © 2025 TweetMuse by Tanmmay. Built with GPT & Love.
      </footer>
    </main>
  );
}

