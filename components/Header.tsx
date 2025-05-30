"use client";

import Link from "next/link";
import { Navbar, Nav, Container, Dropdown, Image } from "react-bootstrap";
import { useEffect, useState } from "react";
import { auth } from "@/firebase/config";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { ADMIN_EMAILS } from "@/constants/admins";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const handleToggle = () => setExpanded(!expanded);
  const handleClose = () => setExpanded(false);

  return (
    <Navbar
      bg="light"
      variant="light"
      expand="lg"
      expanded={expanded}
      onToggle={handleToggle}
      className="shadow-sm"
    >
      <Container>
        <Link
          href="/"
          className="navbar-brand fw-bold text-primary"
          onClick={handleClose}
        >
          Phép Xã Giao
        </Link>

        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Link href="/" className="nav-link fw-medium" onClick={handleClose}>
              Trang Chủ
            </Link>
            {user && ADMIN_EMAILS.includes(user.email || "") && (
              <Link
                href="/quan-tri"
                className="nav-link fw-medium"
                onClick={handleClose}
              >
                Quản Trị
              </Link>
            )}
          </Nav>

          {user ? (
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="link"
                id="user-dropdown"
                className="d-flex align-items-center text-dark text-decoration-none"
              >
                {user.photoURL && (
                  <Image
                    src={user.photoURL}
                    alt="Ảnh đại diện"
                    roundedCircle
                    width={32}
                    height={32}
                    className="me-2 border"
                  />
                )}
                <span className="fw-medium">
                  {user.displayName || user.email}
                </span>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Header className="fw-medium">
                  {user.email}
                </Dropdown.Header>
                <Dropdown.Item
                  onClick={() => {
                    signOut(auth);
                    handleClose();
                  }}
                  className="fw-medium"
                >
                  Đăng Xuất
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Nav>
              <Link
                href="/dang-nhap"
                className="nav-link fw-medium text-primary"
                onClick={handleClose}
              >
                Đăng Nhập
              </Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
