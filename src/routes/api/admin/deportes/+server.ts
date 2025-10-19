import prisma from "$lib/prisma";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
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

    return json(deportes);
  } catch (error) {
    console.error("Error obteniendo deportes:", error);
    return json({ error: "Error al obtener deportes" }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
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

    // Obtener el primer torneo (asumiendo que solo hay uno)
    const torneo = await prisma.torneo.findFirst();

    if (!torneo) {
      return json({ message: "No se encontró ningún torneo" }, { status: 404 });
    }

    const deporte = await prisma.deporte.create({
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
        torneoId: torneo.id,
      },
      include: {
        torneo: true,
        equipos: true,
        podios: true,
      },
    });

    return json(deporte);
  } catch (error) {
    console.error("Error creando deporte:", error);
    return json({ message: "Error al crear deporte" }, { status: 500 });
  }
};
