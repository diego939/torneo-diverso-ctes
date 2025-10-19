import prisma from "$lib/prisma";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  try {
    // Obtener todos los deportes
    const deportes = await prisma.deporte.findMany({
      orderBy: {
        nombre: "asc",
      },
    });

    // Convertir JSON fields de vuelta a objetos/arrays
    const deportesFormateados = deportes.map((deporte) => ({
      id: deporte.id,
      nombre: deporte.nombre,
      planilla: deporte.planilla,
      reglamento: deporte.reglamento,
      fixture: deporte.fixture,
      fechasCompetencia: deporte.fechasCompetencia as string[],
      horarios: deporte.horarios as string[],
      locationsNombre: deporte.locationsNombre as string[],
      locationsUrl: deporte.locationsUrl as string[],
      grupoUrlWhatsapp: deporte.grupoUrlWhatsapp,
      redesSociales: deporte.redesSociales as any,
    }));

    return {
      deportes: deportesFormateados,
    };
  } catch (error) {
    console.error("Error al cargar deportes:", error);
    return {
      deportes: [],
    };
  }
};
