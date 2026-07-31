// Procedural canvas textures for the operations floor. No image assets —
// everything is drawn at startup. THREE comes from the classic CDN script in
// index.html.
//
// Palette (shared with css/game.css):
//   ink    #070b14   floor/ambient dark
//   panel  #0e1524   wall panels
//   steel  #2A3648   console shells
//   amber  #E0A93E   OPEN EXCEPTION — the alert state
//   teal   #58C7B4   CLEARED — the resolved state
//   red    #E06A5A   offline / failed
const THREE = globalThis.THREE;

export function canvasTex(w, h, draw, repeat) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeat[0], repeat[1]);
  }
  t.anisotropy = 4;
  return t;
}

/* Raised access floor — square service tiles with corner bolts, the giveaway
   detail of a real operations floor. */
export function floorTex() {
  return canvasTex(1024, 1024, (g, w, h) => {
    g.fillStyle = '#101826';
    g.fillRect(0, 0, w, h);
    // fine speckle
    for (let i = 0; i < 12000; i++) {
      const v = Math.random();
      g.fillStyle = v > 0.5
        ? `rgba(255,255,255,${Math.random() * 0.018})`
        : `rgba(0,0,0,${Math.random() * 0.045})`;
      g.fillRect(Math.random() * w, Math.random() * h, 1.6, 1.6);
    }
    // 4x4 tile grid with a recessed seam
    const N = 4, step = w / N;
    for (let i = 0; i <= N; i++) {
      g.strokeStyle = 'rgba(0,0,0,0.55)';
      g.lineWidth = 5;
      g.beginPath(); g.moveTo(i * step, 0); g.lineTo(i * step, h); g.stroke();
      g.beginPath(); g.moveTo(0, i * step); g.lineTo(w, i * step); g.stroke();
      g.strokeStyle = 'rgba(150,175,210,0.07)';
      g.lineWidth = 1.5;
      g.beginPath(); g.moveTo(i * step + 3, 0); g.lineTo(i * step + 3, h); g.stroke();
      g.beginPath(); g.moveTo(0, i * step + 3); g.lineTo(w, i * step + 3); g.stroke();
    }
    // corner bolts on every tile
    for (let r = 0; r < N; r++) {
      for (let c2 = 0; c2 < N; c2++) {
        [[18, 18], [step - 18, 18], [18, step - 18], [step - 18, step - 18]].forEach(([bx, by]) => {
          const x = c2 * step + bx, y = r * step + by;
          g.fillStyle = 'rgba(150,175,210,0.13)';
          g.beginPath(); g.arc(x, y, 5, 0, 7); g.fill();
          g.fillStyle = 'rgba(0,0,0,0.4)';
          g.beginPath(); g.arc(x, y, 2.2, 0, 7); g.fill();
        });
      }
    }
  }, [7, 7]);
}

/* Brushed steel for console shells and structure */
export function steelTex() {
  return canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = '#2A3648';
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 2600; i++) {
      const y = Math.random() * h;
      g.strokeStyle = `rgba(255,255,255,${Math.random() * 0.05})`;
      g.lineWidth = 1;
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(w, y + (Math.random() - 0.5) * 3);
      g.stroke();
    }
  }, [1, 2]);
}

/* Back wall — equipment racks with vent slots and standby LEDs */
export function wallTex() {
  return canvasTex(1024, 512, (g, w, h) => {
    g.fillStyle = '#0e1524';
    g.fillRect(0, 0, w, h);
    const bays = 8, bw = w / bays;
    for (let b = 0; b < bays; b++) {
      const x = b * bw;
      // rack cabinet
      g.fillStyle = '#121b2c';
      g.fillRect(x + 8, 40, bw - 16, h - 90);
      g.strokeStyle = 'rgba(0,0,0,0.6)';
      g.lineWidth = 4;
      g.strokeRect(x + 8, 40, bw - 16, h - 90);
      // rack units with vent slots
      for (let u = 0; u < 9; u++) {
        const y = 54 + u * ((h - 118) / 9);
        g.fillStyle = 'rgba(255,255,255,0.028)';
        g.fillRect(x + 16, y, bw - 32, ((h - 118) / 9) - 5);
        for (let s = 0; s < 7; s++) {
          g.fillStyle = 'rgba(0,0,0,0.35)';
          g.fillRect(x + 24 + s * ((bw - 52) / 7), y + 5, (bw - 52) / 12, ((h - 118) / 9) - 15);
        }
        // standby LED — mostly cool, occasionally amber
        g.fillStyle = Math.random() > 0.82 ? 'rgba(224,169,62,0.75)' : 'rgba(88,199,180,0.5)';
        g.fillRect(x + bw - 26, y + 6, 4, 4);
      }
    }
  }, [3, 1]);
}

