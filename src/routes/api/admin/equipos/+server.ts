import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { prisma } from "$lib/prisma";

export const GET: RequestHandler = async ({ url }) => {
  try {
    const deporteId = url.searchParams.get("deporteId");

    const whereClause = deporteId ? { deporteId: parseInt(deporteId) } : {};

    const equipos = await prisma.equipo.findMany({
      where: whereClause,
      include: {
        deporte: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return json(equipos);
  } catch (error) {
    console.error("Error fetching equipos:", error);
    return json({ error: "Error al cargar equipos" }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const data = await request.json();

    const { nombre, local, urlLogo, instagram, facebook, twitter, deporteId } =
      data;

    if (!nombre || !deporteId) {
      return json(
        { error: "Nombre y deporte son requeridos" },
        { status: 400 }
      );
    }

    const equipo = await prisma.equipo.create({
      data: {
        nombre,
        local: local || false,
        urlLogo: urlLogo || "/equipos/sin-logo.jpg",
        instagram: instagram || "",
        facebook: facebook || "",
        twitter: twitter || "",
        deporteId: parseInt(deporteId),
      },
      include: {
        deporte: true,
      },
    });

    return json(equipo, { status: 201 });
  } catch (error) {
    console.error("Error creating equipo:", error);
    return json({ error: "Error al crear equipo" }, { status: 500 });
  }
};
