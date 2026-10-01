import * as THREE from 'three';

export interface ProceduralBeltInstance {
  group: THREE.Group;
  materials: {
    cloth: THREE.MeshPhysicalMaterial;
    stitch: THREE.MeshPhysicalMaterial;
  };
  setColors: (opts?: { color?: string | THREE.Color; stitch?: string | THREE.Color }) => void;
  dispose: () => void;
}

export function createProceduralBelt(options: { color?: string } = {}): ProceduralBeltInstance {
  const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
  const A = 0.16; // Radio cintura X (m)
  const B = 0.11; // Radio cintura Z (m)
  const W = 0.045; // Ancho del cinturón (m)
  const T = 0.0075; // Espesor del cinturón (m)
  const PITCH = 0.064; // Repetición de trama de sarga de algodón

  // Textura procedural de sarga de algodón
  function createWeaveTexture(): THREE.CanvasTexture {
    const S = 128;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = S;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    const im = ctx.createImageData(S, S);
    const th = 4;
    let seed = 7;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

    for (let j = 0; j < S; j++) {
      for (let i = 0; i < S; i++) {
        const ci = Math.floor(i / th);
        const cj = Math.floor(j / th);
        const over = (ci + cj) % 3 === 0;
        const fx = ((i % th) + 0.5) / th;
        const fy = ((j % th) + 0.5) / th;
        const round = over ? Math.sin(Math.PI * fx) : Math.sin(Math.PI * fy);
        const v = (over ? 255 : 238) * (0.9 + 0.1 * round) + (rnd() - 0.5) * 10;
        const k = (j * S + i) * 4;
        im.data[k] = im.data[k + 1] = im.data[k + 2] = Math.max(0, Math.min(255, v));
        im.data[k + 3] = 255;
      }
    }
    ctx.putImageData(im, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1 / PITCH, 1 / PITCH);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    return texture;
  }

  const tex = createWeaveTexture();
  const initialColor = options.color || '#ece8df';

  const cloth = new THREE.MeshPhysicalMaterial({
    name: 'belt_cloth',
    color: initialColor,
    map: tex,
    bumpMap: tex,
    bumpScale: 0.8,
    roughness: 0.92,
    metalness: 0,
    sheen: 1,
    sheenRoughness: 0.45,
    sheenColor: new THREE.Color('#ffffff'),
    side: THREE.DoubleSide,
  });

  const stitch = new THREE.MeshPhysicalMaterial({
    name: 'belt_stitch',
    color: '#d2ccbe',
    roughness: 0.8,
    sheen: 0.6,
    sheenRoughness: 0.5,
    metalness: 0,
    side: THREE.DoubleSide,
  });

  const root = new THREE.Group();
  root.name = 'taekwondo_belt_root';
  const g = new THREE.Group();
  g.name = 'belt_body';
  root.add(g);

  interface Frame {
    p: THREE.Vector3;
    n: THREE.Vector3;
    u: THREE.Vector3;
  }

  const meshes: THREE.Mesh[] = [];

  const M = (name: string, geo: THREE.BufferGeometry, mat: THREE.Material, parent = g) => {
    const m = new THREE.Mesh(geo, mat);
    m.name = name;
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    meshes.push(m);
    return m;
  };

  // Barrido de perfiles a lo largo de una ruta con UV métricos
  function sweep(profiles: number[][][], frames0: Frame[], closed: boolean): THREE.BufferGeometry {
    const fr = closed ? [...frames0, frames0[0]] : frames0;
    const Mn = fr.length;
    const pos: number[] = [];
    const uv: number[] = [];
    const idx: number[] = [];

    const L = [0];
    for (let i = 1; i < Mn; i++) {
      L[i] = L[i - 1] + fr[i].p.distanceTo(fr[i - 1].p);
    }

    profiles.forEach((p0) => {
      const prof = [...p0, p0[0]];
      const K = prof.length;
      const C = [0];
      for (let j = 1; j < K; j++) {
        C[j] = C[j - 1] + Math.hypot(prof[j][0] - prof[j - 1][0], prof[j][1] - prof[j - 1][1]);
      }
      const put = (f: Frame, a: number, b: number, uVal: number, vVal: number) => {
        pos.push(f.p.x + f.n.x * a + f.u.x * b, f.p.y + f.n.y * a + f.u.y * b, f.p.z + f.n.z * a + f.u.z * b);
        uv.push(uVal, vVal);
      };
      const base = pos.length / 3;
      fr.forEach((f, i) => prof.forEach(([a, b], j) => put(f, a, b, L[i], C[j])));
      for (let i = 0; i < Mn - 1; i++) {
        for (let j = 0; j < K - 1; j++) {
          const a = base + i * K + j;
          const c = a + K;
          idx.push(a, c, a + 1, a + 1, c, c + 1);
        }
      }
      if (!closed) {
        [0, Mn - 1].forEach((rIdx) => {
          const f = fr[rIdx];
          const b0 = pos.length / 3;
          prof.forEach(([a, b], j) => put(f, a, b, C[j], 0));
          put(f, 0, 0, 0.01, 0.01);
          const c0 = b0 + K;
          for (let j = 0; j < K - 1; j++) {
            if (rIdx === 0) {
              idx.push(c0, b0 + j + 1, b0 + j);
            } else {
              idx.push(c0, b0 + j, b0 + j + 1);
            }
          }
        });
      }
    });

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    return geo;
  }

  // Cincha multicapa: almohadillas acolchadas
  function puffProfile(Wd: number, Tt: number, puffs: number, amp: number): number[][] {
    const out: number[][] = [];
    const inn: number[][] = [];
    const per = 9;
    const n = puffs * per;
    for (let i = 0; i <= n; i++) {
      const y = -Wd / 2 + (Wd * i) / n;
      const fr = (i % per) / per;
      const e = i === n ? 0 : Math.pow(Math.sin(Math.PI * fr), 0.75);
      const h = Tt / 2 + amp * e;
      out.push([h, y]);
      inn.push([-h, y]);
    }
    return [...out, [0, Wd / 2 + 0.0004], ...inn.reverse(), [0, -Wd / 2 - 0.0004]];
  }

  function threads(Wd: number, Tt: number, puffs: number, r: number): number[][][] {
    const ps: number[][][] = [];
    for (let k = 1; k < puffs; k++) {
      const y = -Wd / 2 + (Wd * k) / puffs;
      [1, -1].forEach((s) => {
        const p: number[][] = [];
        for (let a = 0; a < 6; a++) {
          const t = (a * Math.PI) / 3;
          p.push([s * (Tt / 2 - 0.0001) + r * Math.cos(t), y + r * Math.sin(t)]);
        }
        ps.push(p);
      });
    }
    return ps;
  }

  const ellArc = (rx: number, rz: number, a0: number, a1: number, N: number): Frame[] =>
    Array.from({ length: N }, (_, k) => {
      const t = a0 + ((a1 - a0) * k) / (N - 1);
      const c = Math.cos(t);
      const s = Math.sin(t);
      return { p: V(rx * c, 0, rz * s), n: V(c / rx, 0, s / rz).normalize(), u: V(0, 1, 0) };
    });

  const ellFull = (rx: number, rz: number, N: number): Frame[] => ellArc(rx, rz, 0, (2 * Math.PI * (N - 1)) / N, N);

  function pathFrames(
    P: (s: number) => THREE.Vector3,
    N: number,
    ph: number,
    tw: number
  ): Frame[] {
    const out: Frame[] = [];
    for (let i = 0; i < N; i++) {
      const s = i / (N - 1);
      const p = P(s);
      const t = P(Math.min(1, s + 0.005))
        .sub(P(Math.max(0, s - 0.005)))
        .normalize();
      const z0 = V(0, 0, 1);
      const n = z0.sub(t.clone().multiplyScalar(z0.dot(t))).normalize();
      const u = n.clone().cross(t).normalize();
      const f = tw * Math.sin(s * 4 + ph) * s;
      const cf = Math.cos(f);
      const sf = Math.sin(f);
      out.push({
        p,
        n: n.clone().multiplyScalar(cf).add(u.clone().multiplyScalar(sf)),
        u: u.clone().multiplyScalar(cf).sub(n.clone().multiplyScalar(sf)),
      });
    }
    return out;
  }

  const layer = (name: string, fr: Frame[], closed: boolean, Wd = W, Tt = T, parent = g) => {
    M(name, sweep([puffProfile(Wd, Tt, 5, 0.0004)], fr, closed), cloth, parent);
    M(name + '_stitch', sweep(threads(Wd, Tt, 5, 0.00042), fr, closed), stitch, parent);
  };

  // 1. Banda de cintura y capas envolventes frontales
  layer('band', ellFull(A, B, 360), true);
  layer('wrap_layer_1', ellArc(A + T, B + T, Math.PI / 2 - 0.62, Math.PI / 2 + 0.62, 90), false);
  layer('wrap_layer_2', ellArc(A + 2 * T, B + 2 * T, Math.PI / 2 - 0.34, Math.PI / 2 + 0.34, 60), false);

  // 2. Nudo frontal
  const zs = B + 0.008;
  const kw = 0.064;
  const kh = 0.05;
  const r = 0.012;
  const sh = new THREE.Shape();
  sh.moveTo(-kw / 2 + r, -kh / 2);
  sh.lineTo(kw / 2 - r, -kh / 2);
  sh.quadraticCurveTo(kw / 2, -kh / 2, kw / 2, -kh / 2 + r);
  sh.lineTo(kw / 2, kh / 2 - r);
  sh.quadraticCurveTo(kw / 2, kh / 2, kw / 2 - r, kh / 2);
  sh.lineTo(-kw / 2 + r, kh / 2);
  sh.quadraticCurveTo(-kw / 2, kh / 2, -kw / 2, kh / 2 - r);
  sh.lineTo(-kw / 2, -kh / 2 + r);
  sh.quadraticCurveTo(-kw / 2, -kh / 2, -kw / 2 + r, -kh / 2);

  const kg = new THREE.ExtrudeGeometry(sh, {
    depth: 0.012,
    bevelEnabled: true,
    bevelSize: 0.006,
    bevelThickness: 0.007,
    bevelSegments: 6,
    curveSegments: 10,
  });
  M('knot_body', kg, cloth).position.z = zs;

  const zf = zs + 0.012 + 0.007 + 0.0003;
  [-0.0165, -0.0055, 0.0055, 0.0165].forEach((y, i) => {
    const l = M('knot_stitch_' + (i + 1), new THREE.CylinderGeometry(0.00042, 0.00042, 0.066, 6), stitch);
    l.rotation.z = Math.PI / 2;
    l.position.set(0, y, zf);
  });

  // 3. Extremos laterales del nudo
  (
    [
      [-1, 'left'],
      [1, 'right'],
    ] as const
  ).forEach(([s, nm]) => {
    const P = (t: number) => V(s * (0.022 + 0.062 * t), -0.004 * t - 0.02 * t * t, zs + 0.004 - 0.012 * t);
    layer('knot_flap_' + nm, pathFrames(P, 50, s, s * 0.25), false, 0.04, T);
  });

  // 4. Colas colgantes
  function tail(name: string, len: number, x: number, z: number, rz: number, ph: number, tw: number) {
    const P = (s: number) => V(0.005 * Math.sin(s * 4.5 + ph) * s, -len * s, -0.014 * s * s + 0.004 * Math.sin(s * 6 + ph) * s);
    const p = new THREE.Group();
    p.name = name;
    p.position.set(x, -0.022, z);
    p.rotation.set(-0.03, 0, rz);
    g.add(p);
    layer(name, pathFrames(P, 110, ph, tw), false, W, T, p);
  }
  tail('tail_left', 0.25, -0.014, zs + 0.006, -0.1, 0.6, 0.35);
  tail('tail_right', 0.205, 0.014, zs + 0.002, 0.12, 2.1, -0.3);

  // Centrado vertical
  const bb = new THREE.Box3().setFromObject(root);
  root.position.y = -bb.min.y;

  const wrap = new THREE.Group();
  wrap.name = 'belt_wrapper';
  wrap.add(root);

  const tint = (hex: string) => {
    const c = new THREE.Color(hex);
    const hsl = { h: 0, s: 0, l: 0 };
    c.getHSL(hsl);
    hsl.l = hsl.l > 0.25 ? hsl.l * 0.8 : hsl.l + 0.1;
    return new THREE.Color().setHSL(hsl.h, hsl.s, hsl.l);
  };

  let autoStitch = true;

  const setColors = ({ color, stitch: st }: { color?: string | THREE.Color; stitch?: string | THREE.Color } = {}) => {
    if (color) {
      if (typeof color === 'string') {
        cloth.color.set(color);
        if (autoStitch && !st) stitch.color.copy(tint(color));
      } else {
        cloth.color.copy(color);
      }
    }
    if (st) {
      autoStitch = false;
      if (typeof st === 'string') stitch.color.set(st);
      else stitch.color.copy(st);
    }
  };

  const dispose = () => {
    meshes.forEach((m) => {
      m.geometry?.dispose();
    });
    cloth.dispose();
    stitch.dispose();
    tex.dispose();
  };

  return {
    group: wrap,
    materials: { cloth, stitch },
    setColors,
    dispose,
  };
}
