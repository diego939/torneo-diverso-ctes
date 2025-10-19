import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { prisma } from "$lib/prisma";

export const GET: RequestHandler = async ({ url }) => {
  try {
    const deporteId = url.searchParams.get("deporteId");

    const whereClause = deporteId ? { deporteId: parseInt(deporteId) } : {};

    const podios = await prisma.podio.findMany({
      where: whereClause,
      include: {
        deporte: true,
      },
      orderBy: [{ deporteId: "asc" }, { puesto: "asc" }],
    });

    return json(podios);
  } catch (error) {
    console.error("Error fetching podios:", error);
    return json({ error: "Error al cargar podios" }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const data = await request.json();

    const { equipoNombre, puesto, deporteId } = data;

    if (!equipoNombre || !puesto || !deporteId) {
      return json(
        { error: "Nombre del equipo, puesto y deporte son requeridos" },
        { status: 400 }
      );
    }

    // Verificar que el puesto no esté ya ocupado en este deporte
    const existingPodio = await prisma.podio.findFirst({
      where: {
        deporteId: parseInt(deporteId),
        puesto: parseInt(puesto),
      },
    });

    if (existingPodio) {
      return json(
        { error: `El puesto ${puesto} ya está ocupado en este deporte` },
        { status: 400 }
      );
    }

    const podio = await prisma.podio.create({
      data: {
        equipoNombre,
        puesto: parseInt(puesto),
        deporteId: parseInt(deporteId),
      },
      include: {
        deporte: true,
      },
    });

    return json(podio, { status: 201 });
  } catch (error) {
    console.error("Error creating podio:", error);
    return json({ error: "Error al crear podio" }, { status: 500 });
  }
};
