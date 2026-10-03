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

  /* ---------- 10 de octubre, puerta I: magia de luz en todos los colores ---------- */
  const AROS = ['#ff7ad9', '#ffd27a', '#7af0ff', '#b48cff', '#8dffb0'];
  const TOTAL_ORBES = 44;
  const PASOS_ESPIRAL = 6;

  function iluminar(r) {
    const x0 = r.left + r.width / 2;
    const y0 = r.top + r.height * 0.45;
    const lado = r.width * 0.5;

    // Aros de luz que se expanden desde la puerta, uno de cada color
    AROS.forEach((color, i) => {
      particula({
        clase: 'aro',
        x: x0,
        y: y0,
        ancho: lado,
        alto: lado,
        estilos: { color },
        fotogramas: [
          { transform: 'translate(-50%,-50%) scale(0.1)', opacity: 0 },
          { opacity: 0.9, offset: 0.25 },
          { transform: 'translate(-50%,-50%) scale(3.6)', opacity: 0 }
        ],
        opciones: { duration: 1900, delay: 250 + i * 170, easing: 'cubic-bezier(.15,.7,.3,1)' }
      });
    });

    // Orbes de luz que salen en espiral recorriendo todo el arcoíris
    for (let i = 0; i < TOTAL_ORBES; i++) {
      const t = azar(8, 20);
      const inicio = Math.random() * Math.PI * 2;
      const giro = (Math.random() < 0.5 ? -1 : 1) * azar(Math.PI, Math.PI * 2.5);
      const radio = azar(140, 430);

      const fotogramas = Array.from({ length: PASOS_ESPIRAL + 1 }, (_, k) => {
        const p = k / PASOS_ESPIRAL;
        const ang = inicio + giro * p;
        const extremo = k === 0 || k === PASOS_ESPIRAL;
        return {
          transform: mover(Math.cos(ang) * radio * p, Math.sin(ang) * radio * p - 60 * p, `scale(${k === 0 ? 0 : 1.3 - p})`),
          opacity: extremo ? 0 : 1
        };
      });

      particula({
        clase: 'orbe',
        x: x0,
        y: y0,
        ancho: t,
        alto: t,
        estilos: { color: `hsl(${Math.round((i * 360) / TOTAL_ORBES)}, 100%, 70%)` },
        fotogramas,
        opciones: { duration: azar(1800, 3200), delay: 250 + i * 30, easing: 'ease-out' }
      });
    }
  }

  /* ---------- 10 de octubre, puerta II: rayos que caen sobre la puerta ---------- */
  const CHISPAS = ['#ffffff', '#bfe3ff', '#7fc4ff', '#fff3b0'];

  /** Línea quebrada entre dos puntos, como el trazo de un rayo. */
  function quebrada(x1, y1, x2, y2, desvio) {
    const pasos = Math.max(4, Math.round(Math.hypot(x2 - x1, y2 - y1) / 45));
    return Array.from({ length: pasos + 1 }, (_, i) => {
      const p = i / pasos;
      const suelto = i === 0 || i === pasos ? 0 : azar(-desvio, desvio);
      return [x1 + (x2 - x1) * p + suelto, y1 + (y2 - y1) * p];
    });
  }

  /** Dibuja la línea dos veces: un halo azul ancho y un núcleo blanco fino. */
  function trazoRayo(puntos, halo, nucleo) {
    const texto = puntos.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
    return `<polyline points="${texto}" stroke="#6fb8ff" stroke-width="${halo}" opacity=".55"/>` +
      `<polyline points="${texto}" stroke="#fff" stroke-width="${nucleo}"/>`;
  }

  function fogonazo(x, y, retraso) {
    const velo = document.createElement('div');
    velo.className = 'velo';
    velo.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(200,228,255,.8), transparent 70%)`;
    document.body.appendChild(velo);
    velo.animate(
      [{ opacity: 0 }, { opacity: 1, offset: 0.1 }, { opacity: 0.15, offset: 0.3 }, { opacity: 0.8, offset: 0.42 }, { opacity: 0 }],
      { duration: 520, delay: retraso, fill: 'both' }
    ).onfinish = () => velo.remove();
  }

  function electrizar(r) {
    const anchoVentana = window.innerWidth;
    const altoVentana = window.innerHeight;

    for (let i = 0; i < 4; i++) {
      // Cada rayo baja desde lo alto de la pantalla hasta un punto de la puerta
      const xf = r.left + r.width * azar(0.2, 0.8);
      const yf = r.top + r.height * azar(0.15, 0.6);
      const retraso = 250 + i * 330 + azar(0, 120);
      const tronco = quebrada(xf + azar(-240, 240), -10, xf, yf, 36);

      let trazos = trazoRayo(tronco, 7, 2.6);
      for (let j = 0; j < 2; j++) {
        const [bx, by] = tronco[Math.floor(azar(1, tronco.length - 1))];
        const lado = Math.random() < 0.5 ? -1 : 1;
        trazos += trazoRayo(quebrada(bx, by, bx + lado * azar(70, 200), by + azar(60, 170), 16), 4, 1.4);
      }

      particula({
        clase: 'relampago',
        html: `<svg viewBox="0 0 ${anchoVentana} ${altoVentana}" fill="none" stroke-linecap="round" stroke-linejoin="round">${trazos}</svg>`,
        x: 0,
        y: 0,
        ancho: anchoVentana,
        alto: altoVentana,
        fotogramas: [
          { opacity: 0 },
          { opacity: 1, offset: 0.08 },
          { opacity: 0.15, offset: 0.3 },
          { opacity: 1, offset: 0.42 },
          { opacity: 0 }
        ],
        opciones: { duration: azar(440, 640), delay: retraso }
      });

      fogonazo(xf, yf, retraso);

      // Chispas que saltan donde cae el rayo
      for (let k = 0; k < 7; k++) {
        const t = azar(8, 18);
        const ang = Math.random() * Math.PI * 2;
        const dist = azar(60, 220);

        particula({
          clase: 'destello',
          html: SVG_DESTELLO,
          x: xf,
          y: yf,
          ancho: t,
          alto: t,
          estilos: { color: CHISPAS[k % CHISPAS.length] },
          fotogramas: [
            { transform: 'translate(-50%,-50%) scale(0)', opacity: 0 },
            { transform: mover(Math.cos(ang) * dist * 0.7, Math.sin(ang) * dist * 0.7, 'scale(1.4)'), opacity: 1, offset: 0.25 },
            { transform: mover(Math.cos(ang) * dist, Math.sin(ang) * dist, 'scale(0)'), opacity: 0 }
          ],
          opciones: { duration: azar(600, 1100), delay: retraso + 60, easing: 'cubic-bezier(.1,.8,.3,1)' }
        });
      }
    }
  }

  /* ---------- 10 de octubre, puerta III: burbujas del pantano ---------- */
  function burbujear(r) {
    for (let i = 0; i < 22; i++) {
      const t = azar(8, 26);
      const subida = r.height * azar(0.7, 1.4);
      const vaiven = azar(-40, 40);

      particula({
        clase: 'burbuja',
        x: r.left + Math.random() * r.width,
        y: r.bottom - azar(10, 60),
        ancho: t,
        alto: t,
        fotogramas: [
          { transform: 'translate(-50%,-50%) scale(0.2)', opacity: 0 },
          { transform: mover(vaiven, -subida * 0.4, 'scale(1)'), opacity: 0.9, offset: 0.3 },
          { transform: mover(-vaiven * 0.5, -subida, 'scale(1.3)'), opacity: 0 }
        ],
        opciones: { duration: azar(1800, 3200), delay: 300 + i * 70, easing: 'ease-out' }
      });
    }
  }

  /* ---------- Utilidades compartidas por varios efectos ---------- */
  /** Resplandor de color que cubre la pantalla, centrado en un punto. */
  function resplandor(x, y, color, fotogramas, opciones) {
    const velo = document.createElement('div');
    velo.className = 'velo';
    velo.style.background = `radial-gradient(circle at ${x}px ${y}px, ${color}, transparent 75%)`;
    document.body.appendChild(velo);
    velo.animate(fotogramas, { fill: 'both', ...opciones }).onfinish = () => velo.remove();
  }

  /** Columna de luz que sube desde un punto hasta lo alto de la pantalla. */
  function columnaDeLuz(x, y, ancho) {
    particula({
      clase: 'haz',
      x,
      y,
      ancho,
      alto: y + 120,
      fotogramas: [
        { transform: 'translate(-50%,-100%) scaleX(0.05)', opacity: 0 },
        { transform: 'translate(-50%,-100%) scaleX(1)', opacity: 1, offset: 0.2 },
        { transform: 'translate(-50%,-100%) scaleX(0.8)', opacity: 0.8, offset: 0.6 },
        { transform: 'translate(-50%,-100%) scaleX(1.8)', opacity: 0 }
      ],
      opciones: { duration: 2800, delay: 300, easing: 'ease-out' }
    });
  }

  /** Imagen de cámara de vigilancia sobre toda la pantalla: líneas, barrido y piloto de grabación. */
  function senalDeCamara(duracion, retraso) {
    const anchoVentana = window.innerWidth;
    const altoVentana = window.innerHeight;

    particula({
      clase: 'interferencia',
      x: 0,
      y: 0,
      ancho: anchoVentana,
      alto: altoVentana,
      fotogramas: [
        { opacity: 0 },
        { opacity: 0.7, offset: 0.14 },
        { opacity: 0.4, offset: 0.4 },
        { opacity: 0.7, offset: 0.72 },
        { opacity: 0 }
      ],
      opciones: { duration: duracion, delay: retraso }
    });

    particula({
      clase: 'barrido',
      x: 0,
      y: 0,
      ancho: anchoVentana,
      alto: 110,
      fotogramas: [
        { transform: 'translateY(-120px)' },
        { transform: `translateY(${altoVentana + 20}px)` }
      ],
      opciones: { duration: (duracion - 600) / 2, delay: retraso + 400, iterations: 2, easing: 'linear' }
    });

    particula({
      clase: 'rec',
      html: '<span></span>REC',
      x: 22,
      y: 76,
      fotogramas: [
        { opacity: 0 },
        { opacity: 1, offset: 0.14 },
        { opacity: 0.25, offset: 0.28 },
        { opacity: 1, offset: 0.42 },
        { opacity: 0.25, offset: 0.56 },
        { opacity: 1, offset: 0.7 },
        { opacity: 0 }
      ],
      opciones: { duration: duracion, delay: retraso }
    });
  }

  /* ---------- 17 de octubre, puerta I: latido, bruma granate y ascuas ---------- */
  function nublar(r) {
    const x0 = r.left + r.width / 2;
    const y0 = r.top + r.height * 0.55;

    // Dos latidos de luz roja
    resplandor(x0, y0, 'rgba(205,15,40,.75)', [
      { opacity: 0 },
      { opacity: 1, offset: 0.06 },
      { opacity: 0.2, offset: 0.14 },
      { opacity: 0.8, offset: 0.2 },
      { opacity: 0.1, offset: 0.38 },
      { opacity: 0.9, offset: 0.5 },
      { opacity: 0.2, offset: 0.58 },
      { opacity: 0.7, offset: 0.64 },
      { opacity: 0 }
    ], { duration: 2600, delay: 300 });

    // Bruma espesa que se derrama hacia los lados
    for (let i = 0; i < 26; i++) {
      const t = azar(180, 380);
      const lado = i % 2 ? 1 : -1;
      const dx = lado * azar(160, 620);
      const dy = azar(-300, 80);

      particula({
        clase: 'bruma',
        x: x0 + azar(-0.3, 0.3) * r.width,
        y: y0 + azar(-0.25, 0.25) * r.height,
        ancho: t,
        alto: t,
        fotogramas: [
          { transform: 'translate(-50%,-50%) scale(0.4)', opacity: 0 },
          { transform: mover(dx * 0.45, dy * 0.45, 'scale(1.2)'), opacity: 0.9, offset: 0.3 },
          { transform: mover(dx, dy, 'scale(2.1)'), opacity: 0 }
        ],
        opciones: { duration: azar(3600, 5600), delay: 250 + i * 80, easing: 'ease-out' }
      });
    }

    // Ascuas rojas que suben desde el umbral
    for (let i = 0; i < 34; i++) {
      const t = azar(4, 9);
      const subida = azar(300, 720);
      const vaiven = azar(-90, 90);

      particula({
        clase: 'ascua',
        x: r.left + Math.random() * r.width,
        y: r.bottom - azar(20, r.height * 0.5),
        ancho: t,
        alto: t,
        fotogramas: [
          { transform: 'translate(-50%,-50%) scale(0)', opacity: 0 },
          { transform: mover(vaiven, -subida * 0.4, 'scale(1.4)'), opacity: 1, offset: 0.25 },
          { transform: mover(-vaiven * 0.6, -subida, 'scale(0.4)'), opacity: 0 }
        ],
        opciones: { duration: azar(2200, 4000), delay: 300 + i * 55, easing: 'ease-out' }
      });
    }
  }

  /* ---------- 17 de octubre, puerta II: la llama se enciende ---------- */
  function encender(r) {
    const x0 = r.left + r.width / 2;
    const y0 = r.top + r.height * 0.6;

    // La luz de la llama parpadea antes de apagarse
    resplandor(x0, y0, 'rgba(255,140,30,.7)', [
      { opacity: 0 },
      { opacity: 1, offset: 0.08 },
      { opacity: 0.5, offset: 0.2 },
      { opacity: 0.9, offset: 0.32 },
      { opacity: 0.4, offset: 0.5 },
      { opacity: 0.7, offset: 0.62 },
      { opacity: 0 }
    ], { duration: 2800, delay: 300 });

    // Lenguas de fuego que trepan por la puerta
    for (let i = 0; i < 32; i++) {
      const t = azar(40, 110);
      const subida = r.height * azar(0.5, 1.3);
      const vaiven = azar(-50, 50);

      particula({
        clase: 'llama',
        x: r.left + Math.random() * r.width,
        y: r.bottom - azar(0, 60),
        ancho: t,
        alto: t * 1.7,
        fotogramas: [
          { transform: 'translate(-50%,-50%) scale(0.3, 0.2)', opacity: 0 },
          { transform: mover(vaiven, -subida * 0.35, 'scale(1, 1.3)'), opacity: 0.95, offset: 0.25 },
          { transform: mover(-vaiven, -subida * 0.7, 'scale(0.8, 1.1)'), opacity: 0.8, offset: 0.6 },
          { transform: mover(vaiven * 0.5, -subida, 'scale(0.3, 0.6)'), opacity: 0 }
        ],
        opciones: { duration: azar(1600, 2800), delay: 300 + i * 60, easing: 'ease-out' }
      });
    }

    // Pavesas que saltan del fuego
    for (let i = 0; i < 40; i++) {
      const t = azar(3, 8);
      const ang = -Math.PI * azar(0.15, 0.85);
      const dist = azar(260, 760);

      particula({
        clase: 'ascua ascua--naranja',
        x: r.left + Math.random() * r.width,
        y: r.bottom - azar(20, r.height * 0.4),
        ancho: t,
        alto: t,
        fotogramas: [
          { transform: 'translate(-50%,-50%) scale(0)', opacity: 0 },
          { transform: mover(Math.cos(ang) * dist * 0.5, Math.sin(ang) * dist * 0.5, 'scale(1.5)'), opacity: 1, offset: 0.25 },
          { transform: mover(Math.cos(ang) * dist, Math.sin(ang) * dist, 'scale(0.3)'), opacity: 0 }
        ],
        opciones: { duration: azar(1800, 3400), delay: 350 + i * 45, easing: 'cubic-bezier(.2,.7,.4,1)' }
      });
    }
  }

  /* ---------- 17 de octubre, puerta III: tres brujas, humo verde y chispas ---------- */
  const SVG_BRUJA =
    '<svg viewBox="0 0 120 70"><g fill="#0b1a0e" stroke="#7dff8a" stroke-width="1.2" stroke-linejoin="round">' +
    '<path d="M0 44 L18 47 L18 53 L0 58 L6 51 Z"/><path d="M16 49 L108 41 L108 44 L16 52 Z"/>' +
    '<path d="M64 26 L40 40 L54 44 Z"/><path d="M52 48 L64 24 L80 46 Z"/>' +
    '<circle cx="67" cy="20" r="5.5"/><path d="M57 17 L78 13 L73 12 L64 0 L62 15 Z"/></g></svg>';
  const VERDES = ['#7dff8a', '#c8ffb0', '#3fd96a', '#eaffd0'];

  function volar(r) {
    const x0 = r.left + r.width / 2;
    const y0 = r.top + r.height * 0.4;

    resplandor(x0, y0, 'rgba(70,255,120,.6)', [
      { opacity: 0 },
      { opacity: 1, offset: 0.1 },
      { opacity: 0.2, offset: 0.3 },
      { opacity: 0.7, offset: 0.45 },
      { opacity: 0 }
    ], { duration: 1500, delay: 300 });

    // Columna de humo verde que sube del caldero
    for (let i = 0; i < 16; i++) {
      const t = azar(160, 320);

      particula({
        clase: 'bruma bruma--verde',
        x: x0 + azar(-0.3, 0.3) * r.width,
        y: r.top + r.height * azar(0.4, 0.9),
        ancho: t,
        alto: t,
        fotogramas: [
          { transform: 'translate(-50%,-50%) scale(0.3)', opacity: 0 },
          { transform: mover(azar(-80, 80), -azar(100, 260), 'scale(1.2)'), opacity: 0.85, offset: 0.3 },
          { transform: mover(azar(-200, 200), -azar(380, 700), 'scale(2)'), opacity: 0 }
        ],
        opciones: { duration: azar(3200, 5000), delay: 250 + i * 110, easing: 'ease-out' }
      });
    }

    // Las tres hermanas cruzan la pantalla, una detrás de otra
    for (let i = 0; i < 3; i++) {
      const lado = i === 1 ? -1 : 1; // la de en medio se va hacia el otro lado
      const dx = lado * window.innerWidth * azar(0.6, 1);
      const dy = -azar(200, 460);
      const esc = azar(2, 3);

      particula({
        clase: 'bruja',
        html: SVG_BRUJA,
        x: x0,
        y: y0,
        fotogramas: [
          { transform: `translate(-50%,-50%) scale(${lado * 0.2}, 0.2)`, opacity: 0 },
          { transform: mover(dx * 0.3, dy * 0.6 - 50, `scale(${lado * esc}, ${esc}) rotate(${lado * -16}deg)`), opacity: 1, offset: 0.3 },
          { transform: mover(dx, dy, `scale(${lado * esc * 0.7}, ${esc * 0.7}) rotate(${lado * -4}deg)`), opacity: 0 }
        ],
        opciones: { duration: azar(3200, 4200), delay: 400 + i * 420, easing: 'cubic-bezier(.3,.5,.4,1)' }
      });
    }

    // Estallido de chispas verdes
    for (let i = 0; i < 36; i++) {
      const t = azar(10, 26);
      const ang = Math.random() * Math.PI * 2;
      const dist = azar(150, 520);
      const giro = azar(-360, 360);

      particula({
        clase: 'destello',
        html: SVG_DESTELLO,
        x: x0,
        y: y0,
        ancho: t,
        alto: t,
        estilos: { color: VERDES[i % VERDES.length] },
        fotogramas: [
          { transform: 'translate(-50%,-50%) scale(0)', opacity: 0 },
          { transform: mover(Math.cos(ang) * dist * 0.7, Math.sin(ang) * dist * 0.7, `scale(1.4) rotate(${giro * 0.5}deg)`), opacity: 1, offset: 0.3 },
          { transform: mover(Math.cos(ang) * dist, Math.sin(ang) * dist, `scale(0) rotate(${giro}deg)`), opacity: 0 }
        ],
        opciones: { duration: azar(1600, 2800), delay: 300 + i * 40, easing: 'cubic-bezier(.15,.7,.3,1)' }
      });
    }
  }

  /* ---------- 31 de octubre, puerta I: el teléfono suena y suben globos negros ---------- */
  const SVG_GLOBO =
    '<svg viewBox="0 0 60 120"><g stroke="#8a94a6" stroke-width="1.5">' +
    '<ellipse cx="30" cy="34" rx="26" ry="32" fill="#07080c"/><path d="M26 67 L34 67 L30 61 Z" fill="#07080c"/>' +
    '<path d="M30 67 C24 80 36 92 30 118" fill="none" stroke-width="1.2"/></g>' +
    '<ellipse cx="20" cy="22" rx="5" ry="9" fill="#8a94a6" opacity=".45" transform="rotate(-25 20 22)"/></svg>';

  function sonar(r) {
    const x0 = r.left + r.width / 2;
    const y0 = r.top + r.height / 2;
    const lado = r.width * 0.4;

    // Dos timbrazos: la luz parpadea y salen ondas desde la puerta
    resplandor(x0, y0, 'rgba(205,218,238,.5)', [
      { opacity: 0 },
      { opacity: 1, offset: 0.05 },
      { opacity: 0.2, offset: 0.1 },
      { opacity: 1, offset: 0.15 },
      { opacity: 0, offset: 0.3 },
      { opacity: 0, offset: 0.5 },
      { opacity: 1, offset: 0.55 },
      { opacity: 0.2, offset: 0.6 },
      { opacity: 1, offset: 0.65 },
      { opacity: 0 }
    ], { duration: 2600, delay: 300 });

    for (let i = 0; i < 8; i++) {
      const timbrazo = i < 4 ? 0 : 1300;

      particula({
        clase: 'onda',
        x: x0,
        y: y0,
        ancho: lado,
        alto: lado,
        fotogramas: [
          { transform: 'translate(-50%,-50%) scale(0.2)', opacity: 0 },
          { opacity: 0.9, offset: 0.2 },
          { transform: 'translate(-50%,-50%) scale(4.5)', opacity: 0 }
        ],
        opciones: { duration: 1500, delay: 300 + timbrazo + (i % 4) * 140, easing: 'ease-out' }
      });
    }

    // Globos negros que suben hasta perderse por arriba
    for (let i = 0; i < 16; i++) {
      const xi = r.left + r.width * azar(-0.4, 1.4);
      const yi = r.bottom - azar(0, r.height * 0.3);
      const esc = azar(0.8, 1.7);
      const vaiven = azar(-70, 70);

      particula({
        clase: 'globo',
        html: SVG_GLOBO,
        x: xi,
        y: yi,
        fotogramas: [
          { transform: `translate(-50%,-50%) scale(${esc * 0.3})`, opacity: 0 },
          { transform: mover(vaiven, -yi * 0.3, `scale(${esc}) rotate(${azar(-10, 10)}deg)`), opacity: 1, offset: 0.2 },
          { transform: mover(-vaiven, -yi * 0.7, `scale(${esc}) rotate(${azar(-10, 10)}deg)`), opacity: 1, offset: 0.65 },
          { transform: mover(vaiven * 0.5, -yi - 220, `scale(${esc})`), opacity: 0.9 }
        ],
        opciones: { duration: azar(4200, 6800), delay: 400 + i * 170, easing: 'ease-in' }
      });
    }
  }

  /* ---------- 31 de octubre, puerta II: la caja se abre y la magia sale a chorro ---------- */
  const HERENCIA = ['#ffb347', '#ffd27a', '#c58cff', '#ff7a2e', '#fff3b0'];

  function desatar(r) {
    const x0 = r.left + r.width / 2;
    const y0 = r.top + r.height * 0.6;

    resplandor(x0, y0, 'rgba(255,150,40,.65)', [
      { opacity: 0 },
      { opacity: 1, offset: 0.12 },
      { opacity: 0.5, offset: 0.4 },
      { opacity: 0.8, offset: 0.55 },
      { opacity: 0 }
    ], { duration: 2600, delay: 300 });

    columnaDeLuz(x0, y0, r.width * 0.55);

    // Surtidor de estrellas que sube y cae
    for (let i = 0; i < 52; i++) {
      const t = azar(10, 28);
      const ang = -Math.PI * azar(0.25, 0.75);
      const dist = azar(260, 720);
      const dx = Math.cos(ang) * dist;
      const dy = Math.sin(ang) * dist;
      const giro = azar(-540, 540);

      particula({
        clase: 'destello',
        html: SVG_DESTELLO,
        x: x0,
        y: y0,
        ancho: t,
        alto: t,
        estilos: { color: HERENCIA[i % HERENCIA.length] },
        fotogramas: [
          { transform: 'translate(-50%,-50%) scale(0)', opacity: 0 },
          { transform: mover(dx, dy, `scale(1.4) rotate(${giro * 0.5}deg)`), opacity: 1, offset: 0.4 },
          { transform: mover(dx * 1.4, dy + azar(220, 480), `scale(0.3) rotate(${giro}deg)`), opacity: 0 }
        ],
        opciones: { duration: azar(2400, 3800), delay: 350 + i * 40, easing: 'cubic-bezier(.2,.7,.4,1)' }
      });
    }
  }

  /* ---------- 31 de octubre, puerta III: se va la luz y la cámara sigue grabando ---------- */
  function grabar(r) {
    const anchoVentana = window.innerWidth;
    const altoVentana = window.innerHeight;
    const pantalla = { x: 0, y: 0, ancho: anchoVentana, alto: altoVentana };

    // Apagón: la luz falla, se queda a oscuras un rato y vuelve
    particula({
      clase: 'apagon',
      ...pantalla,
      fotogramas: [
        { opacity: 0 },
        { opacity: 0.85, offset: 0.05 },
        { opacity: 0.15, offset: 0.09 },
        { opacity: 0.9, offset: 0.14 },
        { opacity: 0.8, offset: 0.72 },
        { opacity: 0.25, offset: 0.77 },
        { opacity: 0.85, offset: 0.82 },
        { opacity: 0 }
      ],
      opciones: { duration: 4400, delay: 300 }
    });

    senalDeCamara(4400, 300);

    // Polvo que cae despacio delante de la puerta, como si algo lo moviera
    for (let i = 0; i < 34; i++) {
      const t = azar(2, 5);
      const caida = r.height * azar(0.5, 1);

      particula({
        clase: 'mota',
        x: r.left + Math.random() * r.width,
        y: r.top + azar(0, r.height * 0.3),
        ancho: t,
        alto: t,
        fotogramas: [
          { transform: 'translate(-50%,-50%)', opacity: 0 },
          { transform: mover(azar(-20, 20), caida * 0.3), opacity: 0.9, offset: 0.25 },
          { transform: mover(azar(-40, 40), caida), opacity: 0 }
        ],
        opciones: { duration: azar(2600, 3800), delay: 900 + i * 60, easing: 'linear' }
      });
    }
  }

  const EFECTOS = {
    murcielagos: soltarMurcielagos,
    sangre: derramar,
    hechizo: hechizar,
    cempasuchil: florecer,
    luz: iluminar,
    rayo: electrizar,
    burbujas: burbujear,
    bruma: nublar,
    llama: encender,
    brujas: volar,
    telefono: sonar,
    herencia: desatar,
    camara: grabar
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

  /* ---------- Portada: lo que pasa al tocar una puerta que aún no se abre ---------- */
  /* 17 de octubre: unos ojos de gato entre la niebla roja */
  const SVG_OJOS =
    '<svg viewBox="0 0 120 44"><g fill="#ff1f33">' +
    '<path transform="rotate(9 28 22)" d="M4 22 Q28 2 52 22 Q28 42 4 22 Z"/>' +
    '<path transform="rotate(-9 92 22)" d="M68 22 Q92 2 116 22 Q92 42 68 22 Z"/></g>' +
    '<g fill="#12030a"><ellipse cx="28" cy="22" rx="3.5" ry="13"/><ellipse cx="92" cy="22" rx="3.5" ry="13"/></g></svg>';

  function acechar(r) {
    const x0 = r.left + r.width / 2;
    const y0 = r.top + r.height * 0.45;
    const ancho = r.width * 0.62;

    resplandor(x0, y0, 'rgba(190,15,35,.5)', [
      { opacity: 0 },
      { opacity: 1, offset: 0.2 },
      { opacity: 0.6, offset: 0.7 },
      { opacity: 0 }
    ], { duration: 3200, delay: 100 });

    for (let i = 0; i < 14; i++) {
      const t = azar(110, 240);
      const lado = i % 2 ? 1 : -1;

      particula({
        clase: 'bruma',
        x: x0 + azar(-0.4, 0.4) * r.width,
        y: r.top + r.height * azar(0.3, 0.9),
        ancho: t,
        alto: t,
        fotogramas: [
          { transform: 'translate(-50%,-50%) scale(0.4)', opacity: 0 },
          { transform: mover(lado * azar(30, 120), azar(-60, 10), 'scale(1.1)'), opacity: 0.85, offset: 0.3 },
          { transform: mover(lado * azar(140, 380), azar(-160, 20), 'scale(1.9)'), opacity: 0 }
        ],
        opciones: { duration: azar(2800, 4200), delay: 100 + i * 90, easing: 'ease-out' }
      });
    }

    // Los ojos se abren, parpadean una vez y se cierran
    particula({
      clase: 'ojos-gato',
      html: SVG_OJOS,
      x: x0,
      y: y0,
      ancho,
      alto: ancho * 0.37,
      fotogramas: [
        { transform: 'translate(-50%,-50%) scaleY(0)', opacity: 0 },
        { transform: 'translate(-50%,-50%) scaleY(1)', opacity: 1, offset: 0.15 },
        { transform: 'translate(-50%,-50%) scaleY(1)', opacity: 1, offset: 0.46 },
        { transform: 'translate(-50%,-50%) scaleY(0.05)', opacity: 1, offset: 0.5 },
        { transform: 'translate(-50%,-50%) scaleY(1)', opacity: 1, offset: 0.55 },
        { transform: 'translate(-50%,-50%) scaleY(1)', opacity: 1, offset: 0.85 },
        { transform: 'translate(-50%,-50%) scaleY(0)', opacity: 0 }
      ],
      opciones: { duration: 3000, delay: 500 }
    });
  }

  /* 31 de octubre: la imagen se distorsiona como en una cámara antigua */
  function distorsionar() {
    const VIEJO = 'grayscale(1) contrast(1.45) brightness(1.15)';
    const fotogramas = [
      { filter: 'none', transform: 'none' },
      { filter: VIEJO, transform: 'translateX(-6px) skewX(-2deg)', offset: 0.04 },
      { filter: VIEJO, transform: 'translateX(5px) skewX(1.5deg)', offset: 0.08 },
      { filter: `${VIEJO} sepia(.35)`, transform: 'none', offset: 0.12 },
      { filter: `${VIEJO} sepia(.35)`, transform: 'none', offset: 0.58 },
      { filter: VIEJO, transform: 'translateX(-4px) skewX(-1deg)', offset: 0.62 },
      { filter: VIEJO, transform: 'translateX(3px) skewX(1deg)', offset: 0.66 },
      { filter: `${VIEJO} sepia(.35)`, transform: 'none', offset: 0.7 },
      { filter: `${VIEJO} sepia(.35)`, transform: 'none', offset: 0.9 },
      { filter: 'none', transform: 'none' }
    ];

    document.querySelectorAll('main, .fondo-video').forEach((el) => el.animate(fotogramas, { duration: 2800 }));
    senalDeCamara(2800, 0);
  }

  /* 1 de noviembre: un haz de luz que sube desde la puerta */
  const DORADOS = ['#fff3b0', '#ffd27a', '#f7a934', '#ffffff'];

  function alumbrar(r) {
    const x0 = r.left + r.width / 2;
    const y0 = r.top + r.height * 0.7;

    resplandor(x0, y0, 'rgba(255,205,120,.55)', [
      { opacity: 0 },
      { opacity: 1, offset: 0.2 },
      { opacity: 0.6, offset: 0.6 },
      { opacity: 0 }
    ], { duration: 2800, delay: 300 });

    columnaDeLuz(x0, y0, r.width * 0.7);

    for (let i = 0; i < 16; i++) {
      const t = azar(8, 18);

      particula({
        clase: 'destello',
        html: SVG_DESTELLO,
        x: x0 + azar(-0.3, 0.3) * r.width,
        y: y0,
        ancho: t,
        alto: t,
        estilos: { color: DORADOS[i % DORADOS.length] },
        fotogramas: [
          { transform: 'translate(-50%,-50%) scale(0)', opacity: 0 },
          { transform: mover(azar(-30, 30), -azar(80, 200), 'scale(1.2)'), opacity: 1, offset: 0.3 },
          { transform: mover(azar(-60, 60), -azar(260, 520), 'scale(0)'), opacity: 0 }
        ],
        opciones: { duration: azar(1800, 2800), delay: 400 + i * 70, easing: 'ease-out' }
      });
    }
  }

  // data-bloqueo en cada puerta cerrada de la portada elige su animación
  const BLOQUEOS = {
    rayo: electrizar,
    gato: acechar,
    camara: distorsionar,
    luz: alumbrar
  };
  const enEspera = new WeakSet();

  document.addEventListener('click', (e) => {
    const puerta = e.target.closest('.noche--cerrada[data-bloqueo]');
    const efecto = puerta && BLOQUEOS[puerta.dataset.bloqueo];
    if (!efecto || quieto() || !puerta.animate || enEspera.has(puerta)) return;

    // Hasta que termine la animación, más toques sobre la misma puerta no hacen nada
    enEspera.add(puerta);
    setTimeout(() => enEspera.delete(puerta), 3200);
    efecto(puerta.getBoundingClientRect());
  });

  /* ---------- Melodía en bucle ---------- */
  // La fuente de sonido puede ser un <audio> (páginas de cada noche) o el <video> de la portada.
  // El vídeo nunca se pausa para que siempre se vea: "silenciar" solo le quita el sonido.
  const melodia = document.getElementById('melodia');
  const botonMusica = document.getElementById('musica');
  const esVideo = !!melodia && melodia.tagName === 'VIDEO';
  const VOLUMEN = 0.6;
  // Solo dura mientras la página está abierta: al volver a entrar, la música suena otra vez
  let silenciada = false;
  let temporizadorFundido = null;

  const sonando = () => !melodia.paused && !melodia.muted;

  function marcarBoton() {
    const activo = sonando();
    botonMusica.setAttribute('aria-pressed', String(activo));
    botonMusica.setAttribute('aria-label', activo ? 'Silenciar música' : 'Activar música');
  }

  /** Sube el volumen poco a poco. Usa setInterval (no requestAnimationFrame)
      porque este se detiene en segundo plano y dejaba el volumen atascado en 0. */
  function fundido() {
    clearInterval(temporizadorFundido);
    const inicio = Date.now();
    try { melodia.volume = 0; } catch { /* iOS no permite cambiar el volumen */ }
    temporizadorFundido = setInterval(() => {
      let p = Math.min((Date.now() - inicio) / 2000, 1);
      try { melodia.volume = VOLUMEN * p; } catch { p = 1; }
      if (p >= 1) clearInterval(temporizadorFundido);
    }, 50);
  }

  /** Intenta sonar. Si el navegador no lo permite, el vídeo sigue en silencio para que al menos se vea. */
  function reproducir() {
    melodia.muted = false;
    return melodia.play().then(fundido, (error) => {
      if (esVideo) {
        melodia.muted = true;
        melodia.play().catch(() => {});
      }
      throw error;
    });
  }

  function silenciar() {
    clearInterval(temporizadorFundido);
    if (esVideo) melodia.muted = true;
    else melodia.pause();
  }

  if (melodia && botonMusica) {
    // El botón siempre refleja lo que de verdad está pasando
    ['play', 'playing', 'pause', 'volumechange'].forEach((tipo) => melodia.addEventListener(tipo, marcarBoton));
    marcarBoton();

    botonMusica.addEventListener('click', (e) => {
      e.stopPropagation();
      if (sonando()) {
        silenciada = true;
        silenciar();
      } else {
        silenciada = false;
        reproducir().catch(() => {});
      }
    });

    // Los navegadores solo dejan sonar tras un gesto real. Estos eventos sí cuentan como gesto,
    // también en móvil (touchstart y pointerdown táctil NO cuentan, por eso fallaba en el teléfono).
    const GESTOS = ['click', 'touchend', 'pointerup', 'keydown'];
    const arrancar = (e) => {
      if (botonMusica.contains(e.target)) return; // el propio botón ya lo gestiona
      if (silenciada || sonando()) return;
      reproducir().catch(() => { /* sigue esperando otro gesto */ });
    };
    GESTOS.forEach((tipo) => document.addEventListener(tipo, arrancar, { capture: true, passive: true }));

    // Al volver a la pestaña o a la app, o al regresar con el botón "atrás", retoma la música
    const retomar = () => {
      if (!document.hidden && !silenciada && !sonando()) reproducir().catch(() => {});
    };
    document.addEventListener('visibilitychange', retomar);
    window.addEventListener('pageshow', retomar);

    // Primer intento al abrir la página
    reproducir().catch(() => {});
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
