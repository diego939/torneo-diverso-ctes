import prisma from "$lib/prisma";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
  try {
    const config = await prisma.config.findFirst();

    return json({ config });
  } catch (error) {
    console.error("Error obteniendo configuración:", error);
    return json({ error: "Error al obtener configuración" }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { anio, descripcion } = await request.json();

    if (!anio) {
      return json(
        {
          message: "El año es requerido",
        },
        { status: 400 }
      );
    }

    // Verificar si ya existe una configuración
    const existingConfig = await prisma.config.findFirst();
    if (existingConfig) {
      return json(
        { message: "Ya existe una configuración. Use PUT para actualizar." },
        { status: 400 }
      );
    }

    const config = await prisma.config.create({
      data: {
        anio,
        descripcion: descripcion || "",
      },
    });

    return json(config);
  } catch (error) {
    console.error("Error creando configuración:", error);
    return json({ message: "Error al crear configuración" }, { status: 500 });
  }
};

export const PUT: RequestHandler = async ({ request }) => {
  try {
    const { anio, descripcion } = await request.json();

    if (!anio) {
      return json(
        {
          message: "El año es requerido",
        },
        { status: 400 }
      );
    }

    // Buscar la configuración existente
    const configExistente = await prisma.config.findFirst();

    if (!configExistente) {
      return json(
        { message: "No se encontró configuración para actualizar" },
        { status: 404 }
      );
    }

    const configActualizada = await prisma.config.update({
      where: { id: configExistente.id },
      data: {
        anio,
        descripcion: descripcion || "",
      },
    });

    return json(configActualizada);
  } catch (error) {
    console.error("Error actualizando configuración:", error);
    return json(
      { message: "Error al actualizar configuración" },
      { status: 500 }
    );
  }
};
