/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      return toast.error('All fields are required.');
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/users/register', form);
      toast.success(response.data.message || 'Signup successful 🎉');
      setForm({ name: '', email: '', password: '' });
      router.push('/pages/login')
    } catch (err: any) {
      const msg = err.response?.data || 'Signup failed';
      toast.error(typeof msg === 'string' ? msg : msg.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Create your account</h2>
          <p className="text-gray-500 text-sm mt-1">Join TweetMuse to generate creative tweets!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
            />
          </div>

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
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <a href="/pages/login" className="text-indigo-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </motion.div>
  );
}
