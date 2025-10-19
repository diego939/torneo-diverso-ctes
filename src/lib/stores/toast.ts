import { writable } from "svelte/store";

export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
}

export const toasts = writable<ToastMessage[]>([]);

export function addToast(
  message: string,
  type: "success" | "error" | "info" = "info",
  duration: number = 5000
) {
  const id = Math.random().toString(36).substr(2, 9);
  const toast: ToastMessage = { id, message, type, duration };

  toasts.update((current) => [...current, toast]);

  // Auto-remove after duration
  setTimeout(() => {
    removeToast(id);
  }, duration);
}

export function removeToast(id: string) {
  toasts.update((current) => current.filter((toast) => toast.id !== id));
}

export function clearToasts() {
  toasts.set([]);
}

// Objeto toast con métodos convenientes
export const toast = {
  success: (message: string, duration?: number) =>
    addToast(message, "success", duration),
  error: (message: string, duration?: number) =>
    addToast(message, "error", duration),
  info: (message: string, duration?: number) =>
    addToast(message, "info", duration),
};
