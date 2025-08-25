import { createThirdwebClient, getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";

// Konfigurasi Klien Thirdweb dengan ID klien Anda
// Ganti dengan CLIENT_ID Thirdweb Anda
export const client = createThirdwebClient({
  clientId: import.meta.env.VITE_CLIENT_ID,
});

// Konfigurasi Kontrak GotongChain yang sudah di-deploy di Sepolia
// Ganti dengan alamat kontrak Sepolia Anda
export const contract = getContract({
  client,
  chain: sepolia,
  address: import.meta.env.VITE_ADDRESS_CONTRACT,
});
