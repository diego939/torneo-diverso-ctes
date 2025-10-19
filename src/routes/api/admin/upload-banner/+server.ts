import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import fs from "fs";
import path from "path";
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
    if (!allowedTypes.includes(file.type)) {
      return json({ error: "Tipo de archivo no permitido" }, { status: 400 });
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return json(
        { error: "El archivo es demasiado grande (máximo 5MB)" },
        { status: 400 }
      );
    }

    // Generar nombre único para el archivo
    const fileExtension = path.extname(file.name);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(process.cwd(), "static", "banners", fileName);

    // Asegurar que el directorio existe
    const bannersDir = path.join(process.cwd(), "static", "banners");
    if (!fs.existsSync(bannersDir)) {
      fs.mkdirSync(bannersDir, { recursive: true });
    }

    // Guardar el archivo
    const arrayBuffer = await file.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(arrayBuffer));

    // Retornar la URL del archivo
    const fileUrl = `/banners/${fileName}`;

    return json({
      success: true,
      url: fileUrl,
      fileName: fileName,
    });
  } catch (error) {
    console.error("Error subiendo archivo:", error);
    return json({ error: "Error interno del servidor" }, { status: 500 });
  }
};