/* Console monitor content.
   state: 'offline' (locked station) | 'live' (cleared station) */
export function screenTex(state, seed = 0) {
  return canvasTex(384, 256, (g, w, h) => {
    const live = state === 'live';
    const accent = live ? '#58C7B4' : '#E06A5A';
    g.fillStyle = live ? '#08131a' : '#160d0f';
    g.fillRect(0, 0, w, h);

    // header strip
    g.fillStyle = live ? 'rgba(88,199,180,0.16)' : 'rgba(224,106,90,0.16)';
    g.fillRect(0, 0, w, 26);
    g.fillStyle = accent;
    g.font = '600 14px "IBM Plex Mono", monospace';
    g.textAlign = 'left';
    g.fillText(live ? 'FEED · LIVE' : 'FEED · OFFLINE', 12, 18);
    g.textAlign = 'right';
    g.fillText(live ? 'OK' : 'ERR', w - 12, 18);

    if (live) {
      // telemetry bars
      for (let i = 0; i < 22; i++) {
        const bh = 8 + ((Math.sin(i * 1.7 + seed) + 1) / 2) * 62;
        g.fillStyle = `rgba(88,199,180,${0.35 + (i % 3) * 0.2})`;
        g.fillRect(14 + i * 15, 150 - bh, 9, bh);
      }
      // baseline + trend line
      g.strokeStyle = 'rgba(88,199,180,0.5)';
      g.lineWidth = 1.5;
      g.beginPath();
      g.moveTo(10, 156); g.lineTo(w - 10, 156); g.stroke();
      g.strokeStyle = '#E0A93E';
      g.lineWidth = 2;
      g.beginPath();
      for (let i = 0; i <= 30; i++) {
        const x = 14 + i * ((w - 28) / 30);
        const y = 120 - Math.sin(i * 0.45 + seed) * 26 - i * 0.8;
        i ? g.lineTo(x, y) : g.moveTo(x, y);
      }
      g.stroke();
      // log lines
      g.font = '400 11px "IBM Plex Mono", monospace';
      g.textAlign = 'left';
      for (let i = 0; i < 5; i++) {
        g.fillStyle = `rgba(140,200,190,${0.6 - i * 0.08})`;
        g.fillRect(14, 176 + i * 15, 6, 6);
        g.fillStyle = `rgba(190,225,220,${0.55 - i * 0.07})`;
        g.fillText('control verified  ' + (1000 + ((i * 37 + seed * 11) % 8999)), 28, 182 + i * 15);
      }
    } else {
      // dead-signal scanlines
      for (let y = 30; y < h; y += 4) {
        g.fillStyle = `rgba(224,106,90,${0.03 + Math.random() * 0.05})`;
        g.fillRect(0, y, w, 2);
      }
      // static blocks
      for (let i = 0; i < 60; i++) {
        g.fillStyle = `rgba(255,255,255,${Math.random() * 0.05})`;
        g.fillRect(Math.random() * w, 30 + Math.random() * (h - 40), Math.random() * 40, 3);
      }
      g.fillStyle = accent;
      g.font = '700 30px "Saira Semi Condensed", sans-serif';
      g.textAlign = 'center';
      g.fillText('NO SIGNAL', w / 2, h / 2 + 6);
      g.font = '400 12px "IBM Plex Mono", monospace';
      g.fillStyle = 'rgba(224,106,90,0.65)';
      g.fillText('awaiting control evidence', w / 2, h / 2 + 30);
    }
  });
}

/* Desk auth terminal — the thing a code gets entered into.
   state: 'locked' | 'cleared' */
