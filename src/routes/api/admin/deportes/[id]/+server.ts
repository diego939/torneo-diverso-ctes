import prisma from "$lib/prisma";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params }) => {
  try {
    const deporte = await prisma.deporte.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        torneo: {
          include: {
            organizador: true,
          },
        },
        equipos: true,
        podios: true,
      },
    });

    if (!deporte) {
      return json({ message: "Deporte no encontrado" }, { status: 404 });
    }

    return json(deporte);
  } catch (error) {
    console.error("Error obteniendo deporte:", error);
    return json({ error: "Error al obtener deporte" }, { status: 500 });
  }
};

export const PUT: RequestHandler = async ({ params, request }) => {
  try {
    const {
      nombre,
      planilla,
      reglamento,
      fixture,
      fechasCompetencia,
      horarios,
      locationsNombre,
      locationsUrl,
      grupoUrlWhatsapp,
      redesSociales,
    } = await request.json();

    if (!nombre) {
      return json({ message: "El nombre es requerido" }, { status: 400 });
    }

    const deporte = await prisma.deporte.update({
      where: { id: parseInt(params.id) },
      data: {
        nombre,
        planilla: planilla || "",
        reglamento: reglamento || "",
        fixture: fixture || "",
        fechasCompetencia: fechasCompetencia || [],
        horarios: horarios || [],
        locationsNombre: locationsNombre || [],
        locationsUrl: locationsUrl || [],
        grupoUrlWhatsapp: grupoUrlWhatsapp || "",
        redesSociales: redesSociales || {},
      },
      include: {
        torneo: true,
        equipos: true,
        podios: true,
      },
    });

    return json(deporte);
  } catch (error) {
    console.error("Error actualizando deporte:", error);
    return json({ message: "Error al actualizar deporte" }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ params }) => {
  try {
    await prisma.deporte.delete({
      where: { id: parseInt(params.id) },
    });

    return json({ message: "Deporte eliminado exitosamente" });
  } catch (error) {
    console.error("Error eliminando deporte:", error);
    return json({ message: "Error al eliminar deporte" }, { status: 500 });
  }
};
