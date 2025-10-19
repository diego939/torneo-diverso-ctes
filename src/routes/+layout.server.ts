import prisma from "$lib/prisma";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async () => {
  try {
    // Obtener el organizador
    const organizador = await prisma.organizador.findFirst();

    const config = await prisma.config.findFirst();

    if (!organizador) {
      return {
        organizador: null,
      };
    }
    if (!config) {
      return {
        config: null,
      };
    }
    return {
      organizador: {
        id: organizador.id,
        nombre: organizador.nombre,
        mails: organizador.mails as string[],
        celularWhatsapp: organizador.celularWhatsapp,
        cbu: organizador.cbu,
        alias: organizador.alias,
        nombreRedes: organizador.nombreRedes,
        redesUrl: organizador.redesUrl,
      },
      config: {
        id: config.id,
        anio: config.anio,
        descripcion: config.descripcion,
      },
    };
  } catch (error) {
    console.error("Error al cargar organizador:", error);
    return {
      organizador: null,
    };
  }
};
