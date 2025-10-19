import { json } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
  try {
    const organizador = await prisma.organizador.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });

    return json(organizador);
  } catch (error) {
    console.error("Error fetching organizador:", error);
    return json({ error: "Error al obtener el organizador" }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const data = await request.json();
    const {
      nombre,
      mails,
      celularWhatsapp,
      cbu,
      alias,
      nombreRedes,
      redesUrl,
    } = data;

    // Validar campos requeridos
    if (!nombre || !celularWhatsapp || !cbu || !alias) {
      return json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    // Verificar si ya existe un organizador
    const existingOrganizador = await prisma.organizador.findFirst();
    if (existingOrganizador) {
      return json(
        { error: "Ya existe un organizador. Use PUT para actualizar." },
        { status: 400 }
      );
    }

    const organizador = await prisma.organizador.create({
      data: {
        nombre,
        mails: mails || [],
        celularWhatsapp,
        cbu,
        alias,
        nombreRedes: nombreRedes || "",
        redesUrl: redesUrl || "",
      },
    });

    return json(organizador);
  } catch (error) {
    console.error("Error creating organizador:", error);
    return json({ error: "Error al crear el organizador" }, { status: 500 });
  }
};

export const PUT: RequestHandler = async ({ request }) => {
  try {
    const data = await request.json();
    const {
      nombre,
      mails,
      celularWhatsapp,
      cbu,
      alias,
      nombreRedes,
      redesUrl,
    } = data;

    // Validar campos requeridos
    if (!nombre || !celularWhatsapp || !cbu || !alias) {
      return json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    // Buscar el organizador existente
    const existingOrganizador = await prisma.organizador.findFirst();
    if (!existingOrganizador) {
      return json(
        { error: "No existe un organizador para actualizar" },
        { status: 404 }
      );
    }

    const organizador = await prisma.organizador.update({
      where: { id: existingOrganizador.id },
      data: {
        nombre,
        mails: mails || [],
        celularWhatsapp,
        cbu,
        alias,
        nombreRedes: nombreRedes || "",
        redesUrl: redesUrl || "",
      },
    });

    return json(organizador);
  } catch (error) {
    console.error("Error updating organizador:", error);
    return json(
      { error: "Error al actualizar el organizador" },
      { status: 500 }
    );
  }
};
