import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../ThemeContext';

// ---------------------------------------------------------------------------
// Compact world-outline dataset: array of polylines, each polyline is an array
// of [lon, lat] pairs in degrees. These trace major continental coastlines and
// a selection of large country borders to form a recognisable world map shape.
// ---------------------------------------------------------------------------
const WORLD_OUTLINES = (() => {
  // Helper: great-circle interpolate between two [lon,lat] points, returning
  // `steps` intermediate points (exclusive of endpoints).
  function interp(a, b, steps) {
    const pts = [];
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      pts.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
    return pts;
  }

  // Densify a polyline so no gap between adjacent points exceeds `maxDeg`
  function densify(poly, maxDeg = 2.5) {
    if (poly.length < 2) return poly;
    const out = [poly[0]];
    for (let i = 1; i < poly.length; i++) {
      const a = poly[i - 1], b = poly[i];
      const dist = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const steps = Math.max(1, Math.ceil(dist / maxDeg));
      out.push(...interp(a, b, steps));
      out.push(b);
    }
    return out;
  }

  // Raw simplified outlines (lon, lat)
  const raw = [
    // ── North America ──────────────────────────────────────────────────────
    [[-168,72],[-140,74],[-120,78],[-85,83],[-60,82],[-45,78],[-55,70],[-60,62],[-65,55],[-60,47],[-66,44],[-70,41],[-75,35],[-80,26],[-81,25],[-80,25],[-82,29],[-85,30],[-88,30],[-90,29],[-90,26],[-97,26],[-100,22],[-105,19],[-105,20],[-97,19],[-89,18],[-83,14],[-77,8],[-75,8],[-79,8],[-82,10],[-83,11],[-85,11],[-87,14],[-88,16],[-89,16],[-90,16],[-92,18],[-94,18],[-97,20],[-100,22],[-106,23],[-110,24],[-114,27],[-117,31],[-117,33],[-120,35],[-122,37],[-124,40],[-124,43],[-124,47],[-123,48],[-123,49],[-124,49],[-130,54],[-133,55],[-135,57],[-134,58],[-136,59],[-142,60],[-146,60],[-148,59],[-152,58],[-155,57],[-158,56],[-163,55],[-165,54],[-166,54],[-162,55],[-158,58],[-152,60],[-150,61],[-145,61],[-142,60],[-138,59],[-136,58],[-130,54],[-126,51],[-124,49],[-130,56],[-135,57],[-137,59],[-140,60],[-145,62],[-148,61],[-155,60],[-157,58],[-162,58],[-165,60],[-166,62],[-164,64],[-162,64],[-160,66],[-163,66],[-165,66],[-168,66],[-164,68],[-160,70],[-155,71],[-150,71],[-145,70],[-140,70],[-135,69],[-130,70],[-125,71],[-120,74],[-110,76],[-100,77],[-90,78],[-80,79],[-70,80],[-60,81],[-50,82],[-40,83],[-25,83],[-20,82],[-25,80],[-30,78],[-30,75],[-35,73],[-40,73],[-45,74],[-55,73],[-65,73],[-75,74],[-80,75],[-85,78],[-90,80],[-100,80],[-110,79],[-120,78],[-140,74],[-168,72]],

    // Greenland
    [[-44,60],[-42,64],[-38,67],[-33,68],[-28,70],[-24,71],[-22,74],[-18,76],[-18,78],[-22,80],[-26,82],[-32,83],[-38,83],[-44,82],[-50,82],[-53,80],[-54,78],[-54,74],[-52,71],[-50,68],[-46,66],[-44,64],[-44,60]],

    // ── South America ──────────────────────────────────────────────────────
    [[-77,8],[-77,5],[-75,2],[-73,1],[-70,-2],[-68,-5],[-65,-10],[-63,-15],[-60,-18],[-58,-20],[-55,-23],[-50,-28],[-48,-28],[-44,-23],[-40,-18],[-38,-13],[-35,-8],[-35,-5],[-37,-2],[-40,0],[-50,-1],[-52,4],[-52,6],[-58,8],[-62,10],[-63,10],[-65,11],[-68,12],[-72,11],[-75,10],[-77,8]],
    [[-35,-8],[-38,-13],[-40,-18],[-42,-22],[-44,-23],[-48,-28],[-50,-28],[-52,-33],[-54,-36],[-56,-38],[-58,-40],[-62,-42],[-64,-44],[-66,-47],[-68,-50],[-68,-53],[-68,-55],[-66,-55],[-64,-53],[-62,-51],[-60,-52],[-58,-54],[-55,-55],[-53,-55],[-52,-53],[-50,-52],[-48,-50],[-46,-49],[-44,-47],[-42,-45],[-40,-44],[-38,-43],[-36,-41],[-35,-38],[-35,-35],[-34,-32],[-35,-28],[-36,-25],[-38,-23],[-40,-21],[-42,-22],[-44,-23],[-50,-28],[-52,-33],[-54,-36],[-56,-38],[-58,-40],[-62,-42],[-65,-45],[-68,-50],[-72,-50],[-75,-52],[-75,-55],[-72,-54],[-68,-55],[-68,-53],[-70,-50],[-72,-48],[-75,-45],[-78,-42],[-80,-38],[-82,-35],[-80,-30],[-78,-25],[-76,-20],[-75,-15],[-75,-10],[-77,-8],[-80,-3],[-80,0],[-78,3],[-77,8]],

    // ── Europe ─────────────────────────────────────────────────────────────
    [[-10,36],[0,36],[8,37],[12,38],[16,38],[18,39],[22,38],[26,38],[28,39],[30,41],[32,42],[35,44],[37,45],[38,47],[35,47],[32,46],[30,45],[28,44],[26,44],[24,44],[22,43],[20,42],[18,41],[16,41],[15,40],[14,38],[16,37],[18,38],[20,38],[22,38],[26,38],[30,39],[32,41],[35,44],[37,45],[38,47],[37,48],[36,49],[34,50],[32,51],[30,52],[28,53],[26,55],[24,56],[22,57],[20,58],[18,59],[16,58],[14,57],[12,56],[10,55],[8,54],[8,55],[8,56],[10,58],[12,59],[14,59],[16,59],[18,60],[20,62],[18,64],[16,66],[14,68],[12,68],[14,67],[16,66],[18,67],[20,69],[22,70],[25,71],[28,71],[30,70],[28,69],[26,68],[28,68],[30,68],[32,66],[34,66],[30,65],[28,64],[26,64],[24,65],[22,65],[20,64],[18,63],[16,62],[14,61],[12,60],[10,58],[8,57],[6,56],[4,55],[2,54],[0,54],[-2,54],[-4,54],[-6,55],[-8,54],[-10,52],[-10,50],[-8,48],[-5,47],[-2,47],[0,47],[2,46],[4,45],[6,44],[8,44],[10,44],[12,44],[14,43],[16,42],[18,41],[18,40],[16,39],[15,38],[12,37],[8,37],[5,36],[0,36],[-5,36],[-10,36]],

    // UK
    [[-5,50],[-3,51],[-2,52],[0,53],[0,54],[-2,55],[-2,57],[0,57],[2,58],[0,59],[-2,59],[-4,58],[-5,56],[-5,54],[-3,53],[-5,52],[-5,50]],

    // Scandinavia
    [[5,58],[6,58],[8,57],[10,55],[12,56],[14,56],[16,57],[18,58],[18,60],[20,62],[22,64],[24,66],[26,68],[24,70],[22,71],[18,70],[16,70],[14,68],[12,68],[10,66],[8,64],[6,62],[5,58]],
    // Norway
    [[5,58],[5,62],[6,64],[8,64],[8,66],[10,68],[12,68],[14,68],[16,66],[18,67],[20,68],[22,70],[24,70],[22,71],[18,70],[14,69],[10,66],[8,64],[5,62],[4,60],[5,58]],

    // ── Africa ─────────────────────────────────────────────────────────────
    [[-17,15],[-15,18],[-12,21],[-8,21],[-5,24],[-2,24],[2,24],[5,24],[8,22],[10,18],[12,14],[14,12],[16,10],[14,8],[12,5],[10,4],[8,5],[6,5],[4,5],[2,5],[0,4],[-2,5],[-4,6],[-5,6],[-5,5],[-3,4],[-2,4],[0,5],[2,5],[4,6],[6,8],[8,10],[10,12],[12,14],[14,12],[16,10],[18,8],[20,7],[22,5],[24,5],[25,7],[27,8],[28,7],[30,5],[32,5],[34,4],[36,3],[38,4],[40,6],[41,8],[42,12],[44,12],[45,10],[44,8],[42,4],[42,2],[44,2],[44,4],[42,6],[41,8],[42,12],[42,14],[42,16],[44,18],[44,22],[38,22],[36,22],[34,22],[30,22],[28,22],[26,22],[24,22],[22,22],[20,22],[18,22],[16,22],[14,22],[12,22],[10,24],[8,24],[5,20],[2,18],[0,16],[-2,16],[-5,14],[-8,14],[-10,14],[-12,14],[-14,12],[-16,12],[-17,12],[-17,14],[-17,15]],
    [[-17,34],[-12,34],[-8,36],[-5,37],[0,37],[5,37],[8,36],[10,37],[12,36],[12,34],[14,34],[16,34],[18,34],[20,34],[22,34],[24,32],[26,30],[28,28],[30,26],[30,24],[32,22],[32,20],[34,18],[36,18],[38,18],[40,16],[42,14],[44,12],[44,8],[42,4],[40,2],[38,-2],[36,-4],[34,-6],[32,-8],[30,-10],[28,-10],[26,-12],[24,-14],[22,-16],[20,-18],[18,-20],[18,-22],[16,-24],[16,-26],[16,-28],[16,-30],[18,-32],[20,-34],[22,-34],[24,-34],[26,-34],[26,-32],[28,-30],[30,-28],[32,-26],[32,-24],[30,-22],[28,-20],[26,-18],[26,-16],[28,-14],[28,-12],[26,-10],[24,-8],[22,-4],[20,-2],[18,0],[16,2],[14,4],[12,4],[10,2],[8,2],[6,4],[4,4],[2,4],[0,4],[-2,4],[-5,4],[-8,4],[-10,6],[-12,8],[-14,10],[-16,12],[-17,12],[-17,14],[-17,15],[-17,18],[-15,20],[-13,22],[-12,22],[-12,24],[-14,26],[-14,28],[-13,28],[-12,28],[-10,28],[-8,30],[-6,32],[-5,33],[-5,34],[-6,34],[-8,34],[-10,35],[-12,35],[-14,34],[-17,34]],
    // Madagascar
    [[44,-12],[46,-14],[48,-16],[48,-18],[47,-20],[45,-22],[44,-24],[44,-22],[44,-20],[44,-18],[44,-16],[44,-14],[44,-12]],

    // ── Asia ───────────────────────────────────────────────────────────────
    // Russian outline (simplified)
    [[30,70],[36,70],[40,68],[45,66],[50,65],[55,64],[60,62],[65,61],[70,60],[75,60],[80,60],[85,60],[90,60],[95,60],[100,60],[105,60],[110,60],[115,60],[120,60],[125,62],[130,64],[135,68],[138,70],[140,72],[135,72],[130,72],[125,72],[120,72],[115,72],[110,73],[105,74],[100,74],[95,75],[90,75],[85,74],[80,74],[75,74],[70,74],[65,74],[60,74],[55,74],[50,74],[45,74],[40,73],[35,73],[30,72],[28,70],[30,70]],
    // Russia south coast
    [[30,42],[32,42],[34,42],[36,42],[38,44],[40,44],[42,44],[44,44],[46,44],[48,44],[50,46],[52,46],[54,45],[56,44],[58,44],[60,44],[62,44],[64,44],[66,44],[68,44],[70,44],[72,44],[74,44],[76,44],[78,42],[80,44],[82,46],[84,48],[86,50],[88,52],[90,52],[92,52],[94,52],[96,52],[98,52],[100,52],[102,52],[104,52],[106,52],[108,52],[110,52],[112,52],[114,52],[116,52],[118,52],[120,52],[122,52],[124,52],[126,52],[128,52],[130,52],[132,52],[134,52],[136,52],[138,52],[140,52],[142,52],[144,52],[146,52],[148,52],[150,52],[152,52],[154,52],[156,52],[158,52],[160,54],[162,56],[164,58],[166,60],[168,60],[170,60],[170,62],[168,64],[166,64],[164,66],[162,66],[160,68],[158,70],[155,70],[150,70],[145,70],[140,70],[135,68],[130,64],[125,62],[120,60],[115,60],[110,60],[105,60],[100,60],[95,60],[90,60],[85,60],[80,60],[75,60],[70,60],[65,61],[60,62],[55,64],[50,65],[45,66],[40,68],[36,70],[30,70]],

    // Middle East
    [[30,42],[30,38],[32,36],[34,34],[36,32],[36,30],[38,28],[40,26],[42,22],[44,22],[46,22],[48,22],[50,24],[52,24],[54,24],[56,24],[58,22],[60,22],[60,24],[62,26],[58,32],[52,36],[46,38],[40,40],[34,42],[30,42]],

    // ── INDIA (Official Boundary: Kathiawar peninsula, J&K / Ladakh crown, NE states) ──
    [[68.1,23.7],[68.8,24.2],[69.8,24.5],[71.0,24.6],[71.8,24.2],
     [70.5,23.0],[69.2,22.5],[68.9,22.3],[69.6,21.6],[70.3,20.9],[71.0,20.7],[71.8,21.0],
     [72.2,21.7],[72.6,22.2],[72.9,21.7],[72.8,20.5],
     [72.8,19.0],[73.2,17.0],[73.8,15.5],[74.5,14.0],[74.8,12.8],
     [75.6,11.2],[76.2,9.9],[76.9,8.8],[77.5,8.1],
     [78.1,8.8],[79.3,9.3],[79.8,10.3],[79.8,11.8],[80.3,13.1],
     [80.1,14.5],[80.8,15.8],[81.8,16.2],[82.8,17.2],[83.3,17.7],[84.2,18.8],
     [85.0,19.4],[85.8,19.8],[86.7,20.7],[87.3,21.5],
     [88.0,21.6],[88.8,21.6],[89.1,22.0],
     [88.8,22.8],[88.6,24.0],[88.1,24.8],[88.2,26.3],
     [91.3,24.0],[91.3,23.0],[91.8,22.9],[91.8,24.0],[92.4,23.8],[92.5,22.4],[92.8,21.9],
     [93.2,23.0],[93.2,24.2],[94.3,24.3],[94.7,25.4],[95.1,26.3],
     [96.3,27.2],[97.0,27.8],[97.4,28.2],
     [97.0,28.6],[96.0,28.7],[95.0,29.0],[93.8,28.8],[92.5,27.8],
     [92.1,26.8],[91.5,26.8],[89.8,26.8],
     [88.9,27.1],[88.8,28.1],[88.6,28.0],[88.1,27.2],
     [88.1,26.5],[86.5,26.5],[85.0,26.8],[83.5,27.4],[81.0,28.6],[80.2,28.8],
     [80.3,29.8],[81.1,30.3],[80.2,31.3],[78.8,31.4],[77.7,30.4],
     [77.6,31.4],[78.8,32.3],[76.8,32.8],
     [75.8,32.4],[74.5,32.8],[74.0,33.8],[73.5,34.5],
     [73.2,35.2],[74.0,36.2],[74.5,37.0],[75.5,37.1],
     [77.0,36.5],[78.0,35.8],[79.0,35.5],[79.8,34.5],
     [79.2,33.2],[78.5,32.6],
     [75.0,32.5],[74.6,31.6],[74.4,30.5],
     [73.8,29.8],[72.0,28.4],[70.5,27.2],[70.0,26.5],[70.2,25.0],
     [69.5,24.5],[68.8,24.0],[68.1,23.7]],
    // Sri Lanka
    [[80.0,9.8],[80.8,9.0],[81.5,8.3],[81.8,7.5],[81.4,6.9],[80.8,6.5],
     [80.0,6.8],[79.7,7.6],[79.8,8.5],[80.0,9.8]],
    // Andaman Islands
    [[92.5,13.2],[92.7,12.5],[93.0,11.8],[93.0,13.2],[92.5,13.2]],

    // Southeast Asia mainland
    [[98,18],[100,18],[102,18],[104,18],[106,18],[108,18],[110,18],[110,16],[108,14],[106,12],[104,10],[102,8],[100,6],[100,4],[102,2],[104,2],[104,4],[106,4],[108,6],[110,8],[112,10],[114,12],[116,14],[118,16],[120,18],[122,18],[124,16],[126,14],[128,12],[130,10],[130,8],[128,6],[126,4],[124,2],[122,0],[120,-2],[118,-4],[116,-4],[114,-4],[112,-4],[110,-4],[108,-6],[106,-6],[104,-6],[102,-4],[100,-2],[98,0],[96,2],[94,4],[92,6],[98,18]],

    // Japan
    [[130,32],[132,34],[134,35],[136,36],[138,36],[140,38],[142,38],[142,40],[140,42],[138,42],[136,42],[134,40],[132,38],[130,36],[130,34],[130,32]],
    [[130,42],[132,42],[134,44],[136,44],[138,44],[140,44],[142,44],[144,44],[146,44],[146,42],[144,40],[142,40],[140,40],[138,40],[136,40],[134,40],[132,40],[130,40],[130,42]],

    // Korean Peninsula
    [[124,34],[126,34],[128,36],[128,38],[130,38],[130,40],[128,40],[126,40],[124,40],[124,38],[124,36],[124,34]],

    // China east coast
    [[122,30],[122,32],[122,34],[122,36],[122,38],[120,40],[118,40],[116,40],[114,40],[112,40],[110,40],[108,40],[106,38],[104,36],[102,34],[100,32],[98,30],[96,28],[98,26],[100,24],[102,22],[104,22],[106,22],[108,22],[110,22],[112,22],[114,22],[116,22],[118,22],[120,22],[122,22],[124,22],[126,22],[128,22],[130,22],[130,24],[128,24],[126,24],[124,26],[122,28],[122,30]],

    // ── Australia ──────────────────────────────────────────────────────────
    [[114,-22],[116,-22],[118,-22],[120,-22],[122,-22],[124,-22],[126,-22],[128,-22],[130,-22],[132,-22],[134,-22],[136,-22],[138,-22],[140,-22],[142,-22],[144,-22],[146,-22],[148,-22],[150,-22],[152,-24],[154,-26],[154,-28],[152,-30],[150,-32],[148,-34],[146,-36],[144,-38],[142,-38],[140,-38],[138,-38],[136,-38],[134,-38],[132,-38],[130,-36],[128,-34],[126,-32],[124,-30],[122,-28],[120,-26],[118,-24],[116,-24],[114,-24],[114,-22]],
    [[140,-12],[142,-14],[144,-16],[146,-18],[148,-20],[150,-22],[152,-22],[154,-24],[152,-26],[150,-28],[148,-30],[146,-32],[144,-34],[142,-36],[140,-36],[138,-36],[136,-34],[134,-32],[132,-30],[130,-28],[128,-26],[126,-24],[124,-22],[122,-22],[120,-22],[118,-22],[116,-22],[114,-22],[114,-20],[116,-18],[118,-18],[120,-18],[122,-18],[124,-18],[126,-18],[128,-18],[130,-16],[132,-14],[134,-14],[136,-12],[138,-12],[140,-12]],
    // New Zealand
    [[172,-42],[174,-40],[176,-40],[178,-38],[178,-36],[174,-34],[172,-34],[170,-36],[170,-38],[172,-40],[172,-42]],
    [[168,-46],[170,-46],[172,-44],[172,-46],[170,-48],[168,-46]],
  ];

  // Return densified versions
  return raw.map(poly => densify(poly, 0.3));
})();

