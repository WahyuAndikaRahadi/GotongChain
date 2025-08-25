import React, { useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom"; // Import useParams dan Link dari react-router-dom
import { useActiveAccount, useReadContract } from "thirdweb/react"; // Hook untuk mendapatkan akun aktif dan membaca kontrak
import { toEther } from "thirdweb"; // Utilitas untuk konversi nilai ETH
import { contract } from "../api/thirdweb"; // Kontrak Thirdweb
import { getRemainingTime, Campaign, Donator } from "../utils/helpers"; // Fungsi helper dan definisi tipe
import { LoadingSpinner } from "../components/common/LoadingSpinner"; // Komponen spinner loading
import { MessageAlert } from "../components/ui/MessageAlert"; // Komponen untuk menampilkan pesan
import { DonatorList } from "../components/campaign/DonatorList"; // Komponen daftar donatur
import { useCampaignContext } from "../context/CampaignContext"; // Import hook konteks kampanye
import { motion } from "framer-motion";

export const CampaignDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Mengambil ID kampanye dari URL parameter
  const campaignId = Number(id); // Konversi ID string ke angka
  const account = useActiveAccount(); // Mendapatkan akun dompet aktif
  // Mengambil fungsi donateToCampaign, status isTransactionPending, dan refetchAllCampaigns dari CampaignContext
  const { donateToCampaign, isTransactionPending, refetchAllCampaigns } = useCampaignContext();

  // State untuk menyimpan jumlah donasi yang akan dimasukkan pengguna
  const [donateAmount, setDonateAmount] = useState<string>("");
  // State untuk menyimpan pesan status (sukses/error)
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

  // Mengambil detail kampanye tunggal berdasarkan campaignId menggunakan useReadContract
  // Data ini akan di-refetch secara manual setelah donasi berhasil
  const { data: campaignData, isPending: isCampaignPending, refetch: refetchSingleCampaign } = useReadContract({
    contract,
    method: "function campaigns(uint256) view returns (address owner, string title, string description, uint256 target, uint256 deadline, uint256 amountCollected, string image)",
    params: [BigInt(campaignId)], // campaignId dikirim sebagai BigInt
  });

  // Mengambil daftar donatur untuk kampanye ini
  const { data: donatorsRawData, isPending: isDonatorsPending, refetch: refetchDonators } = useReadContract({
    contract,
    method: "function getDonators(uint256 _id) view returns (address[], uint256[])",
    params: [BigInt(campaignId)], // campaignId dikirim sebagai BigInt
  });

  // Memproses data kampanye mentah menjadi tipe Campaign yang terstruktur
  const typedCampaign: Campaign | undefined = useMemo(() => {
    if (!campaignData) return undefined;
    // Memastikan setiap elemen array dikonversi ke tipe yang benar
    return {
      owner: campaignData[0] as string,
      title: campaignData[1] as string,
      description: campaignData[2] as string,
      target: campaignData[3] as bigint,
      deadline: campaignData[4] as bigint,
      amountCollected: campaignData[5] as bigint,
      image: campaignData[6] as string,
      donators: [], // Ini akan diisi dari donatorsRawData
      donations: [], // Ini akan diisi dari donatorsRawData
    };
  }, [campaignData]);


  // Memproses data donatur mentah menjadi array Donator yang terstruktur
  const donators: Donator[] = useMemo(() => {
    if (!donatorsRawData || !Array.isArray(donatorsRawData) || donatorsRawData.length !== 2) return [];
    // donatorsRawData[0] adalah array alamat, donatorsRawData[1] adalah array jumlah donasi (BigInt)
    const [addresses, amounts] = donatorsRawData as [string[], bigint[]];
    return addresses.map((addr: string, index: number) => ({
      address: addr,
      amount: toEther(amounts[index] ?? BigInt(0)), // Pastikan amounts[index] ada, gunakan BigInt(0) sebagai fallback
    }));
  }, [donatorsRawData]);

  // Menghitung persentase progres kampanye
  const progress = useMemo(() => {
    if (!typedCampaign) return 0;
    const collected = toEther(typedCampaign.amountCollected ?? BigInt(0));
    const target = toEther(typedCampaign.target ?? BigInt(0));
    if (Number(target) === 0) return 0; // Menghindari pembagian dengan nol
    return Math.min(100, (Number(collected) / Number(target)) * 100);
  }, [typedCampaign]);

  // Menghitung sisa waktu kampanye
  const remainingTime = useMemo(() => {
    if (!typedCampaign) return "Memuat...";
    return getRemainingTime(typedCampaign.deadline ?? BigInt(0));
  }, [typedCampaign]);


  /**
   * @dev Mengelola proses donasi ke kampanye.
   */
  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null); // Reset pesan sebelumnya

    // Validasi apakah dompet terhubung
    if (!account) {
      setMessage({ type: "error", text: "Silakan hubungkan dompet Anda terlebih dahulu." });
      return;
    }
    // Validasi jumlah donasi harus lebih besar dari 0
    if (Number(donateAmount) <= 0) {
        setMessage({ type: "error", text: "Jumlah donasi harus lebih besar dari 0." });
        return;
    }

    const result = await donateToCampaign(campaignId, donateAmount);

    if (result.success) {
      setMessage({ type: "success", text: result.message });
      setDonateAmount(""); // Mereset input jumlah donasi
      // Memuat ulang detail kampanye dan daftar donatur setelah donasi berhasil
      refetchSingleCampaign(); // Refetch data kampanye tunggal
      refetchDonators(); // Refetch daftar donatur
      refetchAllCampaigns(); // Refetch semua kampanye di konteks global
    } else {
      setMessage({ type: "error", text: result.message });
    }
  };

  // Menampilkan spinner loading saat detail kampanye sedang dimuat
  if (isCampaignPending) {
    return <LoadingSpinner message="Memuat detail kampanye..." />;
  }

  // Menampilkan pesan jika kampanye tidak ditemukan setelah loading selesai
  if (!typedCampaign) {
    return (
      <p className="text-center text-red-400 text-lg">
        Kampanye tidak ditemukan. Kembali ke{" "}
        {/* Menggunakan Link untuk navigasi kembali ke halaman daftar kampanye */}
        <Link to="/campaigns" className="text-teal-400 cursor-pointer hover:underline">
          Daftar Kampanye
        </Link>
        .
      </p>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} // Animasi awal
      animate={{ opacity: 1, y: 0 }}  // Animasi saat muncul
      transition={{ duration: 0.5, delay: 0.4 }} // Penundaan animasi
      className="bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-10 border border-gray-700"
    >
      {/* Tombol kembali ke daftar kampanye */}
      <Link to="/campaigns"
        className="text-teal-400 mb-6 flex items-center space-x-2 transition-colors duration-200 hover:text-teal-300 font-medium"
      >
        <motion.div whileHover={{ x: -5 }}> {/* Animasi ikon bergerak ke kiri saat hover */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </motion.div>
        <span>Kembali ke Kampanye</span>
      </Link>

      <div className="flex flex-col md:flex-row md:space-x-10">
        <div className="md:w-1/2">
          <img
            src={typedCampaign.image}
            alt={typedCampaign.title}
            className="w-full h-80 object-cover rounded-xl shadow-lg border border-gray-700"
            onError={(e) => { e.currentTarget.src = 'https://placehold.co/800x600/2f3a4b/ffffff?text=Image+Not+Found'; }} // Fallback gambar
          />
        </div>
        <div className="md:w-1/2 mt-6 md:mt-0">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 mb-4">
            {typedCampaign.title}
          </h1>
          <p className="text-gray-300 mb-6 leading-relaxed text-lg">{typedCampaign.description}</p>
          <div className="grid grid-cols-2 gap-4 mb-6 text-gray-400">
            <div>
              <p className="font-semibold text-gray-200">Pemilik</p>
              <p className="text-sm truncate bg-gray-700 p-2 rounded-md">{typedCampaign.owner}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-200">Sisa Waktu</p>
              <p className="text-sm text-yellow-400 bg-gray-700 p-2 rounded-md">{remainingTime}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-200">Target</p>
              <p className="text-sm bg-gray-700 p-2 rounded-md">{toEther(typedCampaign.target ?? BigInt(0))} ETH</p>
            </div>
            <div>
              <p className="font-semibold text-gray-200">Terkumpul</p>
              <p className="text-sm bg-gray-700 p-2 rounded-md">{toEther(typedCampaign.amountCollected ?? BigInt(0))} ETH</p>
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 mb-6">
            <div
              className="bg-gradient-to-r from-green-500 to-cyan-500 h-3 rounded-full shadow-inner"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <form onSubmit={handleDonate} className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <input
              type="number"
              value={donateAmount}
              onChange={(e) => setDonateAmount(e.target.value)}
              step="any"
              min="0.000001" // Minimum donasi yang sangat kecil
              required
              placeholder="Jumlah Donasi (ETH)"
              className="flex-grow px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 text-white text-lg"
            />
            <motion.button
              type="submit"
              disabled={isTransactionPending || !account || donateAmount === ""} // Tombol dinonaktifkan saat transaksi sedang berjalan, dompet tidak terhubung, atau jumlah kosong
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-cyan-600 rounded-lg font-bold text-lg transition-transform duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              whileHover={{ scale: 1.05 }} // Efek hover
              whileTap={{ scale: 0.95 }} // Efek tap
            >
              {isTransactionPending ? "Mengirim..." : "Donasi Sekarang"} {/* Teks tombol berubah saat loading */}
            </motion.button>
          </form>
          <MessageAlert message={message} /> {/* Menampilkan pesan sukses/error */}
        </div>
      </div>

      <DonatorList donators={donators} isPending={isDonatorsPending} /> {/* Menampilkan daftar donatur */}
    </motion.div>
  );
};
