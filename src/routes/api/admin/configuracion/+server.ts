import { json } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
  try {
    const torneo = await prisma.torneo.findFirst({
      include: {
        organizador: true,
      },
    });

    if (!torneo) {
      return json({ config: null });
    }

    // Extraer solo los datos de configuración
    const config = {
      anio: new Date().getFullYear(), // Por defecto el año actual
      descripcion: torneo.descripcion || "",
    };

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

    // Buscar el primer organizador para asociar el torneo
    const organizador = await prisma.organizador.findFirst();

    if (!organizador) {
      return json(
        { message: "No se encontró un organizador. Debe crear uno primero." },
        { status: 400 }
      );
    }

    const torneo = await prisma.torneo.create({
      data: {
        nombre: `Copa Corrientes Diversa ${anio}`,
        descripcion: descripcion || `Copa Corrientes Diversa ${anio}`,
        imagenPrincipal: "",
        fundamentacionTitulo: "Fundamentación",
        fundamentacionTexto: [],
        organizadorId: organizador.id,
      },
      include: {
        organizador: true,
      },
    });

    return json(torneo);
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

    // Buscar el primer torneo para actualizar
    const torneoExistente = await prisma.torneo.findFirst();

    if (!torneoExistente) {
      return json(
        { message: "No se encontró torneo para actualizar" },
        { status: 404 }
      );
    }

    const torneoActualizado = await prisma.torneo.update({
      where: { id: torneoExistente.id },
      data: {
        nombre: `Copa Corrientes Diversa ${anio}`,
        descripcion: descripcion || `Copa Corrientes Diversa ${anio}`,
      },
      include: {
        organizador: true,
      },
    });

    return json(torneoActualizado);
  } catch (error) {
    console.error("Error actualizando configuración:", error);
    return json(
      { message: "Error al actualizar configuración" },
      { status: 500 }
    );
  }
};
