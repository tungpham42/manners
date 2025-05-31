"use client";

import { Pagination } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  return (
    <Pagination className="justify-content-center mt-5 gap-2">
      <Pagination.Prev
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="fw-medium px-3 py-2 rounded-3 bg-secondary-background border-0 shadow-sm"
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </Pagination.Prev>
      {Array.from({ length: totalPages }, (_, i) => (
        <Pagination.Item
          key={i + 1}
          active={i + 1 === currentPage}
          onClick={() => onPageChange(i + 1)}
          className={`fw-medium px-3 py-2 rounded-3 ${
            i + 1 === currentPage
              ? "bg-accent-color text-white"
              : "bg-secondary-background"
          }`}
        >
          {i + 1}
        </Pagination.Item>
      ))}
      <Pagination.Next
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="fw-medium px-3 py-2 rounded-3 bg-secondary-background border-0 shadow-sm"
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </Pagination.Next>
    </Pagination>
  );
}