export default function StageCanvas({ stageRef }) {
  const canvasRef = useRef(null);
  const { active } = useTheme();
  const themeRef = useRef(active);

  useEffect(() => {
    themeRef.current = active;
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let buildTextPos;

    // --- Renderer Setup ---
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);
    camera.position.set(0, 0, 7);

    function resize() {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (buildTextPos) buildTextPos();
    }
    window.addEventListener('resize', resize);
    resize();

    // --- Globe Group Setup ---
    const globeGroup = new THREE.Group();
    // Start with India (lon≈78°E) facing the camera (positive Z)
    // Derived: th=(78+180)*PI/180=258°, to bring z=sin(258°)≈-0.978 to +Z, rotate by ~2.932 rad
    globeGroup.rotation.y = 2.932;
    scene.add(globeGroup);

    const initialTheme = themeRef.current || {};
    const initDots = initialTheme.globeDots || [0.96, 0.78, 0.32];
    const isLight = initialTheme.id === 'reversed-ocean-blue';

    const curColors = {
      dotR: initDots[0], dotG: initDots[1], dotB: initDots[2],
      wire: new THREE.Color(initialTheme.globeWire || 0xd4a847),
      halo: new THREE.Color(initialTheme.globeHalo || 0xd4a847),
      outline: new THREE.Color(initialTheme.globeOutline || 0xf5d580),
      outlineHalo: new THREE.Color(initialTheme.globeOutlineHalo || 0xd4a847),
      city: new THREE.Color(initialTheme.globeCity || 0xf5d77a),
      arc: new THREE.Color(initialTheme.globeArc || 0xd4a847),
      earth: new THREE.Color(initialTheme.globeEarth || 0x07090e),
      lightMode: isLight ? 1.0 : 0.0,
    };

    // Inner dark sphere
    const earthGeom = new THREE.SphereGeometry(2, 64, 64);
    const earthMat = new THREE.MeshBasicMaterial({ color: curColors.earth, transparent: true, opacity: 0.92, depthWrite: false });
    const earth = new THREE.Mesh(earthGeom, earthMat);
    earth.renderOrder = 0;
    globeGroup.add(earth);

    // Wire lat/lon
    const wireGeom = new THREE.SphereGeometry(2.003, 40, 28);
    const wireMat = new THREE.MeshBasicMaterial({ color: curColors.wire, wireframe: true, transparent: true, opacity: isLight ? 0.06 : 0.22, depthWrite: false });
    const wire = new THREE.Mesh(wireGeom, wireMat);
    wire.renderOrder = 1;
    globeGroup.add(wire);

    // --- Dot Cloud Generation ---
    const DOTS = 6000;
    const basePos = new Float32Array(DOTS * 3);
    const shatterPos = new Float32Array(DOTS * 3);
    const orbitPos = new Float32Array(DOTS * 3);
    const constellationPos = new Float32Array(DOTS * 3);
    const vortexPos = new Float32Array(DOTS * 3);
    const fieldPos = new Float32Array(DOTS * 3);
    const wavePos = new Float32Array(DOTS * 3);
    const helixPos = new Float32Array(DOTS * 3);
    const textPos = new Float32Array(DOTS * 3);
    const colors = new Float32Array(DOTS * 3);
    const brights = new Float32Array(DOTS);

    const phi = Math.PI * (3 - Math.sqrt(5));
    let count = 0;
    for (let i = 0; i < DOTS; i++) {
      const y = 1 - (i / (DOTS - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      
      // Completely uniform Fibonacci distribution
      const include = true;
      
      if (!include) continue;
      
      const k = count;
      basePos[k * 3] = x * 2.01;
      basePos[k * 3 + 1] = y * 2.01;
      basePos[k * 3 + 2] = z * 2.01;

      // Shatter Target (blow outward)
      const burst = 1 + Math.random() * 2.5;
      shatterPos[k * 3] = x * 2.01 * burst + (Math.random() - 0.5) * 1.4;
      shatterPos[k * 3 + 1] = y * 2.01 * burst + (Math.random() - 0.5) * 1.4;
      shatterPos[k * 3 + 2] = z * 2.01 * burst + (Math.random() - 0.5) * 1.4;

      // Orbit Target (points distributed on nested rings)
      const ringIndex = k % 4;
      const ringR = 1.4 + ringIndex * 0.7;
      const a = Math.random() * Math.PI * 2;
      const tiltY = (ringIndex - 1.5) * 0.25;
      orbitPos[k * 3] = Math.cos(a) * ringR;
      orbitPos[k * 3 + 1] = Math.sin(a) * ringR * 0.55 + tiltY;
      orbitPos[k * 3 + 2] = Math.sin(a) * ringR;

      // Constellation Target (sparse spread)
      const cs = 2.6 + Math.random() * 1.4;
      constellationPos[k * 3] = (Math.random() - 0.5) * cs * 1.6;
      constellationPos[k * 3 + 1] = (Math.random() - 0.5) * cs * 1.0;
      constellationPos[k * 3 + 2] = (Math.random() - 0.5) * cs * 1.6;

      // Vortex Target (tornado spiral)
      const v_h = (Math.random() - 0.5) * 4.5;
      const v_r = 0.5 + Math.abs(v_h) * 0.6 + Math.random() * 0.4;
      const v_a = Math.random() * Math.PI * 2;
      vortexPos[k * 3] = Math.cos(v_a) * v_r;
      vortexPos[k * 3 + 1] = v_h;
      vortexPos[k * 3 + 2] = Math.sin(v_a) * v_r;

      // Field Target (flat backdrop)
      fieldPos[k * 3] = (Math.random() - 0.5) * 8;
      fieldPos[k * 3 + 1] = (Math.random() - 0.5) * 5;
      fieldPos[k * 3 + 2] = (Math.random() - 0.5) * 3 - 1;

      const bright = 0.35 + Math.random() * 0.35;
      brights[count] = bright;
      colors[k * 3] = curColors.dotR * bright;
      colors[k * 3 + 1] = curColors.dotG * bright;
      colors[k * 3 + 2] = curColors.dotB * bright;
      count++;
    }

    // --- Text Target Generation (async — waits for fonts to be loaded) ---
    buildTextPos = () => {
      const textCanvas = document.createElement('canvas');
      const textCtx = textCanvas.getContext('2d');
      textCanvas.width = 1400;
      textCanvas.height = 400;
      textCtx.fillStyle = '#000000';
      textCtx.fillRect(0, 0, textCanvas.width, textCanvas.height);
      textCtx.fillStyle = '#ffffff';
      textCtx.font = 'bold 160px "Squarish Sans", Arial, sans-serif';
      textCtx.textAlign = 'center';
      textCtx.textBaseline = 'middle';
      textCtx.fillText('Networq Global', textCanvas.width / 2, 200);

      const imgData = textCtx.getImageData(0, 0, textCanvas.width, textCanvas.height);

      // Scan actual rendered bounding box so we can map ONLY the text pixels
      // to the full world width — ignoring empty canvas margins
      let minX = textCanvas.width, maxX = 0, minY = textCanvas.height, maxY = 0;
      for (let y = 0; y < textCanvas.height; y++) {
        for (let x = 0; x < textCanvas.width; x++) {
          if (imgData.data[(y * textCanvas.width + x) * 4] > 128) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      const bboxW = maxX - minX;
      const bboxH = maxY - minY;
      if (bboxW <= 0 || bboxH <= 0) return; // nothing rendered yet

      // Dynamically calculate visible frustum size at Z=0 (distance=7) to scale footer name
      const aspect = window.innerWidth / window.innerHeight;
      const visibleHeight = 2 * Math.tan((38 * Math.PI) / 360) * 7;
      const visibleWidth = visibleHeight * aspect;

      // Fit within 88% of screen width, max 8.6 on desktop
      const worldW = Math.min(8.6, visibleWidth * 0.88);
      const textAspect = bboxW / bboxH;
      const worldH = worldW / textAspect;

      const textPixels = [];
      const step = 3;
      for (let y = minY; y <= maxY; y += step) {
        for (let x = minX; x <= maxX; x += step) {
          const idx = (y * textCanvas.width + x) * 4;
          if (imgData.data[idx] > 128) {
            // Map text bounding box exactly to full screen width
            textPixels.push({
              x: ((x - minX) / bboxW - 0.5) * worldW,
              y: -((y - minY) / bboxH - 0.5) * worldH,
              z: 0
            });
          }
        }
      }

      if (textPixels.length === 0) return;

      for (let i = 0; i < count; i++) {
        // Uniformly sample from the entire textPixels array so the whole text is formed
        const idx = Math.floor((i / count) * textPixels.length);
        const p = textPixels[idx];
        textPos[i * 3]     = p.x + (Math.random() - 0.5) * 0.01;
        textPos[i * 3 + 1] = p.y + (Math.random() - 0.5) * 0.01;
        textPos[i * 3 + 2] = p.z;
      }
    };

    // Run immediately (in case fonts already loaded) and also after fonts.ready
    buildTextPos();
    document.fonts.ready.then(() => {
      buildTextPos();
    });

    // Define Wave and Helix targets dynamically using count
    const gridSize = Math.floor(Math.sqrt(count));
    for (let i = 0; i < count; i++) {
      // Wave Grid (sinusoidal ripple)
      const gx = i % gridSize;
      const gy = Math.floor(i / gridSize);
      const wx = (gx / gridSize - 0.5) * 7.5;
      const wz = (gy / gridSize - 0.5) * 5.5;
      const dist = Math.sqrt(wx * wx + wz * wz);
      const wy = Math.sin(dist * 3.2) * 0.45;
      wavePos[i * 3] = wx;
      wavePos[i * 3 + 1] = wy;
      wavePos[i * 3 + 2] = wz - 0.5;

      // Double Helix (DNA spiral)
      const strand = i % 2;
      const pct = i / count;
      const ht = pct * Math.PI * 12;
      const hr = 1.0;
      const hx = Math.cos(ht + strand * Math.PI) * hr;
      const hz = Math.sin(ht + strand * Math.PI) * hr;
      const hy = (pct - 0.5) * 5.0;
      helixPos[i * 3] = hx;
      helixPos[i * 3 + 1] = hy;
      helixPos[i * 3 + 2] = hz;
    }

    // Allocate live position buffer
    const livePos = new Float32Array(count * 3);
    livePos.set(basePos.subarray(0, count * 3));

    const dotsGeom = new THREE.BufferGeometry();
    dotsGeom.setAttribute('position', new THREE.BufferAttribute(livePos, 3));
    dotsGeom.setAttribute('color', new THREE.BufferAttribute(colors.subarray(0, count * 3), 3));
    const dotsMat = new THREE.PointsMaterial({
      size: 0.018,
      vertexColors: true,
      transparent: true,
      opacity: 0.52,
      sizeAttenuation: true,
      depthWrite: false
    });
    const dots = new THREE.Points(dotsGeom, dotsMat);
    scene.add(dots);

    // Halo shader — uLightMode=0 is dark (additive glow), uLightMode=1 is light (soft shadow ring)
    const haloGeom = new THREE.SphereGeometry(2.22, 48, 48);
    const haloMat = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        c: { value: curColors.halo },
        uLightMode: { value: curColors.lightMode },
        uOpacity: { value: 1.0 }
      },
      vertexShader: `
        varying vec3 vN;
        void main() {
          vN = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vN;
        uniform vec3 c;
        uniform float uLightMode;
        uniform float uOpacity;
        void main() {
          float rim = pow(1.0 - abs(vN.z), 3.0);
          float alpha = mix(rim * 0.12, rim * 0.08, uLightMode);
          gl_FragColor = vec4(c, alpha * uOpacity);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });
    const halo = new THREE.Mesh(haloGeom, haloMat);
    globeGroup.add(halo);

    // --- World Map Outline Particles ---
    // Collect all lat/lon points from the outline polylines
    const outlinePoints = [];
    WORLD_OUTLINES.forEach(poly => {
      poly.forEach(([lon, lat]) => {
        const ph = (90 - lat) * Math.PI / 180;
        const th = (lon + 180) * Math.PI / 180;
        const R = 2.018; // Slightly above sphere surface
        outlinePoints.push(
          -R * Math.sin(ph) * Math.cos(th),
           R * Math.cos(ph),
           R * Math.sin(ph) * Math.sin(th)
        );
      });
    });

    const outlineCount = outlinePoints.length / 3;
    const outlinePosArr = new Float32Array(outlinePoints);
    const outlineGeom = new THREE.BufferGeometry();
    outlineGeom.setAttribute('position', new THREE.BufferAttribute(outlinePosArr, 3));

    // Custom shader: glowing disc per particle
    // Front hemisphere = full brightness; back = dim (translucent globe effect, always visible)
    // uLightMode=0 → additive (dark bg); uLightMode=1 → normal blend (light bg)
    const outlineMat = new THREE.ShaderMaterial({
      uniforms: {
        uColor:     { value: curColors.outline },
        uSize:      { value: 3.5 * renderer.getPixelRatio() },
        uLightMode: { value: curColors.lightMode },
        uOpacity:   { value: 1.0 }
      },
      vertexShader: `
        uniform float uSize;
        varying float vDepth;
        void main() {
          // vDepth: +1 = fully facing camera, -1 = fully behind
          vec3 nv = normalize(normalMatrix * normalize(position));
          vDepth = nv.z;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          // Back particles are slightly smaller for depth-perception cue
          float sz = 0.6 + 0.4 * max(0.0, nv.z);
          gl_PointSize = uSize * (6.0 / -mv.z) * sz;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uLightMode;
        uniform float uOpacity;
        varying float vDepth;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;
          float glow = pow(smoothstep(0.5, 0.0, d), 1.6);
          // Subtle, non-overpowering opacity
          float frontAlpha = mix(0.92, 0.90, uLightMode);
          float backAlpha  = mix(0.12, 0.08, uLightMode);
          float fade = backAlpha + frontAlpha * max(0.0, vDepth);
          vec3 col = uColor * mix(0.95 + glow * 0.35, 1.0, uLightMode);
          gl_FragColor = vec4(col, glow * fade * uOpacity);
        }
      `,
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
      depthTest: false,
    });

    const outlinePts = new THREE.Points(outlineGeom, outlineMat);
    outlinePts.renderOrder = 3;
    globeGroup.add(outlinePts);

    // Outer soft-glow halo — same depth-fade, no time animation
    const outlineHaloMat = new THREE.ShaderMaterial({
      uniforms: {
        uColor:     { value: curColors.outlineHalo },
        uSize:      { value: 9.0 * renderer.getPixelRatio() },
        uLightMode: { value: curColors.lightMode },
        uOpacity:   { value: 1.0 }
      },
      vertexShader: `
        uniform float uSize;
        varying float vDepth;
        void main() {
          vec3 nv = normalize(normalMatrix * normalize(position));
          vDepth = nv.z;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          float sz = 0.5 + 0.5 * max(0.0, nv.z);
          gl_PointSize = uSize * (6.0 / -mv.z) * sz;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uLightMode;
        uniform float uOpacity;
        varying float vDepth;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;
          float glow = pow(max(0.0, 1.0 - d * 2.0), 2.2);
          // Dark: 18% bloom; Light: 10% soft glow (reduced from 42%)
          float bloomStr = mix(0.18, 0.10, uLightMode);
          float fade = 0.05 + 0.95 * max(0.0, vDepth);
          gl_FragColor = vec4(uColor, glow * bloomStr * fade * uOpacity);
        }
      `,
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
      depthTest: false,
    });
    const outlineHaloPts = new THREE.Points(outlineGeom, outlineHaloMat);
    outlineHaloPts.renderOrder = 2;
    globeGroup.add(outlineHaloPts);

    // --- Cities & Arcs ---
    const cities = [
      { name: "New York", lat: 40.71, lon: -74.00 },
      { name: "London", lat: 51.50, lon: -0.12 },
      { name: "Dubai", lat: 25.20, lon: 55.27 },
      { name: "Singapore", lat: 1.35, lon: 103.82 },
      { name: "Tokyo", lat: 35.68, lon: 139.69 },
      { name: "São Paulo", lat: -23.55, lon: -46.63 },
      { name: "Berlin", lat: 52.52, lon: 13.40 },
      { name: "Mumbai", lat: 19.07, lon: 72.87 },
      { name: "Sydney", lat: -33.86, lon: 151.20 },
      { name: "Lagos", lat: 6.52, lon: 3.37 },
      { name: "Mexico City", lat: 19.43, lon: -99.13 },
      { name: "Toronto", lat: 43.65, lon: -79.38 }
    ];

    function llToVec(lat, lon, r) {
      const ph = (90 - lat) * Math.PI / 180;
      const th = (lon + 180) * Math.PI / 180;
      return new THREE.Vector3(-r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph), r * Math.sin(ph) * Math.sin(th));
    }

    const cityRings = [];
    const ringGeom = new THREE.RingGeometry(0.03, 0.05, 24);
    const sphereMiniGeom = new THREE.SphereGeometry(0.036, 16, 16);
    const pulseGeom = new THREE.SphereGeometry(0.028, 12, 12);
    const cityMiniMat = new THREE.MeshBasicMaterial({
      color: curColors.city,
      transparent: true,
      opacity: 1.0
    });

    cities.forEach(c => {
      const v = llToVec(c.lat, c.lon, 2.02);
      const m = new THREE.Mesh(sphereMiniGeom, cityMiniMat);
      m.position.copy(v);
      globeGroup.add(m);

      const ringMat = new THREE.MeshBasicMaterial({
        color: curColors.city,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.position.copy(v);
      ring.lookAt(0, 0, 0);
      ring.userData.phase = Math.random() * Math.PI * 2;
      globeGroup.add(ring);
      cityRings.push(ring);
    });

    const arcsGroup = new THREE.Group();
    globeGroup.add(arcsGroup);

    function makeArc(a, b) {
      const s = llToVec(a.lat, a.lon, 2.02), e = llToVec(b.lat, b.lon, 2.02);
      const m = s.clone().add(e).multiplyScalar(0.5);
      const d = s.distanceTo(e);
      m.normalize().multiplyScalar(2.02 + d * 0.38);
      const curve = new THREE.QuadraticBezierCurve3(s, m, e);
      const pts = curve.getPoints(60);
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({ color: curColors.arc, transparent: true, opacity: 0.85 });
      const line = new THREE.Line(g, mat);
      arcsGroup.add(line);

      const pulseMat = new THREE.MeshBasicMaterial({ color: curColors.city, transparent: true, opacity: 0.95 });
      const pulse = new THREE.Mesh(pulseGeom, pulseMat);
      arcsGroup.add(pulse);

      return { line, curve, pulse };
    }

    const arcs = [];
    for (let i = 0; i < 18; i++) {
      const a = cities[i % cities.length], b = cities[(i * 5 + 3) % cities.length];
      if (a === b) continue;
      const arcObj = makeArc(a, b);
      arcs.push({ ...arcObj, t: Math.random(), speed: 0.004 + Math.random() * 0.004 });
    }

    // --- Morph Geometry (Process Section) ---
    const MORPH_N = 2400;
    function spherePts(n, r) {
      const arr = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        const y = 1 - (i / (n - 1)) * 2;
        const rr = Math.sqrt(1 - y * y);
        const t = phi * i;
        arr[i * 3] = Math.cos(t) * rr * r;
        arr[i * 3 + 1] = y * r;
        arr[i * 3 + 2] = Math.sin(t) * rr * r;
      }
      return arr;
    }

    function mobiusPts(n, R, w) {
      const arr = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        const u = (i / n) * Math.PI * 2;
        const v = (Math.random() * 2 - 1) * w;
        arr[i * 3] = (R + v * Math.cos(u / 2)) * Math.cos(u);
        arr[i * 3 + 1] = v * Math.sin(u / 2);
        arr[i * 3 + 2] = (R + v * Math.cos(u / 2)) * Math.sin(u);
      }
      return arr;
    }

    function doubleHelixPts(n, r, h) {
      const arr = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        const strand = i % 2;
        const pct = i / n;
        const t = pct * Math.PI * 8; // 4 turns
        arr[i * 3] = Math.cos(t + strand * Math.PI) * r;
        arr[i * 3 + 1] = (pct - 0.5) * h;
        arr[i * 3 + 2] = Math.sin(t + strand * Math.PI) * r;
      }
      return arr;
    }

    function icoPts(n, r) {
      const arr = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        const u = Math.acos(2 * Math.random() - 1);
        const v = Math.random() * Math.PI * 2;
        const rr = r * (0.92 + Math.random() * 0.16);
        arr[i * 3] = rr * Math.sin(u) * Math.cos(v);
        arr[i * 3 + 1] = rr * Math.cos(u);
        arr[i * 3 + 2] = rr * Math.sin(u) * Math.sin(v);
      }
      return arr;
    }

    const SHAPES = [
      spherePts(MORPH_N, 1.6),
      mobiusPts(MORPH_N, 1.4, 0.45),
      doubleHelixPts(MORPH_N, 0.8, 3.2),
      icoPts(MORPH_N, 1.65)
    ];

    const morphLive = new Float32Array(MORPH_N * 3);
    morphLive.set(SHAPES[0]);
    const morphBrights = new Float32Array(MORPH_N);
    const morphColors = new Float32Array(MORPH_N * 3);
    for (let i = 0; i < MORPH_N; i++) {
      const b = 0.7 + Math.random() * 0.3;
      morphBrights[i] = b;
      morphColors[i * 3] = curColors.dotR * b;
      morphColors[i * 3 + 1] = curColors.dotG * b;
      morphColors[i * 3 + 2] = curColors.dotB * b;
    }

    const morphGeom = new THREE.BufferGeometry();
    morphGeom.setAttribute('position', new THREE.BufferAttribute(morphLive, 3));
    morphGeom.setAttribute('color', new THREE.BufferAttribute(morphColors, 3));
    const morphMat = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      sizeAttenuation: true,
      depthWrite: false
    });
    const morphPts = new THREE.Points(morphGeom, morphMat);
    const morphGroup = new THREE.Group();
    morphGroup.add(morphPts);

    const morphRings = [];
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(2.0 + i * 0.35, 0.005, 12, 160),
        new THREE.MeshBasicMaterial({ color: curColors.arc, transparent: true, opacity: 0 })
      );
      ring.rotation.x = Math.PI / 2 + i * 0.3;
      ring.rotation.y = i * 0.4;
      morphGroup.add(ring);
      morphRings.push(ring);
    }
    scene.add(morphGroup);
    morphGroup.position.set(0, 0, 0);
    morphGroup.visible = false;

    // --- State & Easing ---
    // Start local copies for interpolation/easing
    const cur = {
      bShatter: 0, bOrbit: 0, bConstellation: 0, bField: 0, bVortex: 0, bWave: 0, bHelix: 0, bText: 0,
      globeX: 1.6, globeY: 0.3, globeScale: 1.0,
      globeOpacity: 1, arcsOpacity: 1, citiesOpacity: 1,
      morphOpacity: 0, morphIndex: 0,
      morphPosX: 0, morphPosY: 0, morphScale: 1,
      warpSpeed: 0
    };

    function updateDots() {
      const arr = dotsGeom.attributes.position.array;
      const wBase = Math.max(0, 1 - cur.bShatter - cur.bOrbit - cur.bConstellation - cur.bField - cur.bVortex - cur.bWave - cur.bHelix - cur.bText);
      for (let i = 0; i < count; i++) {
        const k = i * 3;
        arr[k] = basePos[k] * wBase 
               + shatterPos[k] * cur.bShatter 
               + orbitPos[k] * cur.bOrbit 
               + constellationPos[k] * cur.bConstellation 
               + fieldPos[k] * cur.bField 
               + vortexPos[k] * cur.bVortex
               + wavePos[k] * cur.bWave
               + helixPos[k] * cur.bHelix
               + textPos[k] * cur.bText;
        arr[k + 1] = basePos[k + 1] * wBase 
                   + shatterPos[k + 1] * cur.bShatter 
                   + orbitPos[k + 1] * cur.bOrbit 
                   + constellationPos[k + 1] * cur.bConstellation 
                   + fieldPos[k + 1] * cur.bField 
                   + vortexPos[k + 1] * cur.bVortex
                   + wavePos[k + 1] * cur.bWave
                   + helixPos[k + 1] * cur.bHelix
                   + textPos[k + 1] * cur.bText;
        arr[k + 2] = basePos[k + 2] * wBase 
                   + shatterPos[k + 2] * cur.bShatter 
                   + orbitPos[k + 2] * cur.bOrbit 
                   + constellationPos[k + 2] * cur.bConstellation 
                   + fieldPos[k + 2] * cur.bField 
                   + vortexPos[k + 2] * cur.bVortex
                   + wavePos[k + 2] * cur.bWave
                   + helixPos[k + 2] * cur.bHelix
                   + textPos[k + 2] * cur.bText;
      }
      dotsGeom.attributes.position.needsUpdate = true;
    }

    function updateMorph() {
      if (cur.morphOpacity < 0.01) {
        morphGroup.visible = false;
        return;
      }
      morphGroup.visible = true;
      const idx = Math.max(0, Math.min(3, cur.morphIndex));
      const i0 = Math.floor(idx);
      const i1 = Math.min(3, i0 + 1);
      const f = idx - i0;
      const A = SHAPES[i0], B = SHAPES[i1];
      const arr = morphGeom.attributes.position.array;
      for (let i = 0; i < MORPH_N * 3; i++) {
        arr[i] = A[i] * (1 - f) + B[i] * f;
      }
      morphGeom.attributes.position.needsUpdate = true;
      morphMat.opacity = cur.morphOpacity;
      morphRings.forEach((r, j) => {
        r.material.opacity = cur.morphOpacity * (0.55 - j * 0.15);
      });
    }

    // --- Parallax setup ---
    let pTargetX = 0, pTargetY = 0, pCurX = 0, pCurY = 0;
    function onMouseMove(e) {
      const w = window.innerWidth, h = window.innerHeight;
      pTargetX = (e.clientX / w - 0.5) * 0.6;
      pTargetY = -(e.clientY / h - 0.5) * 0.4;
    }
    window.addEventListener('mousemove', onMouseMove);

    const startTime = performance.now();
    let animId = null;
    let isFirstFrame = true;

    function tick() {
      const t = (performance.now() - startTime) / 1000;
      const ease = 0.085;
      
      // Interpolate from shared state ref and check if values are changing
      const targetState = stageRef.current;
      let dotsNeedUpdate = false;
      let morphNeedUpdate = false;

      for (const k in targetState) {
        const diff = targetState[k] - cur[k];
        if (Math.abs(diff) > 0.00005) {
          cur[k] += diff * ease;
          if (['bShatter', 'bOrbit', 'bConstellation', 'bField', 'bVortex', 'bWave', 'bHelix', 'bText'].includes(k)) {
            dotsNeedUpdate = true;
          }
          if (['morphIndex', 'morphOpacity'].includes(k)) {
            morphNeedUpdate = true;
          }
        } else {
          cur[k] = targetState[k];
        }
      }

      if (isFirstFrame) {
        dotsNeedUpdate = true;
        morphNeedUpdate = true;
        isFirstFrame = false;
      }

      pCurX += (pTargetX - pCurX) * 0.05;
      pCurY += (pTargetY - pCurY) * 0.05;

      // Apply globe rotations/scales
      globeGroup.position.x = cur.globeX + pCurX * 0.4;
      globeGroup.position.y = cur.globeY + pCurY * 0.3;
      globeGroup.scale.setScalar(cur.globeScale);
      globeGroup.rotation.y += 0.0018 + cur.warpSpeed * 0.05;
      globeGroup.rotation.x = pCurY * 0.4 + Math.sin(t * 0.25) * 0.04;

      // Dynamic color interpolation
      const activeTheme = themeRef.current || {};
      const targetDots = activeTheme.globeDots || [0.96, 0.78, 0.32];
      const targetWire = new THREE.Color(activeTheme.globeWire || 0xd4a847);
      const targetHalo = new THREE.Color(activeTheme.globeHalo || 0xd4a847);
      const targetOutline = new THREE.Color(activeTheme.globeOutline || 0xf5d580);
      const targetOutlineHalo = new THREE.Color(activeTheme.globeOutlineHalo || 0xd4a847);
      const targetCity = new THREE.Color(activeTheme.globeCity || 0xf5d77a);
      const targetArc = new THREE.Color(activeTheme.globeArc || 0xd4a847);
      const targetEarth = new THREE.Color(activeTheme.globeEarth || 0x07090e);
      const targetLightMode = activeTheme.id === 'reversed-ocean-blue' ? 1.0 : 0.0;

      const cEase = 0.05;
      let colorsNeedUpdate = false;

      const dR = targetDots[0] - curColors.dotR;
      const dG = targetDots[1] - curColors.dotG;
      const dB = targetDots[2] - curColors.dotB;

      if (Math.abs(dR) > 0.0001 || Math.abs(dG) > 0.0001 || Math.abs(dB) > 0.0001) {
        curColors.dotR += dR * cEase;
        curColors.dotG += dG * cEase;
        curColors.dotB += dB * cEase;
        colorsNeedUpdate = true;
      }

      curColors.wire.lerp(targetWire, cEase);
      curColors.halo.lerp(targetHalo, cEase);
      curColors.outline.lerp(targetOutline, cEase);
      curColors.outlineHalo.lerp(targetOutlineHalo, cEase);
      curColors.city.lerp(targetCity, cEase);
      curColors.arc.lerp(targetArc, cEase);
      curColors.earth.lerp(targetEarth, cEase);
      curColors.lightMode += (targetLightMode - curColors.lightMode) * cEase;

      // Apply colors to materials
      earthMat.color.copy(curColors.earth);
      wireMat.color.copy(curColors.wire);
      haloMat.uniforms.c.value.copy(curColors.halo);
      haloMat.uniforms.uLightMode.value = curColors.lightMode;
      cityMiniMat.color.copy(curColors.city);
      cityRings.forEach(r => {
        r.material.color.copy(curColors.city);
      });
      arcs.forEach(a => {
        a.line.material.color.copy(curColors.arc);
      });
      morphRings.forEach(r => {
        r.material.color.copy(curColors.arc);
      });

      // Pass lightMode to outline shaders and dynamically switch blending modes
      outlineMat.uniforms.uLightMode.value = curColors.lightMode;
      outlineHaloMat.uniforms.uLightMode.value = curColors.lightMode;

      const targetBlending = curColors.lightMode > 0.5 ? THREE.NormalBlending : THREE.AdditiveBlending;
      if (outlineMat.blending !== targetBlending) {
        outlineMat.blending = targetBlending;
        outlineMat.needsUpdate = true;
      }
      if (outlineHaloMat.blending !== targetBlending) {
        outlineHaloMat.blending = targetBlending;
        outlineHaloMat.needsUpdate = true;
      }
      if (haloMat.blending !== targetBlending) {
        haloMat.blending = targetBlending;
        haloMat.needsUpdate = true;
      }

      if (colorsNeedUpdate) {
        const dotsColorsArr = dotsGeom.attributes.color.array;
        for (let i = 0; i < count; i++) {
          const k = i * 3;
          const b = brights[i];
          dotsColorsArr[k] = curColors.dotR * b;
          dotsColorsArr[k + 1] = curColors.dotG * b;
          dotsColorsArr[k + 2] = curColors.dotB * b;
        }
        dotsGeom.attributes.color.needsUpdate = true;

        const morphColorsArr = morphGeom.attributes.color.array;
        for (let i = 0; i < MORPH_N; i++) {
          const k = i * 3;
          const b = morphBrights[i];
          morphColorsArr[k] = curColors.dotR * b;
          morphColorsArr[k + 1] = curColors.dotG * b;
          morphColorsArr[k + 2] = curColors.dotB * b;
        }
        morphGeom.attributes.color.needsUpdate = true;
      }

      // Sync outline color/opacity with globe opacity and scroll Y
      const abstractActive = Math.max(
        cur.bWave,
        cur.bConstellation,
        cur.bHelix,
        cur.bVortex,
        cur.bText,
        cur.bField,
        cur.bShatter,
        cur.bOrbit
      );
      // We only show outlines, wire, and earth on the main hero section (when abstract shape is inactive)
      const heroFactor = Math.max(0, 1 - abstractActive);
      const scrollY = window.scrollY || 0;
      const heroScrollOpacity = Math.max(0, 1 - scrollY / 300); // fade out completely within 300px scroll
      const op = cur.globeOpacity * heroFactor * heroScrollOpacity;

      outlineMat.uniforms.uColor.value.copy(curColors.outline);
      outlineMat.uniforms.uOpacity.value = op;
      outlinePts.visible = op > 0.005;

      outlineHaloMat.uniforms.uColor.value.copy(curColors.outlineHalo);
      outlineHaloMat.uniforms.uOpacity.value = op;
      outlineHaloPts.visible = op > 0.005;

      haloMat.uniforms.uOpacity.value = op;

      // Position dots: lerp toward bottom-center when forming text, otherwise follow globe
      const textBlend = cur.bText;
      dots.position.x = (cur.globeX + pCurX * 0.4) * (1 - textBlend);
      // Push text below copyright — at FOV=16, Z=10, screen half-height ≈ 1.4 units
      // Y = -1.05 places text fully below the copyright bar
      // Move Y up to -1.60 to ensure the bottom is well within the screen bounds
      // and doesn't get chopped off on different aspect ratios
      const globePosY = (cur.globeY + pCurY * 0.3);
      dots.position.y = globePosY * (1 - textBlend) + (-1.60 * textBlend);
      dots.position.z = 0;
      // NO camera animation — keep FOV=38, Z=7 (static, predictable frustum)

      // Scale: force 1.0 immediately so text fills full world width without lerp delay
      dots.scale.setScalar(textBlend > 0.05 ? 1.0 : cur.globeScale);
      
      // Freeze rotation when in text mode
      const rotY = globeGroup.rotation.y * (1 - textBlend);
      const rotX = globeGroup.rotation.x * (1 - textBlend);
      dots.rotation.set(rotX, rotY, 0);

      // In text mode, boost particle size for legibility.
      // On light themes, use a slightly larger dot so they're crisp on white.
      const baseSize = 0.028 + curColors.lightMode * 0.012;
      dotsMat.size = baseSize + textBlend * 0.022;

      // Opacities
      const textBoost = cur.bText * 0.5;
      // Light theme: force full opacity so navy dots are crisp on white
      const dotOpacity = 0.55 + 0.45 * Math.max(
        cur.globeOpacity,
        cur.bField * 0.6 + cur.bConstellation * 0.7 + cur.bShatter * 0.7 + cur.bOrbit * 0.7 + cur.bVortex * 0.7 + cur.bWave * 0.7 + cur.bHelix * 0.7 + cur.bText * 0.9
      );
      dotsMat.opacity = Math.min(1.0, Math.max(dotOpacity, curColors.lightMode) + textBoost);
      earth.material.opacity = op; // full opacity sphere — color handles the look
      earth.visible = op > 0.01;
      // On light bg: faint wireframe; on dark bg: 24% gold grid glow
      wire.material.opacity = op * (0.24 - curColors.lightMode * 0.12);
      wire.visible = op > 0.01;
      halo.visible = op > 0.2;

      // Cities & Arcs are allowed on the hero (scrollY < 300) OR constellation section (bConstellation > 0.01)
      const citiesAllowed = (scrollY < 300) || (cur.bConstellation > 0.01);
      const currentCitiesOpacity = citiesAllowed ? cur.citiesOpacity : 0;
      const currentArcsOpacity = citiesAllowed ? cur.arcsOpacity : 0;

      // Sync city mini sphere opacity
      cityMiniMat.opacity = currentCitiesOpacity;
      cityMiniMat.visible = currentCitiesOpacity > 0.01;

      // Pulse city rings
      cityRings.forEach(r => {
        const s = 1 + (Math.sin(t * 2.5 + r.userData.phase) + 1) * 0.7;
        r.scale.setScalar(s);
        r.material.opacity = Math.max(0, (0.85 - (s - 1) * 0.5) * currentCitiesOpacity);
        r.visible = currentCitiesOpacity > 0.01;
      });

      // Animated Arcs and traveling light pulses
      arcs.forEach(a => {
        a.t += a.speed;
        if (a.t > 1.2) a.t = -0.1;
        const lineOp = Math.sin(Math.min(1, Math.max(0, a.t)) * Math.PI) * currentArcsOpacity;
        
        a.line.material.color.copy(curColors.arc);
        a.line.material.opacity = lineOp * 0.85;
        a.line.visible = lineOp > 0.01;

        if (a.pulse) {
          const pt = a.curve.getPoint(Math.max(0, Math.min(1, a.t)));
          a.pulse.position.copy(pt);
          a.pulse.material.color.copy(curColors.city);
          a.pulse.material.opacity = lineOp * 0.95;
          a.pulse.visible = lineOp > 0.01;
        }
      });

      if (dotsNeedUpdate) {
        updateDots();
      }

      // Morph Group Easing
      morphGroup.position.x = cur.morphPosX + pCurX * 0.3;
      morphGroup.position.y = cur.morphPosY + pCurY * 0.25;
      morphGroup.scale.setScalar(cur.morphScale);
      morphGroup.rotation.y += 0.004 + cur.warpSpeed * 0.08;
      morphGroup.rotation.x = Math.sin(t * 0.4) * 0.2;
      morphRings.forEach((r, j) => {
        r.rotation.z += 0.002 * (j + 1);
      });

      if (morphNeedUpdate) {
        updateMorph();
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(tick);
    }

    tick();

    // --- Cleanup resources ---
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      if (animId) cancelAnimationFrame(animId);

      // Dispose of Three.js objects
      earthGeom.dispose();
      earthMat.dispose();
      wireGeom.dispose();
      wireMat.dispose();
      dotsGeom.dispose();
      dotsMat.dispose();
      haloGeom.dispose();
      haloMat.dispose();
      outlineGeom.dispose();
      outlineMat.dispose();
      outlineHaloMat.dispose();
      ringGeom.dispose();
      cityMiniMat.dispose();
      
      cityRings.forEach(r => {
        r.material.dispose();
      });
      
      arcsGroup.children.forEach(line => {
        line.geometry.dispose();
        line.material.dispose();
      });

      morphGeom.dispose();
      morphMat.dispose();
      morphRings.forEach(r => {
        r.material.dispose();
      });

      renderer.dispose();
    };
  }, [stageRef]);

  return (
    <>
      <canvas id="stage-canvas" ref={canvasRef}></canvas>
      <div id="stage-overlay"></div>
    </>
  );
}
