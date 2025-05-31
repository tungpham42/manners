"use client";

import { useEffect } from "react";
import { auth, provider } from "@/firebase/config";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Button, Container, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { motion } from "framer-motion";

export default function Login() {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push("/quan-tri");
    } catch (err) {
      alert("Đăng nhập thất bại");
      console.error(err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) router.push("/quan-tri");
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          className="shadow-sm border-0"
          style={{ maxWidth: "400px", width: "100%" }}
        >
          <Card.Body className="text-center p-5">
            <Card.Title className="fw-bold fs-3 mb-4">Đăng Nhập</Card.Title>
            <p className="text-muted mb-4">
              Đăng nhập để quản lý và khám phá các phép xã giao.
            </p>
            <Button
              onClick={handleLogin}
              variant="danger"
              className="d-flex align-items-center justify-content-center gap-2 w-100 px-4 py-2 rounded-3"
            >
              <FontAwesomeIcon icon={faGoogle} />
              Đăng nhập bằng Google
            </Button>
          </Card.Body>
        </Card>
      </motion.div>
    </Container>
  );
}
