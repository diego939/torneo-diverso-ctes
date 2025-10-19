import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import path from "path";
import fs from "fs";

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
      if (file.size > 12 * 3000 * 3000) {
        return json(
          { error: "El archivo es demasiado grande (máx. 5MB)" },
          { status: 400 }
        );
      }

      // Nota: La validación de dimensiones se hace en el frontend
      // para evitar dependencias adicionales en el servidor

      // Obtener extensión del archivo
      const ext = path.extname(file.name).toLowerCase();
      const allowedImageExts = [".jpg", ".jpeg", ".png"];

      if (!allowedImageExts.includes(ext)) {
        return json(
          { error: "Solo se permiten archivos JPG, JPEG o PNG" },
          { status: 400 }
        );
      }

      // Crear buffer del archivo
      const buffer = Buffer.from(await file.arrayBuffer());

      // Nombre fijo: fondo-sitio con la extensión original
      const filename = `fondo-sitio${ext}`;
      const uploadPath = `static/images/${filename}`;

      // Crear directorio si no existe
      const dir = path.dirname(uploadPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Eliminar archivos anteriores de fondo-sitio si existen
      const possibleExtensions = [".png", ".jpg", ".jpeg"];
      for (const oldExt of possibleExtensions) {
        const oldPath = `static/images/fondo-sitio${oldExt}`;
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      // Escribir archivo
      fs.writeFileSync(uploadPath, buffer);

      // Retornar URL del archivo
      const fileUrl = `/images/${filename}`;

      return json({
        success: true,
        url: fileUrl,
        filename: filename,
      });
    }

    // Lógica original para deportes
    if (!deporteId) {
      return json(
        { error: "deporteId es requerido para archivos de deportes" },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    const allowedTypes = {
      planilla: [".xlsx", ".xls", ".pdf"],
      reglamento: [".pdf"],
      fixture: [".pdf", ".xlsx", ".xls"],
    };

    const ext = path.extname(file.name).toLowerCase();
    if (!allowedTypes[type as keyof typeof allowedTypes]?.includes(ext)) {
      return json(
        { error: `Tipo de archivo no permitido para ${type}` },
        { status: 400 }
      );
    }

    // Validar tamaño del archivo (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return json(
        { error: "El archivo es demasiado grande (máx. 10MB)" },
        { status: 400 }
      );
    }

    // Crear buffer del archivo
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${deporteId}${ext}`;

    // Determinar ruta de destino
    let uploadPath = "";
    switch (type) {
      case "planilla":
        uploadPath = `static/planillas/${filename}`;
        break;
      case "reglamento":
        uploadPath = `static/reglamentos/${filename}`;
        break;
      case "fixture":
        uploadPath = `static/fixtures/${filename}`;
        break;
      default:
        return json({ error: "Tipo de archivo no válido" }, { status: 400 });
    }

    // Crear directorio si no existe
    const dir = path.dirname(uploadPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Escribir archivo
    fs.writeFileSync(uploadPath, buffer);

    // Retornar URL del archivo
    const fileUrl = `/${type}s/${filename}`;

    return json({
      success: true,
      url: fileUrl,
      filename: filename,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return json({ error: "Error al subir archivo" }, { status: 500 });
  }
};
