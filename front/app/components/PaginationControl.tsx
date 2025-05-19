import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface PaginationControlProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function PaginationControl({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationControlProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center space-x-1 justify-center">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50"
      >
        <ChevronLeftIcon size={20} />
      </button>
      <span className="text-sm">
        Page {currentPage}/{totalPages}
      </span>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50"
      >
        <ChevronRightIcon size={20} />
      </button>
    </div>
  );
}
