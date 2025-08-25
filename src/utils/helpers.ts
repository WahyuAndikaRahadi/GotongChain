// Definisi Tipe untuk data kampanye dari smart contract
export type Campaign = {
  owner: string;
  title: string;
  description: string;
  target: bigint;
  deadline: bigint;
  amountCollected: bigint;
  image: string;
  donators: string[];
  donations: bigint[];
};

// Tipe untuk data donatur
export type Donator = {
  address: string;
  amount: string;
};

/**
 * @dev Fungsi untuk menampilkan batas waktu dalam format hari, jam, dan menit yang lebih rinci.
 * @param deadline Waktu batas kampanye dalam detik Unix (sebagai bigint).
 * @returns String yang menunjukkan sisa waktu atau "Sudah selesai".
 */
export const getRemainingTime = (deadline: bigint): string => {
  const deadlineNumber = Number(deadline); // Konversi bigint ke number untuk perhitungan Date.now()
  const remainingSeconds = deadlineNumber - Math.floor(Date.now() / 1000);
  if (remainingSeconds <= 0) {
    return "Sudah selesai";
  }

  const days = Math.floor(remainingSeconds / (60 * 60 * 24));
  const hours = Math.floor((remainingSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((remainingSeconds % (60 * 60)) / 60);

  let timeString = "";
  if (days > 0) {
    timeString += `${days} hari `;
  }
  if (hours > 0) {
    timeString += `${hours} jam `;
  }
  if (minutes > 0) {
    timeString += `${minutes} menit`;
  }

  return timeString.trim() || "Kurang dari 1 menit";
};
