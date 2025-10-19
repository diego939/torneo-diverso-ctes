import prisma from "$lib/prisma";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async () => {
  try {
    // Verificar si existe al menos un usuario admin
    const usuarioAdmin = await prisma.usuario.findFirst();

    return {
      hasAdmin: !!usuarioAdmin,
    };
  } catch (error) {
    console.error("Error al verificar admin:", error);
    return {
      hasAdmin: false,
    };
  }
};
