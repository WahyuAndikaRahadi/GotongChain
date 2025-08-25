import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useReadContract, useActiveAccount, useSendTransaction } from "thirdweb/react";
import { contract } from "../api/thirdweb";
import { Campaign, Donator } from "../utils/helpers";
import { toWei, toEther, prepareContractCall } from "thirdweb";

// =========================================================================
// DEFINISI TIPE KONTEKS
// =========================================================================

interface CampaignContextType {
  campaigns: Campaign[] | undefined;
  isCampaignsPending: boolean;
  refetchAllCampaigns: () => Promise<any>;
  createCampaign: (
    title: string,
    description: string,
    target: string,
    deadline: string,
    image: string
  ) => Promise<{ success: boolean; message: string }>;
  donateToCampaign: (
    campaignId: number,
    amount: string
  ) => Promise<{ success: boolean; message: string }>;
  isTransactionPending: boolean; // State untuk loading transaksi
}

// Buat konteks dengan nilai default
const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

// =========================================================================
// PROVIDER KONTEKS KAMPANYE
// =========================================================================

export const CampaignProvider = ({ children }: { children: ReactNode }) => {
  const account = useActiveAccount(); // Hook untuk mendapatkan akun aktif
  const { mutate: sendTransaction, isPending: isTxPending } = useSendTransaction(); // Hook untuk mengirim transaksi

  // Membaca semua kampanye dari kontrak
  const {
    data: allCampaignsData,
    isPending: isCampaignsPending,
    refetch: refetchAllCampaigns,
  } = useReadContract({
    contract,
    method:
      "function getCampaigns() view returns ((address owner, string title, string description, uint256 target, uint256 deadline, uint256 amountCollected, string image, address[] donators, uint256[] donations)[])",
    params: [],
  });

  // Efek samping untuk memuat ulang kampanye saat komponen dimuat atau akun berubah
  useEffect(() => {
    // Panggil refetch saat komponen CampaignProvider pertama kali dimuat
    // atau ketika akun aktif berubah, untuk memastikan data terbaru.
    refetchAllCampaigns();
    console.log("CampaignContext: Initiating refetchAllCampaigns on mount or account change.");
  }, [account, refetchAllCampaigns]); // Tambahkan `account` sebagai dependensi

  // Memproses data kampanye agar sesuai dengan tipe Campaign
  const campaigns: Campaign[] | undefined = React.useMemo(() => {
    console.log("CampaignContext: allCampaignsData raw:", allCampaignsData); // Log data mentah
    
    // Jika allCampaignsData adalah null/undefined atau bukan array, kembalikan array kosong
    if (!allCampaignsData || !Array.isArray(allCampaignsData)) {
      console.log("CampaignContext: allCampaignsData is null/undefined or not an array. Returning empty array.");
      return []; // Mengembalikan array kosong untuk mencegah error rendering
    }

    // Ubah pemrosesan untuk menangani `campaignObject` (bukan `campaignArray`)
    const processedCampaigns = (allCampaignsData as any[]).map((campaignObject: any, index: number) => {
        // Memastikan setiap properti memiliki nilai default yang aman jika null/undefined
        const owner = (campaignObject.owner as string | undefined) ?? "";
        const title = (campaignObject.title as string | undefined) ?? "";
        const description = (campaignObject.description as string | undefined) ?? "";
        const target = (campaignObject.target as bigint | undefined) ?? BigInt(0);
        const deadline = (campaignObject.deadline as bigint | undefined) ?? BigInt(0);
        const amountCollected = (campaignObject.amountCollected as bigint | undefined) ?? BigInt(0);
        const image = (campaignObject.image as string | undefined) ?? "https://placehold.co/600x400/2f3a4b/ffffff?text=Image+Not+Found"; // Default image fallback
        const donators = (campaignObject.donators as string[] | undefined) ?? [];
        const donations = (campaignObject.donations as bigint[] | undefined) ?? [];

        return {
          owner,
          title,
          description,
          target,
          deadline,
          amountCollected,
          image,
          donators,
          donations,
        };
    });
    console.log("CampaignContext: processedCampaigns:", processedCampaigns); // Log data yang sudah diproses
    return processedCampaigns;
  }, [allCampaignsData]);

  // =========================================================================
  // FUNGSI AKSI KONTRAK
  // =========================================================================

  /**
   * @dev Fungsi untuk membuat kampanye baru melalui smart contract.
   */
  const createCampaign = async (
    title: string,
    description: string,
    target: string,
    deadline: string,
    image: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!account) {
      return { success: false, message: "Silakan hubungkan dompet Anda terlebih dahulu." };
    }

    try {
      const deadlineInSeconds = Math.floor(new Date(deadline).getTime() / 1000);
      const transaction = prepareContractCall({
        contract,
        method:
          "function createCampaign(address _owner, string _title, string _description, uint256 _target, uint256 _deadline, string _image) returns (uint256)",
        params: [
          account.address,
          title,
          description,
          toWei(target),
          BigInt(deadlineInSeconds),
          image,
        ],
      });
      await sendTransaction(transaction);
      await refetchAllCampaigns(); // Memuat ulang data kampanye setelah berhasil membuat
      return { success: true, message: "Kampanye berhasil dibuat!" };
    } catch (error: any) {
      console.error("Gagal membuat kampanye:", error);
      let errorMessage = "Gagal membuat kampanye. Coba lagi.";
      if (error.message && error.message.includes("User denied transaction")) {
        errorMessage = "Transaksi ditolak oleh pengguna.";
      } else if (error.message && error.message.includes("insufficient funds")) {
        errorMessage = "Dana tidak mencukupi untuk biaya gas transaksi.";
      }
      return { success: false, message: errorMessage };
    }
  };

  /**
   * @dev Fungsi untuk melakukan donasi ke kampanye tertentu.
   */
  const donateToCampaign = async (
    campaignId: number,
    amount: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!account) {
      return { success: false, message: "Silakan hubungkan dompet Anda terlebih dahulu." };
    }

    try {
      const transaction = prepareContractCall({
        contract,
        method: "function donateToCampaign(uint256 _id) payable",
        params: [BigInt(campaignId)],
        value: toWei(amount),
      });
      await sendTransaction(transaction);
      await refetchAllCampaigns(); // Memuat ulang data kampanye setelah berhasil donasi
      return { success: true, message: "Donasi berhasil! Terima kasih atas dukungan Anda." };
    } catch (error: any) {
      console.error("Gagal melakukan donasi:", error);
      let errorMessage = "Gagal melakukan donasi. Coba lagi.";
      if (error.message && error.message.includes("User denied transaction")) {
        errorMessage = "Transaksi ditolak oleh pengguna.";
      } else if (error.message && error.message.includes("insufficient funds")) {
        errorMessage = "Dana tidak mencukupi untuk donasi.";
      }
      return { success: false, message: errorMessage };
    }
  };

  // =========================================================================
  // NILAI KONTEKS
  // =========================================================================

  const contextValue: CampaignContextType = {
    campaigns,
    isCampaignsPending,
    refetchAllCampaigns,
    createCampaign,
    donateToCampaign,
    isTransactionPending: isTxPending,
  };

  return (
    <CampaignContext.Provider value={contextValue}>
      {children}
    </CampaignContext.Provider>
  );
};

// =========================================================================
// HOOK KUSTOM UNTUK MENGGUNAKAN KONTEKS KAMPANYE
// =========================================================================

export const useCampaignContext = () => {
  const context = useContext(CampaignContext);
  if (context === undefined) {
    throw new Error("useCampaignContext must be used within a CampaignProvider");
  }
  return context;
};
