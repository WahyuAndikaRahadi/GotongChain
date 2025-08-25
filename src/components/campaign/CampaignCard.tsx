import React, { useMemo } from "react";
import { Link } from "react-router-dom"; // Import Link
import { Campaign } from "../../utils/helpers";
import { toEther } from "thirdweb";
import { getRemainingTime } from "../../utils/helpers";
import { motion } from "framer-motion";

// Tipe untuk props komponen CampaignCard
interface CampaignCardProps {
  campaign: Campaign;
  id: number;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, id }) => {
  // Menghitung persentase progres kampanye
  const progress = useMemo(() => {
    // Pastikan campaign.amountCollected dan campaign.target adalah BigInt sebelum dikonversi
    const collected = toEther(campaign.amountCollected ?? BigInt(0)); // Default ke BigInt(0) jika undefined
    const target = toEther(campaign.target ?? BigInt(0));           // Default ke BigInt(0) jika undefined
    if (Number(target) === 0) return 0;
    return Math.min(100, (Number(collected) / Number(target)) * 100);
  }, [campaign.amountCollected, campaign.target]);

  // Menghitung sisa waktu kampanye
  const remainingTime = useMemo(() => {
    // Pastikan campaign.deadline adalah BigInt sebelum digunakan
    return getRemainingTime(campaign.deadline ?? BigInt(0)); // Default ke BigInt(0) jika undefined
  }, [campaign.deadline]);

  return (
    // Menggunakan Link untuk navigasi ke halaman detail
    <Link to={`/campaigns/${id}`}>
      <motion.div
        className="bg-gray-800 rounded-xl overflow-hidden shadow-xl transform transition-transform duration-300 hover:scale-105 cursor-pointer border border-gray-700"
        whileHover={{ scale: 1.03, boxShadow: "0 15px 30px rgba(0,0,0,0.4)" }}
        whileTap={{ scale: 0.98 }}
      >
        <img
          src={campaign.image}
          alt={campaign.title}
          className="w-full h-48 object-cover"
          // Fallback gambar jika URL tidak valid
          onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400/2f3a4b/ffffff?text=Image+Not+Found'; }}
        />
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 truncate text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-400">{campaign.title}</h3>
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{campaign.description}</p>
          <div className="flex justify-between text-gray-400 text-sm mb-4">
            <span>Target: <span className="font-semibold text-teal-300">{toEther(campaign.target ?? BigInt(0))} ETH</span></span>
            <span>Terkumpul: <span className="font-semibold text-blue-300">{toEther(campaign.amountCollected ?? BigInt(0))} ETH</span></span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
            <div
              className="bg-gradient-to-r from-teal-500 to-blue-500 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-gray-300">Sisa Waktu:</span>
            <span className="text-yellow-400">{remainingTime}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
