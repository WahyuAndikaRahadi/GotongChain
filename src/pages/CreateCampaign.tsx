import React, { useState } from "react";
import { useActiveAccount } from "thirdweb/react"; // Hook untuk mendapatkan akun aktif
import { useNavigate } from "react-router-dom"; // Hook untuk navigasi programatik
import { MessageAlert } from "../components/ui/MessageAlert"; // Komponen untuk menampilkan pesan
import { useCampaignContext } from "../context/CampaignContext"; // Import hook konteks kampanye
import { motion } from "framer-motion";

export const CreateCampaign: React.FC = () => {
  const account = useActiveAccount(); // Mendapatkan akun dompet yang terhubung
  const navigate = useNavigate(); // Inisialisasi hook useNavigate
  // Mengambil fungsi createCampaign dan status isTransactionPending dari CampaignContext
  const { createCampaign, isTransactionPending } = useCampaignContext();

  // State untuk menyimpan data form input
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    target: "",
    deadline: "",
    image: "",
  });
  // State untuk menyimpan pesan sukses atau error
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

  /**
   * @dev Mengelola perubahan nilai input pada form.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * @dev Mengelola pengiriman form untuk membuat kampanye baru.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null); // Reset pesan sebelumnya

    // Validasi apakah dompet terhubung
    if (!account) {
      setMessage({ type: "error", text: "Silakan hubungkan dompet Anda terlebih dahulu." });
      return;
    }

    // Validasi semua bidang form harus diisi
    if (!formData.title || !formData.description || !formData.target || !formData.deadline || !formData.image) {
      setMessage({ type: "error", text: "Semua bidang harus diisi." });
      return;
    }
    // Validasi target donasi harus lebih besar dari 0
    if (Number(formData.target) <= 0) {
      setMessage({ type: "error", text: "Target donasi harus lebih besar dari 0." });
      return;
    }
    // Validasi batas waktu harus tanggal yang valid di masa depan
    const deadlineDate = new Date(formData.deadline);
    if (isNaN(deadlineDate.getTime()) || deadlineDate.getTime() < Date.now()) {
        setMessage({ type: "error", text: "Batas waktu harus tanggal yang valid di masa depan." });
        return;
    }

    // Memanggil fungsi createCampaign dari CampaignContext
    const result = await createCampaign(
      formData.title,
      formData.description,
      formData.target,
      formData.deadline,
      formData.image
    );

    if (result.success) {
      setMessage({ type: "success", text: result.message + " Mengarahkan ke daftar kampanye..." });
      // Mereset form setelah kampanye berhasil dibuat
      setFormData({
        title: "", description: "", target: "", deadline: "", image: "",
      });
      // Navigasi ke halaman kampanye setelah 2 detik
      setTimeout(() => navigate("/campaigns"), 2000);
    } else {
      setMessage({ type: "error", text: result.message });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} // Animasi awal
      animate={{ opacity: 1, y: 0 }}  // Animasi saat muncul
      transition={{ duration: 0.5, delay: 0.3 }} // Penundaan animasi
      className="w-full max-w-2xl mx-auto p-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700"
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-500">
        Buat Kampanye GotongChain Baru
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-gray-300 mb-1 font-medium">Judul Kampanye</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400 text-white"
            placeholder="Judul menarik untuk kampanye Anda"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-gray-300 mb-1 font-medium">Deskripsi</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400 text-white"
            placeholder="Jelaskan tujuan dan dampak kampanye Anda"
          ></textarea>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="target" className="block text-gray-300 mb-1 font-medium">Target (ETH)</label>
            <input
              type="number"
              id="target"
              name="target"
              value={formData.target}
              onChange={handleChange}
              step="any"
              min="0.000001" // Minimum target yang sangat kecil untuk menghindari nilai 0
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400 text-white"
              placeholder="0.5"
            />
          </div>
          <div>
            <label htmlFor="deadline" className="block text-gray-300 mb-1 font-medium">Batas Waktu</label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]} // Batas waktu minimum adalah hari ini
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-white"
            />
          </div>
        </div>
        <div>
          <label htmlFor="image" className="block text-gray-300 mb-1 font-medium">URL Gambar</label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400 text-white"
            placeholder="https://example.com/gambar-kampanye.jpg"
          />
        </div>
        <motion.button
          type="submit"
          disabled={isTransactionPending || !account} // Tombol dinonaktifkan saat transaksi sedang berjalan atau dompet tidak terhubung
          className="w-full py-3 mt-4 bg-gradient-to-r from-pink-500 to-red-600 rounded-lg font-bold text-lg transition-transform duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          whileHover={{ scale: 1.05 }} // Efek hover
          whileTap={{ scale: 0.95 }} // Efek tap
        >
          {/* Logika Teks Tombol: Cek koneksi dompet terlebih dahulu */}
          {
            !account
              ? "Hubungkan Dompet untuk Melanjutkan" // Jika dompet tidak terhubung
              : isTransactionPending 
              ? "Memproses..." // Jika transaksi sedang berjalan
              : "Buat Kampanye" // Status default
          }
        </motion.button>
        <MessageAlert message={message} /> {/* Menampilkan pesan sukses/error */}
      </form>
    </motion.div>
  );
};