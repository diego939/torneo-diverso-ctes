import { json } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
  try {
    const torneo = await prisma.torneo.findFirst({
      include: {
        organizador: true,
        banners: true,
        deportes: {
          include: {
            equipos: true,
            podios: true,
          },
        },
      },
    });

    return json(torneo);
  } catch (error) {
    console.error("Error obteniendo torneo:", error);
    return json({ error: "Error al obtener torneo" }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const data = await request.json();
    const {
      nombre,
      descripcion,
      imagenPrincipal,
      fundamentacionTitulo,
      fundamentacionTexto,
      organizadorId,
    } = data;

    // Validar campos requeridos
    if (!nombre || !descripcion || !fundamentacionTitulo) {
      return json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    // Verificar si ya existe un torneo
    const existingTorneo = await prisma.torneo.findFirst();
    if (existingTorneo) {
      return json(
        { error: "Ya existe un torneo. Use PUT para actualizar." },
        { status: 400 }
      );
    }

    const torneo = await prisma.torneo.create({
      data: {
        nombre,
        descripcion,
        imagenPrincipal: imagenPrincipal || "",
        fundamentacionTitulo,
        fundamentacionTexto: fundamentacionTexto || [],
        organizadorId,
      },
      include: {
        organizador: true,
      },
    });

    return json(torneo);
  } catch (error) {
    console.error("Error creando torneo:", error);
    return json({ error: "Error al crear torneo" }, { status: 500 });
  }
};

export const PUT: RequestHandler = async ({ request }) => {
  try {
    const data = await request.json();
    const {
      nombre,
      descripcion,
      imagenPrincipal,
      fundamentacionTitulo,
      fundamentacionTexto,
      organizadorId,
    } = data;

    // Validar campos requeridos
    if (!nombre || !descripcion || !fundamentacionTitulo) {
      return json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    // Buscar el torneo existente
    const existingTorneo = await prisma.torneo.findFirst();
    if (!existingTorneo) {
      return json(
        { error: "No existe un torneo para actualizar" },
        { status: 404 }
      );
    }

    const torneo = await prisma.torneo.update({
      where: { id: existingTorneo.id },
      data: {
        nombre,
        descripcion,
        imagenPrincipal: imagenPrincipal || "",
        fundamentacionTitulo,
        fundamentacionTexto: fundamentacionTexto || [],
        organizadorId,
      },
      include: {
        organizador: true,
      },
    });

    return json(torneo);
  } catch (error) {
    console.error("Error actualizando torneo:", error);
    return json({ error: "Error al actualizar torneo" }, { status: 500 });
  }
};
