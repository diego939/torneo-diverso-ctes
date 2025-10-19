import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { prisma } from "$lib/prisma";

export const PUT: RequestHandler = async ({ params, request }) => {
  try {
    const id = parseInt(params.id);
    const data = await request.json();

    const { nombre, local, urlLogo, instagram, facebook, twitter, deporteId } =
      data;

    if (!nombre || !deporteId) {
      return json(
        { error: "Nombre y deporte son requeridos" },
        { status: 400 }
      );
    }

    const equipo = await prisma.equipo.update({
      where: { id },
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

    return json(equipo);
  } catch (error) {
    console.error("Error updating equipo:", error);
    return json({ error: "Error al actualizar equipo" }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ params }) => {
  try {
    const id = parseInt(params.id);

    await prisma.equipo.delete({
      where: { id },
    });

    return json({ message: "Equipo eliminado exitosamente" });
  } catch (error) {
    console.error("Error deleting equipo:", error);
    return json({ error: "Error al eliminar equipo" }, { status: 500 });
  }
};