export function terminalTex(state) {
  return canvasTex(256, 320, (g, w, h) => {
    const cleared = state === 'cleared';
    g.fillStyle = '#151d2c';
    g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(120,140,170,0.25)';
    g.lineWidth = 4;
    g.strokeRect(6, 6, w - 12, h - 12);

    // readout
    g.fillStyle = '#0a0f1a';
    g.fillRect(22, 22, w - 44, 74);
    g.fillStyle = cleared ? '#58C7B4' : '#E0A93E';
    g.font = '700 26px "Saira Semi Condensed", sans-serif';
    g.textAlign = 'center';
    g.fillText(cleared ? 'CLEARED' : 'EXCEPTION', w / 2, 54);
    g.font = '400 12px "IBM Plex Mono", monospace';
    g.fillStyle = cleared ? 'rgba(88,199,180,0.7)' : 'rgba(224,169,62,0.7)';
    g.fillText(cleared ? 'evidence accepted' : 'awaiting evidence', w / 2, 78);

    // signature/attest strip
    g.fillStyle = 'rgba(255,255,255,0.04)';
    g.fillRect(22, 110, w - 44, 44);
    g.strokeStyle = 'rgba(120,140,170,0.2)';
    g.lineWidth = 1.5;
    g.strokeRect(22, 110, w - 44, 44);
    g.fillStyle = 'rgba(150,175,210,0.45)';
    g.font = '400 11px "IBM Plex Mono", monospace';
    g.textAlign = 'left';
    g.fillText('REVIEWER SIGN-OFF', 30, 126);
    g.strokeStyle = cleared ? 'rgba(88,199,180,0.8)' : 'rgba(120,140,170,0.3)';
    g.lineWidth = 2;
    g.beginPath();
    if (cleared) {
      // a scrawled signature once signed off
      g.moveTo(34, 146);
      for (let i = 0; i < 22; i++) {
        g.lineTo(34 + i * 7, 146 - Math.sin(i * 0.9) * 7 - (i % 3) * 2);
      }
    } else {
      g.moveTo(34, 146); g.lineTo(w - 34, 146);
    }
    g.stroke();

    // control checklist rows
    for (let r = 0; r < 4; r++) {
      const y = 178 + r * 32;
      g.fillStyle = '#1e2940';
      g.fillRect(22, y, w - 44, 24);
      g.fillStyle = cleared ? '#58C7B4' : 'rgba(224,169,62,0.55)';
      g.beginPath(); g.arc(38, y + 12, 6, 0, 7); g.fill();
      g.fillStyle = 'rgba(160,180,205,0.55)';
      g.fillRect(54, y + 9, 100 + (r % 3) * 30, 5);
    }
  });
}

/* Station nameplate above each console */
export function signTex(n, label) {
  return canvasTex(512, 170, (g, w, h) => {
    g.fillStyle = '#0d1422';
    g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(224,169,62,0.55)';
    g.lineWidth = 5;
    g.strokeRect(8, 8, w - 16, h - 16);
    g.textAlign = 'center';
    g.fillStyle = '#E0A93E';
    g.font = '700 58px "Saira Semi Condensed", sans-serif';
    g.textBaseline = 'middle';
    g.fillText('STATION 0' + n, w / 2, 62);
    g.fillStyle = 'rgba(150,175,210,0.75)';
    g.font = '500 27px "IBM Plex Mono", monospace';
    g.fillText(String(label || '').toUpperCase().slice(0, 22), w / 2, 116);
  });
}

/* The big board on the back wall — master exception counter.
   Rendered fresh whenever the open-exception count changes. */
