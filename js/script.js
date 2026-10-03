/* ==========================================================
   Cartelera misteriosa — interacción y efectos
   ========================================================== */
(() => {
  'use strict';

  const movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)');
  const quieto = () => movimientoReducido.matches;

  /* ---------- Utilidades ---------- */
  const azar = (min, max) => min + Math.random() * (max - min);

  /** Crea un elemento de partícula fijo en pantalla, lo anima y lo elimina al terminar. */
  function particula({ clase, html = '', x, y, ancho, alto, estilos = {}, fotogramas, opciones }) {
    const el = document.createElement('div');
    el.className = `particula ${clase}`;
    el.innerHTML = html;
    Object.assign(el.style, {
      left: `${x}px`,
      top: `${y}px`,
      ...(ancho && { width: `${ancho}px` }),
      ...(alto && { height: `${alto}px` }),
      ...estilos
    });
    document.body.appendChild(el);
    el.animate(fotogramas, { fill: 'both', ...opciones }).onfinish = () => el.remove();
    return el;
  }

  /** Traslación relativa al centro del elemento. */
  const mover = (dx, dy, extra = '') =>
    `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) ${extra}`;

  /* ---------- Puerta I: murciélagos que escapan ---------- */
  const SVG_MURCIELAGO =
    '<svg viewBox="0 0 64 32"><path fill="#06040a" stroke="#b8935a" stroke-width="1" d="M32 10 L28 4 L27 10 C20 2 10 2 2 8 C8 9 10 13 11 18 C14 14 18 14 21 18 C24 15 28 18 32 26 C36 18 40 15 43 18 C46 14 50 14 53 18 C54 13 56 9 62 8 C54 2 44 2 37 10 L36 4 Z"/></svg>';

  function soltarMurcielagos(r) {
    const x0 = r.left + r.width / 2;
    const y0 = r.top + r.height / 2;

    for (let i = 0; i < 14; i++) {
      const ang = -Math.PI * azar(0.1, 0.9);
      const dist = azar(260, 640);
      const dx = Math.cos(ang) * dist;
      const dy = Math.sin(ang) * dist;
      const esc = azar(0.7, 2);

      particula({
        clase: 'murcielago',
        html: SVG_MURCIELAGO,
        x: x0,
        y: y0,
        fotogramas: [
          { transform: 'translate(-50%,-50%) scale(0.2)', opacity: 0 },
          { transform: mover(dx * 0.4, dy * 0.4 + 30, `scale(${esc}) rotate(${azar(-15, 15)}deg)`), opacity: 1, offset: 0.3 },
          { transform: mover(dx, dy, `scale(${esc * 0.6}) rotate(${azar(-20, 20)}deg)`), opacity: 0 }
        ],
        opciones: { duration: azar(1500, 2700), delay: 250 + i * 45, easing: 'cubic-bezier(.2,.6,.3,1)' }
      });
    }
  }

  /* ---------- Puerta II: gotas carmesí y resplandor rojo ---------- */
  function derramar(r) {
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;

    const velo = document.createElement('div');
    velo.className = 'velo';
    velo.style.background = `radial-gradient(circle at ${cx}px ${cy}px, rgba(190,20,35,.55), transparent 65%)`;
    document.body.appendChild(velo);
    velo.animate(
      [{ opacity: 0 }, { opacity: 1, offset: 0.35 }, { opacity: 0 }],
      { duration: 1800, delay: 300, fill: 'both' }
    ).onfinish = () => velo.remove();

    for (let i = 0; i < 18; i++) {
      const t = azar(6, 15);
      const caida = r.height * azar(0.6, 1.2);

      particula({
        clase: 'gota',
        x: r.left + Math.random() * r.width,
        y: r.top + azar(20, 80),
        ancho: t,
        alto: t * 1.5,
        fotogramas: [
          { transform: 'translateY(0) scaleY(0.4)', opacity: 0 },
          { transform: `translateY(${caida * 0.15}px) scaleY(1.3)`, opacity: 1, offset: 0.2 },
          { transform: `translateY(${caida}px) scaleY(1)`, opacity: 0 }
        ],
        opciones: { duration: azar(1400, 2800), delay: 300 + i * 90, easing: 'cubic-bezier(.5,0,.9,.6)' }
      });
    }
  }

  /* ---------- Puerta III: destellos de luz, como hechizos ---------- */
  const SVG_DESTELLO =
    '<svg viewBox="0 0 40 40"><path fill="currentColor" d="M20 0 C21 12 28 19 40 20 C28 21 21 28 20 40 C19 28 12 21 0 20 C12 19 19 12 20 0 Z"/></svg>';
  const LUCES = ['#fff6d8', '#9fb4ff', '#d9a6ff', '#ffd27a'];

  function hechizar(r) {
    const x0 = r.left + r.width / 2;
    const y0 = r.top + r.height * 0.45;

    for (let i = 0; i < 26; i++) {
      const t = azar(10, 32);
      const ang = Math.random() * Math.PI * 2;
      const dist = azar(90, 390);
      const dx = Math.cos(ang) * dist;
      const dy = Math.sin(ang) * dist;
      const giro = (Math.random() < 0.5 ? -1 : 1) * azar(120, 360);

      particula({
        clase: 'destello',
        html: SVG_DESTELLO,
        x: x0,
        y: y0,
        ancho: t,
        alto: t,
        estilos: { color: LUCES[i % LUCES.length] },
        fotogramas: [
          { transform: 'translate(-50%,-50%) scale(0) rotate(0deg)', opacity: 0 },
          { transform: mover(dx * 0.6, dy * 0.6, `scale(1.3) rotate(${giro * 0.5}deg)`), opacity: 1, offset: 0.35 },
          { transform: mover(dx * 0.85, dy * 0.85, `scale(0.5) rotate(${giro * 0.8}deg)`), opacity: 0.9, offset: 0.7 },
          { transform: mover(dx, dy, `scale(0) rotate(${giro}deg)`), opacity: 0 }
        ],
        opciones: { duration: azar(1500, 2800), delay: 250 + i * 55, easing: 'cubic-bezier(.15,.7,.3,1)' }
      });
    }
  }

  /* ---------- 1 de noviembre: lluvia de pétalos de cempasúchil ---------- */
  const COLORES_PETALO = ['#f28c1b', '#f7a934', '#ffc94a', '#e3711d', '#e8457f'];

  function florecer(r) {
    const x0 = r.left + r.width / 2;
    const y0 = r.top + r.height * 0.4;

    for (let i = 0; i < 40; i++) {
      const t = azar(8, 16);
      const ang = -Math.PI * azar(0.05, 0.95); // hacia arriba, en abanico
      const dist = azar(120, 420);
      const dx = Math.cos(ang) * dist;
      const dy = Math.sin(ang) * dist;
      const caida = azar(250, 520);
      const giro = azar(-540, 540);

      particula({
        clase: 'petalo',
        x: x0,
        y: y0,
        ancho: t,
        alto: t,
        estilos: { background: COLORES_PETALO[i % COLORES_PETALO.length] },
        fotogramas: [
          { transform: 'translate(-50%,-50%) scale(0) rotate(0deg)', opacity: 0 },
          { transform: mover(dx, dy, `scale(1) rotate(${giro * 0.4}deg)`), opacity: 1, offset: 0.35 },
          { transform: mover(dx * 1.15 + azar(-60, 60), dy + caida, `scale(.8) rotate(${giro}deg)`), opacity: 0 }
        ],
        opciones: { duration: azar(2200, 3600), delay: 250 + i * 35, easing: 'cubic-bezier(.2,.7,.4,1)' }
      });
    }
  }

  const EFECTOS = {
    murcielagos: soltarMurcielagos,
    sangre: derramar,
    hechizo: hechizar,
    cempasuchil: florecer
  };

  /* ---------- Apertura de puertas ---------- */
  document.querySelectorAll('.marco').forEach((marco) => {
    const hoja = marco.querySelector('.hoja');
    const umbral = marco.querySelector('.umbral');
    const llamar = hoja.querySelector('.llamar');

    hoja.addEventListener('click', () => {
      const abierta = marco.classList.toggle('abierta');
      hoja.setAttribute('aria-expanded', String(abierta));
      umbral.setAttribute('aria-hidden', String(!abierta));
      llamar.textContent = abierta ? llamar.dataset.cerrar : llamar.dataset.abrir;

      const efecto = EFECTOS[marco.dataset.efecto];
      if (abierta && efecto && !quieto() && marco.animate) {
        efecto(marco.getBoundingClientRect());
      }
    });
  });

  /* ---------- Melodía en bucle ---------- */
  const melodia = document.getElementById('melodia');
  const botonMusica = document.getElementById('musica');
  const VOLUMEN = 0.6;
  // Solo dura mientras la página está abierta: al volver a entrar, la música suena otra vez
  let silenciada = false;

  function marcarBoton(sonando) {
    botonMusica.setAttribute('aria-pressed', String(sonando));
    botonMusica.setAttribute('aria-label', sonando ? 'Silenciar música' : 'Activar música');
  }

  /** Sube el volumen poco a poco para que la música no entre de golpe. */
  function fundido() {
    melodia.volume = 0;
    const inicio = performance.now();
    const paso = (t) => {
      const p = Math.min((t - inicio) / 2000, 1);
      melodia.volume = VOLUMEN * p;
      if (p < 1 && !melodia.paused) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  }

  function reproducir() {
    return melodia.play().then(() => {
      fundido();
      marcarBoton(true);
    });
  }

  function pausar() {
    melodia.pause();
    marcarBoton(false);
  }

  if (melodia && botonMusica) {
    botonMusica.addEventListener('click', (e) => {
      e.stopPropagation();
      if (melodia.paused) {
        silenciada = false;
        reproducir().catch(() => marcarBoton(false));
      } else {
        silenciada = true;
        pausar();
      }
    });

    // Siempre intenta sonar al abrir. Si el navegador bloquea el sonido automático,
    // arranca con el primer toque, clic o tecla en cualquier parte de la página.
    const arrancar = (e) => {
      if (botonMusica.contains(e.target)) return; // el propio botón ya lo gestiona
      if (silenciada || !melodia.paused) return quitar();
      reproducir().then(quitar, () => { /* sigue esperando otro gesto */ });
    };
    const quitar = () => {
      ['pointerdown', 'keydown', 'touchstart'].forEach((tipo) =>
        document.removeEventListener(tipo, arrancar, true));
    };

    reproducir().catch(() => {
      ['pointerdown', 'keydown', 'touchstart'].forEach((tipo) =>
        document.addEventListener(tipo, arrancar, { capture: true, passive: true }));
    });
  }

  /* ---------- Vídeo en bucle hasta el segundo indicado en data-fin ---------- */
  const video = document.querySelector('video[data-fin]');
  if (video) {
    const fin = parseFloat(video.dataset.fin);
    const alInicio = () => { video.currentTime = 0; };

    // Comprueba en cada fotograma (o en cada timeupdate si no hay soporte) para cortar justo a tiempo
    if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
      const vigilar = (_ahora, datos) => {
        if (datos.mediaTime >= fin) alInicio();
        video.requestVideoFrameCallback(vigilar);
      };
      video.requestVideoFrameCallback(vigilar);
    } else {
      video.addEventListener('timeupdate', () => {
        if (video.currentTime >= fin) alInicio();
      });
    }
  }

  /* ---------- Brasas que suben despacio por el fondo ---------- */
  const lienzo = document.getElementById('brasas');
  const ctx = lienzo && lienzo.getContext && lienzo.getContext('2d');
  if (!ctx) return;

  const TOTAL_BRASAS = 45;
  let ancho = 0;
  let alto = 0;
  let brasas = [];
  let idFrame = null;

  function medir() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ancho = window.innerWidth;
    alto = window.innerHeight;
    lienzo.width = Math.round(ancho * dpr);
    lienzo.height = Math.round(alto * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // data-modo="petalos" en el canvas: pétalos de cempasúchil que caen en lugar de brasas que suben
  const modoPetalos = lienzo.dataset.modo === 'petalos';

  const nuevaBrasa = (desdeElBorde) => ({
    x: Math.random() * ancho,
    y: desdeElBorde ? (modoPetalos ? -10 : alto + 10) : Math.random() * alto,
    r: modoPetalos ? azar(2.5, 5.5) : azar(0.6, 2.4),
    v: modoPetalos ? azar(0.35, 0.9) : azar(0.15, 0.6),
    f: Math.random() * Math.PI * 2,
    tono: azar(22, 42)
  });

  function pintarPetalo(b, t) {
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(t / 900 + b.f);
    ctx.beginPath();
    ctx.ellipse(0, 0, b.r, b.r * 0.55, 0, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${b.tono}, 92%, 55%, .85)`;
    ctx.fill();
    ctx.restore();
  }

  function pintar(t) {
    ctx.clearRect(0, 0, ancho, alto);
    for (let i = 0; i < brasas.length; i++) {
      let b = brasas[i];
      b.y += modoPetalos ? b.v : -b.v;
      b.x += Math.sin(t / 1400 + b.f) * (modoPetalos ? 0.6 : 0.25);
      if (modoPetalos ? b.y > alto + 10 : b.y < -10) b = brasas[i] = nuevaBrasa(true);

      if (modoPetalos) {
        pintarPetalo(b, t);
        continue;
      }
      const brillo = 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(t / 500 + b.f));
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(224,170,96,${brillo})`;
      ctx.fill();
    }
    idFrame = requestAnimationFrame(pintar);
  }

  function iniciar() {
    if (idFrame !== null || quieto() || document.hidden) return;
    idFrame = requestAnimationFrame(pintar);
  }

  function detener() {
    if (idFrame !== null) cancelAnimationFrame(idFrame);
    idFrame = null;
  }

  let temporizadorResize;
  window.addEventListener('resize', () => {
    clearTimeout(temporizadorResize);
    temporizadorResize = setTimeout(medir, 150);
  });

  // Ahorra batería: pausa cuando la pestaña no está visible
  document.addEventListener('visibilitychange', () => (document.hidden ? detener() : iniciar()));

  // Respeta cambios en la preferencia de movimiento reducido en caliente
  movimientoReducido.addEventListener?.('change', () => {
    if (quieto()) {
      detener();
      ctx.clearRect(0, 0, ancho, alto);
    } else {
      iniciar();
    }
  });

  medir();
  brasas = Array.from({ length: TOTAL_BRASAS }, () => nuevaBrasa(false));
  iniciar();
})();
