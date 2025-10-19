import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

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
    if (!allowedTypes.includes(file.type)) {
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
    if (file.size > maxSize) {
      return json(
        { error: "El archivo es demasiado grande. Máximo 5MB" },
        { status: 400 }
      );
    }

    // Crear directorio luego de static si no existe
    const uploadDir = join(process.cwd(), "static", "equipos");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const extension = file.name.split(".").pop() || "jpg";
    const fileName = `equipo-${timestamp}.${extension}`;
    const filePath = join(uploadDir, fileName);

    // Convertir File a Buffer y guardar
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(filePath, buffer);

    // Retornar URL relativa
    const url = `/equipos/${fileName}`;

    return json({ url });
  } catch (error) {
    console.error("Error uploading equipo image:", error);
    return json({ error: "Error al subir la imagen" }, { status: 500 });
  }
};

