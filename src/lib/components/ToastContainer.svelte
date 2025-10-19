<script lang="ts">
  import { toasts } from "$lib/stores/toast";
  import { onMount } from "svelte";

  let container: HTMLDivElement;

  onMount(() => {
    // Asegurar que el contenedor esté en el DOM
    if (container) {
      container.style.position = "fixed";
      container.style.top = "50px";
      container.style.left = "50%";
      container.style.transform = "translateX(-50%)";
      container.style.zIndex = "9999";
    }
  });
</script>

<div
  bind:this={container}
  class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-2"
>
  {#each $toasts as toast (toast.id)}
    <div
      class="flex items-center p-4 mb-4 text-sm rounded-lg shadow-lg max-w-sm transition-all duration-300 transform {toast.type ===
      'success'
        ? 'bg-green-100 text-green-800 border border-green-200'
        : toast.type === 'error'
          ? 'bg-red-100 text-red-800 border border-red-200'
          : 'bg-blue-100 text-blue-800 border border-blue-200'}"
      role="alert"
    >
      <div class="flex items-center">
        {#if toast.type === "success"}
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            ></path>
          </svg>
        {:else if toast.type === "error"}
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            ></path>
          </svg>
        {:else}
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            ></path>
          </svg>
        {/if}
        <span class="font-medium">{toast.message}</span>
      </div>
      <button
        type="button"
        class="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 hover:bg-gray-200 focus:ring-2 focus:ring-gray-300"
        on:click={() => {
          // Remover toast específico
          toasts.update((current) => current.filter((t) => t.id !== toast.id));
        }}
        aria-label="Cerrar"
      >
        <span class="sr-only">Cerrar</span>
        <svg
          class="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
    </div>
  {/each}
</div>
