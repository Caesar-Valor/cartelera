/* ==========================================================
   Cartelera misteriosa — transición al entrar por una puerta (portada)
   1. La puerta se abre hacia dentro y deja salir luz.
   2. La cámara "entra" por la puerta y todo se funde a negro.
   3. Se carga la página de esa noche.
   ========================================================== */
(() => {
  'use strict';

  const quieto = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let entrando = false;

  /** Prepara la hoja y la luz de cada puerta (invisibles hasta que se usa). */
  document.querySelectorAll('.noche').forEach((puerta) => {
    const luz = document.createElement('span');
    luz.className = 'noche__luz';
    const hoja = document.createElement('span');
    hoja.className = 'noche__hoja';
    puerta.append(luz, hoja);
  });

  const cortina = document.createElement('div');
  cortina.className = 'cortina';
  cortina.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cortina);

  document.addEventListener('click', (e) => {
    const puerta = e.target.closest('a.noche');
    if (!puerta) return;

    const destino = puerta.getAttribute('href');
    // Puertas cerradas, clic con Ctrl/Cmd (nueva pestaña) o movimiento reducido: comportamiento normal
    if (!destino || puerta.classList.contains('noche--cerrada')) return;
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
    if (quieto() || !puerta.animate) return;

    e.preventDefault();
    if (entrando) return;
    entrando = true;

    const r = puerta.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const main = document.querySelector('main');
    const hoja = puerta.querySelector('.noche__hoja');
    const luz = puerta.querySelector('.noche__luz');

    puerta.classList.add('noche--entrando');
    document.body.classList.add('transicionando');

    // 1. La hoja aparece sobre la puerta y se abre hacia dentro
    hoja.animate([
      { opacity: 0, transform: 'rotateY(0deg)' },
      { opacity: 1, transform: 'rotateY(0deg)', offset: 0.2 },
      { opacity: 1, transform: 'rotateY(-105deg)' }
    ], { duration: 1100, easing: 'cubic-bezier(.6,.05,.25,1)', fill: 'forwards' });

    // La luz del otro lado se enciende mientras se abre
    luz.animate([
      { opacity: 0 },
      { opacity: 0, offset: 0.25 },
      { opacity: 1 }
    ], { duration: 1100, easing: 'ease-out', fill: 'forwards' });

    // 2. La cámara entra por la puerta
    const m = main.getBoundingClientRect();
    main.style.transformOrigin = `${cx - m.left}px ${cy - m.top}px`;
    main.animate([
      { transform: 'scale(1)', filter: 'blur(0)' },
      { transform: 'scale(1)', filter: 'blur(0)', offset: 0.45 },
      { transform: 'scale(4.5)', filter: 'blur(2px)' }
    ], { duration: 1900, easing: 'cubic-bezier(.55,0,.7,.2)', fill: 'forwards' });

    // Destello de luz desde la puerta y luego negro
    cortina.style.setProperty('--x', `${cx}px`);
    cortina.style.setProperty('--y', `${cy}px`);
    const fundido = cortina.animate([
      { opacity: 0 },
      { opacity: 0, offset: 0.5 },
      { opacity: 1 }
    ], { duration: 1900, easing: 'ease-in', fill: 'forwards' });

    // 3. Cargar la página de la noche
    fundido.onfinish = () => { location.href = destino; };
  });

  // Al volver con "atrás", la portada debe verse normal y no a mitad de la transición
  window.addEventListener('pageshow', (e) => {
    if (!e.persisted) return;
    entrando = false;
    document.body.classList.remove('transicionando');
    document.querySelectorAll('.noche--entrando').forEach((p) => p.classList.remove('noche--entrando'));
    document.querySelectorAll('main, .cortina, .noche__hoja, .noche__luz')
      .forEach((el) => el.getAnimations().forEach((a) => a.cancel()));
  });
})();
