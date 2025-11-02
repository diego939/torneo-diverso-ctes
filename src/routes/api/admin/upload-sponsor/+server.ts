import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import {
  uploadToBlob,
  validateFileType,
  validateFileSize,
  getFileExtension,
  generateUniqueFileName,
} from "$lib/blob";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return json({ error: "No se recibió ningún archivo" }, { status: 400 });
    }

    // Validar tipo de archivo
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/svg+xml",
      "image/webp",
    ];
    if (!validateFileType(file, allowedTypes)) {
      return json(
        {
          error:
            "Tipo de archivo no permitido. Solo se permiten: JPG, JPEG, PNG, SVG, WEBP",
        },
        { status: 400 }
      );
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (!validateFileSize(file, maxSize)) {
      return json(
        { error: "El archivo es demasiado grande. Máximo 5MB" },
        { status: 400 }
      );
    }

    // Generar nombre único para el archivo
    const extension = getFileExtension(file.name) || "jpg";
    const fileName = generateUniqueFileName("sponsor", extension);
    const blobPath = `sponsors/${fileName}`;

    // Subir a Vercel Blob
    const url = await uploadToBlob(file, blobPath);

    return json({ url });
  } catch (error) {
    console.error("Error uploading sponsor image:", error);
    return json({ error: "Error al subir la imagen" }, { status: 500 });
  }
};
