import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { prisma } from "$lib/prisma";

export const PUT: RequestHandler = async ({ params, request }) => {
  try {
    const id = parseInt(params.id);
    const data = await request.json();

    const { nombre, urlImage, redesNombre, redesUrl } = data;

    if (!nombre || !urlImage) {
      return json({ error: "Nombre e imagen son requeridos" }, { status: 400 });
    }

    const sponsor = await prisma.sponsor.update({
      where: { id },
      data: {
        nombre,
        urlImage,
        redesNombre: redesNombre || "",
        redesUrl: redesUrl || "",
      },
    });

    return json(sponsor);
  } catch (error) {
    console.error("Error updating sponsor:", error);
    return json({ error: "Error al actualizar sponsor" }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ params }) => {
  try {
    const id = parseInt(params.id);

    await prisma.sponsor.delete({
      where: { id },
    });

    return json({ message: "Sponsor eliminado exitosamente" });
  } catch (error) {
    console.error("Error deleting sponsor:", error);
    return json({ error: "Error al eliminar sponsor" }, { status: 500 });
  }
};

