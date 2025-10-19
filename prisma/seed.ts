import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const prisma = new PrismaClient();

// Para obtener __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("🌱 Iniciando seeding...");

  // Leer el archivo data.json
  const dataPath = path.join(__dirname, "..", "static", "data.json");
  const rawData = fs.readFileSync(dataPath, "utf-8");
  const data = JSON.parse(rawData);

  // Limpiar datos existentes (opcional, comentar si no quieres limpiar)
  console.log("🧹 Limpiando base de datos...");
  await prisma.podio.deleteMany();
  await prisma.equipo.deleteMany();
  await prisma.deporte.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.torneo.deleteMany();
  await prisma.organizador.deleteMany();
  await prisma.sponsor.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.config.deleteMany();

  // 1. Crear Organizador
  console.log("👤 Creando organizador...");
  const organizador = await prisma.organizador.create({
    data: {
      nombre: data.organizador.nombre,
      mails: data.organizador.mails,
      celularWhatsapp: data.organizador.celularWhatsapp,
      cbu: data.organizador.cbu,
      alias: data.organizador.alias,
      nombreRedes: data.organizador.nombreRedes,
      redesUrl: data.organizador.redesUrl,
    },
  });
  console.log(`✅ Organizador creado: ${organizador.nombre}`);

  // 2. Crear Torneo
  console.log("🏆 Creando torneo...");
  const torneo = await prisma.torneo.create({
    data: {
      nombre: data.torneoInfo.nombre,
      descripcion: data.torneoInfo.descripcion,
      imagenPrincipal: data.torneoInfo.imagenPrincipal,
      fundamentacionTitulo: data.torneoInfo.fundamentacionTitulo,
      fundamentacionTexto: data.torneoInfo.fundamentacionTexto,
      organizadorId: organizador.id,
    },
  });
  console.log(`✅ Torneo creado: ${torneo.nombre}`);

  // 3. Crear Banners
  console.log("🎨 Creando banners...");
  for (const bannerData of data.banners) {
    const banner = await prisma.banner.create({
      data: {
        encabezado: bannerData.encabezado,
        urlImagenes: bannerData.urlImagenes,
        textoPie: bannerData.textoPie,
        urlLocation: bannerData.urlLocation,
        torneoId: torneo.id,
      },
    });
    console.log(`✅ Banner creado: ${banner.encabezado}`);
  }

  // 4. Crear Deportes
  console.log("⚽ Creando deportes...");
  for (const deporteData of data.deportes) {
    const deporte = await prisma.deporte.create({
      data: {
        nombre: deporteData.nombre,
        planilla: deporteData.planilla,
        reglamento: deporteData.reglamento,
        fixture: deporteData.fixture,
        fechasCompetencia: deporteData.fechasCompetencia,
        horarios: deporteData.horarios,
        locationsNombre: deporteData.locationsNombre,
        locationsUrl: deporteData.locationsUrl,
        grupoUrlWhatsapp: deporteData.grupoUrlWhatsapp,
        redesSociales: deporteData.redesSociales,
        torneoId: torneo.id,
      },
    });
    console.log(`✅ Deporte creado: ${deporte.nombre}`);
  }

  // 5. Crear Sponsors
  console.log("💼 Creando sponsors...");
  for (const sponsorData of data.sponsors) {
    const sponsor = await prisma.sponsor.create({
      data: {
        nombre: sponsorData.nombre,
        urlImage: sponsorData.urlImage,
        redesNombre: sponsorData.redesNombre,
        redesUrl: sponsorData.redesUrl,
      },
    });
    console.log(`✅ Sponsor creado: ${sponsor.nombre}`);
  }

  // 6. Crear usuario de ejemplo (opcional)
  console.log("🔐 Creando usuario de ejemplo...");
  const usuario = await prisma.usuario.create({
    data: {
      email: "admin@corrientesdiversa.org",
      contrasenia: "cambiar_esto", // ⚠️ En producción, usar hash (bcrypt)
    },
  });
  console.log(`✅ Usuario creado: ${usuario.email}`);

  // 7. Crear configuración inicial
  console.log("⚙️ Creando configuración...");
  const config = await prisma.config.create({
    data: {
      anio: 2024,
      descripcion:
        "Copa Corrientes Diversa 2024 - Primer torneo internacional mixto de deportes LGBTQ+",
    },
  });
  console.log(`✅ Configuración creada: ${config.anio}`);

  console.log("🎉 Seeding completado exitosamente!");
}

main()
  .catch((e) => {
    console.error("❌ Error durante el seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
