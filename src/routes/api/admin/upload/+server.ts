import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import {
  uploadToBlob,
  validateFileSize,
  listBlobFiles,
  deleteFromBlob,
} from "$lib/blob";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string;
    const deporteId = formData.get("deporteId") as string;

    if (!file || !type) {
      return json({ error: "Faltan parámetros requeridos" }, { status: 400 });
    }

    // Caso especial para fondo-sitio
    if (type === "fondo-sitio") {
      // Validar que sea una imagen
      if (!file.type.startsWith("image/")) {
        return json(
          { error: "Solo se permiten archivos de imagen" },
          { status: 400 }
        );
      }

      // Validar tamaño del archivo (5MB)
      const maxSize = 5 * 1024 * 1024;
      if (!validateFileSize(file, maxSize)) {
        return json(
          { error: "El archivo es demasiado grande (máx. 5MB)" },
          { status: 400 }
        );
      }

      // Obtener extensión del archivo
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      const allowedImageExts = ["jpg", "jpeg", "png"];

      if (!allowedImageExts.includes(ext)) {
        return json(
          { error: "Solo se permiten archivos JPG, JPEG o PNG" },
          { status: 400 }
        );
      }

      // Nombre fijo: fondo-sitio con la extensión original
      const filename = `fondo-sitio.${ext}`;
      const blobPath = `images/${filename}`;

      // Eliminar archivos anteriores de fondo-sitio si existen
      try {
        const existingFiles = await listBlobFiles("images/fondo-sitio");
        for (const oldFile of existingFiles) {
          await deleteFromBlob(oldFile.url);
        }
      } catch (error) {
        // Si no hay archivos anteriores, continuar sin error
        console.log("No se encontraron archivos anteriores de fondo-sitio");
      }

      // Subir a Vercel Blob
      const url = await uploadToBlob(file, blobPath);

      return json({
        success: true,
        url: url,
        filename: filename,
      });
    }

    // Lógica para archivos de deportes
    if (!deporteId) {
      return json(
        { error: "deporteId es requerido para archivos de deportes" },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    const allowedTypes = {
      planilla: ["xlsx", "xls", "pdf"],
      reglamento: ["pdf"],
      fixture: ["pdf", "xlsx", "xls"],
    };

    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    if (!allowedTypes[type as keyof typeof allowedTypes]?.includes(ext)) {
      return json(
        { error: `Tipo de archivo no permitido para ${type}` },
        { status: 400 }
      );
    }

    // Validar tamaño del archivo (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (!validateFileSize(file, maxSize)) {
      return json(
        { error: "El archivo es demasiado grande (máx. 10MB)" },
        { status: 400 }
      );
    }

    const filename = `${deporteId}.${ext}`;

    // Determinar ruta de destino en Blob
    let blobPath = "";
    switch (type) {
      case "planilla":
        blobPath = `planillas/${filename}`;
        break;
      case "reglamento":
        blobPath = `reglamentos/${filename}`;
        break;
      case "fixture":
        blobPath = `fixtures/${filename}`;
        break;
      default:
        return json({ error: "Tipo de archivo no válido" }, { status: 400 });
    }

    // Subir a Vercel Blob
    const url = await uploadToBlob(file, blobPath);

    return json({
      success: true,
      url: url,
      filename: filename,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return json({ error: "Error al subir archivo" }, { status: 500 });
  }
};
