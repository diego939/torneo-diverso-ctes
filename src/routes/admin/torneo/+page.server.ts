import prisma from "$lib/prisma";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  try {
    // Obtener el torneo actual con su organizador
    const torneo = await prisma.torneo.findFirst({
      include: {
        organizador: true,
        banners: true,
        deportes: {
          include: {
            equipos: true,
            podios: true,
          },
        },
      },
    });

    // Obtener todos los organizadores disponibles
    const organizadores = await prisma.organizador.findMany({
      orderBy: {
        nombre: "asc",
      },
    });

    return {
      torneo,
      organizadores,
    };
  } catch (error) {
    console.error("Error cargando datos del torneo:", error);
    return {
      torneo: null,
      organizadores: [],
    };
  }
};
