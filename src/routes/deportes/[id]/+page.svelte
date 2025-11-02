<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;

  let showCopyAlert = false;

  // Usar los datos que vienen del servidor
  $: deporte = data.deporte;
  $: org = data.organizador;
  $: equipos = deporte?.equipos || [];

  function copiarCbu() {
    if (org?.cbu) {
      navigator.clipboard.writeText(org.cbu);
      showCopyAlert = true;
      setTimeout(() => {
        showCopyAlert = false;
      }, 2000);
    }
  }

  function formatearFecha(fechaISO: string): string {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString("es-AR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
</script>

<svelte:head>
  <title>{deporte?.nombre || "Deporte"} - Copa Corrientes Diversa</title>
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-8">
  {#if deporte}
    <!-- Header mejorado -->
    <div class="text-center mb-8 md:mb-12 text-gray-800 px-4">
      <a
        href="/deportes"
        class="inline-flex items-center gap-2 text-blue-900 hover:text-blue-700 transition-colors duration-200 font-medium mb-6"
      >
        <i class="bi bi-arrow-left"></i> Volver a deportes
      </a>
      <h1 class="text-2xl md:text-4xl font-bold mb-4 drop-shadow-lg">
        🏆 {deporte.nombre}
      </h1>
      <p class="text-base md:text-lg lg:text-xl opacity-90">
        Información detallada, horarios, ubicaciones y documentos del deporte
      </p>
    </div>

    <!-- Equipos participantes -->
    {#if equipos && equipos.length > 0}
      <div class="mb-8 md:mb-12 px-4">
        <h2
          class="text-xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6 text-center"
        >
          Equipos/Participantes
        </h2>
        <div class="bg-white rounded-2xl shadow-lg p-4 md:p-8">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead
                class="bg-gradient-to-r from-blue-900 to-blue-700 text-white"
              >
                <tr>
                  <th
                    class="px-4 md:px-6 py-3 md:py-4 text-center font-semibold text-sm md:text-base"
                    >Escudo</th
                  >
                  <th
                    class="px-4 md:px-6 py-3 md:py-4 text-left font-semibold text-sm md:text-base"
                    >Equipo/Participante</th
                  >
                  <th
                    class="px-4 md:px-6 py-3 md:py-4 text-center font-semibold text-sm md:text-base"
                    >Tipo</th
                  >
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                {#each equipos as equipo}
                  <tr class="hover:bg-gray-50 transition-colors duration-200">
                    <td class="px-4 md:px-6 py-3 md:py-4 text-center">
                      <img
                        src={equipo.urlLogo || "/equipos/sin-logo.jpg"}
                        alt={equipo.nombre}
                        class="w-8 h-8 md:w-12 md:h-12 object-contain rounded-lg border border-gray-200 mx-auto"
                      />
                    </td>
                    <td class="px-4 md:px-6 py-3 md:py-4">
                      <div
                        class="font-medium text-gray-900 text-sm md:text-base"
                      >
                        {equipo.nombre}
                      </div>
                    </td>
                    <td class="px-4 md:px-6 py-3 md:py-4 text-center">
                      <span
                        class="inline-flex items-center px-3 py-1 rounded-full text-xs md:text-sm font-medium {equipo.local
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'}"
                      >
                        {equipo.local ? "Local" : "Visitante"}
                      </span>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    {/if}

    <!-- Información principal -->
    <div class="px-4 mb-8 md:mb-12">
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
      >
        <!-- Horarios de competencia -->
        {#if deporte.horarios && deporte.horarios.length > 0}
          <div
            class="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden"
          >
            <div
              class="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-4 md:p-6 font-semibold flex items-center gap-3"
            >
              <i class="bi bi-clock text-lg md:text-xl"></i>
              <span class="text-sm md:text-base">Fechas de Competencia</span>
            </div>
            <div class="p-4 md:p-6">
              {#each deporte.fechasCompetencia as fecha}
                <p
                  class="py-2 border-b border-gray-100 last:border-b-0 text-sm md:text-base"
                >
                  {formatearFecha(fecha)}
                </p>
              {/each}
              <ul
                class="space-y-2 mt-4 text-gray-600 border-t border-gray-300 pt-4"
              >
                <p
                  class="py-2 border-b border-gray-100 last:border-b-0 font-semibold text-sm md:text-base"
                >
                  Descripción de los horarios:
                </p>
                {#each deporte.horarios as horario}
                  <li
                    class="py-2 border-b border-gray-100 last:border-b-0 text-sm md:text-base"
                  >
                    {horario}
                  </li>
                {/each}
              </ul>
            </div>
          </div>
        {/if}

        <!-- Ubicación -->
        {#if deporte.locationsNombre && deporte.locationsNombre.length > 0}
          <div
            class="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden"
          >
            <div
              class="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-4 md:p-6 font-semibold flex items-center gap-3"
            >
              <i class="bi bi-geo-alt-fill text-lg md:text-xl"></i>
              <span class="text-sm md:text-base">Ubicación</span>
            </div>
            <div class="p-4 md:p-6">
              {#each deporte.locationsNombre as location, index}
                <div class="py-2">
                  <p class="mb-2 text-sm md:text-base">{location}</p>
                  {#if deporte.locationsUrl && deporte.locationsUrl[index]}
                    <a
                      href={deporte.locationsUrl[index]}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs md:text-sm font-medium transition-colors duration-200"
                    >
                      <i class="bi bi-map"></i> Ver mapa
                    </a>
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Redes Sociales del Deporte -->
        {#if deporte.redesSociales && (deporte.redesSociales.instagram || deporte.redesSociales.facebook || deporte.redesSociales.twitter || deporte.redesSociales.tiktok || deporte.redesSociales.youtube)}
          <div
            class="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden"
          >
            <div
              class="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-4 md:p-6 font-semibold flex items-center gap-3"
            >
              <i class="bi bi-share text-lg md:text-xl"></i>
              <span class="text-sm md:text-base">Sponsors y Redes</span>
            </div>
            <div class="p-4 md:p-6">
              <p class="mb-3 text-gray-600 text-sm md:text-base">
                Síguenos en nuestras redes:
              </p>
              <div class="overflow-x-auto">
                <div class="flex flex-wrap gap-2">
                  {#if deporte.redesSociales.instagram}
                    {#each deporte.redesSociales.instagram as red}
                      <a
                        href={red.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap shadow-sm hover:shadow-md max-w-full"
                      >
                        <i class="bi bi-instagram text-xs flex-shrink-0"></i>
                        <span class="truncate max-w-[150px]">@{red.nombre}</span
                        >
                      </a>
                    {/each}
                  {/if}
                  {#if deporte.redesSociales.facebook}
                    {#each deporte.redesSociales.facebook as red}
                      <a
                        href={red.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap shadow-sm hover:shadow-md max-w-full"
                      >
                        <i class="bi bi-facebook text-xs flex-shrink-0"></i>
                        <span class="truncate max-w-[150px]">{red.nombre}</span>
                      </a>
                    {/each}
                  {/if}
                  {#if deporte.redesSociales.twitter}
                    {#each deporte.redesSociales.twitter as red}
                      <a
                        href={red.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-sky-500 hover:bg-sky-600 text-white rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap shadow-sm hover:shadow-md max-w-full"
                      >
                        <i class="bi bi-twitter text-xs flex-shrink-0"></i>
                        <span class="truncate max-w-[150px]">@{red.nombre}</span
                        >
                      </a>
                    {/each}
                  {/if}
                  {#if deporte.redesSociales.tiktok}
                    {#each deporte.redesSociales.tiktok as red}
                      <a
                        href={red.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black hover:bg-gray-800 text-white rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap shadow-sm hover:shadow-md max-w-full"
                      >
                        <i class="bi bi-tiktok text-xs flex-shrink-0"></i>
                        <span class="truncate max-w-[150px]">@{red.nombre}</span
                        >
                      </a>
                    {/each}
                  {/if}
                  {#if deporte.redesSociales.youtube}
                    {#each deporte.redesSociales.youtube as red}
                      <a
                        href={red.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap shadow-sm hover:shadow-md max-w-full"
                      >
                        <i class="bi bi-youtube text-xs flex-shrink-0"></i>
                        <span class="truncate max-w-[150px]">{red.nombre}</span>
                      </a>
                    {/each}
                  {/if}
                </div>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>

    <!-- Documentos -->
    <div class="px-4 mb-8 md:mb-12">
      <h2
        class="text-xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6 text-center"
      >
        <i class="bi bi-file-earmark-medical-fill"></i> Documentos
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {#if deporte.reglamento}
          <a
            href={deporte.reglamento}
            target="_blank"
            class="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 text-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group"
          >
            <i class="bi bi-file-text text-4xl md:text-5xl text-blue-900 mb-4"
            ></i>
            <h3 class="text-lg md:text-xl font-semibold text-blue-900 mb-2">
              Reglamento
            </h3>
            <p class="text-gray-600 text-sm md:text-base">
              Ver reglamento oficial
            </p>
          </a>
        {/if}
        {#if deporte.fixture}
          <a
            href={deporte.fixture}
            target="_blank"
            class="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 text-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group"
          >
            <i class="bi bi-diagram-3 text-4xl md:text-5xl text-blue-900 mb-4"
            ></i>
            <h3 class="text-lg md:text-xl font-semibold text-blue-900 mb-2">
              Fixture
            </h3>
            <p class="text-gray-600 text-sm md:text-base">Ver el Fixture</p>
          </a>
        {/if}
        {#if deporte.planilla}
          <a
            href={deporte.planilla}
            target="_blank"
            class="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 text-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group"
          >
            <i
              class="bi bi-file-earmark-spreadsheet text-4xl md:text-5xl text-blue-900 mb-4"
            ></i>
            <h3 class="text-lg md:text-xl font-semibold text-blue-900 mb-2">
              Planilla de Inscripción
            </h3>
            <p class="text-gray-600 text-sm md:text-base">Descargar planilla</p>
          </a>
        {/if}
      </div>
    </div>

    <!-- Grupo de WhatsApp -->
    {#if deporte.grupoUrlWhatsapp}
      <div class="px-4 mb-8 md:mb-12">
        <div
          class="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden"
        >
          <div
            class="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 md:p-6 font-semibold flex items-center gap-3"
          >
            <i class="bi bi-whatsapp text-lg md:text-xl"></i>
            <span class="text-sm md:text-base">Únete al grupo de WhatsApp</span>
          </div>
          <div class="p-4 md:p-6 text-center">
            <p class="text-gray-600 mb-4 text-sm md:text-base">
              Mantente informado y conecta con otros participantes
            </p>
            <a
              href={deporte.grupoUrlWhatsapp}
              target="_blank"
              class="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 text-sm md:text-base"
            >
              <i class="bi bi-whatsapp"></i> Unirse al grupo
            </a>
          </div>
        </div>
      </div>
    {/if}

    <!-- Información de pago -->
    {#if org}
      <div class="px-4 mb-8 md:mb-12">
        <h2
          class="text-xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6 text-center"
        >
          <i class="bi bi-credit-card-fill"></i> Información de Inscripción
        </h2>
        <div
          class="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden"
        >
          <div
            class="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-4 md:p-6 font-semibold flex items-center gap-3"
          >
            <i class="bi bi-credit-card text-lg md:text-xl"></i>
            <span class="text-sm md:text-base">Datos de Pago</span>
          </div>
          <div class="p-4 md:p-6">
            <div class="space-y-4">
              <div class="flex flex-col sm:flex-row sm:items-center gap-3">
                <strong class="text-gray-700 text-sm md:text-base">CBU:</strong>
                <input
                  type="text"
                  value={org.cbu}
                  readonly
                  class="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-lg font-mono text-xs md:text-sm bg-gray-50"
                />
                <button
                  class="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm md:text-base"
                  on:click={copiarCbu}
                >
                  <i class="bi bi-copy"></i> Copiar
                </button>
              </div>
              {#if org.alias}
                <p class="text-sm md:text-base">
                  <strong class="text-gray-700">Alias:</strong>
                  <span class="text-blue-900">{org.alias}</span>
                </p>
              {/if}
              {#if org.nombre}
                <p class="text-sm md:text-base">
                  <strong class="text-gray-700">Titular:</strong>
                  <span class="text-blue-900">{org.nombre}</span>
                </p>
              {/if}
            </div>
            {#if showCopyAlert}
              <div
                class="mt-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2 text-sm md:text-base"
              >
                <i class="bi bi-check-circle"></i> CBU copiado al portapapeles
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/if}

    <!-- Contacto -->
    {#if org}
      <div class="px-4 mb-8 md:mb-12">
        <div class="text-center bg-gray-50 rounded-2xl p-6 md:p-8 shadow-lg">
          <h3 class="text-xl md:text-2xl font-bold text-blue-900 mb-2">
            ¿Tienes dudas?
          </h3>
          <p class="text-gray-600 mb-6 text-sm md:text-base">
            Contáctanos para más información
          </p>
          <div class="flex flex-wrap gap-3 md:gap-4 justify-center">
            {#if org.celularWhatsapp}
              <a
                href="https://wa.me/{org.celularWhatsapp}"
                target="_blank"
                class="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 md:px-6 py-3 rounded-lg font-semibold transition-colors duration-200 text-sm md:text-base"
              >
                <i class="bi bi-whatsapp"></i> WhatsApp
              </a>
            {/if}
            {#if org.mails && org.mails.length > 0}
              <a
                href="mailto:{org.mails[0]}"
                class="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 md:px-6 py-3 rounded-lg font-semibold transition-colors duration-200 text-sm md:text-base"
              >
                <i class="bi bi-envelope"></i> Email
              </a>
            {/if}
          </div>
        </div>
      </div>
    {/if}
  {:else}
    <div class="px-4">
      <div class="bg-white rounded-2xl shadow-lg p-12 md:p-16 text-center">
        <div class="text-8xl mb-6">🏆</div>
        <h2 class="text-xl md:text-2xl font-bold text-gray-800 mb-4">
          Deporte no encontrado
        </h2>
        <p class="text-gray-600 mb-6 text-sm md:text-lg">
          El deporte que buscas no existe o está siendo cargado.
        </p>
        <a
          href="/deportes"
          class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 text-sm md:text-base"
        >
          <i class="bi bi-arrow-left"></i> Volver a deportes
        </a>
      </div>
    </div>
  {/if}
</div>

<!-- Todo convertido a clases de Tailwind CSS -->
