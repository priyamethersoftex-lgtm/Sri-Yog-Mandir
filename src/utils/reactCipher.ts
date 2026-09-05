import CryptoJS from "crypto-js";

declare const process: any;

const getEnvVar = (key: string): string => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      return import.meta.env[key] as string;
    }
  } catch (e) {}
  
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key] as string;
    }
  } catch (e) {}

  return "";
};

const SECRET_KEY = getEnvVar("VITE_ENCRYPTED_SECRET_KEY");

export class ReactCipher {
  static encrypt(data: string | number | null | undefined): string | null {
    if (!data) return null;
    if (!SECRET_KEY) {
      console.warn("ReactCipher: VITE_ENCRYPTED_SECRET_KEY is missing");
      return null;
    }
    return CryptoJS.AES.encrypt(String(data), SECRET_KEY).toString();
  }

  static decrypt(cipher: string | null | undefined): string | null {
    if (!cipher) return null;
    if (!SECRET_KEY) {
      console.warn("ReactCipher: VITE_ENCRYPTED_SECRET_KEY is missing");
      return null;
    }
    try {
      const bytes = CryptoJS.AES.decrypt(cipher, SECRET_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch {
      return null;
    }
  }
}