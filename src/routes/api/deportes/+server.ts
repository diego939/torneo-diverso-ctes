import { json } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import type { RequestHandler } from "./$types";

// GET /api/deportes - Obtener todos los deportes
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
        podios: {
          orderBy: {
            puesto: "asc",
          },
        },
      },
      orderBy: {
        nombre: "asc",
      },
    });

    // Formatear los campos JSON
    const deportesFormateados = deportes.map((deporte) => ({
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
      },
    }));

    return json(deportesFormateados);
  } catch (error) {
    console.error("Error al obtener deportes:", error);
    return json({ error: "Error al obtener deportes" }, { status: 500 });
  }
};

// POST /api/deportes - Crear un nuevo deporte
export const POST: RequestHandler = async ({ request }) => {
  try {
    const data = await request.json();

    const deporte = await prisma.deporte.create({
      data: {
        nombre: data.nombre,
        planilla: data.planilla || "",
        reglamento: data.reglamento || "",
        fixture: data.fixture || "",
        fechasCompetencia: data.fechasCompetencia || [],
        horarios: data.horarios || [],
        locationsNombre: data.locationsNombre || [],
        locationsUrl: data.locationsUrl || [],
        grupoUrlWhatsapp: data.grupoUrlWhatsapp || "",
        redesSociales: data.redesSociales || {},
        torneoId: data.torneoId,
      },
      include: {
        torneo: true,
      },
    });

    return json(deporte, { status: 201 });
  } catch (error) {
    console.error("Error al crear deporte:", error);
    return json({ error: "Error al crear deporte" }, { status: 500 });
  }
};

