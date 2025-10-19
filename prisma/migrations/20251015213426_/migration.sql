-- CreateTable
CREATE TABLE `organizadores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `mails` JSON NOT NULL,
    `celularWhatsapp` VARCHAR(191) NOT NULL,
    `cbu` VARCHAR(191) NOT NULL,
    `alias` VARCHAR(191) NOT NULL,
    `nombreRedes` VARCHAR(191) NOT NULL,
    `redesUrl` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `torneos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` TEXT NOT NULL,
    `imagenPrincipal` VARCHAR(191) NOT NULL,
    `fundamentacionTitulo` VARCHAR(191) NOT NULL,
    `fundamentacionTexto` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `organizadorId` INTEGER NOT NULL,

    INDEX `torneos_organizadorId_idx`(`organizadorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `banners` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `encabezado` VARCHAR(191) NOT NULL,
    `urlImagenes` JSON NOT NULL,
    `textoPie` VARCHAR(191) NOT NULL,
    `urlLocation` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `torneoId` INTEGER NOT NULL,

    INDEX `banners_torneoId_idx`(`torneoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `deportes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `planilla` VARCHAR(191) NOT NULL,
    `reglamento` VARCHAR(191) NOT NULL,
    `fixture` VARCHAR(191) NOT NULL,
    `fechasCompetencia` JSON NOT NULL,
    `horarios` JSON NOT NULL,
    `locationsNombre` JSON NOT NULL,
    `locationsUrl` JSON NOT NULL,
    `grupoUrlWhatsapp` VARCHAR(191) NOT NULL,
    `redesSociales` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `torneoId` INTEGER NOT NULL,

    INDEX `deportes_torneoId_idx`(`torneoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `equipos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `local` BOOLEAN NOT NULL DEFAULT false,
    `urlLogo` VARCHAR(191) NOT NULL,
    `instagram` VARCHAR(191) NULL,
    `facebook` VARCHAR(191) NULL,
    `twitter` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deporteId` INTEGER NOT NULL,

    INDEX `equipos_deporteId_idx`(`deporteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `podios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `equipoNombre` VARCHAR(191) NOT NULL,
    `puesto` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deporteId` INTEGER NOT NULL,

    INDEX `podios_deporteId_idx`(`deporteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sponsors` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `urlImage` VARCHAR(191) NOT NULL,
    `redesNombre` VARCHAR(191) NOT NULL,
    `redesUrl` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `contrasenia` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `usuarios_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `config` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `anio` INTEGER NOT NULL,
    `descripcion` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `torneos` ADD CONSTRAINT `torneos_organizadorId_fkey` FOREIGN KEY (`organizadorId`) REFERENCES `organizadores`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `banners` ADD CONSTRAINT `banners_torneoId_fkey` FOREIGN KEY (`torneoId`) REFERENCES `torneos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `deportes` ADD CONSTRAINT `deportes_torneoId_fkey` FOREIGN KEY (`torneoId`) REFERENCES `torneos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `equipos` ADD CONSTRAINT `equipos_deporteId_fkey` FOREIGN KEY (`deporteId`) REFERENCES `deportes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `podios` ADD CONSTRAINT `podios_deporteId_fkey` FOREIGN KEY (`deporteId`) REFERENCES `deportes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
