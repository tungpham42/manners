"use client";

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

  // Generate pagination items with ellipsis for large page counts
  const getPageItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    const ellipsis = <span className="pagination-ellipsis">...</span>;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`pagination-item ${i === currentPage ? "active" : ""}`}
            aria-current={i === currentPage ? "page" : undefined}
            aria-label={`Page ${i}`}
          >
            {i}
          </button>
        );
      }
    } else {
      // Always show first page
      items.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className={`pagination-item ${1 === currentPage ? "active" : ""}`}
          aria-current={1 === currentPage ? "page" : undefined}
          aria-label="Page 1"
        >
          1
        </button>
      );

      // Show ellipsis if current page is far from start
      if (currentPage > 3) {
        items.push(ellipsis);
      }

      // Show pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`pagination-item ${i === currentPage ? "active" : ""}`}
            aria-current={i === currentPage ? "page" : undefined}
            aria-label={`Page ${i}`}
          >
            {i}
          </button>
        );
      }

      // Show ellipsis if current page is far from end
      if (currentPage < totalPages - 2) {
        items.push(ellipsis);
      }

      // Always show last page
      items.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className={`pagination-item ${
            totalPages === currentPage ? "active" : ""
          }`}
          aria-current={totalPages === currentPage ? "page" : undefined}
          aria-label={`Page ${totalPages}`}
        >
          {totalPages}
        </button>
      );
    }

    return items;
  };

  return (
    <nav className="pagination-container" aria-label="Pagination navigation">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-nav"
        aria-label="Previous page"
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <div className="pagination-items">{getPageItems()}</div>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-nav"
        aria-label="Next page"
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </nav>
  );
}
