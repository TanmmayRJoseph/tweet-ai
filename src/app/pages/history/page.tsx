/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import TweetCard from "@/components/TweetCard";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const moods = ["funny", "sarcastic", "motivational"];

export default function HistoryPage() {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMood, setActiveMood] = useState<string | null>(null);

  const fetchTweets = async (mood: string | null = null) => {
    setLoading(true);
    try {
      const response = await axios.get("/api/tweet/filtertweet", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: mood ? { mood } : {},
      });

      if (Array.isArray(response.data.tweets)) {
        setTweets(response.data.tweets);
      } else {
        console.error("Unexpected tweet format:", response.data);
        setTweets([]);
      }
    } catch (error) {
      console.error("Error fetching tweets:", error);
      setTweets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tweetId: number) => {
    try {
      await axios.delete(`/api/tweet/delete-tweet/${tweetId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTweets((prevTweets) => prevTweets.filter((t: any) => t.id !== tweetId));
    } catch (error) {
      console.error("Error deleting tweet:", error);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  const handleFilterClick = (mood: string | null) => {
    setActiveMood(mood);
    fetchTweets(mood);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Your Tweet History</h1>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={activeMood === null ? "default" : "outline"}
          onClick={() => handleFilterClick(null)}
        >
          All
        </Button>
        {moods.map((mood) => (
          <Button
            key={mood}
            variant={activeMood === mood ? "default" : "outline"}
            onClick={() => handleFilterClick(mood)}
          >
            {mood.charAt(0).toUpperCase() + mood.slice(1)}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center mt-10">
          <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
        </div>
      ) : tweets.length === 0 ? (
        <p className="text-muted-foreground">No tweets found for the selected filter.</p>
      ) : (
        <div className="space-y-4">
          {tweets.map((tweet: any) => (
            <TweetCard key={tweet.id} tweet={tweet} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
