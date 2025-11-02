import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { uploadToBlob, validateFileType, validateFileSize } from "$lib/blob";
import { v4 as uuidv4 } from "uuid";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return json(
        { error: "No se proporcionó ningún archivo" },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validateFileType(file, allowedTypes)) {
      return json({ error: "Tipo de archivo no permitido" }, { status: 400 });
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (!validateFileSize(file, maxSize)) {
      return json(
        { error: "El archivo es demasiado grande (máximo 5MB)" },
        { status: 400 }
      );
    }

    // Generar nombre único para el archivo con UUID
    const fileExtension = file.name.split(".").pop() || "";
    const fileName = `${uuidv4()}.${fileExtension}`;
    const blobPath = `banners/${fileName}`;

    // Subir a Vercel Blob
    const url = await uploadToBlob(file, blobPath);

    return json({
      success: true,
      url: url,
      fileName: fileName,
    });
  } catch (error) {
    console.error("Error subiendo archivo:", error);
    return json({ error: "Error interno del servidor" }, { status: 500 });
  }
};
