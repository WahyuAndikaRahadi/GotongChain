import React from "react";
import { Donator } from "../../utils/helpers";
import { motion } from "framer-motion";

// Tipe untuk props komponen DonatorList
interface DonatorListProps {
  donators: Donator[];
  isPending: boolean;
}

export const DonatorList: React.FC<DonatorListProps> = ({ donators, isPending }) => {
  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
        Daftar Donatur
      </h3>
      {isPending ? (
        <p className="text-gray-400 text-lg">Memuat daftar donatur...</p>
      ) : (
        <ul className="space-y-3">
          {donators.length > 0 ? (
            donators.map((donator, index) => (
              <motion.li
                key={index}
                className="bg-gray-700 p-4 rounded-lg flex justify-between items-center shadow-md border border-gray-600"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <span className="text-gray-300 truncate font-mono text-base">{donator.address}</span>
                <span className="text-base font-semibold text-yellow-300">{donator.amount} ETH</span>
              </motion.li>
            ))
          ) : (
            <p className="text-gray-400 text-lg">Belum ada donasi untuk kampanye ini. Jadilah donatur pertama!</p>
          )}
        </ul>
      )}
    </div>
  );
};
