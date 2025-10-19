import prisma from "$lib/prisma";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  try {
    // Obtener todos los sponsors
    const sponsors = await prisma.sponsor.findMany({
      orderBy: {
        nombre: "asc",
      },
    });

    return {
      sponsors: sponsors.map((sponsor) => ({
        id: sponsor.id,
        nombre: sponsor.nombre,
        urlImage: sponsor.urlImage,
        redesNombre: sponsor.redesNombre,
        redesUrl: sponsor.redesUrl,
      })),
    };
  } catch (error) {
    console.error("Error al cargar sponsors:", error);
    return {
      sponsors: [],
    };
  }
};

