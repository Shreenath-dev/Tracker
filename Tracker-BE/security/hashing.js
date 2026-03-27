import crypto from "crypto";
import config from "@/config";

export const encryptionString = (data) => {
    const iv = crypto.randomBytes(16);
    const cipher =crypto.createCipheriv("aes-256-cbc", Buffer.from(config.HASHING_SECRET), iv);
    let encrypted = cipher.update(data,"utf-8","hex");
    encrypted += cipher.final("hex");
    return `${ iv.toString("hex") }:${ encrypted }`;
}

export const decryptionString = (data) => {
    const [iv, encrypted] = data.split(":");
    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(config.HASHING_SECRET), Buffer.from(iv, "hex"));
    let decrypted = decipher.update(encrypted, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
}