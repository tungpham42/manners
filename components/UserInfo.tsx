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
    <div className="d-flex align-items-center gap-2">
      {user.photoURL && (
        <Image
          src={user.photoURL}
          alt="Ảnh đại diện"
          roundedCircle
          width={40}
          height={40}
          className="border"
        />
      )}
      <div>
        <div className="fw-medium">{user.displayName || "Người dùng"}</div>
        <div className="text-muted small">{user.email}</div>
      </div>
    </div>
  );
}
