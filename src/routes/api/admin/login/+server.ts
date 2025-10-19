import prisma from "$lib/prisma";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return json(
        { message: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    // Buscar usuario (autenticación básica - en producción usar bcrypt)
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      return json({ message: "Credenciales incorrectas" }, { status: 401 });
    }

    // Verificar contraseña (básico - en producción usar hash)
    if (usuario.contrasenia !== password) {
      return json({ message: "Credenciales incorrectas" }, { status: 401 });
    }

    // Retornar usuario sin la contraseña
    const { contrasenia, ...userWithoutPassword } = usuario;

    return json({
      id: userWithoutPassword.id,
      email: userWithoutPassword.email,
      createdAt: userWithoutPassword.createdAt,
      updatedAt: userWithoutPassword.updatedAt,
    });
  } catch (error) {
    console.error("Error en login:", error);
    return json({ message: "Error interno del servidor" }, { status: 500 });
  }
};
