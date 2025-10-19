import prisma from "$lib/prisma";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  try {
    const deportes = await prisma.deporte.findMany({
      include: {
        torneo: {
          include: {
            organizador: true,
          },
        },
        equipos: true,
        podios: true,
      },
      orderBy: {
        nombre: "asc",
      },
    });

    return {
      deportes,
    };
  } catch (error) {
    console.error("Error cargando deportes:", error);
    return {
      deportes: [],
    };
  }
};
