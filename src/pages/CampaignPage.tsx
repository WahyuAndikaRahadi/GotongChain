import React from "react";
import { CampaignCard } from "../components/campaign/CampaignCard";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { useCampaignContext } from "../context/CampaignContext"; // Import hook konteks kampanye
import { motion } from "framer-motion";

export const CampaignsPage: React.FC = () => {
  // Mengambil data kampanye dan status loading dari konteks CampaignContext
  const { campaigns, isCampaignsPending } = useCampaignContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} // Animasi awal
      animate={{ opacity: 1, y: 0 }}  // Animasi saat muncul
      transition={{ duration: 0.5, delay: 0.2 }} // Penundaan animasi
      className="text-center"
    >
      <h1 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-500">
        Kampanye GotongChain
      </h1>
      {isCampaignsPending ? (
        // Menampilkan spinner loading saat data kampanye sedang dimuat
        <LoadingSpinner message="Memuat kampanye yang luar biasa..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Memetakan setiap kampanye ke komponen CampaignCard */}
          {campaigns && campaigns.map((campaign, index) => (
            <CampaignCard key={index} campaign={campaign} id={index} />
          ))}
        </div>
      )}
      {/* Pesan jika tidak ada kampanye dan loading sudah selesai */}
      {!isCampaignsPending && campaigns && campaigns.length === 0 && (
        <p className="text-gray-400 text-lg">Tidak ada kampanye yang tersedia saat ini. Jadilah yang pertama!</p>
      )}
    </motion.div>
  );
};
