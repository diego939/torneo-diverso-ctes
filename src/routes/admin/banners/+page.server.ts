import { error, fail, redirect } from "@sveltejs/kit";
import { prisma } from "$lib/prisma";
import type { Actions, PageServerLoad } from "./$types";
import fs from "fs";
import path from "path";

export const load: PageServerLoad = async () => {
  try {
    // Obtener banners con su torneo
    const banners = await prisma.banner.findMany({
      include: {
        torneo: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Obtener imágenes disponibles en la carpeta static/banners
    const bannersDir = path.join(process.cwd(), "static", "banners");
    let availableImages: string[] = [];

    try {
      const files = fs.readdirSync(bannersDir);
      availableImages = files
        .filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
        .map((file) => `/banners/${file}`)
        .sort();
    } catch (err) {
      console.warn("No se pudo leer la carpeta de banners:", err);
    }

    return {
      banners,
      availableImages,
    };
  } catch (err) {
    console.error("Error cargando banners:", err);
    throw error(500, "Error al cargar los banners");
  }
};

export const actions: Actions = {
  create: async ({ request }) => {
    try {
      const formData = await request.formData();
      const encabezado = formData.get("encabezado") as string;
      const textoPie = formData.get("textoPie") as string;
      const urlLocation = formData.get("urlLocation") as string;
      const torneoId = parseInt(formData.get("torneoId") as string);
      const imagenesSeleccionadas = formData.getAll("imagenes") as string[];

      if (!encabezado || !textoPie || !torneoId) {
        return fail(400, {
          error: "Todos los campos son obligatorios",
        });
      }

      // Verificar que el torneo existe
      const torneo = await prisma.torneo.findUnique({
        where: { id: torneoId },
      });

      if (!torneo) {
        return fail(400, {
          error: "El torneo seleccionado no existe",
        });
      }

      // Crear banner
      const banner = await prisma.banner.create({
        data: {
          encabezado,
          textoPie,
          urlLocation: urlLocation || "",
          urlImagenes: imagenesSeleccionadas,
          torneoId,
        },
      });

      return {
        success: true,
        message: "Banner creado exitosamente",
      };
    } catch (err) {
      console.error("Error creando banner:", err);
      return fail(500, {
        error: "Error interno del servidor",
      });
    }
  },

  update: async ({ request }) => {
    try {
      const formData = await request.formData();
      const id = parseInt(formData.get("id") as string);
      const encabezado = formData.get("encabezado") as string;
      const textoPie = formData.get("textoPie") as string;
      const urlLocation = formData.get("urlLocation") as string;
      const imagenesSeleccionadas = formData.getAll("imagenes") as string[];

      if (!id || !encabezado || !textoPie) {
        return fail(400, {
          error: "Todos los campos son obligatorios",
        });
      }

      // Verificar que el banner existe
      const existingBanner = await prisma.banner.findUnique({
        where: { id },
      });

      if (!existingBanner) {
        return fail(404, {
          error: "Banner no encontrado",
        });
      }

      // Actualizar banner
      await prisma.banner.update({
        where: { id },
        data: {
          encabezado,
          textoPie,
          urlLocation: urlLocation || "",
          urlImagenes: imagenesSeleccionadas,
        },
      });

      return {
        success: true,
        message: "Banner actualizado exitosamente",
      };
    } catch (err) {
      console.error("Error actualizando banner:", err);
      return fail(500, {
        error: "Error interno del servidor",
      });
    }
  },

  delete: async ({ request }) => {
    try {
      const formData = await request.formData();
      const id = parseInt(formData.get("id") as string);

      if (!id) {
        return fail(400, {
          error: "ID de banner requerido",
        });
      }

      // Verificar que el banner existe
      const existingBanner = await prisma.banner.findUnique({
        where: { id },
      });

      if (!existingBanner) {
        return fail(404, {
          error: "Banner no encontrado",
        });
      }

      // Eliminar banner
      await prisma.banner.delete({
        where: { id },
      });

      return {
        success: true,
        message: "Banner eliminado exitosamente",
      };
    } catch (err) {
      console.error("Error eliminando banner:", err);
      return fail(500, {
        error: "Error interno del servidor",
      });
    }
  },
};

