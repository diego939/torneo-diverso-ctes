import prisma from "$lib/prisma";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  try {
    // Obtener el organizador actual
    const organizador = await prisma.organizador.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      organizador,
    };
  } catch (error) {
    console.error("Error cargando datos del organizador:", error);
    return {
      organizador: null,
    };
  }
};
