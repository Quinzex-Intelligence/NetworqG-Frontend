# Local Backup of Color, Visibility, Scroll, & Blending Changes

This file contains a copy of all code modifications made to the project files. You can copy-paste from here to restore or view changes.

---

## 1. `src/ThemeContext.jsx`
### Reversed Ocean Blue Palette Update
```javascript
  {
    id: 'reversed-ocean-blue',
    name: 'Reversed Ocean Blue',
    label: 'Palette 7',
    bg: '#FFFFFF', // Pure white
    bg2: '#F4F6F9', // Very soft bluish-gray for sections/cards alternate (originally '#FFFFFF')
    gold: '#F59E0B', // Bright clean orange-gold (originally '#E2A100')
    gold2: '#D97706', // Slightly darker gold
    goldDeep: '#B45309',
    ink: '#0B2C4D', // Deep slate-navy text (originally '#04385F')
    mute: '#4A5568', // Slate gray for muted text (originally '#64748B')
    line: 'rgba(11, 44, 77, 0.08)', // Subtle slate navy borders (originally 'rgba(4, 56, 95, 0.12)')
    cardBg: '#FFFFFF', // Solid white cards over soft background (originally 'rgba(255, 255, 255, 0.85)')
    glassBg: 'rgba(244, 246, 249, 0.70)', // Light glassbg (originally 'rgba(255, 255, 255, 0.60)')
    navBg: 'rgba(255, 255, 255, 0.80)', // White transparent nav (originally 'rgba(255, 255, 255, 0.75)')
    drawerBg: '#FFFFFF',
    caseCoverGrad: 'radial-gradient(circle at 80% 20%, rgba(245,158,11,0.12), transparent 55%), radial-gradient(circle at 20% 80%, rgba(245,158,11,0.15), transparent 55%), linear-gradient(135deg,#FFFFFF,#FFFFFF)',
    preloaderBg: '#FFFFFF',
    burgerBg: 'rgba(255, 255, 255, 0.85)',
    accentRgb: '245, 158, 11', // rgb of F59E0B (originally '226, 161, 0')
    bgRgb: '255, 255, 255',
    bg2Rgb: '244, 246, 249', // rgb of F4F6F9
    preview: ['#FFFFFF', '#0B2C4D'],
    // Globe configuration: vivid ocean blue on white — high contrast
    globeDots: [0.04, 0.28, 0.55],      // Strong ocean blue dots
    globeWire: '#6ba8cc',               // Visible mid-blue wireframe grid
    globeHalo: '#2563eb',               // Rich blue atmospheric glow
    globeOutline: '#083e66',            // Very dark navy continent outlines
    globeOutlineHalo: '#3b82f6',        // Electric blue outline bloom
    globeCity: '#d97706',               // Amber/gold cities
    globeArc: '#1d4ed8',                // Vivid blue arcs
    globeEarth: '#deedf7',              // Light ice-blue sphere (not white — gives depth)
  },
```

---

## 2. `src/index.css`
### Cursor Classes Updates
```css
.cursor-dot {
  position: fixed;
  left: 0;
  top: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--ink);
  pointer-events: none;
  z-index: 9999;
  will-change: transform;
}

.cursor-ring {
  position: fixed;
  left: 0;
  top: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1.5px solid var(--ink);
  opacity: 0.5;
  pointer-events: none;
  z-index: 9998;
  will-change: transform, width, height;
  transition: width .25s ease, height .25s ease, border-color .25s ease, opacity .25s ease;
}

.cursor-link {
  width: 56px;
  height: 56px;
  border-color: var(--gold-2);
  opacity: 0.85;
}
```

---

## 3. `src/App.jsx`
### Page Context Canvas Hiding (Around Line 333)
```javascript
    set({
      globeX: HERO.x, globeY: HERO.y, globeScale: HERO.s,
      globeOpacity: currentPage === 'home' ? 1 : 0,
      arcsOpacity: currentPage === 'home' ? 1 : 0,
      citiesOpacity: currentPage === 'home' ? 1 : 0,
      morphOpacity: 0,
      bShatter: 0, bOrbit: 0, bConstellation: 0, bField: 0, bVortex: 0, bWave: 0, bHelix: 0, bText: 0
    });

    if (currentPage !== 'home') return;
```

