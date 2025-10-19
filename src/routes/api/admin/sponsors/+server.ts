import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { prisma } from "$lib/prisma";

export const GET: RequestHandler = async () => {
  try {
    const sponsors = await prisma.sponsor.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return json(sponsors);
  } catch (error) {
    console.error("Error fetching sponsors:", error);
    return json({ error: "Error al cargar sponsors" }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const data = await request.json();

    const { nombre, urlImage, redesNombre, redesUrl } = data;

    if (!nombre || !urlImage) {
      return json({ error: "Nombre e imagen son requeridos" }, { status: 400 });
    }

    const sponsor = await prisma.sponsor.create({
      data: {
        nombre,
        urlImage,
        redesNombre: redesNombre || "",
        redesUrl: redesUrl || "",
      },
    });

    return json(sponsor, { status: 201 });
  } catch (error) {
    console.error("Error creating sponsor:", error);
    return json({ error: "Error al crear sponsor" }, { status: 500 });
  }
};

