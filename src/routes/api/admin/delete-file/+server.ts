import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import fs from "fs";
import path from "path";

export const DELETE: RequestHandler = async ({ request }) => {
  try {
    const { filePath } = await request.json();

    if (!filePath) {
      return json({ error: "Ruta de archivo requerida" }, { status: 400 });
    }

    // Construir ruta completa del archivo
    const fullPath = path.join("static", filePath);

    // Verificar si el archivo existe
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return json({
        success: true,
        message: "Archivo eliminado correctamente",
      });
    } else {
      return json({ error: "Archivo no encontrado" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    return json({ error: "Error al eliminar archivo" }, { status: 500 });
  }
};
