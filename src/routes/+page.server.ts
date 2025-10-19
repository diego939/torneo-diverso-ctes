import prisma from "$lib/prisma";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  try {
    // Obtener el torneo con sus relaciones
    const torneo = await prisma.torneo.findFirst({
      include: {
        organizador: true,
        banners: true,
      },
    });

    if (!torneo) {
      return {
        torneoInfo: null,
        banners: [],
        organizador: null,
      };
    }

    // Formatear los datos para que coincidan con la estructura esperada
    return {
      torneoInfo: {
        id: torneo.id,
        nombre: torneo.nombre,
        descripcion: torneo.descripcion,
        imagenPrincipal: torneo.imagenPrincipal,
        fundamentacionTitulo: torneo.fundamentacionTitulo,
        fundamentacionTexto: torneo.fundamentacionTexto as string[],
      },
      banners: torneo.banners.map((banner) => ({
        id: banner.id,
        encabezado: banner.encabezado,
        urlImagenes: banner.urlImagenes as string[],
        textoPie: banner.textoPie,
        urlLocation: banner.urlLocation,
      })),
      organizador: {
        id: torneo.organizador.id,
        nombre: torneo.organizador.nombre,
        mails: torneo.organizador.mails as string[],
        celularWhatsapp: torneo.organizador.celularWhatsapp,
        cbu: torneo.organizador.cbu,
        alias: torneo.organizador.alias,
        nombreRedes: torneo.organizador.nombreRedes,
        redesUrl: torneo.organizador.redesUrl,
      },
    };
  } catch (error) {
    console.error("Error al cargar datos del torneo:", error);
    return {
      torneoInfo: null,
      banners: [],
      organizador: null,
    };
  }
};

