"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/dang-nhap");
        setIsAuthenticated(false);
      } else {
        setUser(currentUser);
        setIsAuthenticated(true);
      }

      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  return { user, loading, isAuthenticated };
}
