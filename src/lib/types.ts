// Tipos personalizados para manejar los campos JSON de Prisma

export interface RedesSociales {
  instagram?: Array<{
    nombre: string;
    url: string;
  }>;
  facebook?: Array<{
    nombre: string;
    url: string;
  }>;
  twitter?: Array<{
    nombre: string;
    url: string;
  }>;
}

export interface DeporteFormateado {
  id: string;
  nombre: string;
  planilla: string;
  reglamento: string;
  fixture: string;
  fechasCompetencia: string[];
  horarios: string[];
  locationsNombre: string[];
  locationsUrl: string[];
  grupoUrlWhatsapp: string;
  redesSociales: RedesSociales;
  torneoId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizadorFormateado {
  id: string;
  nombre: string;
  mails: string[];
  celularWhatsapp: string;
  cbu: string;
  alias: string;
  nombreRedes: string;
  redesUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TorneoFormateado {
  id: string;
  nombre: string;
  descripcion: string;
  imagenPrincipal: string;
  fundamentacionTitulo: string;
  fundamentacionTexto: string[];
  organizadorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BannerFormateado {
  id: string;
  encabezado: string;
  urlImagenes: string[];
  textoPie: string;
  urlLocation: string;
  torneoId: string;
  createdAt: Date;
  updatedAt: Date;
}

