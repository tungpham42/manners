"use client";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";
import { Button } from "react-bootstrap";

export function LogoutButton() {
  return (
    <Button
      onClick={() => signOut(auth)}
      variant="outline-primary"
      className="fw-medium"
    >
      Đăng Xuất
    </Button>
  );
}
