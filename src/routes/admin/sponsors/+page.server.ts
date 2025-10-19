import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/prisma";

export const load: PageServerLoad = async () => {
  try {
    const sponsors = await prisma.sponsor.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      sponsors,
    };
  } catch (error) {
    console.error("Error loading sponsors:", error);
    return {
      sponsors: [],
    };
  }
};

