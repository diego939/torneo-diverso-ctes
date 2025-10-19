import prisma from "$lib/prisma";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  try {
    const config = await prisma.config.findFirst();

    return {
      config,
    };
  } catch (error) {
    console.error("Error cargando configuración:", error);
    return {
      config: null,
    };
  }
};
