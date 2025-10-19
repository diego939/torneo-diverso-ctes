import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/prisma";

export const load: PageServerLoad = async () => {
  try {
    const equipos = await prisma.equipo.findMany({
      include: {
        deporte: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const deportes = await prisma.deporte.findMany({
      orderBy: {
        nombre: "asc",
      },
    });

    return {
      equipos,
      deportes,
    };
  } catch (error) {
    console.error("Error loading equipos:", error);
    return {
      equipos: [],
      deportes: [],
    };
  }
};
