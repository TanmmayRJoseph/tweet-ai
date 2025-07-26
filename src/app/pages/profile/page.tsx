"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface User {
  name: string;
  email: string;
  createdAt: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/users/me");
        setUser(res.data.user);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error(err);
        toast.error(err?.response?.data?.error || "Failed to load user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post("/api/users/logout");
      toast.success(response.data.message || "Logout successful");
      router.push('/');
    } catch (err) {
      console.error(err);
      toast.error( "Failed to logout");
    }
  };
  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="w-full max-w-md border-indigo-200 shadow-xl bg-white/80 backdrop-blur-md rounded-2xl">
        <CardContent className="p-6 space-y-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-indigo-700">Your Profile</h2>
            <p className="text-sm text-gray-500">Account Info</p>
          </div>

          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-3/4 mx-auto" />
              <Skeleton className="h-6 w-5/6 mx-auto" />
              <Skeleton className="h-6 w-1/2 mx-auto" />
            </div>
          ) : user ? (
            <div className="space-y-3">
              <div>
                <p className="text-gray-600 text-sm">Full Name</p>
                <p className="text-lg font-medium">{user.name}</p>
              </div>

              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="text-lg font-medium">{user.email}</p>
              </div>

              <div>
                <p className="text-gray-600 text-sm">Joined</p>
                <p className="text-lg font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>

              <Button
                onClick={handleLogout}
                variant="destructive"
                className="w-full mt-4"
              >
                Logout
              </Button>
            </div>
          ) : (
            <p className="text-red-600 text-center font-medium">
              Failed to load user info.
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
