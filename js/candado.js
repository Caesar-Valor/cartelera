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
  const yaLlego = (texto) => Date.now() >= fecha(texto).getTime();

  // 1. Página bloqueada: vuelve a la portada antes de mostrarse
  const desdePagina = document.documentElement.dataset.desde;
  if (desdePagina && !yaLlego(desdePagina)) {
    document.documentElement.style.display = 'none';
    location.replace('index.html');
    return;
  }

  // 2. Puertas de la portada: se abren solas cuando llega su fecha
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
