import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const deleteUploadFile = (filePath) => {
  if (!filePath || !filePath.startsWith("/uploads/")) return;

  const absolutePath = path.join(__dirname, "..", filePath.replace(/^\//, ""));

  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }
};

export const deleteProductImage = deleteUploadFile;
