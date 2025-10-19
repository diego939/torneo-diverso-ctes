import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

// Tipos basados en el modelo de datos
export interface Organizador {
  id: string;
  nombre: string;
  mails: string[];
  celularWhatsapp: string;
  cbu: string;
  alias: string;
  nombreRedes: string;
  redesUrl: string;
}

export interface TorneoInfo {
  id: string;
  nombre: string;
  descripcion: string;
  imagenPrincipal: string;
  fundamentacionTitulo: string;
  fundamentacionTexto: string[];
}

export interface Banner {
  id: string;
  encabezado: string;
  urlImagenes: string[];
  textoPie: string;
  urlLocation: string;
}

export interface Deporte {
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
  redesSociales?: {
    instagram?: Array<{ nombre: string; url: string }>;
    facebook?: Array<{ nombre: string; url: string }>;
    twitter?: Array<{ nombre: string; url: string }>;
  };
}

export interface Equipo {
  id: string;
  nombre: string;
  deporteId: string;
  local: boolean;
  urlLogo: string;
  redesSociales: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

export interface Podio {
  id: string;
  deporteId: string;
  equipoNombre: string;
  puesto: number;
}

export interface Sponsor {
  id: string;
  nombre: string;
  urlImage: string;
  redesNombre: string;
  redesUrl: string;
}

export interface AppData {
  organizador: Organizador;
  torneoInfo: TorneoInfo;
  banners: Banner[];
  deportes: Deporte[];
  equipos: Equipo[];
  podios: Podio[];
  sponsors: Sponsor[];
}

// Función para cargar datos
async function loadData(): Promise<AppData> {
  try {
    const response = await fetch('/data.json');
    if (!response.ok) {
      throw new Error('Error al cargar datos');
    }
    return await response.json();
  } catch (error) {
    console.error('Error cargando data.json:', error);
    // Retornar datos vacíos en caso de error
    return {
      organizador: {} as Organizador,
      torneoInfo: {} as TorneoInfo,
      banners: [],
      deportes: [],
      equipos: [],
      podios: [],
      sponsors: []
    };
  }
}

// Función para guardar datos (para el panel de administración)
export async function saveData(data: AppData): Promise<boolean> {
  try {
    const response = await fetch('/api/save-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return response.ok;
  } catch (error) {
    console.error('Error guardando datos:', error);
    return false;
  }
}

// Store principal
export const appData: Writable<AppData | null> = writable(null);

// Inicializar datos
export async function initializeData() {
  const data = await loadData();
  appData.set(data);
}

// Stores derivados para acceso fácil
export const organizador = writable<Organizador | null>(null);
export const torneoInfo = writable<TorneoInfo | null>(null);
export const banners = writable<Banner[]>([]);
export const deportes = writable<Deporte[]>([]);
export const equipos = writable<Equipo[]>([]);
export const podios = writable<Podio[]>([]);
export const sponsors = writable<Sponsor[]>([]);

// Suscribirse a appData y actualizar stores derivados
appData.subscribe((data) => {
  if (data) {
    organizador.set(data.organizador);
    torneoInfo.set(data.torneoInfo);
    banners.set(data.banners);
    deportes.set(data.deportes);
    equipos.set(data.equipos);
    podios.set(data.podios);
    sponsors.set(data.sponsors);
  }
});

