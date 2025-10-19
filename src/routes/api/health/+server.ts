import { json } from "@sveltejs/kit";
import prisma from "$lib/prisma";

export async function GET() {
  try {
    // Verificar conexión a la base de datos
    await prisma.$connect();

    // Verificar que las tablas existan
    const organizadorCount = await prisma.organizador.count();
    const configCount = await prisma.config.count();

    return json({
      status: "success",
      database: "connected",
      tables: {
        organizadores: organizadorCount,
        config: configCount,
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        databaseUrlLength: process.env.DATABASE_URL?.length || 0,
      },
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    return json(
      {
        status: "error",
        database: "disconnected",
        error: {
          message: error instanceof Error ? error.message : "Unknown error",
          name: error instanceof Error ? error.name : "UnknownError",
        },
        environment: {
          nodeEnv: process.env.NODE_ENV,
          hasDatabaseUrl: !!process.env.DATABASE_URL,
          databaseUrlLength: process.env.DATABASE_URL?.length || 0,
        },
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
