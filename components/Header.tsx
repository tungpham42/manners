"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  const handleToggle = () => setExpanded(!expanded);
  const handleClose = () => setExpanded(false);

  const isActive = (href: string) => pathname === href;

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
          className={`navbar-brand fw-bold text-accent-color ${
            isActive("/") ? "text-decoration-underline" : ""
          }`}
          onClick={handleClose}
        >
          Phép Xã Giao
        </Link>

        <Navbar.Toggle aria-controls="navbar-nav" className="border-0">
          <span className="navbar-toggler-icon"></span>
        </Navbar.Toggle>

        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto align-items-start gap-2">
            {user && ADMIN_EMAILS.includes(user.email || "") && (
              <Link
                href="/quan-tri"
                className={`nav-link fw-medium ${
                  isActive("/quan-tri")
                    ? "text-decoration-underline text-accent-color"
                    : ""
                }`}
                onClick={handleClose}
              >
                Quản Trị
              </Link>
            )}
            {isAuthenticated && (
              <Link
                href="/ho-so"
                className={`nav-link fw-medium ${
                  isActive("/ho-so")
                    ? "text-decoration-underline text-accent-color"
                    : ""
                }`}
                onClick={handleClose}
              >
                Hồ Sơ
              </Link>
            )}
            {isAuthenticated ? (
              <Dropdown as={Nav.Item} className="d-lg-none mt-2">
                <Dropdown.Toggle
                  variant="link"
                  id="user-dropdown"
                  className="d-flex align-items-center text-primary-foreground text-decoration-none p-2 rounded hover-bg-secondary-background w-100"
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

                <Dropdown.Menu className="border-0 shadow-sm rounded-3 w-100">
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
              <Nav.Item className="d-lg-none mt-2">
                <Link
                  href="/dang-nhap"
                  className={`nav-link fw-medium ${
                    isActive("/dang-nhap")
                      ? "text-decoration-underline text-accent-color"
                      : ""
                  }`}
                  onClick={handleClose}
                >
                  Đăng Nhập
                </Link>
              </Nav.Item>
            )}
          </Nav>

          {/* Dropdown for desktop view */}
          {isAuthenticated ? (
            <Nav className="d-none d-lg-flex ms-2">
              <Dropdown as={Nav.Item}>
                <Dropdown.Toggle
                  variant="link"
                  id="user-dropdown-desktop"
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
            </Nav>
          ) : (
            <Nav className="d-none d-lg-flex">
              <Link
                href="/dang-nhap"
                className={`btn btn-outline-primary fw-medium px-4 ${
                  isActive("/dang-nhap")
                    ? "border-accent-color text-accent-color"
                    : ""
                }`}
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
