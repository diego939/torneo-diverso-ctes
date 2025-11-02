<script lang="ts">
  import { onMount } from "svelte";
  import { toast } from "$lib/stores/toast";
  import type { PageData } from "./$types";

  export let data: PageData;

  let organizador = data.organizador;
  let isLoading = false;
  let isEditing = false;

  // Formulario del organizador
  let formData = {
    nombre: "",
    mails: [] as string[],
    celularWhatsapp: "",
    cbu: "",
    alias: "",
    nombreRedes: "",
    redesUrl: "",
  };

  // Editor de mails
  let nuevoMail = "";
  let editingMailIndex: number | null = null;
  let editingMailText = "";

  // Inicializar datos del formulario
  onMount(() => {
    if (organizador) {
      formData = {
        nombre: organizador.nombre || "",
        mails: Array.isArray(organizador.mails)
          ? (organizador.mails as string[])
          : [],
        celularWhatsapp: organizador.celularWhatsapp || "",
        cbu: organizador.cbu || "",
        alias: organizador.alias || "",
        nombreRedes: organizador.nombreRedes || "",
        redesUrl: organizador.redesUrl || "",
      };
    }
  });

  function startEditing() {
    isEditing = true;
  }

  function cancelEditing() {
    isEditing = false;
    if (organizador) {
      formData = {
        nombre: organizador.nombre || "",
        mails: Array.isArray(organizador.mails)
          ? (organizador.mails as string[])
          : [],
        celularWhatsapp: organizador.celularWhatsapp || "",
        cbu: organizador.cbu || "",
        alias: organizador.alias || "",
        nombreRedes: organizador.nombreRedes || "",
        redesUrl: organizador.redesUrl || "",
      };
    }
  }

  async function saveOrganizador() {
    if (
      !formData.nombre ||
      !formData.celularWhatsapp ||
      !formData.cbu ||
      !formData.alias
    ) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const mail of formData.mails) {
      if (mail && !emailRegex.test(mail)) {
        toast.error("Por favor ingresa un email válido");
        return;
      }
    }

    isLoading = true;
    try {
      const method = organizador ? "PUT" : "POST";
      const response = await fetch("/api/admin/organizador", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        organizador = result;
        isEditing = false;
        toast.success(
          organizador
            ? "Organizador actualizado correctamente"
            : "Organizador creado correctamente"
        );
      } else {
        toast.error(result.message || "Error al guardar el organizador");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error de conexión");
    } finally {
      isLoading = false;
    }
  }

  function addMail() {
    if (nuevoMail.trim() && !formData.mails.includes(nuevoMail.trim())) {
      formData.mails.push(nuevoMail.trim());
      formData.mails = [...formData.mails];
      nuevoMail = "";
    }
  }

  function removeMail(index: number) {
    formData.mails.splice(index, 1);
    formData.mails = [...formData.mails];
  }

  function startEditingMail(index: number) {
    editingMailIndex = index;
    editingMailText = formData.mails[index];
  }

  function saveEditingMail() {
    if (editingMailIndex !== null && editingMailText.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editingMailText.trim())) {
        toast.error("Por favor ingresa un email válido");
        return;
      }

      // Verificar si el email ya existe en otra posición
      const existingIndex = formData.mails.findIndex(
        (mail, index) =>
          mail === editingMailText.trim() && index !== editingMailIndex
      );

      if (existingIndex !== -1) {
        toast.error("Este correo ya existe en la lista");
        return;
      }

      formData.mails[editingMailIndex] = editingMailText.trim();
      formData.mails = [...formData.mails];
      editingMailIndex = null;
      editingMailText = "";
    }
  }

  function cancelEditingMail() {
    editingMailIndex = null;
    editingMailText = "";
  }
</script>

<svelte:head>
  <title>Organizador - Panel de Administración</title>
</svelte:head>

