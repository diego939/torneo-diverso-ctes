import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { unlink } from "fs/promises";
import { join } from "path";

export const DELETE: RequestHandler = async ({ request }) => {
  try {
    const { filePath } = await request.json();

    if (!filePath) {
      return json(
        { error: "No se proporcionó la ruta del archivo" },
        { status: 400 }
      );
    }

    // Proteger el logo por defecto - nunca eliminar
    if (
      filePath === "/equipos/sin-logo.jpg" ||
      filePath.includes("sin-logo.jpg")
    ) {
      return json(
        { error: "No se puede eliminar el logo por defecto" },
        { status: 400 }
      );
    }

    // Extraer el nombre del archivo de la URL
    const fileName = filePath.split("/").pop();
    const fullPath = join(process.cwd(), "static", "equipos", fileName);

    // Eliminar el archivo
    await unlink(fullPath);

    return json({ message: "Imagen eliminada exitosamente" });
  } catch (error) {
    console.error("Error deleting equipo image:", error);
    return json({ error: "Error al eliminar la imagen" }, { status: 500 });
  }
};