---

## 4. `src/components/StageCanvas.jsx`
### Initializing `curColors`
```javascript
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
      accent: new THREE.Color(initialTheme.globeArc || 0xd4a847),
      earth: new THREE.Color(initialTheme.globeEarth || 0x07090e),
      lightMode: isLight ? 1.0 : 0.0,
    };
```

### Initializing `wireframe`
```javascript
    const wireGeom = new THREE.SphereGeometry(2.003, 40, 28);
    const wireMat = new THREE.MeshBasicMaterial({ color: curColors.wire, wireframe: true, transparent: true, opacity: isLight ? 0.04 : 0.10, depthWrite: false });
```

### Initializing Shaders
```javascript
    // Halo Shader (Includes uOpacity and uLightMode)
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
          float alpha = mix(rim * 0.55, rim * 0.18, uLightMode);
          gl_FragColor = vec4(c, alpha * uOpacity);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });

    // Outline Shader (Includes uOpacity, uLightMode, and Blending support)
    const outlineMat = new THREE.ShaderMaterial({
      uniforms: {
        uColor:     { value: curColors.outline },
        uSize:      { value: 8.0 * renderer.getPixelRatio() },
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
          float frontAlpha = mix(0.88, 0.90, uLightMode);
          float backAlpha  = mix(0.12, 0.08, uLightMode);
          float fade = backAlpha + frontAlpha * max(0.0, vDepth);
          vec3 col = uColor * mix(0.9 + glow * 0.4, 1.0, uLightMode);
          gl_FragColor = vec4(col, glow * fade * uOpacity);
        }
      `,
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
      depthTest: false,
    });

    // Outline Halo Shader
    const outlineHaloMat = new THREE.ShaderMaterial({
      uniforms: {
        uColor:     { value: curColors.outlineHalo },
        uSize:      { value: 20.0 * renderer.getPixelRatio() },
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
          float bloomStr = mix(0.42, 0.15, uLightMode);
          float fade = 0.05 + 0.95 * max(0.0, vDepth);
          gl_FragColor = vec4(uColor, glow * bloomStr * fade * uOpacity);
        }
      `,
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
      depthTest: false,
    });
```

### Initializing `cityMiniMat`
```javascript
    const cityMiniMat = new THREE.MeshBasicMaterial({
      color: curColors.city,
      transparent: true,
      opacity: 1.0
    });
```

### Tick Animation Loop
```javascript
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

      ...

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
      const globePosY = (cur.globeY + pCurY * 0.3);
      dots.position.y = globePosY * (1 - textBlend) + (-1.60 * textBlend);
      dots.position.z = 0;

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
      const dotOpacity = 0.55 + 0.45 * Math.max(
        cur.globeOpacity,
        cur.bField * 0.6 + cur.bConstellation * 0.7 + cur.bShatter * 0.7 + cur.bOrbit * 0.7 + cur.bVortex * 0.7 + cur.bWave * 0.7 + cur.bHelix * 0.7 + cur.bText * 0.9
      );
      dotsMat.opacity = Math.min(1.0, Math.max(dotOpacity, curColors.lightMode) + textBoost);
      earth.material.opacity = op;
      earth.visible = op > 0.01;
      wire.material.opacity = op * (0.10 - curColors.lightMode * 0.06);
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
        const s = 1 + (Math.sin(t * 2 + r.userData.phase) + 1) * 0.6;
        r.scale.setScalar(s);
        r.material.opacity = Math.max(0, (0.7 - (s - 1) * 0.55) * currentCitiesOpacity);
        r.visible = currentCitiesOpacity > 0.01;
      });

      // Arc trails
      arcsGroup.children.forEach((line, i) => {
        const a = arcs[i];
        if (!a) return;
        a.t += a.speed;
        if (a.t > 1.3) a.t = -0.1;
        const lineOp = Math.sin(Math.min(1, Math.max(0, a.t)) * Math.PI);
        line.material.opacity = lineOp * 0.9 * currentArcsOpacity;
        line.visible = currentArcsOpacity > 0.01;
      });
```
