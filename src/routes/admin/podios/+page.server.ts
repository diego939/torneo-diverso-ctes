import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/prisma";

export const load: PageServerLoad = async () => {
  try {
    const podios = await prisma.podio.findMany({
      include: {
        deporte: true,
      },
      orderBy: [{ deporteId: "asc" }, { puesto: "asc" }],
    });

    const deportes = await prisma.deporte.findMany({
      include: {
        equipos: {
          orderBy: {
            nombre: "asc",
          },
        },
      },
      orderBy: {
        nombre: "asc",
      },
    });

    return {
      podios,
      deportes,
    };
  } catch (error) {
    console.error("Error loading podios:", error);
    return {
      podios: [],
      deportes: [],
    };
  }
};
