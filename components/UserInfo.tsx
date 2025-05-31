"use client";

import { useEffect, useState } from "react";
import { auth } from "@/firebase/config";
import { onAuthStateChanged, User } from "firebase/auth";
import { Image } from "react-bootstrap";

export default function UserInfo() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  if (!user) return null;

  return (
    <div className="d-flex align-items-center gap-3 p-2 rounded bg-secondary-background">
      {user.photoURL && (
        <Image
          src={user.photoURL}
          alt="Ảnh đại diện"
          roundedCircle
          width={48}
          height={48}
          className="border border-2 border-accent-color"
        />
      )}
      <div>
        <div className="fw-semibold fs-6">
          {user.displayName || "Người dùng"}
        </div>
        <div className="text-muted small">{user.email}</div>
      </div>
    </div>
  );
}
