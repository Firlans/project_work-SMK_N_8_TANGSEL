import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_CHAT_SECRET_KEY;

export function encryptMessage(message) {
  return CryptoJS.AES.encrypt(message, SECRET_KEY).toString();
}

export const decryptMessage = (ciphertext) => {
  try {
    if (
      !ciphertext ||
      typeof ciphertext !== "string" ||
      ciphertext.length < 20
    ) {
      return "[UNREADABLE]";
    }
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || "[UNREADABLE]";
  } catch (e) {
    console.error("❌ Gagal dekripsi:", e);
    return "[ERROR]";
  }
};
