<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;

  $: podios = data.podios;
  $: deportes = data.deportes;
  $: selectedDeporteId = "";

  // Reactive filtered podios
  $: filteredPodios = selectedDeporteId
    ? podios.filter((p) => p.deporteId === parseInt(selectedDeporteId))
    : podios;

  // Reactive filtered deportes (for display)
  $: filteredDeportes = selectedDeporteId
    ? deportes.filter((d) => d.id === parseInt(selectedDeporteId))
    : deportes;

  function filterByDeporte(deporteId: string) {
    selectedDeporteId = deporteId;
  }

  function getPuestoEmoji(puesto: number) {
    switch (puesto) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return "🏅";
    }
  }

  function getPuestoColor(puesto: number) {
    switch (puesto) {
      case 1:
        return "from-yellow-400 to-yellow-600";
      case 2:
        return "from-gray-300 to-gray-500";
      case 3:
        return "from-orange-400 to-orange-600";
      default:
        return "from-blue-400 to-blue-600";
    }
  }
</script>

<svelte:head>
  <title>Podios - Copa Corrientes Diversa</title>
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-8">
  <div class="text-center mb-8 md:mb-12 text-gray-800 px-4">
    <h1 class="text-2xl md:text-4xl font-bold mb-4 drop-shadow-lg">
      🏆 Podios Copa Corrientes Diversa
    </h1>
    <p class="text-base md:text-lg lg:text-xl opacity-90">
      Los equipos/participantes destacados de cada deporte
    </p>
  </div>

  <!-- Filtro por deporte -->
  <div class="mb-6 md:mb-8 px-4">
    <div class="bg-white rounded-lg p-4 md:p-6 shadow-lg">
      <label
        for="deporte-filter"
        class="block font-semibold text-gray-800 mb-3"
      >
        Filtrar por Deporte:
      </label>
      <select
        id="deporte-filter"
        bind:value={selectedDeporteId}
        on:change={() => filterByDeporte(selectedDeporteId)}
        class="w-full p-3 border-2 border-gray-300 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-blue-500"
      >
        <option value="">Todos los deportes</option>
        {#each deportes as deporte}
          <option value={deporte.id}>{deporte.nombre}</option>
        {/each}
      </select>
    </div>
  </div>

  <!-- Podios agrupados por deporte -->
  {#each filteredDeportes as deporte}
    {@const deportePodios = filteredPodios.filter(
      (p) => p.deporteId === deporte.id
    )}
    {#if deportePodios.length > 0}
      <div class="mb-8 md:mb-12 px-4">
        <h2
          class="text-xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6 text-center"
        >
          {deporte.nombre}
        </h2>

        <!-- Podium Display -->
        <div class="bg-white rounded-2xl shadow-lg p-4 md:p-8">
          {#if deportePodios.length >= 3}
            <!-- Podium with 3 positions -->
            <div
              class="flex justify-center items-end gap-2 md:gap-4 mb-6 md:mb-8 overflow-x-auto pb-2"
            >
              <!-- 2nd Place -->
              {#each deportePodios.filter((p) => p.puesto === 2) as segundo}
                <div class="flex flex-col items-center min-w-[120px]">
                  <div
                    class="bg-gradient-to-b from-gray-300 to-gray-500 text-white rounded-t-lg p-2 md:p-4 w-24 md:w-32 h-16 md:h-24 flex items-center justify-center text-xl md:text-2xl"
                  >
                    🥈
                  </div>
                  <div
                    class="bg-gray-500 text-white p-2 md:p-3 w-24 md:w-32 text-center"
                  >
                    <div class="font-bold text-sm md:text-lg truncate">
                      {segundo.equipoNombre}
                    </div>
                    <div class="text-xs md:text-sm">2° Lugar</div>
                  </div>
                </div>
              {/each}

              <!-- 1st Place -->
              {#each deportePodios.filter((p) => p.puesto === 1) as primero}
                <div class="flex flex-col items-center min-w-[140px]">
                  <div
                    class="bg-gradient-to-b from-yellow-400 to-yellow-600 text-white rounded-t-lg p-2 md:p-4 w-28 md:w-36 h-20 md:h-32 flex items-center justify-center text-2xl md:text-3xl"
                  >
                    🥇
                  </div>
                  <div
                    class="bg-yellow-600 text-white p-2 md:p-4 w-28 md:w-36 text-center"
                  >
                    <div class="font-bold text-sm md:text-xl truncate">
                      {primero.equipoNombre}
                    </div>
                    <div class="text-xs md:text-sm">1° Lugar</div>
                  </div>
                </div>
              {/each}

              <!-- 3rd Place -->
              {#each deportePodios.filter((p) => p.puesto === 3) as tercero}
                <div class="flex flex-col items-center min-w-[120px]">
                  <div
                    class="bg-gradient-to-b from-orange-400 to-orange-600 text-white rounded-t-lg p-2 md:p-4 w-24 md:w-32 h-14 md:h-20 flex items-center justify-center text-lg md:text-2xl"
                  >
                    🥉
                  </div>
                  <div
                    class="bg-orange-600 text-white p-2 md:p-3 w-24 md:w-32 text-center"
                  >
                    <div class="font-bold text-sm md:text-lg truncate">
                      {tercero.equipoNombre}
                    </div>
                    <div class="text-xs md:text-sm">3° Lugar</div>
                  </div>
                </div>
              {/each}
            </div>
          {/if}

          <!-- Complete Results Table -->
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead
                class="bg-gradient-to-r from-blue-900 to-blue-700 text-white"
              >
                <tr>
                  <th
                    class="px-4 md:px-6 py-3 md:py-4 text-center font-semibold text-sm md:text-base"
                    >Puesto</th
                  >
                  <th
                    class="px-4 md:px-6 py-3 md:py-4 text-left font-semibold text-sm md:text-base"
                    >Equipo/Participante</th
                  >
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                {#each deportePodios.sort((a, b) => a.puesto - b.puesto) as podio}
                  <tr class="hover:bg-gray-50 transition-colors duration-200">
                    <td class="px-4 md:px-6 py-3 md:py-4 text-center">
                      <div
                        class="flex items-center justify-center gap-2 md:gap-3"
                      >
                        <span class="text-2xl md:text-3xl"
                          >{getPuestoEmoji(podio.puesto)}</span
                        >
                        <div class="flex flex-col items-center">
                          <span class="font-bold text-lg md:text-xl"
                            >{podio.puesto}°</span
                          >
                          <span class="text-xs text-gray-500 hidden md:block"
                            >Lugar</span
                          >
                        </div>
                      </div>
                    </td>
                    <td class="px-4 md:px-6 py-3 md:py-4">
                      <div
                        class="font-medium text-gray-900 text-base md:text-lg"
                      >
                        {podio.equipoNombre}
                      </div>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    {/if}
  {/each}

  {#if filteredPodios.length === 0}
    <div class="bg-white rounded-2xl p-16 shadow-lg text-center">
      <div class="text-8xl mb-6">🏆</div>
      <h2 class="text-2xl font-bold text-gray-800 mb-4">
        {#if selectedDeporteId}
          No hay podios para {filteredDeportes[0]?.nombre || "este deporte"}
        {:else}
          No hay podios registrados aún
        {/if}
      </h2>
      <p class="text-gray-600 text-lg">
        {#if selectedDeporteId}
          Los resultados para {filteredDeportes[0]?.nombre || "este deporte"} se
          publicarán pronto.
        {:else}
          Los resultados de la Copa Corrientes Diversa se publicarán
          próximamente.
        {/if}
      </p>
    </div>
  {/if}

  <!-- Estadísticas generales -->
  {#if podios.length > 0}
    <div
      class="mt-12 md:mt-16 bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-6 md:p-8 text-white text-center mx-4"
    >
      <h3 class="text-xl md:text-2xl font-bold mb-4">
        🏅 Estadísticas del Torneo
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div class="bg-white bg-opacity-20 rounded-lg p-3 md:p-4 text-gray-800">
          <div class="text-2xl md:text-3xl font-bold">{deportes.length}</div>
          <div class="text-xs md:text-sm opacity-90">Deportes</div>
        </div>
        <div
          class="bg-white bg-opacity-20 rounded-lg p-3 md:p-4 text-green-800"
        >
          <div class="text-2xl md:text-3xl font-bold">{podios.length}</div>
          <div class="text-xs md:text-sm opacity-90">
            Equipos/Participantes en Podios
          </div>
        </div>
        <div
          class="bg-white bg-opacity-20 rounded-lg p-3 md:p-4 text-yellow-600"
        >
          <div class="text-2xl md:text-3xl font-bold">
            {podios.filter((p) => p.puesto === 1).length}
          </div>
          <div class="text-xs md:text-sm opacity-90">Campeones</div>
        </div>
      </div>
    </div>
  {/if}
</div>