export function boardTex(openCount, total) {
  return canvasTex(1024, 512, (g, w, h) => {
    const clear = openCount === 0;
    g.fillStyle = '#080f1c';
    g.fillRect(0, 0, w, h);
    g.strokeStyle = clear ? 'rgba(88,199,180,0.5)' : 'rgba(224,169,62,0.45)';
    g.lineWidth = 8;
    g.strokeRect(14, 14, w - 28, h - 28);

    g.textAlign = 'center';
    g.fillStyle = 'rgba(150,175,210,0.75)';
    g.font = '500 30px "IBM Plex Mono", monospace';
    g.fillText('MONTH-END CLOSE STATUS', w / 2, 84);

    g.fillStyle = clear ? '#58C7B4' : '#E0A93E';
    g.font = '700 150px "Saira Semi Condensed", sans-serif';
    g.fillText(clear ? 'CLEARED' : String(openCount), w / 2, clear ? 250 : 235);

    if (!clear) {
      g.fillStyle = 'rgba(224,169,62,0.9)';
      g.font = '600 44px "Saira Semi Condensed", sans-serif';
      g.fillText(openCount === 1 ? 'OPEN EXCEPTION' : 'OPEN EXCEPTIONS', w / 2, 300);
    } else {
      g.fillStyle = 'rgba(88,199,180,0.85)';
      g.font = '600 36px "Saira Semi Condensed", sans-serif';
      g.fillText('EVIDENCE PACK COMPLETE', w / 2, 312);
    }

    // per-station pips
    const pipW = 150, gap = 26;
    const totalW = total * pipW + (total - 1) * gap;
    for (let i = 0; i < total; i++) {
      const x = (w - totalW) / 2 + i * (pipW + gap);
      const done = i < total - openCount;
      g.fillStyle = done ? 'rgba(88,199,180,0.22)' : 'rgba(224,169,62,0.12)';
      g.fillRect(x, 360, pipW, 76);
      g.strokeStyle = done ? 'rgba(88,199,180,0.75)' : 'rgba(224,169,62,0.45)';
      g.lineWidth = 3;
      g.strokeRect(x, 360, pipW, 76);
      g.fillStyle = done ? '#58C7B4' : 'rgba(224,169,62,0.8)';
      g.font = '600 22px "IBM Plex Mono", monospace';
      g.fillText('0' + (i + 1), x + pipW / 2, 392);
      g.font = '600 19px "Saira Semi Condensed", sans-serif';
      g.fillText(done ? 'CLEARED' : 'OPEN', x + pipW / 2, 420);
    }
  });
}

/* Ambient video wall behind the consoles — dim telemetry, never the focus */
export function videoWallTex() {
  return canvasTex(1024, 320, (g, w, h) => {
    g.fillStyle = '#070d18';
    g.fillRect(0, 0, w, h);
    const cols = 6, rows = 2;
    const cw = w / cols, ch = h / rows;
    for (let r = 0; r < rows; r++) {
      for (let c2 = 0; c2 < cols; c2++) {
        const x = c2 * cw + 6, y = r * ch + 6, iw = cw - 12, ih = ch - 12;
        g.fillStyle = '#0a1422';
        g.fillRect(x, y, iw, ih);
        g.strokeStyle = 'rgba(90,120,160,0.18)';
        g.lineWidth = 2;
        g.strokeRect(x, y, iw, ih);
        const kind = (r * cols + c2) % 3;
        if (kind === 0) {
          for (let i = 0; i < 12; i++) {
            const bh = 6 + Math.random() * (ih - 34);
            g.fillStyle = `rgba(88,199,180,${0.16 + Math.random() * 0.24})`;
            g.fillRect(x + 12 + i * ((iw - 24) / 12), y + ih - 14 - bh, (iw - 24) / 16, bh);
          }
        } else if (kind === 1) {
          g.strokeStyle = 'rgba(224,169,62,0.4)';
          g.lineWidth = 2;
          g.beginPath();
          for (let i = 0; i <= 26; i++) {
            const px = x + 10 + i * ((iw - 20) / 26);
            const py = y + ih / 2 - Math.sin(i * 0.6 + c2) * (ih / 5);
            i ? g.lineTo(px, py) : g.moveTo(px, py);
          }
          g.stroke();
        } else {
          for (let i = 0; i < 7; i++) {
            g.fillStyle = `rgba(150,180,215,${0.28 - i * 0.03})`;
            g.fillRect(x + 12, y + 14 + i * 13, (iw - 30) * (0.35 + Math.random() * 0.6), 5);
          }
        }
      }
    }
  });
}

/* Procedural environment cubemap (fake reflections) */
export function envMap() {
  const faces = [];
  for (let i = 0; i < 6; i++) {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    const gr = g.createLinearGradient(0, 0, 0, 64);
    gr.addColorStop(0, '#1a2438');
    gr.addColorStop(0.55, '#0d1422');
    gr.addColorStop(1, '#070b14');
    g.fillStyle = gr;
    g.fillRect(0, 0, 64, 64);
    if (i === 2) { // top face: ceiling light blobs
      for (let j = 0; j < 5; j++) {
        g.fillStyle = 'rgba(200,215,235,0.5)';
        g.fillRect(6 + j * 12, 20 + (j % 2) * 14, 8, 4);
      }
    }
    faces.push(c);
  }
  const tex = new THREE.CubeTexture(faces);
  tex.needsUpdate = true;
  return tex;
}
