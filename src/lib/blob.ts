import { put, del, list } from "@vercel/blob";
import { BLOB_READ_WRITE_TOKEN } from "$env/static/private";

// Configuración del token para Vercel Blob
const blobConfig = {
  token: BLOB_READ_WRITE_TOKEN,
};

/**
 * Sube un archivo a Vercel Blob Storage
 * @param file - El archivo a subir (File object)
 * @param path - Ruta donde se guardará el archivo en Blob Storage (ej: 'sponsors/sponsor-123.jpg')
 * @param options - Opciones adicionales
 * @returns URL pública del archivo subido
 */
export async function uploadToBlob(
  file: File,
  path: string,
  options?: {
    addRandomSuffix?: boolean;
    cacheControlMaxAge?: number;
  }
): Promise<string> {
  try {
    const blob = await put(path, file, {
      access: "public",
      addRandomSuffix: options?.addRandomSuffix ?? false,
      cacheControlMaxAge: options?.cacheControlMaxAge ?? 31536000, // 1 año por defecto
      ...blobConfig,
    });

    return blob.url;
  } catch (error) {
    console.error("Error uploading to Vercel Blob:", error);
    throw new Error("Error al subir archivo a Vercel Blob");
  }
}

/**
 * Elimina un archivo de Vercel Blob Storage usando su URL
 * @param url - URL completa del archivo a eliminar
 */
export async function deleteFromBlob(url: string): Promise<void> {
  try {
    await del(url, blobConfig);
  } catch (error) {
    console.error("Error deleting from Vercel Blob:", error);
    throw new Error("Error al eliminar archivo de Vercel Blob");
  }
}

/**
 * Lista archivos en Vercel Blob Storage con un prefijo específico
 * @param prefix - Prefijo para filtrar archivos (ej: 'sponsors/')
 */
export async function listBlobFiles(prefix?: string) {
  try {
    const { blobs } = await list({
      prefix: prefix,
      ...blobConfig,
    });
    return blobs;
  } catch (error) {
    console.error("Error listing Vercel Blob files:", error);
    throw new Error("Error al listar archivos de Vercel Blob");
  }
}

/**
 * Valida el tipo de archivo
 * @param file - Archivo a validar
 * @param allowedTypes - Array de tipos MIME permitidos
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * Valida el tamaño del archivo
 * @param file - Archivo a validar
 * @param maxSizeInBytes - Tamaño máximo en bytes
 */
export function validateFileSize(file: File, maxSizeInBytes: number): boolean {
  return file.size <= maxSizeInBytes;
}

/**
 * Genera un nombre de archivo único con timestamp
 * @param prefix - Prefijo para el nombre (ej: 'sponsor', 'banner')
 * @param extension - Extensión del archivo (ej: 'jpg', 'png')
 */
export function generateUniqueFileName(
  prefix: string,
  extension: string
): string {
  const timestamp = Date.now();
  return `${prefix}-${timestamp}.${extension}`;
}

/**
 * Obtiene la extensión de un archivo
 * @param filename - Nombre del archivo
 */
export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || "";
}
