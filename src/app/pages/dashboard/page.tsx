/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquareText, History, User } from 'lucide-react';
import axios from 'axios';
type Message = {
  id: number;
  from: "user" | "ai";
  text: string;
};
export default function TweetChatDashboard() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<
    { id: number; from: 'user' | 'ai'; text: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
  
    const userMessage: Message = {
      id: Date.now(),
      from: "user",
      text: input,
    };
  
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
  
    try {
      const token = localStorage.getItem("token");
  
      const response = await axios.post(
        "/api/tweet/generate-tweet",
        { mood: input },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const { tweet } = response.data;
  
      if (tweet) {
        const aiMessage: Message = {
          id: Date.now() + 1,
          from: "ai",
          text: tweet,
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        console.error("No tweet returned.");
      }
    } catch (error: any) {
      console.error("API Error:", error?.response?.data?.error || error.message);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-[260px] bg-gray-900 text-white p-4 space-y-6">
        <h2 className="text-2xl font-bold">TweetMuse 🎭</h2>
        <nav className="space-y-4">
          <div
            className="flex items-center gap-2 cursor-pointer hover:text-indigo-300"
            onClick={handleNewChat}
          >
            <MessageSquareText size={18} />
            <span>New Chat</span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer hover:text-indigo-300">
            <History size={18} />
            <Link href="/pages/history">History</Link>
          </div>
          <div className="flex items-center gap-2 cursor-pointer hover:text-indigo-300">
            <User size={18} />
            <Link href="/pages/profile">My Profile</Link>
          </div>
        </nav>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="border-b p-4 text-xl font-semibold text-gray-700 shadow-sm">
          AI Tweet Generator
        </div>

        <ScrollArea className="flex-1 p-6 space-y-4 overflow-y-auto px-15">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`max-w-lg px-4 py-3 rounded-xl shadow-md ${
                msg.from === 'user'
                  ? 'bg-indigo-100 self-end ml-auto'
                  : 'bg-white self-start'
              }`}
            >
              <p className="text-sm text-gray-800">{msg.text}</p>
            </motion.div>
          ))}

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500 text-sm"
            >
              Generating tweet...
            </motion.div>
          )}
        </ScrollArea>

        {/* Input area */}
        <div className="sticky bottom-0 border-t p-4 flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter mood: funny / sarcastic / motivational"
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={loading}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
