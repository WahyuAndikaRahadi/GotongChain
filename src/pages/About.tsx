import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Blocks, Globe, Zap } from 'lucide-react'; // Mengimpor ikon baru

export const About: React.FC = () => {
  const sectionVariants: any = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
  };

  const featureVariants: any = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
      // Menambahkan px-4 di mobile
      className="text-gray-100 font-inter w-full max-w-4xl mx-auto px-4"
    >
      <div className="bg-gray-900/50 rounded-xl shadow-2xl p-8 sm:p-12 border border-gray-800">
        {/* Header */}
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-8 text-center leading-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">
          Tentang GotongChain
        </h2>
        
        {/* Narasi Utama */}
        <p className="text-gray-300 mb-8 leading-relaxed text-lg text-center">
          <b>GotongChain</b> adalah platform <b>crowdfunding terdesentralisasi</b> yang lahir dari semangat <b>gotong royong</b> Indonesia, diwujudkan melalui kekuatan teknologi <b>blockchain</b>. Kami menghilangkan perantara, memastikan setiap kontribusi langsung menuju dampak yang nyata.
        </p>
        
        <div className="bg-gray-800/70 p-6 rounded-xl border border-gray-700 mb-10">
          <p className="text-gray-300 leading-relaxed text-md text-center">
            Dengan memanfaatkan <b>Smart Contract</b> di jaringan <b>Ethereum Sepolia Testnet</b>, kami menjamin <b>transparansi penuh</b> dan <b>keamanan superior</b>. Dana dikelola secara otomatis oleh kode, bukan oleh lembaga, sehingga setiap rupiah (atau kripto) yang didonasikan dapat dilacak dan diverifikasi publik.
          </p>
        </div>

        {/* Fitur Utama */}
        <h3 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-yellow-500">
          Pilar GotongChain
        </h3>

        {/* Perbaikan Grid: grid-cols-1 di mobile, md:grid-cols-3 di tablet/desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Pilar 1: Blockchain */}
          <motion.div className="bg-gray-800/70 p-6 rounded-xl shadow-lg border border-teal-600 flex flex-col items-center text-center" variants={featureVariants}>
            <Blocks className="text-teal-400 mb-3" size={40} />
            <h4 className="text-xl font-semibold mb-2 text-teal-300">Desentralisasi Penuh</h4>
            <p className="text-gray-400 text-sm">
              Tidak ada otoritas pusat. Proyek dan dana dikendalikan langsung oleh smart contract.
            </p>
          </motion.div>

          {/* Pilar 2: Transparansi */}
          <motion.div className="bg-gray-800/70 p-6 rounded-xl shadow-lg border border-cyan-600 flex flex-col items-center text-center" variants={featureVariants}>
            <Globe className="text-cyan-400 mb-3" size={40} />
            <h4 className="text-xl font-semibold mb-2 text-cyan-300">Transparansi Global</h4>
            <p className="text-gray-400 text-sm">
              Semua aliran dana dan status kampanye terbuka dan tercatat di publik ledger.
            </p>
          </motion.div>

          {/* Pilar 3: Efisiensi */}
          <motion.div className="bg-gray-800/70 p-6 rounded-xl shadow-lg border border-lime-600 flex flex-col items-center text-center" variants={featureVariants}>
            <Zap className="text-lime-400 mb-3" size={40} />
            <h4 className="text-xl font-semibold mb-2 text-lime-300">Akses Cepat & Langsung</h4>
            <p className="text-gray-400 text-sm">
              Biaya rendah dan pemrosesan instan memastikan dana cepat sampai ke penerima.
            </p>
          </motion.div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-xl text-gray-200 mb-6 font-semibold">
            Bergabunglah dalam revolusi pendanaan gotong royong ini.
          </p>
          <Link to="/create">
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-xl rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.95 }}
              variants={featureVariants}
            >
              Mulai Proyek Impian Anda Sekarang!
            </motion.button>
          </Link>
        </div>

      </div>
    </motion.div>
  );
};