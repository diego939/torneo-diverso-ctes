import prisma from "$lib/prisma";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
  try {
    const [
      organizadores,
      torneos,
      banners,
      deportes,
      sponsors,
      equipos,
      podios,
    ] = await Promise.all([
      prisma.organizador.count(),
      prisma.torneo.count(),
      prisma.banner.count(),
      prisma.deporte.count(),
      prisma.sponsor.count(),
      prisma.equipo.count(),
      prisma.podio.count(),
    ]);

    return json({
      organizadores,
      torneos,
      banners,
      deportes,
      sponsors,
      equipos,
      podios,
    });
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error);
    return json({ error: "Error al obtener estadísticas" }, { status: 500 });
  }
};
