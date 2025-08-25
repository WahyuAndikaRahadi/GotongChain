import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; // Import Chart.js

// Mock data and context for a self-contained example
const mockCampaigns = [
  { donators: ['0x1', '0x2', '0x3'] },
  { donators: ['0x4', '0x2', '0x5'] },
  { donators: ['0x6', '0x7', '0x1'] },
];

const useCampaignContext = () => ({
  campaigns: mockCampaigns,
  isCampaignsPending: false,
});

export function Home() {
  const { campaigns, isCampaignsPending } = useCampaignContext();
  // Properly type the refs to avoid TypeScript errors
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

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

  // Effect to render or update the chart
  useEffect(() => {
    if (chartRef.current && !isCampaignsPending) {
      if (chartInstance.current) {
        // Destroy the old chart instance if it exists
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
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
              borderRadius: 8, // Add border radius to bars
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  color: '#cbd5e0',
                },
                grid: {
                  color: '#4a5568',
                }
              },
              x: {
                ticks: {
                  color: '#cbd5e0',
                },
                grid: {
                  color: '#4a5568',
                }
              }
            },
            plugins: {
              legend: {
                display: false,
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
    }

    // Cleanup function when the component unmounts
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [totalCampaigns, totalUniqueDonators, isCampaignsPending]);

  return (
    <div className="text-gray-100 font-inter w-full">
      {/* Hero Section */}
      <section
        className="flex flex-col items-center justify-center text-center p-6 md:p-12 w-full"
      >
        <div className="max-w-4xl mx-auto py-16 px-4 w-full">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-teal-500 to-blue-600">
            GotongChain
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            GotongChain adalah platform crowdfunding terdesentralisasi yang menghadirkan semangat gotong royong ke era digital. Melalui transparansi blockchain, kami memberdayakan komunitas untuk bersama-sama mewujudkan ide-ide inovatif dan proyek sosial yang memberi dampak nyata bagi masyarakat
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 w-full">
            <a href="/campaigns">
              <button
                className="px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold text-xl rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
              >
                Lihat Kampanye Aktif
              </button>
            </a>
            <a href="/create">
              <button
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-xl rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
              >
                Mulai Kampanye Anda
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Statistik GotongChain Section (Chart.js) */}
      <section
        className="py-16 px-6 md:px-12 bg-gray-900/50 rounded-xl mx-auto max-w-7xl mt-8 w-full"
      >
        <div className="max-w-6xl mx-auto text-center w-full">
          <h2 className="text-4xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600">Statistik GotongChain</h2>
          {isCampaignsPending ? (
            <p className="text-gray-400">Memuat statistik...</p>
          ) : (
            <div className="bg-gray-800/70 p-8 rounded-xl shadow-lg border border-gray-700 h-96 flex justify-center items-center w-full">
              <canvas ref={chartRef}></canvas>
            </div>
          )}
        </div>
      </section>

      {/* Apa itu GotongChain? Section */}
      <section
        className="py-16 px-6 md:px-12 bg-gray-900/50 rounded-xl mx-auto max-w-7xl mt-8 w-full"
      >
        <div className="max-w-6xl mx-auto text-center w-full">
          <h2 className="text-4xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Apa itu GotongChain?</h2>
          <div className="grid md:grid-cols-3 gap-10 w-full">
            <div className="bg-gray-800/70 p-8 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center">
              <span className="text-teal-400 mb-4 text-4xl">🚀</span>
              <h3 className="text-2xl font-semibold mb-3">Inovasi Terdesentralisasi</h3>
              <p className="text-gray-300 text-center">
                Mendorong ide-ide baru dengan kekuatan blockchain, memastikan transparansi dan keadilan.
              </p>
            </div>
            <div className="bg-gray-800/70 p-8 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center">
              <span className="text-green-400 mb-4 text-4xl">👥</span>
              <h3 className="text-2xl font-semibold mb-3">Digerakkan oleh Komunitas</h3>
              <p className="text-gray-300 text-center">
                Setiap proyek didukung oleh komunitas, membangun kepercayaan dan kolaborasi yang kuat.
              </p>
            </div>
            <div className="bg-gray-800/70 p-8 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center">
              <span className="text-blue-400 mb-4 text-4xl">🛡️</span>
              <h3 className="text-2xl font-semibold mb-3">Keamanan Transparan</h3>
              <p className="text-gray-300 text-center">
                Transaksi tercatat di blockchain, memastikan setiap kontribusi aman dan dapat diverifikasi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bagaimana Cara Kerjanya? Section */}
      <section
        className="py-16 px-6 md:px-12 bg-gray-900/50 rounded-xl mx-auto max-w-7xl mt-8 w-full"
      >
        <div className="max-w-6xl mx-auto text-center w-full">
          <h2 className="text-4xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-600">Bagaimana Cara Kerjanya?</h2>
          <div className="grid md:grid-cols-3 gap-10 w-full">
            <div className="bg-gray-800/70 p-8 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center">
              <span className="text-yellow-400 mb-4 text-4xl">✍️</span>
              <h3 className="text-2xl font-semibold mb-3">1. Buat Kampanye</h3>
              <p className="text-gray-300 text-center">
                Ajukan ide atau proyek Anda, tetapkan target pendanaan, dan jelaskan visi Anda kepada komunitas.
              </p>
            </div>
            <div className="bg-gray-800/70 p-8 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center">
              <span className="text-orange-400 mb-4 text-4xl">💰</span>
              <h3 className="text-2xl font-semibold mb-3">2. Danai Proyek</h3>
              <p className="text-gray-300 text-center">
                Dukung kampanye favorit Anda dengan aset kripto, melihat dampak kontribusi Anda secara langsung.
              </p>
            </div>
            <div className="bg-gray-800/70 p-8 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center">
              <span className="text-lime-400 mb-4 text-4xl">📈</span>
              <h3 className="text-2xl font-semibold mb-3">3. Wujudkan Ide</h3>
              <p className="text-gray-300 text-center">
                Setelah target tercapai, dana dilepaskan dan proyek Anda siap untuk diwujudkan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mengapa Memilih GotongChain? Section */}
      <section
        className="py-16 px-6 md:px-12 bg-gray-900/50 rounded-xl mx-auto max-w-7xl mt-8 w-full"
      >
        <div className="max-w-6xl mx-auto text-center w-full">
          <h2 className="text-4xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-green-600">Mengapa Memilih GotongChain?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
            <div className="bg-gray-800/70 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center">
              <span className="text-cyan-400 mb-3 text-3xl">👁️</span>
              <h3 className="text-xl font-semibold mb-2">Transparansi Penuh</h3>
              <p className="text-gray-300 text-center text-sm">
                Semua transaksi terekam di blockchain dan dapat dilihat oleh publik.
              </p>
            </div>
            <div className="bg-gray-800/70 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center">
              <span className="text-emerald-400 mb-3 text-3xl">🔒</span>
              <h3 className="text-xl font-semibold mb-2">Keamanan Terjamin</h3>
              <p className="text-gray-300 text-center text-sm">
                Teknologi blockchain memberikan keamanan data dan dana yang superior.
              </p>
            </div>
            <div className="bg-gray-800/70 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center">
              <span className="text-lime-400 mb-3 text-3xl">🌐</span>
              <h3 className="text-xl font-semibold mb-2">Pemberdayaan Komunitas</h3>
              <p className="text-gray-300 text-center text-sm">
                Memberikan kekuatan kepada individu untuk mendanai dan mendukung proyek.
              </p>
            </div>
            <div className="bg-gray-800/70 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center">
              <span className="text-rose-400 mb-3 text-3xl">💸</span>
              <h3 className="text-xl font-semibold mb-2">Biaya Rendah</h3>
              <p className="text-gray-300 text-center text-sm">
                Mengurangi biaya transaksi dengan menghilangkan perantara.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Siap untuk Bergabung? Section */}
      <section
        className="py-16 px-6 md:px-12 bg-gray-900/50 rounded-xl mx-auto max-w-7xl mt-8 w-full"
      >
        <div className="max-w-4xl mx-auto w-full">
          <h2 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">Siap untuk Mengubah Dunia?</h2>
          <p className="text-xl text-gray-300 mb-10">
            Bergabunglah dengan GotongChain dan jadilah bagian dari revolusi crowdfunding terdesentralisasi.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 w-full">
            <a href="/campaigns">
              <button
                className="px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold text-xl rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
              >
                Jelajahi Kampanye
              </button>
            </a>
            <a href="/create">
              <button
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-xl rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
              >
                Mulai Proyek Impian Anda
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900/50 text-center text-gray-400 border-t border-gray-800 mx-auto max-w-7xl mt-8 rounded-xl px-6 md:px-12 w-full">
        <p>&copy; {new Date().getFullYear()} GotongChain. All rights reserved.</p>
      </footer>
    </div>
  );
};

