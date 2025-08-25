import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Rocket, Users, Shield, Edit, Wallet, TrendingUp, Eye, Lock, Network, BadgeDollarSign
} from 'lucide-react';
import Chart from 'chart.js/auto'; // Mengimpor Chart.js
import { useCampaignContext } from '../context/CampaignContext'; // Mengimpor konteks kampanye Anda tanpa ekstensi .tsx

export const Home = () => {
  const { campaigns, isCampaignsPending } = useCampaignContext();
  const chartRef = useRef(null); // Ref untuk elemen canvas chart
  const chartInstance = useRef(null); // Ref untuk instance chart.js

  const sectionVariants: any = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
  };

  const totalCampaigns = campaigns ? campaigns.length : 0;
  const totalUniqueDonators = React.useMemo(() => {
    if (!campaigns) return 0;
    const donatorAddresses = new Set<string>();
    campaigns.forEach(campaign => {
      campaign.donators.forEach(donator => {
        donatorAddresses.add(donator);
      });
    });
    return donatorAddresses.size;
  }, [campaigns]);

  // Efek untuk merender atau memperbarui chart
  useEffect(() => {
    if (chartRef.current && !isCampaignsPending) {
      if (chartInstance.current) {
        // Hancurkan instance chart yang lama jika ada
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Total Kampanye', 'Donatur Unik'],
          datasets: [{
            label: 'Jumlah',
            data: [totalCampaigns, totalUniqueDonators],
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)', // Tailwind blue-500
              'rgba(16, 185, 129, 0.8)', // Tailwind emerald-500
            ],
            borderColor: [
              'rgba(59, 130, 246, 1)',
              'rgba(16, 185, 129, 1)',
            ],
            borderWidth: 1,
            borderRadius: 8, // Menambahkan border radius pada bar
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, // Penting untuk responsivitas
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: '#cbd5e0', // Warna teks Y-axis
              },
              grid: {
                color: '#4a5568', // Warna grid Y-axis
              }
            },
            x: {
              ticks: {
                color: '#cbd5e0', // Warna teks X-axis
              },
              grid: {
                color: '#4a5568', // Warna grid X-axis
              }
            }
          },
          plugins: {
            legend: {
              display: false, // Tidak perlu legend karena label sudah jelas
            },
            tooltip: {
              backgroundColor: '#2d3748',
              borderColor: '#4a5568',
              borderWidth: 1,
              titleColor: '#edf2f7',
              bodyColor: '#cbd5e0',
              cornerRadius: 8,
            }
          }
        }
      });
    }

    // Fungsi cleanup saat komponen di-unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [totalCampaigns, totalUniqueDonators, isCampaignsPending]); // Dependensi untuk memperbarui chart

  return (
    <div className="text-gray-100 font-inter w-full"> {/* Pastikan mengambil lebar penuh */}
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="flex flex-col items-center justify-center text-center p-6 md:p-12 w-full"
      >
        <div className="max-w-4xl mx-auto py-16 px-4 w-full">
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-teal-500 to-blue-600"
            variants={itemVariants}
          >
           GotongChain
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl text-gray-300 mb-10 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            GotongChain adalah platform crowdfunding terdesentralisasi yang menghadirkan semangat gotong royong ke era digital. Melalui transparansi blockchain, kami memberdayakan komunitas untuk bersama-sama mewujudkan ide-ide inovatif dan proyek sosial yang memberi dampak nyata bagi masyarakat
          </motion.p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 w-full">
            <Link to="/campaigns">
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold text-xl rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.3)" }}
                whileTap={{ scale: 0.95 }}
                variants={itemVariants}
              >
                Lihat Kampanye Aktif
              </motion.button>
            </Link>
            <Link to="/create">
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-xl rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.3)" }}
                whileTap={{ scale: 0.95 }}
                variants={itemVariants}
              >
                Mulai Kampanye Anda
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Statistik GotongChain Section (Chart.js) */}
      <motion.section
        className="py-16 px-6 md:px-12 bg-gray-900/50 rounded-xl mx-auto max-w-7xl mt-8 w-full"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="max-w-6xl mx-auto text-center w-full">
          <h2 className="text-4xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600">Statistik GotongChain</h2>
          {isCampaignsPending ? (
            <p className="text-gray-400">Memuat statistik...</p>
          ) : (
            <div className="bg-gray-800/70 p-8 rounded-xl shadow-lg border border-gray-700 h-96 flex justify-center items-center w-full">
              <canvas ref={chartRef}></canvas> {/* Elemen canvas untuk Chart.js */}
            </div>
          )}
        </div>
      </motion.section>

      {/* Apa itu GotongChain? Section */}
      <motion.section
        className="py-16 px-6 md:px-12 bg-gray-900/50 rounded-xl mx-auto max-w-7xl mt-8 w-full"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="max-w-6xl mx-auto text-center w-full">
          <h2 className="text-4xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Apa itu GotongChain?</h2>
          <div className="grid md:grid-cols-3 gap-10 w-full">
            <motion.div className="bg-gray-800/70 p-8 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center" variants={itemVariants}>
              <Rocket className="text-teal-400 mb-4" size={48} />
              <h3 className="text-2xl font-semibold mb-3">Inovasi Terdesentralisasi</h3>
              <p className="text-gray-300 text-center">
                Mendorong ide-ide baru dengan kekuatan blockchain, memastikan transparansi dan keadilan.
              </p>
            </motion.div>
            <motion.div className="bg-gray-800/70 p-8 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center" variants={itemVariants}>
              <Users className="text-green-400 mb-4" size={48} />
              <h3 className="text-2xl font-semibold mb-3">Digerakkan oleh Komunitas</h3>
              <p className="text-gray-300 text-center">
                Setiap proyek didukung oleh komunitas, membangun kepercayaan dan kolaborasi yang kuat.
              </p>
            </motion.div>
            <motion.div className="bg-gray-800/70 p-8 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center" variants={itemVariants}>
              <Shield className="text-blue-400 mb-4" size={48} />
              <h3 className="text-2xl font-semibold mb-3">Keamanan Transparan</h3>
              <p className="text-gray-300 text-center">
                Transaksi tercatat di blockchain, memastikan setiap kontribusi aman dan dapat diverifikasi.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Bagaimana Cara Kerjanya? Section */}
      <motion.section
        className="py-16 px-6 md:px-12 bg-gray-900/50 rounded-xl mx-auto max-w-7xl mt-8 w-full"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="max-w-6xl mx-auto text-center w-full">
          <h2 className="text-4xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-600">Bagaimana Cara Kerjanya?</h2>
          <div className="grid md:grid-cols-3 gap-10 w-full">
            <motion.div className="bg-gray-800/70 p-8 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center" variants={itemVariants}>
              <Edit className="text-yellow-400 mb-4" size={48} />
              <h3 className="text-2xl font-semibold mb-3">1. Buat Kampanye</h3>
              <p className="text-gray-300 text-center">
                Ajukan ide atau proyek Anda, tetapkan target pendanaan, dan jelaskan visi Anda kepada komunitas.
              </p>
            </motion.div>
            <motion.div className="bg-gray-800/70 p-8 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center" variants={itemVariants}>
              <Wallet className="text-orange-400 mb-4" size={48} />
              <h3 className="text-2xl font-semibold mb-3">2. Danai Proyek</h3>
              <p className="text-gray-300 text-center">
                Dukung kampanye favorit Anda dengan aset kripto, melihat dampak kontribusi Anda secara langsung.
              </p>
            </motion.div>
            <motion.div className="bg-gray-800/70 p-8 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center" variants={itemVariants}>
              <TrendingUp className="text-lime-400 mb-4" size={48} />
              <h3 className="text-2xl font-semibold mb-3">3. Wujudkan Ide</h3>
              <p className="text-gray-300 text-center">
                Setelah target tercapai, dana dilepaskan dan proyek Anda siap untuk diwujudkan.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Mengapa Memilih GotongChain? Section */}
      <motion.section
        className="py-16 px-6 md:px-12 bg-gray-900/50 rounded-xl mx-auto max-w-7xl mt-8 w-full"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="max-w-6xl mx-auto text-center w-full">
          <h2 className="text-4xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-green-600">Mengapa Memilih GotongChain?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
            <motion.div className="bg-gray-800/70 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center" variants={itemVariants}>
              <Eye className="text-cyan-400 mb-3" size={40} />
              <h3 className="text-xl font-semibold mb-2">Transparansi Penuh</h3>
              <p className="text-gray-300 text-center text-sm">
                Semua transaksi terekam di blockchain dan dapat dilihat oleh publik.
              </p>
            </motion.div>
            <motion.div className="bg-gray-800/70 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center" variants={itemVariants}>
              <Lock className="text-emerald-400 mb-3" size={40} />
              <h3 className="text-xl font-semibold mb-2">Keamanan Terjamin</h3>
              <p className="text-gray-300 text-center text-sm">
                Teknologi blockchain memberikan keamanan data dan dana yang superior.
              </p>
            </motion.div>
            <motion.div className="bg-gray-800/70 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center" variants={itemVariants}>
              <Network className="text-lime-400 mb-3" size={40} />
              <h3 className="text-xl font-semibold mb-2">Pemberdayaan Komunitas</h3>
              <p className="text-gray-300 text-center text-sm">
                Memberikan kekuatan kepada individu untuk mendanai dan mendukung proyek.
              </p>
            </motion.div>
            <motion.div className="bg-gray-800/70 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center" variants={itemVariants}>
              <BadgeDollarSign className="text-rose-400 mb-3" size={40} />
              <h3 className="text-xl font-semibold mb-2">Biaya Rendah</h3>
              <p className="text-gray-300 text-center text-sm">
                Mengurangi biaya transaksi dengan menghilangkan perantara.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Siap untuk Bergabung? Section */}
      <motion.section
        className="py-16 px-6 md:px-12 bg-gray-900/50 rounded-xl mx-auto max-w-7xl mt-8 w-full"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="max-w-4xl mx-auto w-full">
          <h2 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">Siap untuk Mengubah Dunia?</h2>
          <p className="text-xl text-gray-300 mb-10">
            Bergabunglah dengan GotongChain dan jadilah bagian dari revolusi crowdfunding terdesentralisasi.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 w-full">
            <Link to="/campaigns">
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold text-xl rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.3)" }}
                whileTap={{ scale: 0.95 }}
                variants={itemVariants}
              >
                Jelajahi Kampanye
              </motion.button>
            </Link>
            <Link to="/create">
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-xl rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.3)" }}
                whileTap={{ scale: 0.95 }}
                variants={itemVariants}
              >
                Mulai Proyek Impian Anda
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900/50 text-center text-gray-400 border-t border-gray-800 mx-auto max-w-7xl mt-8 rounded-xl px-6 md:px-12 w-full">
        <p>&copy; {new Date().getFullYear()} GotongChain. All rights reserved.</p>
      </footer>
    </div>
  );
};
