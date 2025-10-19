import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { prisma } from "$lib/prisma";

export const PUT: RequestHandler = async ({ params, request }) => {
  try {
    const id = parseInt(params.id);
    const data = await request.json();

    const { equipoNombre, puesto, deporteId } = data;

    if (!equipoNombre || !puesto || !deporteId) {
      return json(
        { error: "Nombre del equipo, puesto y deporte son requeridos" },
        { status: 400 }
      );
    }

    // Verificar que el puesto no esté ya ocupado por otro equipo en este deporte
    const existingPodio = await prisma.podio.findFirst({
      where: {
        deporteId: parseInt(deporteId),
        puesto: parseInt(puesto),
        id: { not: id },
      },
    });

    if (existingPodio) {
      return json(
        { error: `El puesto ${puesto} ya está ocupado en este deporte` },
        { status: 400 }
      );
    }

    const podio = await prisma.podio.update({
      where: { id },
      data: {
        equipoNombre,
        puesto: parseInt(puesto),
        deporteId: parseInt(deporteId),
      },
      include: {
        deporte: true,
      },
    });

    return json(podio);
  } catch (error) {
    console.error("Error updating podio:", error);
    return json({ error: "Error al actualizar podio" }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ params }) => {
  try {
    const id = parseInt(params.id);

    await prisma.podio.delete({
      where: { id },
    });

    return json({ message: "Podio eliminado exitosamente" });
  } catch (error) {
    console.error("Error deleting podio:", error);
    return json({ error: "Error al eliminar podio" }, { status: 500 });
  }
};
