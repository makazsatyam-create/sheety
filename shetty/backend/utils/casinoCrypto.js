import crypto from "crypto";

// 🔒 Casino API Secret Key
const AES_KEY = process.env.CASINO_API_SECRET;

// 🔧 Create proper 32-byte key for AES-256
function createKey(keyString) {
  const keyBuffer = Buffer.from(keyString, "utf8");
  if (keyBuffer.length >= 32) {
    return keyBuffer.slice(0, 32);
  } else {
    // Pad with zeros if key is too short
    const paddedKey = Buffer.alloc(32);
    keyBuffer.copy(paddedKey);
    return paddedKey;
  }
}

// 🔧 Match PHP openssl_encrypt with OPENSSL_RAW_DATA + base64_encode
export function encrypt(payload) {
  try {
    const text =
      typeof payload === "string" ? payload : JSON.stringify(payload);
    console.log("🔒 Encrypting text:", text);

    const key = createKey(AES_KEY);
    console.log("🔒 Key length:", key.length);

    // Create cipher with AES-256-ECB (like PHP)
    const cipher = crypto.createCipheriv("aes-256-ecb", key, null);

    let encrypted = cipher.update(text, "utf8", "base64");
    encrypted += cipher.final("base64");

    console.log("🔒 Encrypted result:", encrypted);
    return encrypted;
  } catch (error) {
    console.error("🔒 Encryption error:", error);
    throw error;
  }
}

export function decrypt(cipherText) {
  try {
    console.log("🔓 Decrypting:", cipherText);

    const key = createKey(AES_KEY);
    console.log("🔓 Key length:", key.length);

    // Create decipher with AES-256-ECB (like PHP)
    const decipher = crypto.createDecipheriv("aes-256-ecb", key, null);

    let decrypted = decipher.update(cipherText, "base64", "utf8");
    decrypted += decipher.final("utf8");

    console.log("🔓 Decrypted text:", decrypted);

    if (!decrypted) {
      throw new Error("Decryption resulted in empty string");
    }

    return JSON.parse(decrypted);
  } catch (error) {
    console.error("🔓 Decryption error:", error);
    throw new Error(
      "Payload decryption failed or invalid JSON: " + error.message,
    );
  }
}
