import crypto from "crypto";

const getEncryptionKey = () => {
  const value = process.env.TWO_FACTOR_ENCRYPTION_KEY;

  if (!value || !/^[a-fA-F0-9]{64}$/.test(value)) {
    throw new Error(
      "TWO_FACTOR_ENCRYPTION_KEY must be a 64-character hex string"
    );
  }

  return Buffer.from(value, "hex");
};

export const encryptTwoFactorSecret = (plainText) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    getEncryptionKey(),
    iv
  );

  const encrypted = Buffer.concat([
    cipher.update(plainText, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return [
    iv.toString("base64"),
    authTag.toString("base64"),
    encrypted.toString("base64"),
  ].join(".");
};

export const decryptTwoFactorSecret = (storedValue) => {
  const [ivBase64, tagBase64, encryptedBase64] =
    String(storedValue || "").split(".");

  if (!ivBase64 || !tagBase64 || !encryptedBase64) {
    throw new Error("Invalid encrypted 2FA secret");
  }

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    getEncryptionKey(),
    Buffer.from(ivBase64, "base64")
  );

  decipher.setAuthTag(
    Buffer.from(tagBase64, "base64")
  );

  const decrypted = Buffer.concat([
    decipher.update(
      Buffer.from(encryptedBase64, "base64")
    ),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
};
