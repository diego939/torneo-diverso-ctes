import { json, error } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import type { RequestHandler } from "./$types";

// GET /api/deportes/[id] - Obtener un deporte específico
export const GET: RequestHandler = async ({ params }) => {
  try {
    const deporte = await prisma.deporte.findUnique({
      where: {
        id: params.id,
      },
      include: {
        torneo: {
          include: {
            organizador: true,
            banners: true,
          },
        },
        equipos: {
          orderBy: {
            nombre: "asc",
          },
        },
        podios: {
          orderBy: {
            puesto: "asc",
          },
        },
      },
    });

    if (!deporte) {
      throw error(404, "Deporte no encontrado");
    }

    // Formatear los campos JSON
    const deporteFormateado = {
      ...deporte,
      fechasCompetencia: deporte.fechasCompetencia as string[],
      horarios: deporte.horarios as string[],
      locationsNombre: deporte.locationsNombre as string[],
      locationsUrl: deporte.locationsUrl as string[],
      redesSociales: deporte.redesSociales as any,
      torneo: {
        ...deporte.torneo,
        fundamentacionTexto: deporte.torneo.fundamentacionTexto as string[],
        organizador: {
          ...deporte.torneo.organizador,
          mails: deporte.torneo.organizador.mails as string[],
        },
        banners: deporte.torneo.banners.map((banner) => ({
          ...banner,
          urlImagenes: banner.urlImagenes as string[],
        })),
      },
    };

    return json(deporteFormateado);
  } catch (e) {
    if (e instanceof Error && "status" in e) {
      throw e;
    }
    console.error("Error al obtener deporte:", e);
    throw error(500, "Error al obtener el deporte");
  }
};

// PUT /api/deportes/[id] - Actualizar un deporte
export const PUT: RequestHandler = async ({ params, request }) => {
  try {
    const data = await request.json();

    const deporte = await prisma.deporte.update({
      where: {
        id: params.id,
      },
      data: {
        nombre: data.nombre,
        planilla: data.planilla,
        reglamento: data.reglamento,
        fixture: data.fixture,
        fechasCompetencia: data.fechasCompetencia,
        horarios: data.horarios,
        locationsNombre: data.locationsNombre,
        locationsUrl: data.locationsUrl,
        grupoUrlWhatsapp: data.grupoUrlWhatsapp,
        redesSociales: data.redesSociales,
      },
      include: {
        torneo: true,
        equipos: true,
        podios: true,
      },
    });

    return json(deporte);
  } catch (e) {
    console.error("Error al actualizar deporte:", e);
    throw error(500, "Error al actualizar el deporte");
  }
};

// DELETE /api/deportes/[id] - Eliminar un deporte
export const DELETE: RequestHandler = async ({ params }) => {
  try {
    await prisma.deporte.delete({
      where: {
        id: params.id,
      },
    });

    return json({ success: true, message: "Deporte eliminado" });
  } catch (e) {
    console.error("Error al eliminar deporte:", e);
    throw error(500, "Error al eliminar el deporte");
  }
};

