/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return toast.error("Please enter both email and password.");
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/users/login", form);
      toast.success(res.data.message || "Login successful!");
      //   store token in local storage
      localStorage.setItem("token", res.data.token);
      // Redirect if needed
      router.push("/pages/dashboard");
    } catch (err: any) {
      const msg = err.response?.data?.error || "Login failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-100 to-pink-100 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Welcome Back</h2>
          <p className="text-gray-500 text-sm mt-1">
            Login to your TweetMuse account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="text-sm text-center text-gray-500">
          Don’t have an account?{" "}
          <a href="/pages/signup" className="text-indigo-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </motion.div>
  );
}
