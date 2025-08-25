import React from "react";

// Tipe untuk props komponen LoadingSpinner
interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Memuat..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-teal-500 mb-4"></div>
      <p className="text-gray-300 text-lg font-medium">{message}</p>
    </div>
  );
};
