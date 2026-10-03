/* ==========================================================
   Cartelera misteriosa — protección del contenido
   Dificulta copiar, descargar o inspeccionar imágenes, vídeo y audio.
   Ojo: en la web nada es 100 % privado; esto disuade, no blinda.
   ========================================================== */
(() => {
  'use strict';

  // 1. No permitir que otra web muestre la cartelera dentro de un <iframe>
  if (window.top !== window.self) {
    try { window.top.location = window.self.location; } catch { document.documentElement.remove(); }
  }

  const esMedia = (el) => el instanceof Element && !!el.closest('img, video, audio, svg, canvas, picture');

  // 2. Sin menú contextual (clic derecho / pulsación larga): evita "Guardar imagen/vídeo como…"
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  // 3. Sin arrastrar imágenes ni vídeo fuera de la página
  document.addEventListener('dragstart', (e) => {
    if (esMedia(e.target)) e.preventDefault();
  });

  // 4. Sin copiar ni seleccionar texto o elementos
  ['copy', 'cut', 'selectstart'].forEach((tipo) =>
    document.addEventListener(tipo, (e) => e.preventDefault()));

  // 5. Atajos para guardar, imprimir, ver el código o abrir las herramientas de desarrollo
  document.addEventListener('keydown', (e) => {
    const tecla = e.key.toLowerCase();
    const ctrl = e.ctrlKey || e.metaKey;
    const bloqueado =
      tecla === 'f12' ||
      (ctrl && ['s', 'u', 'p'].includes(tecla)) ||                     // guardar, ver código, imprimir
      (ctrl && e.shiftKey && ['i', 'j', 'c', 'k'].includes(tecla)) ||   // herramientas de desarrollo
      (e.metaKey && e.altKey && ['i', 'j', 'c', 'u'].includes(tecla));  // mismos atajos en Mac
    if (bloqueado) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  // 6. Vídeo y audio sin botón de descarga, sin imagen flotante y sin enviar a otra pantalla
  document.querySelectorAll('video, audio').forEach((m) => {
    m.setAttribute('controlsList', 'nodownload noplaybackrate');
    m.disablePictureInPicture = true;
    m.disableRemotePlayback = true;
    m.setAttribute('disablePictureInPicture', '');
    m.setAttribute('disableRemotePlayback', '');
  });
})();
