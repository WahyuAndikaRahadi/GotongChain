import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// Tipe untuk props komponen MessageAlert
interface MessageAlertProps {
  message: { type: string; text: string } | null;
}

export const MessageAlert: React.FC<MessageAlertProps> = ({ message }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`mt-4 px-4 py-3 rounded-lg text-center font-medium ${
            message.type === "success" ? "bg-green-600 bg-opacity-80" : "bg-red-600 bg-opacity-80"
          } text-white`}
        >
          {message.text}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
