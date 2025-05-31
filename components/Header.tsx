"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { Navbar, Nav, Container, Dropdown, Image } from "react-bootstrap";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";
import { ADMIN_EMAILS } from "@/constants/admins";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => setExpanded(!expanded);
  const handleClose = () => setExpanded(false);

  return (
    <Navbar
      bg="primary-background"
      variant="light"
      expand="lg"
      expanded={expanded}
      onToggle={handleToggle}
      className="shadow-sm py-3"
    >
      <Container>
        <Link
          href="/"
          className="navbar-brand fw-bold text-accent-color"
          onClick={handleClose}
        >
          Phép Xã Giao
        </Link>

        <Navbar.Toggle aria-controls="navbar-nav" className="border-0">
          <span className="navbar-toggler-icon"></span>
        </Navbar.Toggle>

        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto align-items-center gap-2">
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
            {isAuthenticated && (
              <Link
                href="/them"
                className="nav-link fw-medium"
                onClick={handleClose}
              >
                Thêm Mới
              </Link>
            )}
          </Nav>

          {isAuthenticated ? (
            <Dropdown align="end" className="ms-2">
              <Dropdown.Toggle
                variant="link"
                id="user-dropdown"
                className="d-flex align-items-center text-primary-foreground text-decoration-none p-2 rounded hover-bg-secondary-background"
              >
                {user?.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt="Ảnh đại diện"
                    roundedCircle
                    width={36}
                    height={36}
                    className="me-2 border border-2 border-accent-color"
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faUserCircle}
                    size="2x"
                    className="me-2"
                  />
                )}
                <span className="fw-medium">
                  {user?.displayName || user?.email}
                </span>
              </Dropdown.Toggle>

              <Dropdown.Menu className="border-0 shadow-sm mt-2 rounded-3">
                <Dropdown.Header className="fw-medium text-muted">
                  {user?.email}
                </Dropdown.Header>
                <Dropdown.Item
                  onClick={() => {
                    signOut(auth);
                    handleClose();
                  }}
                  className="fw-medium d-flex align-items-center gap-2"
                >
                  Đăng Xuất
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Nav>
              <Link
                href="/dang-nhap"
                className="btn btn-outline-primary fw-medium px-4"
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
