import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { ThirdwebProvider } from "thirdweb/react";
import "./index.css";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import { CampaignProvider } from "./context/CampaignContext"; 

// Dapatkan elemen root dari DOM
const rootElement = document.getElementById("root");

// Pastikan elemen root ada sebelum membuat root React
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      {/* Menggunakan BrowserRouter untuk routing */}
      <BrowserRouter>
        {/* ThirdwebProvider membungkus seluruh aplikasi untuk fungsionalitas Thirdweb */}
        <ThirdwebProvider>
          {/* CampaignProvider membungkus komponen yang membutuhkan akses ke konteks kampanye */}
          <CampaignProvider>
            <App />
          </CampaignProvider>
        </ThirdwebProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
} else {
  console.error("Elemen 'root' tidak ditemukan di dokumen.");
}
