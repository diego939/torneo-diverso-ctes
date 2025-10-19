<script lang="ts">
  import { onMount } from "svelte";
  import { toast } from "$lib/stores/toast";
  import type { PageData } from "./$types";

  export let data: PageData;

  let torneo = data.torneo;
  let organizadores = data.organizadores;
  let isLoading = false;
  let isEditing = false;
  let showFundamentacionEditor = false;
  let uploadingImage = false;
  let fondoFile: File | null = null;

  // Formulario del torneo
  let formData = {
    nombre: "",
    descripcion: "",
    imagenPrincipal: "",
    fundamentacionTitulo: "",
    fundamentacionTexto: [] as string[],
    organizadorId: 0,
  };

  // Editor de fundamentación
  let fundamentacionTextos: string[] = [];
  let nuevoTexto = "";
  let editingIndex: number | null = null;
  let editingText = "";

  // Inicializar datos del formulario
  onMount(() => {
    if (torneo) {
      formData = {
        nombre: torneo.nombre || "",
        descripcion: torneo.descripcion || "",
        imagenPrincipal: torneo.imagenPrincipal || "",
        fundamentacionTitulo: torneo.fundamentacionTitulo || "",
        fundamentacionTexto: Array.isArray(torneo.fundamentacionTexto)
          ? (torneo.fundamentacionTexto as string[])
          : [],
        organizadorId: torneo.organizadorId || 0,
      };
      fundamentacionTextos = [...(formData.fundamentacionTexto || [])];
    }
  });

  function startEditing() {
    isEditing = true;
    fundamentacionTextos = [...(formData.fundamentacionTexto || [])];
  }

  function cancelEditing() {
    isEditing = false;
    if (torneo) {
      formData = {
        nombre: torneo.nombre || "",
        descripcion: torneo.descripcion || "",
        imagenPrincipal: torneo.imagenPrincipal || "",
        fundamentacionTitulo: torneo.fundamentacionTitulo || "",
        fundamentacionTexto: Array.isArray(torneo.fundamentacionTexto)
          ? (torneo.fundamentacionTexto as string[])
          : [],
        organizadorId: torneo.organizadorId || 0,
      };
    }
  }

  async function saveTorneo() {
    if (
      !formData.nombre ||
      !formData.descripcion ||
      !formData.fundamentacionTitulo
    ) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    isLoading = true;
    try {
      let imagenPrincipalUrl = formData.imagenPrincipal;

      // Manejar upload de imagen de fondo si se seleccionó un archivo
      if (fondoFile) {
        // La API se encarga automáticamente de eliminar archivos anteriores
        imagenPrincipalUrl = await uploadFondoFile();
        if (!imagenPrincipalUrl) {
          toast.error("Error al subir la imagen de fondo");
          return;
        }
      }

      const method = torneo ? "PUT" : "POST";
      const response = await fetch("/api/admin/torneo", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          imagenPrincipal: imagenPrincipalUrl,
          fundamentacionTexto: fundamentacionTextos,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        torneo = result;
        isEditing = false;
        fondoFile = null; // Limpiar archivo seleccionado
        toast.success(
          torneo
            ? "Torneo actualizado correctamente"
            : "Torneo creado correctamente"
        );
      } else {
        toast.error(result.message || "Error al guardar el torneo");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error de conexión");
    } finally {
      isLoading = false;
    }
  }

  function addFundamentacionTexto() {
    if (nuevoTexto.trim()) {
      fundamentacionTextos.push(nuevoTexto.trim());
      nuevoTexto = "";
    }
  }

  function removeFundamentacionTexto(index: number) {
    fundamentacionTextos.splice(index, 1);
  }

  function moveFundamentacionTexto(index: number, direction: "up" | "down") {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < fundamentacionTextos.length) {
      [fundamentacionTextos[index], fundamentacionTextos[newIndex]] = [
        fundamentacionTextos[newIndex],
        fundamentacionTextos[index],
      ];
      fundamentacionTextos = [...fundamentacionTextos];
    }
  }

  function startEditingTexto(index: number) {
    editingIndex = index;
    editingText = fundamentacionTextos[index];
  }

  function saveEditingTexto() {
    if (editingIndex !== null && editingText.trim()) {
      fundamentacionTextos[editingIndex] = editingText.trim();
      fundamentacionTextos = [...fundamentacionTextos];
      editingIndex = null;
      editingText = "";
    }
  }

  function cancelEditingTexto() {
    editingIndex = null;
    editingText = "";
  }

  // Función para validar dimensiones de imagen
  function validateImageDimensions(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        const isValid = img.width <= 3000 && img.height <= 3000;
        resolve(isValid);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(false);
      };

      img.src = url;
    });
  }

  // Función para manejar la selección de archivo de fondo
  async function handleFondoFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const file = target.files[0];

      // Validar tipo de archivo
      if (!file.type.startsWith("image/")) {
        toast.error("Por favor selecciona un archivo de imagen válido");
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("El archivo es demasiado grande. Máximo 5MB");
        return;
      }

      // Validar dimensiones (máximo 3000x3000)
      const isValidDimensions = await validateImageDimensions(file);
      if (!isValidDimensions) {
        toast.error(
          "Las dimensiones de la imagen no pueden exceder 3000x3000 píxeles"
        );
        return;
      }

      fondoFile = file;
    }
  }

  // Función para subir archivo de fondo
  async function uploadFondoFile() {
    if (!fondoFile) return null;

    uploadingImage = true;
    try {
      const formData = new FormData();
      formData.append("file", fondoFile);
      formData.append("type", "fondo-sitio");
      // No enviamos deporteId para fondo-sitio

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        return result.url;
      } else {
        const error = await response.json();
        toast.error(error.error || "Error al subir la imagen");
        return null;
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error de conexión al subir la imagen");
      return null;
    } finally {
      uploadingImage = false;
    }
  }

  // Función para eliminar archivo anterior
  async function deleteFile(url: string) {
    try {
      await fetch("/api/admin/delete-file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  }
</script>

<svelte:head>
  <title>Torneo - Panel de Administración</title>
</svelte:head>

<div class="max-w-6xl mx-auto p-8">
  <div class="text-center mb-12 text-gray-800">
    <h1 class="text-3xl mb-2 drop-shadow-lg">🏆 Gestión del Torneo</h1>
    <p class="opacity-90">
      Administra la información general del torneo y su organizador
    </p>
  </div>

  {#if !torneo && !isEditing}
    <div class="bg-white rounded-2xl p-8 shadow-lg text-center mb-8">
      <div class="text-6xl mb-4">🏆</div>
      <h2 class="text-gray-800 mb-4">No hay torneo configurado</h2>
      <p class="text-gray-600 mb-6">
        Crea la información del torneo para comenzar.
      </p>
      <button
        on:click={startEditing}
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        Crear Torneo
      </button>
    </div>
  {:else}
    <div class="bg-white rounded-2xl p-8 shadow-lg">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">
          {torneo ? "Información del Torneo" : "Nuevo Torneo"}
        </h2>
        {#if !isEditing}
          <button
            on:click={startEditing}
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Editar
          </button>
        {/if}
      </div>

      {#if isEditing}
        <form on:submit|preventDefault={saveTorneo} class="space-y-6">
          <!-- Nombre del Torneo -->
          <div>
            <label
              for="nombre"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Nombre del Torneo *
            </label>
            <input
              id="nombre"
              type="text"
              bind:value={formData.nombre}
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: Copa Corrientes Diversa 2024"
              required
            />
          </div>

          <!-- Descripción -->
          <div>
            <label
              for="descripcion"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Descripción *
            </label>
            <textarea
              id="descripcion"
              bind:value={formData.descripcion}
              rows="4"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe el torneo, sus objetivos y características..."
              required
            ></textarea>
          </div>

          <!-- Imagen de Fondo del Sitio -->
          <div>
            <span class="block text-sm font-medium text-gray-700 mb-2">
              Imagen de Fondo del Sitio
            </span>

            <!-- Preview de imagen actual -->
            {#if formData.imagenPrincipal}
              <div class="mb-4">
                <p class="text-sm text-gray-600 mb-2">Imagen actual:</p>
                <img
                  src={formData.imagenPrincipal}
                  alt="Imagen de fondo actual"
                  class="max-w-xs h-32 object-cover rounded-lg border border-gray-300"
                />
              </div>
            {/if}

            <!-- Input de archivo -->
            <div class="space-y-3">
              <div>
                <input
                  id="fondoFile"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  on:change={handleFondoFileSelect}
                  class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                  disabled={uploadingImage}
                />
                <p class="text-xs text-gray-500 mt-1">
                  Formatos permitidos: JPG, JPEG, PNG. Tamaño máximo: 5MB.
                  Dimensiones máximas: 3000x3000 píxeles
                </p>
              </div>

              <!-- Preview del archivo seleccionado -->
              {#if fondoFile}
                <div class="border border-gray-300 rounded-lg p-3 bg-gray-50">
                  <p class="text-sm font-medium text-gray-700 mb-2">
                    Archivo seleccionado:
                  </p>
                  <div class="flex items-center gap-3">
                    <img
                      src={URL.createObjectURL(fondoFile)}
                      alt="Preview"
                      class="w-16 h-16 object-cover rounded border"
                    />
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-800">
                        {fondoFile.name}
                      </p>
                      <p class="text-xs text-gray-500">
                        {(fondoFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      on:click={() => (fondoFile = null)}
                      class="text-red-500 hover:text-red-700 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              {/if}

              <!-- Estado de carga -->
              {#if uploadingImage}
                <div class="flex items-center gap-2 text-blue-600">
                  <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                      fill="none"
                    />
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span class="text-sm">Subiendo imagen...</span>
                </div>
              {/if}
            </div>
          </div>

          <!-- Organizador -->
          <div>
            <label
              for="organizadorId"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Organizador
            </label>
            <select
              id="organizadorId"
              bind:value={formData.organizadorId}
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={0}>Seleccionar organizador...</option>
              {#each organizadores as org}
                <option value={org.id}>{org.nombre}</option>
              {/each}
            </select>
          </div>

          <!-- Fundamentación -->
          <div>
            <label
              for="fundamentacionTitulo"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Título de Fundamentación *
            </label>
            <input
              id="fundamentacionTitulo"
              type="text"
              bind:value={formData.fundamentacionTitulo}
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: ¿Por qué este torneo?"
              required
            />
          </div>

          <!-- Textos de Fundamentación -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <span class="block text-sm font-medium text-gray-700">
                Textos de Fundamentación
              </span>
              <button
                type="button"
                on:click={() =>
                  (showFundamentacionEditor = !showFundamentacionEditor)}
                class="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {showFundamentacionEditor ? "Ocultar Editor" : "Mostrar Editor"}
              </button>
            </div>

            {#if showFundamentacionEditor}
              <div class="border border-gray-300 rounded-lg p-4 space-y-3">
                <!-- Agregar nuevo texto -->
                <div class="flex gap-2">
                  <input
                    type="text"
                    bind:value={nuevoTexto}
                    placeholder="Nuevo texto de fundamentación..."
                    class="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    on:keydown={(e) =>
                      e.key === "Enter" && addFundamentacionTexto()}
                  />
                  <button
                    type="button"
                    on:click={addFundamentacionTexto}
                    class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium transition-colors"
                  >
                    Agregar
                  </button>
                </div>

                <!-- Lista de textos -->
                <div class="space-y-2">
                  {#each fundamentacionTextos as texto, index}
                    <div class="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <span class="text-sm text-gray-500 w-6">{index + 1}.</span
                      >

                      {#if editingIndex === index}
                        <!-- Modo edición -->
                        <div class="flex-1 flex gap-2">
                          <textarea
                            bind:value={editingText}
                            class="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            rows="8"
                            on:keydown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                saveEditingTexto();
                              }
                              if (e.key === "Escape") cancelEditingTexto();
                            }}
                          ></textarea>
                          <div class="flex flex-col gap-1">
                            <button
                              type="button"
                              on:click={saveEditingTexto}
                              class="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                              title="Guardar"
                            >
                              ✓
                            </button>
                            <button
                              type="button"
                              on:click={cancelEditingTexto}
                              class="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                              title="Cancelar"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      {:else}
                        <!-- Modo visualización -->
                        <div class="flex-1 flex gap-2">
                          <textarea
                            value={texto}
                            disabled
                            class="flex-1 px-2 py-1 text-sm border border-gray-300 rounded bg-gray-100 text-gray-700 resize-none"
                            rows="2"
                          ></textarea>
                          <div class="flex flex-col gap-1">
                            <button
                              type="button"
                              on:click={() => startEditingTexto(index)}
                              class="p-2 text-blue-500 hover:text-blue-700"
                              title="Editar"
                            >
                              ✏️
                            </button>
                            <button
                              type="button"
                              on:click={() =>
                                moveFundamentacionTexto(index, "up")}
                              disabled={index === 0}
                              class="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                              title="Mover arriba"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              on:click={() =>
                                moveFundamentacionTexto(index, "down")}
                              disabled={index ===
                                fundamentacionTextos.length - 1}
                              class="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                              title="Mover abajo"
                            >
                              ↓
                            </button>
                            <button
                              type="button"
                              on:click={() => removeFundamentacionTexto(index)}
                              class="p-2 text-red-500 hover:text-red-700"
                              title="Eliminar"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      {/if}
                    </div>
                  {/each}
                </div>
              </div>
            {/if}
          </div>

          <!-- Botones de acción -->
          <div class="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={isLoading}
              class="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {isLoading ? "Guardando..." : torneo ? "Actualizar" : "Crear"}
            </button>
            <button
              type="button"
              on:click={cancelEditing}
              disabled={isLoading}
              class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      {:else}
        <!-- Vista de solo lectura -->
        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-800 mb-2">
                Nombre del Torneo
              </h3>
              <p class="text-gray-600">{torneo?.nombre || "No especificado"}</p>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-800 mb-2">
                Organizador
              </h3>
              <p class="text-gray-600">
                {torneo?.organizador?.nombre || "No especificado"}
              </p>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">
              Descripción
            </h3>
            <p class="text-gray-600 whitespace-pre-wrap">
              {torneo?.descripcion || "No especificada"}
            </p>
          </div>

          {#if torneo?.imagenPrincipal}
            <div>
              <h3 class="text-lg font-semibold text-gray-800 mb-2">
                Imagen de Fondo del Sitio
              </h3>
              <div class="bg-gray-50 p-4 rounded-lg">
                <img
                  src={torneo.imagenPrincipal}
                  alt="Imagen de fondo del sitio"
                  class="max-w-md h-auto rounded-lg shadow-md border border-gray-200"
                />
                <p class="text-sm text-gray-600 mt-2">
                  Esta imagen se utiliza como fondo principal del sitio web.
                </p>
              </div>
            </div>
          {/if}

          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">
              Fundamentación
            </h3>
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-medium text-gray-800 mb-3">
                {torneo?.fundamentacionTitulo || "Sin título"}
              </h4>
              {#if torneo?.fundamentacionTexto && Array.isArray(torneo.fundamentacionTexto) && torneo.fundamentacionTexto.length > 0}
                <ul class="space-y-2">
                  {#each torneo.fundamentacionTexto as texto}
                    <li class="text-gray-600">• {texto}</li>
                  {/each}
                </ul>
              {:else}
                <p class="text-gray-500 italic">
                  No hay textos de fundamentación
                </p>
              {/if}
            </div>
          </div>

          <!-- Estadísticas del torneo -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <div class="text-2xl font-bold text-blue-600">
                {torneo?.banners?.length || 0}
              </div>
              <div class="text-sm text-gray-600">Banners</div>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <div class="text-2xl font-bold text-green-600">
                {torneo?.deportes?.length || 0}
              </div>
              <div class="text-sm text-gray-600">Deportes</div>
            </div>
            <div class="text-center p-4 bg-purple-50 rounded-lg">
              <div class="text-2xl font-bold text-purple-600">
                {torneo?.deportes?.reduce(
                  (total, deporte) => total + (deporte.equipos?.length || 0),
                  0
                ) || 0}
              </div>
              <div class="text-sm text-gray-600">Equipos</div>
            </div>
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>
