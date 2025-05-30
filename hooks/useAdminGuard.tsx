"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useRouter } from "next/navigation";
import { ADMIN_EMAILS } from "@/constants/admins";

export function useAdminGuard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/dang-nhap");
        return;
      }

      if (ADMIN_EMAILS.includes(user.email || "")) {
        setAllowed(true);
      } else {
        router.push("/");
      }

      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  return loading || !allowed;
}
