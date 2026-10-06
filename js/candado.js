/* ==========================================================
   Cartelera misteriosa — candado por fecha
   - En una página: <html data-desde="AAAA-MM-DD"> → antes de esa fecha
     se vuelve a la portada sin llegar a mostrarse.
   - En la portada: <a class="noche" data-desde="AAAA-MM-DD" data-href="..."
     data-estado="..."> → la puerta se abre sola cuando llega el día.
   Se carga en el <head> SIN defer para actuar antes de que se pinte nada.
   ========================================================== */
(() => {
  'use strict';

  /** "2026-11-01" → medianoche de ese día en la hora local. */
  const fecha = (texto) => {
    const [a, m, d] = texto.split('-').map(Number);
    return new Date(a, m - 1, d);
  };
  // Vista previa: en true abre todas las puertas sin esperar a su fecha.
  // Solo funciona en este equipo (archivo local o localhost), nunca en la web publicada.
  const VISTA_PREVIA = false;
  const enLocal = ['', 'localhost', '127.0.0.1'].includes(location.hostname);

  const yaLlego = (texto) => (VISTA_PREVIA && enLocal) || Date.now() >= fecha(texto).getTime();

  // 1. Página bloqueada: vuelve a la portada antes de mostrarse
  const desdePagina = document.documentElement.dataset.desde;
  if (desdePagina && !yaLlego(desdePagina)) {
    document.documentElement.style.display = 'none';
    location.replace('index.html');
    return;
  }

  // 2. Fotos de las puertas: <img class="umbral__foto" data-src="..."> no se carga
  //    hasta las 17:00 del día de la página; antes, la puerta se ve sin foto.
  const HORA_FOTOS = 17;
  // En true enseña las fotos antes de hora, solo en este equipo (para revisarlas)
  const VISTA_PREVIA_FOTOS = false;
  const revelarFotos = () => {
    document.querySelectorAll('.umbral__foto[data-src]').forEach((foto) => {
      foto.src = foto.dataset.src;
      foto.removeAttribute('data-src');
      foto.closest('.umbral').classList.add('umbral--foto');
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    const fotos = document.querySelectorAll('.umbral__foto[data-src]');
    if (!fotos.length || !desdePagina) return;

    const falta = fecha(desdePagina).getTime() + HORA_FOTOS * 3600e3 - Date.now();
    if (falta <= 0 || (VISTA_PREVIA_FOTOS && enLocal)) return revelarFotos();

    // Aún no es la hora: sin foto ni velo, y se revelan solas si la página sigue abierta
    fotos.forEach((foto) => foto.closest('.umbral').classList.remove('umbral--foto'));
    // (setTimeout se dispara al instante con esperas de más de ~24 días)
    if (falta < 2 ** 31) setTimeout(revelarFotos, falta);
  });

  // 3. Puertas de la portada: se abren solas cuando llega su fecha
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.noche[data-desde]').forEach((puerta) => {
      if (!yaLlego(puerta.dataset.desde)) return;
      puerta.href = puerta.dataset.href;
      puerta.classList.remove('noche--cerrada');
      puerta.removeAttribute('aria-disabled');
      const estado = puerta.querySelector('.noche__estado');
      if (estado && puerta.dataset.estado) estado.textContent = puerta.dataset.estado;
    });
  });
})();
