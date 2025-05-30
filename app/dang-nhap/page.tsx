"use client";

import { useEffect } from "react";
import { auth, provider } from "@/firebase/config";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Button, Container, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

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
      <Card className="shadow-sm" style={{ maxWidth: "400px", width: "100%" }}>
        <Card.Body className="text-center">
          <Card.Title className="fw-bold mb-4">Đăng nhập</Card.Title>
          <Button
            onClick={handleLogin}
            variant="danger"
            className="d-flex align-items-center justify-content-center gap-2 w-100"
          >
            <FontAwesomeIcon icon={faGoogle} />
            Đăng nhập bằng Google
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}
