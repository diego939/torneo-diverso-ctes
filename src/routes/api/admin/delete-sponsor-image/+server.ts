import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { deleteFromBlob } from "$lib/blob";

export const DELETE: RequestHandler = async ({ request }) => {
  try {
    const { filePath, fileUrl } = await request.json();

    if (!filePath && !fileUrl) {
      return json(
        { error: "No se proporcionó la ruta o URL del archivo" },
        { status: 400 }
      );
    }

    // Si se proporciona fileUrl (URL completa de Vercel Blob), usarla directamente
    // Si solo se proporciona filePath (compatibilidad con archivos antiguos),
    // no se puede eliminar porque los archivos antiguos están en static/
    const urlToDelete = fileUrl;

    if (!urlToDelete) {
      return json(
        { error: "URL de archivo requerida para eliminar desde Vercel Blob" },
        { status: 400 }
      );
    }

    // Eliminar el archivo de Vercel Blob
    await deleteFromBlob(urlToDelete);

    return json({ message: "Imagen eliminada exitosamente" });
  } catch (error) {
    console.error("Error deleting sponsor image:", error);
    return json({ error: "Error al eliminar la imagen" }, { status: 500 });
  }
};
