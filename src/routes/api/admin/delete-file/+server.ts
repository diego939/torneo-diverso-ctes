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
    const urlToDelete = fileUrl;

    if (!urlToDelete) {
      return json(
        { error: "URL de archivo requerida para eliminar desde Vercel Blob" },
        { status: 400 }
      );
    }

    // Eliminar el archivo de Vercel Blob
    await deleteFromBlob(urlToDelete);

    return json({
      success: true,
      message: "Archivo eliminado correctamente",
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    return json({ error: "Error al eliminar archivo" }, { status: 500 });
  }
};