<div class="max-w-6xl mx-auto p-4 md:p-8">
  <div class="text-center mb-8 md:mb-12 text-gray-800">
    <h1 class="text-2xl md:text-3xl mb-2 drop-shadow-lg">
      👤 Gestión del Organizador
    </h1>
    <p class="text-sm md:text-base opacity-90">
      Administra la información del organizador del torneo
    </p>
  </div>

  {#if !organizador && !isEditing}
    <div class="bg-white rounded-2xl p-6 md:p-8 shadow-lg text-center mb-8">
      <div class="text-4xl md:text-6xl mb-4">👤</div>
      <h2 class="text-lg md:text-xl text-gray-800 mb-4">
        No hay organizador configurado
      </h2>
      <p class="text-sm md:text-base text-gray-600 mb-6">
        Crea la información del organizador para comenzar.
      </p>
      <button
        on:click={startEditing}
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg text-sm md:text-base font-medium transition-colors"
      >
        Crear Organizador
      </button>
    </div>
  {:else}
    <div class="bg-white rounded-2xl p-4 md:p-8 shadow-lg">
      <div
        class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6"
      >
        <h2 class="text-xl md:text-2xl font-bold text-gray-800">
          {organizador ? "Información del Organizador" : "Nuevo Organizador"}
        </h2>
        {#if !isEditing}
          <button
            on:click={startEditing}
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm md:text-base font-medium transition-colors w-full sm:w-auto"
          >
            Editar
          </button>
        {/if}
      </div>

      {#if isEditing}
        <form on:submit|preventDefault={saveOrganizador} class="space-y-6">
          <!-- Nombre del Organizador -->
          <div>
            <label
              for="nombre"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Nombre del Organizador *
            </label>
            <input
              id="nombre"
              type="text"
              bind:value={formData.nombre}
              class="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: Fundación Corrientes Diversa"
              required
            />
          </div>

          <!-- Mails -->
          <div>
            <span class="block text-sm font-medium text-gray-700 mb-2">
              Correos Electrónicos
            </span>

            <!-- Agregar nuevo mail -->
            <div class="flex flex-col sm:flex-row gap-2 mb-3">
              <input
                type="email"
                bind:value={nuevoMail}
                placeholder="nuevo@email.com"
                class="flex-1 px-3 py-2 text-sm md:text-base border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                on:keydown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addMail())}
              />
              <button
                type="button"
                on:click={addMail}
                class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm md:text-base font-medium transition-colors whitespace-nowrap"
              >
                Agregar
              </button>
            </div>

            <!-- Lista de mails -->
            <div class="space-y-2">
              {#each formData.mails as mail, index}
                <div class="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span
                    class="text-xs md:text-sm text-gray-500 w-6 flex-shrink-0"
                    >{index + 1}.</span
                  >

                  {#if editingMailIndex === index}
                    <!-- Modo edición -->
                    <input
                      type="email"
                      bind:value={editingMailText}
                      class="flex-1 min-w-0 px-2 py-1 text-xs md:text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      on:keydown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          saveEditingMail();
                        } else if (e.key === "Escape") {
                          e.preventDefault();
                          cancelEditingMail();
                        }
                      }}
                      autofocus
                    />
                    <button
                      type="button"
                      on:click={saveEditingMail}
                      class="p-1 flex-shrink-0 text-green-600 hover:text-green-700 text-sm md:text-base"
                      title="Guardar"
                    >
                      ✓
                    </button>
                    <button
                      type="button"
                      on:click={cancelEditingMail}
                      class="p-1 flex-shrink-0 text-gray-600 hover:text-gray-700 text-sm md:text-base"
                      title="Cancelar"
                    >
                      ✕
                    </button>
                  {:else}
                    <!-- Modo visualización -->
                    <span class="flex-1 text-xs md:text-sm truncate min-w-0"
                      >{mail}</span
                    >
                    <button
                      type="button"
                      on:click={() => startEditingMail(index)}
                      class="p-1 flex-shrink-0 text-blue-500 hover:text-blue-700"
                      title="Editar"
                    >
                      <svg
                        class="w-5 h-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      on:click={() => removeMail(index)}
                      class="p-1 flex-shrink-0 text-red-500 hover:text-red-700"
                      title="Eliminar"
                    >
                      <svg
                        class="w-5 h-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                        />
                      </svg>
                    </button>
                  {/if}
                </div>
              {/each}
            </div>
          </div>

          <!-- Celular WhatsApp -->
          <div>
            <label
              for="celularWhatsapp"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Celular WhatsApp *
            </label>
            <input
              id="celularWhatsapp"
              type="tel"
              bind:value={formData.celularWhatsapp}
              class="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: 3794123456"
              required
            />
            <p class="text-xs text-gray-500 mt-1">
              Solo números, sin espacios ni guiones
            </p>
          </div>

          <!-- CBU -->
          <div>
            <label
              for="cbu"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              CBU *
            </label>
            <input
              id="cbu"
              type="text"
              bind:value={formData.cbu}
              class="w-full px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: 1234567890123456789012"
              required
            />
          </div>

          <!-- Alias -->
          <div>
            <label
              for="alias"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Alias *
            </label>
            <input
              id="alias"
              type="text"
              bind:value={formData.alias}
              class="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: fundacion.diversa"
              required
            />
          </div>

          <!-- Nombre del contacto de WhatsApp -->
          <div>
            <label
              for="nombreRedes"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Nombre del contacto de WhatsApp
            </label>
            <input
              id="nombreRedes"
              type="text"
              bind:value={formData.nombreRedes}
              class="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: Fundación Corrientes Diversa"
            />
          </div>

          <!-- URL de WhatsApp -->
          <div>
            <label
              for="redesUrl"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              URL de WhatsApp
            </label>
            <input
              id="redesUrl"
              type="url"
              bind:value={formData.redesUrl}
              class="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: https://wa.me/5493794123456"
            />
          </div>

          <!-- Botones de acción -->
          <div class="flex flex-col sm:flex-row gap-3 md:gap-4 pt-6">
            <button
              type="submit"
              disabled={isLoading}
              class="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg text-sm md:text-base font-medium transition-colors w-full sm:w-auto"
            >
              {isLoading
                ? "Guardando..."
                : organizador
                  ? "Actualizar"
                  : "Crear"}
            </button>
            <button
              type="button"
              on:click={cancelEditing}
              disabled={isLoading}
              class="bg-gray-500 hover:bg-gray-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg text-sm md:text-base font-medium transition-colors w-full sm:w-auto"
            >
              Cancelar
            </button>
          </div>
        </form>
      {:else}
        <!-- Vista de solo lectura -->
        <div class="space-y-4 md:space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <h3 class="text-base md:text-lg font-semibold text-gray-800 mb-2">
                Nombre del Organizador
              </h3>
              <p class="text-sm md:text-base text-gray-600 break-words">
                {organizador?.nombre || "No especificado"}
              </p>
            </div>
            <div>
              <h3 class="text-base md:text-lg font-semibold text-gray-800 mb-2">
                Celular WhatsApp
              </h3>
              <p class="text-sm md:text-base text-gray-600">
                {organizador?.celularWhatsapp || "No especificado"}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <h3 class="text-base md:text-lg font-semibold text-gray-800 mb-2">
                CBU
              </h3>
              <p class="text-xs md:text-sm text-gray-600 font-mono break-all">
                {organizador?.cbu || "No especificado"}
              </p>
            </div>
            <div>
              <h3 class="text-base md:text-lg font-semibold text-gray-800 mb-2">
                Alias
              </h3>
              <p class="text-sm md:text-base text-gray-600 break-words">
                {organizador?.alias || "No especificado"}
              </p>
            </div>
          </div>

          {#if organizador?.mails && Array.isArray(organizador.mails) && organizador.mails.length > 0}
            <div>
              <h3 class="text-base md:text-lg font-semibold text-gray-800 mb-2">
                Correos Electrónicos
              </h3>
              <ul class="space-y-1">
                {#each organizador.mails as mail}
                  <li class="text-sm md:text-base text-gray-600 truncate">
                    <span class="mr-2">•</span>
                    <span class="truncate block">{mail}</span>
                  </li>
                {/each}
              </ul>
            </div>
          {/if}

          {#if organizador?.nombreRedes || organizador?.redesUrl}
            <div>
              <h3 class="text-base md:text-lg font-semibold text-gray-800 mb-2">
                WhatsApp
              </h3>
              <div class="space-y-2">
                {#if organizador.nombreRedes}
                  <p class="text-sm md:text-base text-gray-600 break-words">
                    <span class="font-medium">Nombre del contacto:</span>
                    <span class="ml-1">{organizador.nombreRedes}</span>
                  </p>
                {/if}
                {#if organizador.redesUrl}
                  <p class="text-sm md:text-base text-gray-600">
                    <span class="font-medium block mb-1 md:inline md:mb-0"
                      >URL de WhatsApp:</span
                    >
                    <a
                      href={organizador.redesUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-blue-600 hover:text-blue-800 underline truncate block md:inline"
                      title={organizador.redesUrl}
                    >
                      {organizador.redesUrl}
                    </a>
                  </p>
                {/if}
              </div>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  {/if}
</div>
