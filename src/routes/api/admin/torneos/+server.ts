import { json } from "@sveltejs/kit";
import { prisma } from "$lib/prisma";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
  try {
    const torneos = await prisma.torneo.findMany({
      select: {
        id: true,
        nombre: true,
      },
      orderBy: {
        nombre: "asc",
      },
    });

    return json(torneos);
  } catch (error) {
    console.error("Error obteniendo torneos:", error);
    return json({ error: "Error interno del servidor" }, { status: 500 });
  }
};
