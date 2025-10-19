import prisma from "$lib/prisma";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  try {
    const deporteId = parseInt(params.id);

    if (isNaN(deporteId)) {
      throw error(400, "ID de deporte inválido");
    }

    const deporte = await prisma.deporte.findUnique({
      where: {
        id: deporteId,
      },
      include: {
        torneo: {
          include: {
            organizador: true,
          },
        },
        equipos: {
          orderBy: [
            { local: "desc" }, // Locales primero
            { nombre: "asc" }, // Luego por nombre
          ],
        },
      },
    });

    if (!deporte) {
      throw error(404, "Deporte no encontrado");
    }

    // Convertir JSON fields de vuelta a objetos/arrays
    return {
      deporte: {
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
        equipos: deporte.equipos,
      },
      organizador: {
        id: deporte.torneo.organizador.id,
        nombre: deporte.torneo.organizador.nombre,
        mails: deporte.torneo.organizador.mails as string[],
        celularWhatsapp: deporte.torneo.organizador.celularWhatsapp,
        cbu: deporte.torneo.organizador.cbu,
        alias: deporte.torneo.organizador.alias,
        nombreRedes: deporte.torneo.organizador.nombreRedes,
        redesUrl: deporte.torneo.organizador.redesUrl,
      },
    };
  } catch (e) {
    if (e instanceof Error && "status" in e) {
      throw e;
    }
    console.error("Error al cargar deporte:", e);
    throw error(500, "Error al cargar el deporte");
  }
};
