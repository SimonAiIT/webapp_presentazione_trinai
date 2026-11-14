/**
 * ArkAng-EL - Cockpit blueprint
 * Scena 3D a rete di linee, quote sul modello e registro delle misure.
 * Le rotte API e i corpi delle richieste restano quelli del solutore.
 */

const state = {
  currentResult: null,
  presets: [],
  priors: null,
  scene: null,
  camera: null,
  renderer: null,
  controls: null,
  grid: null,
  sceneGroups: {
    arch: null,
    fiducials: null,
    implants: null,
    mua: null,
    nerves: null,
    confidence: null,
    pins: null,
    guideBar: null,
    annotations: null
  },
  raycaster: new THREE.Raycaster(),
  mouse: new THREE.Vector2(),
  interactiveMeshes: [],
  labelAnchors: [],
  leaderSvg: null,
  sceneBox: null,
  currentView: "iso",
  fitOnNextUpdate: true,
  resizeTimer: null,
  previousCamera: null,
  cameraTween: null
};
window.state = state;

const VIEWS = {
  iso: { dir: [0.6, 0.75, 1.15], up: [0, 0, 1] },
  top: { dir: [0, 0, 1], up: [0, 1, 0] },
  front: { dir: [0, 1, 0], up: [0, 0, 1] },
  right: { dir: [1, 0, 0], up: [0, 0, 1] },
  left: { dir: [-1, 0, 0], up: [0, 0, 1] }
};

document.addEventListener("DOMContentLoaded", () => {
  init3DViewport();
  initEventListeners();
  loadPresets();
  loadPriors();
  loadProfili();
  loadNeuralStatus();
});

// ==============================================================================
// 1. COLORI DALLE VARIABILI CSS
// ==============================================================================

function cssColor(name) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return new THREE.Color(value);
}

function createCircleTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.arc(16, 16, 13, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// ==============================================================================
// 2. INIZIALIZZAZIONE 3D
// ==============================================================================

function init3DViewport() {
  const container = document.getElementById("viewport3d");
  const width = Math.max(1, container.clientWidth);
  const height = Math.max(1, container.clientHeight);

  state.scene = new THREE.Scene();
  state.scene.background = cssColor("--color-bg");
  state.scene.add(new THREE.HemisphereLight(0xffffff, 0x647080, 1.15));
  const implantKeyLight = new THREE.DirectionalLight(0xffffff, 1.7);
  implantKeyLight.position.set(-35, -45, 70);
  state.scene.add(implantKeyLight);

  state.grid = new THREE.GridHelper(120, 60, cssColor("--color-border"), cssColor("--color-line"));
  state.grid.rotation.x = Math.PI / 2;
  state.grid.material.transparent = true;
  state.grid.material.opacity = 0.22;
  state.grid.material.depthWrite = false;
  state.scene.add(state.grid);

  state.leaderSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  state.leaderSvg.setAttribute("class", "scene-leaders");
  state.leaderSvg.setAttribute("aria-hidden", "true");
  container.appendChild(state.leaderSvg);

  state.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 2000);
  state.camera.up.set(0, 0, 1);

  state.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  state.renderer.setSize(width, height);
  state.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  container.appendChild(state.renderer.domElement);

  state.controls = new THREE.OrbitControls(state.camera, state.renderer.domElement);
  state.controls.enableDamping = true;
  state.controls.dampingFactor = 0.08;
  state.controls.target.set(0, 0, 0);

  for (const key of Object.keys(state.sceneGroups)) {
    const group = new THREE.Group();
    state.scene.add(group);
    state.sceneGroups[key] = group;
  }

  window.addEventListener("resize", onWindowResize);
  container.addEventListener("mousemove", onMouseMove);

  setCameraPreset("iso");

  function animate() {
    requestAnimationFrame(animate);
    state.controls.update();
    updateCameraTween();
    const pulse = 0.5 + 0.5 * Math.sin(performance.now() / 700);
    state.sceneGroups.annotations.children.forEach(obj => {
      if (obj.userData && obj.userData.pulse) {
        obj.scale.setScalar(0.88 + pulse * 0.24);
        obj.material.opacity = 0.65 + pulse * 0.35;
        obj.material.transparent = true;
      }
    });
    updateSceneLabels();
    state.renderer.render(state.scene, state.camera);
  }
  animate();
}

function onWindowResize() {
  const container = document.getElementById("viewport3d");
  if (!container || !state.camera || !state.renderer) return;

  const width = Math.max(1, container.clientWidth);
  const height = Math.max(1, container.clientHeight);
  state.camera.aspect = width / height;
  state.camera.updateProjectionMatrix();
  state.renderer.setSize(width, height);

  clearTimeout(state.resizeTimer);
  state.resizeTimer = setTimeout(() => {
    if (state.currentResult) fitScene(state.currentView);
  }, 150);
}

function getViewDefinition(preset) {
  return VIEWS[preset] || VIEWS.iso;
}

function sceneBounds() {
  const box = new THREE.Box3();
  let hasContent = false;

  for (const [key, group] of Object.entries(state.sceneGroups)) {
    if (key === "annotations" || !group || group.children.length === 0) continue;
    group.updateMatrixWorld(true);
    box.expandByObject(group);
    hasContent = true;
  }

  return hasContent ? box : null;
}

function fitScene(preset) {
  if (!state.camera || !state.controls) return;

  const box = sceneBounds();
  if (!box) return;

  const center = box.getCenter(new THREE.Vector3());

  const view = getViewDefinition(preset);
  const direction = new THREE.Vector3(view.dir[0], view.dir[1], view.dir[2]).normalize();
  const up = new THREE.Vector3(view.up[0], view.up[1], view.up[2]).normalize();
  const right = new THREE.Vector3().crossVectors(up, direction).normalize();

  const vFov = THREE.MathUtils.degToRad(state.camera.fov);
  const tanV = Math.tan(vFov / 2);
  const tanH = tanV * Math.max(0.2, state.camera.aspect);
  const fillX = 0.48;
  const fillY = 0.52;

  const corners = [];
  for (const x of [box.min.x, box.max.x]) {
    for (const y of [box.min.y, box.max.y]) {
      for (const z of [box.min.z, box.max.z]) {
        corners.push(new THREE.Vector3(x, y, z));
      }
    }
  }

  let distance = 0;
  for (const corner of corners) {
    const relative = corner.clone().sub(center);
    const depth = relative.dot(direction);
    const horizontal = Math.abs(relative.dot(right));
    const vertical = Math.abs(relative.dot(up));
    const needed = Math.max(horizontal / (tanH * fillX), vertical / (tanV * fillY));
    distance = Math.max(distance, needed + depth);
  }
  distance = Math.max(distance, 15);

  state.camera.position.copy(center).add(direction.clone().multiplyScalar(distance));
  state.camera.up.copy(up);
  state.camera.near = 0.1;
  state.camera.far = Math.max(800, distance + box.getSize(new THREE.Vector3()).length() * 4);
  state.camera.updateProjectionMatrix();
  state.camera.updateMatrixWorld(true);
  state.controls.target.copy(center);
  state.controls.update();

  if (state.grid) {
    state.grid.position.set(0, 0, box.min.z - 2);
  }
}

function setCameraPreset(preset) {
  state.currentView = VIEWS[preset] ? preset : "iso";
  fitScene(state.currentView);
  fitScene(state.currentView); // la prima inquadratura dopo il cambio di vista non si assesta da sola, la seconda sì

  document.querySelectorAll(".cam-btn[data-cam]").forEach(button => {
    const isActive = button.dataset.cam === state.currentView;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function onMouseMove(event) {
  const container = document.getElementById("viewport3d");
  const rect = container.getBoundingClientRect();
  state.mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
  state.mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

  state.raycaster.setFromCamera(state.mouse, state.camera);
  const intersects = state.raycaster.intersectObjects(state.interactiveMeshes);
  const hoveredImplant = intersects.length > 0 ? intersects[0].object : null;
  if (state.hoveredImplant !== hoveredImplant) {
    if (state.hoveredImplant && state.hoveredImplant.material && state.hoveredImplant.material.color) {
      state.hoveredImplant.material.color.set(0xb9bcc0);
    }
    if (hoveredImplant && hoveredImplant.material && hoveredImplant.material.color) {
      hoveredImplant.material.color.set(0xd4ff24);
    }
    state.hoveredImplant = hoveredImplant;
  }

  const tooltip = document.getElementById("tooltip3d");
  if (intersects.length > 0) {
    const data = intersects[0].object.userData;
    if (data && data.label) {
      tooltip.style.display = "block";
      tooltip.style.left = `${event.clientX - rect.left + 15}px`;
      tooltip.style.top = `${event.clientY - rect.top + 15}px`;
      tooltip.innerHTML = `
        <strong>${data.label}</strong><br>
        Impianto: &Oslash;${data.diam} &times; ${data.length} mm<br>
        Cresta: (${data.p_crest.x}, ${data.p_crest.y}, ${data.p_crest.z}) mm<br>
        Inclinazione: ${data.total_tilt}&deg; (MD ${data.tilt_md}&deg;, BL ${data.tilt_bl}&deg;)<br>
        Moncone: ${data.mua_angle}&deg; H${data.mua_height} mm (rotazione ${data.hex_rot}&deg;)<br>
        Distanza dal nervo: <span class="val-accent">${data.nerve_clearance_mm} mm</span><br>
        Aggancio previsto: ${data.torque_ncm} Ncm
      `;
      return;
    }
  }
  tooltip.style.display = "none";
}

// ==============================================================================
// 3. COSTRUZIONE DELLA SCENA BLUEPRINT
// ==============================================================================

function clearGroup(group) {
  while (group.children.length > 0) {
    const obj = group.children[0];
    group.remove(obj);
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
      if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
      else obj.material.dispose();
    }
  }
}

function update3DScene(res) {
  for (const group of Object.values(state.sceneGroups)) {
    clearGroup(group);
  }
  state.interactiveMeshes = [];
  state.labelAnchors = [];

  const labelContainer = document.getElementById("sceneLabels");
  if (labelContainer) labelContainer.replaceChildren();
  if (state.leaderSvg) state.leaderSvg.replaceChildren();

  const blueStructure = cssColor("--color-blue");
  const blueLight = cssColor("--color-blue-light");
  const blueSoft = cssColor("--color-blue-soft");
  const accent = cssColor("--color-accent");

  state.sceneGroups.arch.renderOrder = 1;
  state.sceneGroups.fiducials.renderOrder = 4;
  state.sceneGroups.nerves.renderOrder = 5;
  state.sceneGroups.confidence.renderOrder = 4;
  state.sceneGroups.implants.renderOrder = 10;
  state.sceneGroups.mua.renderOrder = 12;
  state.sceneGroups.pins.renderOrder = 12;
  state.sceneGroups.guideBar.renderOrder = 13;
  state.sceneGroups.annotations.renderOrder = 20;

  const wireMaterial = new THREE.LineBasicMaterial({
    color: blueStructure,
    transparent: true,
    opacity: 0.22,
    depthWrite: false
  });
  const pointMaterial = new THREE.PointsMaterial({
    color: blueSoft,
    size: 2.8,
    sizeAttenuation: false,
    map: createCircleTexture(),
    transparent: true,
    alphaTest: 0.1,
    opacity: 0.35,
    depthWrite: false
  });
  const accentLineMaterial = new THREE.LineBasicMaterial({
    color: accent,
    transparent: true,
    opacity: 0.95
  });
  const nerveMaterial = new THREE.MeshBasicMaterial({
    color: 0xfff0b0,
    transparent: true,
    opacity: 1
  });
  const confidenceMaterial = new THREE.MeshBasicMaterial({ color: 0xffd447, transparent: true, opacity: 0.25, depthWrite: false, side: THREE.DoubleSide });
  const confidenceEdgeMaterial = new THREE.MeshBasicMaterial({ color: 0xffd447, wireframe: true, transparent: true, opacity: 0.62, depthWrite: false });
  const confidenceHalfWidth = readNonNegativeInput("inputNerveConfidence", 2.9);
  const safetyLineMaterial = new THREE.LineDashedMaterial({
    color: accent,
    dashSize: 1.0,
    gapSize: 0.9,
    transparent: true,
    opacity: 0.55
  });
  const implantBodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xb9bcc0,
    metalness: 0.6,
    roughness: 0.4
  });
  const implantInsideMaterial = implantBodyMaterial;
  const implantExitMaterial = implantBodyMaterial;
  const collarMaterial = new THREE.MeshBasicMaterial({
    color: blueStructure,
    transparent: true,
    opacity: 1.0,
    depthTest: true,
    depthWrite: true
  });
  const thinBlueMaterial = new THREE.LineBasicMaterial({
    color: blueLight,
    transparent: true,
    opacity: 0.34
  });
  const faintBlueMaterial = new THREE.LineBasicMaterial({
    color: blueLight,
    transparent: true,
    opacity: 0.18
  });
  const barMaterial = new THREE.LineBasicMaterial({
    color: blueStructure,
    transparent: true,
    opacity: 0.8
  });
  const pinMaterial = new THREE.LineBasicMaterial({
    color: blueSoft,
    transparent: true,
    opacity: 0.75
  });
  const fiducialMaterial = new THREE.MeshBasicMaterial({ color: blueSoft });
  const craterMaterial = new THREE.MeshBasicMaterial({
    color: blueLight,
    wireframe: true,
    transparent: true,
    opacity: 0.45
  });

  const archPoints = (res.arch_spline_points || []).map(p => new THREE.Vector3(p.x, p.y, p.z));
  if (archPoints.length > 1) {
    // mandibola completa e stilizzata: l'arcata tra i forami, il corpo dietro i forami fino all'angolo (stesso percorso del canale) e i due rami
    const osso = arcataConCorpo(archPoints, res.fiducials);
    buildBoneNetwork(osso, state.sceneGroups.arch, wireMaterial, pointMaterial, blueSoft, res.params);
    if (osso.length > archPoints.length) addRamiStilizzati(state.sceneGroups.arch, osso, wireMaterial);
  }

  ARCATA_PUNTI = archPoints.length > 2 ? archPoints : null;
  const fid = res.fiducials || {};
  if (fid.P0_Midline) {
    addSphere(state.sceneGroups.fiducials, fid.P0_Midline, 1.1, fiducialMaterial);
  }
  if (fid.Foramen_Sinus_R) {
    addSphere(state.sceneGroups.fiducials, fid.Foramen_Sinus_R, 1.3, fiducialMaterial);
  }
  if (fid.Foramen_Sinus_L) {
    addSphere(state.sceneGroups.fiducials, fid.Foramen_Sinus_L, 1.3, fiducialMaterial);
  }

  if (fid.Foramen_Sinus_R && fid.Nerve_Loop_R) {
    addNerve(state.sceneGroups.nerves, fid.Foramen_Sinus_R, fid.Nerve_Loop_R, nerveMaterial, safetyLineMaterial, confidenceHalfWidth, confidenceMaterial, confidenceEdgeMaterial);
  }
  if (fid.Foramen_Sinus_L && fid.Nerve_Loop_L) {
    addNerve(state.sceneGroups.nerves, fid.Foramen_Sinus_L, fid.Nerve_Loop_L, nerveMaterial, safetyLineMaterial, confidenceHalfWidth, confidenceMaterial, confidenceEdgeMaterial);
  }

  const sleeveCenters = [];
  const vProst = parseFloat((res.params && res.params.V_prost) || 14.5);

  (res.implants || []).forEach(imp => {
    const pCrest = new THREE.Vector3(imp.p_crest.x, imp.p_crest.y, imp.p_crest.z);
    const axisDir = new THREE.Vector3(imp.axis_dir.x, imp.axis_dir.y, imp.axis_dir.z).normalize();
    const physicalLength = Number(imp.length) > 0
      ? Number(imp.length)
      : new THREE.Vector3(imp.p_apex.x, imp.p_apex.y, imp.p_apex.z).distanceTo(pCrest);
    const rImp = (Number(imp.diam) || 3.5) / 2.0;
    const pApex = pCrest.clone().add(axisDir.clone().multiplyScalar(physicalLength));
    const boneMargin = imp.bone_margin_mm !== undefined && imp.bone_margin_mm !== null
      ? Number(imp.bone_margin_mm)
      : 999;

    const implantMesh = createImplantMesh(pCrest, axisDir, physicalLength, Number(imp.diam) || 3.5, implantInsideMaterial);
    implantMesh.userData = imp;
    implantMesh.renderOrder = 10;
    state.sceneGroups.implants.add(implantMesh);
    state.interactiveMeshes.push(implantMesh);

    const collarHalf = Math.min(0.5, physicalLength * 0.05);
    const pCollarStart = pCrest.clone().add(axisDir.clone().multiplyScalar(-collarHalf));
    const pCollarEnd = pCrest.clone().add(axisDir.clone().multiplyScalar(collarHalf));
    const collarMesh = addCylinder(state.sceneGroups.implants, pCollarStart, pCollarEnd, rImp * 1.1, collarMaterial, 16);
    collarMesh.renderOrder = 11;

    const pNeckTop = pCrest.clone().add(new THREE.Vector3(0, 0, Math.min(imp.mua_height, 2.4)));
    addLine(state.sceneGroups.mua, pCrest, pNeckTop, thinBlueMaterial);

    const pSleeveTop = pCrest.clone().add(axisDir.clone().multiplyScalar(-1.3));
    addLine(state.sceneGroups.mua, pCrest, pSleeveTop, thinBlueMaterial);
    sleeveCenters.push(pSleeveTop);

    const pChimneyTop = new THREE.Vector3(pCrest.x, pCrest.y, vProst);
    if (pChimneyTop.z > pNeckTop.z + 0.4) {
      addLine(state.sceneGroups.mua, pNeckTop, pChimneyTop, faintBlueMaterial);
    }
  });

  for (let i = 0; i < sleeveCenters.length - 1; i++) {
    addLine(state.sceneGroups.guideBar, sleeveCenters[i], sleeveCenters[i + 1], barMaterial);
  }

  (res.pins || []).forEach(pin => {
    const pEntry = new THREE.Vector3(pin.entry.x, pin.entry.y, pin.entry.z);
    const pTip = new THREE.Vector3(pin.tip.x, pin.tip.y, pin.tip.z);
    addLine(state.sceneGroups.pins, pEntry, pTip, pinMaterial);
    addSphere(state.sceneGroups.pins, pin.entry, 0.3, fiducialMaterial);
  });

  if (res.imperfection_3d && res.imperfection_3d.center) {
    const defCenter = res.imperfection_3d.center;
    const defRadius = Math.max(2.2, (res.imperfection_3d.radius || 3.5) * 0.65);
    addSphere(state.sceneGroups.arch, defCenter, defRadius, craterMaterial);
  }

  buildSceneAnnotations(res, archPoints, accentLineMaterial);

  const box = sceneBounds();
  state.sceneBox = box;
  if (box && state.grid) {
    state.grid.position.set(0, 0, box.min.z - 2);
  }

  if (state.fitOnNextUpdate) {
    fitScene(state.currentView);
    state.fitOnNextUpdate = false;
  }
}

function buildBoneNetwork(points, group, wireMaterial, pointMaterial, centerColor, params) {
  const curve = new THREE.CatmullRomCurve3(points);
  const rings = 46;
  const ringPoints = 16;
  const ringVertices = [];
  const segments = [];
  const sampledPoints = [];

  const H_ant = parseFloat(params && params.H_ant) || 15.0;
  const H_post_R = parseFloat(params && params.H_post_R) || 10.0;
  const H_post_L = parseFloat(params && params.H_post_L) || 10.0;
  const W_ant = parseFloat(params && params.W_ant) || 6.0;
  const W_post = parseFloat(params && params.W_post) || 6.5;

  for (let i = 0; i <= rings; i++) {
    const t = i / rings;
    const crest = curve.getPoint(t);
    const tangent = curve.getTangent(t).normalize();

    let H, W;
    if (t < 0.5) {
      const s = 0.5 - 0.5 * Math.cos((t / 0.5) * Math.PI);
      H = H_post_L + (H_ant - H_post_L) * s;
      W = W_post + (W_ant - W_post) * s;
    } else {
      const s = 0.5 - 0.5 * Math.cos(((t - 0.5) / 0.5) * Math.PI);
      H = H_ant + (H_post_R - H_ant) * s;
      W = W_ant + (W_post - W_ant) * s;
    }

    const center = crest.clone();
    center.z -= H / 2.0;

    let normal = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 0, 1));
    if (normal.lengthSq() < 1e-5) normal.set(1, 0, 0);
    normal.z = 0;
    normal.normalize();

    const widthRadius = W / 2.0;
    const heightRadius = H / 2.0;
    const ring = [];

    for (let j = 0; j < ringPoints; j++) {
      const angle = (j / ringPoints) * Math.PI * 2;
      const offset = normal.clone().multiplyScalar(Math.cos(angle) * widthRadius);
      offset.z = Math.sin(angle) * heightRadius;
      ring.push(center.clone().add(offset));
    }

    ringVertices.push(ring);
    if (i % 2 === 0) {
      for (let j = 0; j < ringPoints; j += 2) {
        sampledPoints.push(ring[j]);
      }
    }
  }

  for (let i = 0; i < ringVertices.length; i++) {
    const ring = ringVertices[i];
    for (let j = 0; j < ringPoints; j++) {
      segments.push(ring[j], ring[(j + 1) % ringPoints]);
      if (i < ringVertices.length - 1) {
        segments.push(ring[j], ringVertices[i + 1][j]);
      }
    }
  }

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(segments);
  const lineMesh = new THREE.LineSegments(lineGeometry, wireMaterial);
  lineMesh.renderOrder = 1;
  group.add(lineMesh);

  const pointGeometry = new THREE.BufferGeometry().setFromPoints(sampledPoints);
  const pointMesh = new THREE.Points(pointGeometry, pointMaterial);
  pointMesh.renderOrder = 1;
  group.add(pointMesh);

  const centerGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const centerMaterial = new THREE.LineBasicMaterial({
    color: centerColor,
    transparent: true,
    opacity: 0.30,
    depthWrite: false
  });
  const centerMesh = new THREE.Line(centerGeometry, centerMaterial);
  centerMesh.renderOrder = 1;
  group.add(centerMesh);
}

// Il solutore conosce del nervo solo il tratto anteriore (dall'ansa al forame). Il tratto posteriore, dal forame verso il ramo,
// è la FORMA MEDIA di 240 canali veri di ToothFairy3 (calcolata dai dati, assi verificati: dal forame il canale sale verso il ramo, quasi tutto in un piano),
// ancorata al forame, DENTRO il corpo della mandibola (l'osso è prolungato dietro i forami lungo lo stesso percorso). Non è la ricostruzione del caso: quella la farà la lucertola dai punti dati. Le distanze del solutore non la usano.
// Colonne: indietro lungo l'arcata, verso l'esterno, in alto (mm) a passi di 5 mm dal forame.
const CANALE_FORMA_MEDIA = [
  [0.00, 0.00, 0.00], [4.15, -0.06, 0.34], [8.73, 0.00, -0.01], [13.43, 0.00, 1.09], [17.99, 0.00, 2.70],
  [22.43, 0.02, 4.59], [26.76, 0.02, 6.78], [30.88, 0.01, 9.32], [34.76, -0.01, 12.19], [38.31, -0.02, 15.47]
];

function canaleSistema(from, to) {
  const foramen = new THREE.Vector3(from.x, from.y, from.z);
  const loop = new THREE.Vector3(to.x, to.y, to.z);
  const dir = new THREE.Vector3().subVectors(foramen, loop);
  dir.z = 0;
  if (dir.lengthSq() < 1e-6) dir.set(Math.sign(foramen.x) || 1, 0, 0);
  dir.normalize();
  const side = Math.sign(foramen.x) || 1;
  const lateral = new THREE.Vector3(-dir.y, dir.x, 0);
  if (lateral.x * side < 0) lateral.negate();
  return { foramen, loop, dir, lateral };
}

// Punti del tratto posteriore a partire da un'origine (il forame per il canale, la fine dell'arcata per la cresta dell'osso).
function tratto_posteriore(origine, sistema) {
  return CANALE_FORMA_MEDIA.slice(1).map(([back, out, up]) => origine.clone()
    .add(sistema.dir.clone().multiplyScalar(back))
    .add(sistema.lateral.clone().multiplyScalar(out))
    .add(new THREE.Vector3(0, 0, up)));
}

// Il canale vero (atlante, 1.064 canali): arriva da dietro DENTRO il corpo della mandibola, quasi su un piano, e vicino al forame si
// sposta verso l'esterno (circa 2,4 mm) e sale (circa 1,2 mm): e' l'UNCINO (l'ansa). Nelle etichette non continua oltre il forame verso gli incisivi.
// Il solutore da' il forame e il 'loop del nervo' (quanto l'uncino va avanti prima di tornare indietro e uscire dal forame).
const NERVO_RAGGIO_MM = 1.45; // calibro della maschera del canale (2,9 mm di diametro), limite alto del nervo vero
let UNCINO_PUNTO = null;

function canaleConUncino(from, to) {
  const s = canaleSistema(from, to);
  const F = s.foramen;
  const rel = (back, out, up) => F.clone()
    .add(s.dir.clone().multiplyScalar(back))
    .add(s.lateral.clone().multiplyScalar(out))
    .add(new THREE.Vector3(0, 0, up));
  const avanti = Math.max(1.2, F.distanceTo(s.loop));
  const corpo = CANALE_FORMA_MEDIA.slice(1, 6).reverse().map(([back, out, up]) => rel(back, out, up));
  const ingresso = rel(1.6, 0.0, 0.0);
  const apice = rel(-avanti, 0.5, 0.2);
  const curva = rel(-avanti * 0.35, 1.7, 0.9);
  const uscita = rel(1.0, 2.6, 1.3);
  UNCINO_PUNTO = apice.clone();
  return {
    asse: new THREE.CatmullRomCurve3([...corpo, ingresso, apice, curva, uscita], false, 'centripetal'),
    uncino: new THREE.CatmullRomCurve3([corpo[corpo.length - 1], ingresso, apice, curva, uscita], false, 'centripetal'),
    apice, uscita
  };
}

// L'osso disegnato è solo l'arcata tra i forami: il canale entra dal forame e corre DENTRO il corpo della mandibola. Si prolunga quindi
// l'osso dietro i forami lungo lo stesso percorso del canale, così il canale resta dentro l'osso e non fuori nello spazio.
function arcataConCorpo(archPoints, fid) {
  if (!fid || !fid.Foramen_Sinus_R || !fid.Nerve_Loop_R || !fid.Foramen_Sinus_L || !fid.Nerve_Loop_L) return archPoints;
  const destra = tratto_posteriore(archPoints[archPoints.length - 1], canaleSistema(fid.Foramen_Sinus_R, fid.Nerve_Loop_R));
  const sinistra = tratto_posteriore(archPoints[0], canaleSistema(fid.Foramen_Sinus_L, fid.Nerve_Loop_L)).reverse();
  return [...sinistra, ...archPoints, ...destra];
}

// Ramo stilizzato: nel piano verticale lungo il percorso dell'osso. Contorno (indietro, in alto) rispetto alla fine del corpo: angolo, bordo posteriore,
// condilo, incisura, processo coronoide. E' un disegno di riferimento, non una misura.
const RAMO_CONTORNO = [[-6, -9], [-3, 8], [-1, 24], [5, 33], [9, 21], [15, 31], [20, 28], [22, 8], [21, -6], [14, -13], [4, -13]];

function addRamiStilizzati(group, osso, wireMaterial) {
  [[osso[osso.length - 1], osso[osso.length - 4]], [osso[0], osso[3]]].forEach(([fine, prima]) => {
    const post = new THREE.Vector3().subVectors(fine, prima);
    post.z = 0;
    if (post.lengthSq() < 1e-6) return;
    post.normalize();
    const su = new THREE.Vector3(0, 0, 1);
    const laterale = new THREE.Vector3().crossVectors(su, post).normalize();
    const base = new THREE.Matrix4().makeBasis(post, su, laterale).setPosition(fine);
    const forma = new THREE.Shape(RAMO_CONTORNO.map(([a, z]) => new THREE.Vector2(a, z)));
    const riempimento = new THREE.Mesh(new THREE.ShapeGeometry(forma), new THREE.MeshBasicMaterial({ color: 0x2f6fe0, transparent: true, opacity: 0.1, depthWrite: false, side: THREE.DoubleSide }));
    riempimento.applyMatrix4(base);
    riempimento.renderOrder = 1;
    group.add(riempimento);
    const contorno = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(RAMO_CONTORNO.map(([a, z]) => new THREE.Vector3(a, z, 0).applyMatrix4(base))), wireMaterial);
    contorno.renderOrder = 1;
    group.add(contorno);
    // linee di riferimento nel ramo, per dargli volume
    [-4, 4, 12].forEach(z => {
      const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-2 + z * 0.1, z, 0).applyMatrix4(base), new THREE.Vector3(21, z, 0).applyMatrix4(base)]), wireMaterial);
      l.renderOrder = 1;
      group.add(l);
    });
    const condilo = new THREE.Mesh(new THREE.SphereGeometry(2.6, 14, 14), new THREE.MeshBasicMaterial({ color: 0x6fa3ff, transparent: true, opacity: 0.35, depthWrite: false }));
    condilo.position.copy(new THREE.Vector3(17.5, 30, 0).applyMatrix4(base));
    group.add(condilo);
  });
}

function addTube(group, curve, radius, material, radial = 12) {
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 72, radius, radial, false), material);
  group.add(mesh);
  return mesh;
}

function addNerve(group, from, to, nerveMaterial, safetyLineMaterial, confidenceHalfWidth = 0, confidenceMaterial, confidenceEdgeMaterial) {
  const start = new THREE.Vector3(from.x, from.y, from.z);
  const end = new THREE.Vector3(to.x, to.y, to.z);
  const canale = canaleConUncino(from, to);

  // Due tubi. 1) il nervo presunto: parete del canale (raggio 1,45 mm) e, dentro, la linea centrale sottile; l'uncino in arancione.
  const parete = new THREE.MeshBasicMaterial({ color: 0xfff0b0, transparent: true, opacity: 0.26, depthWrite: false, side: THREE.DoubleSide });
  addTube(group, canale.asse, NERVO_RAGGIO_MM, parete, 20).renderOrder = 3;
  state.paretiNervo = (state.paretiNervo || []).filter(m => m !== parete).concat([parete]);
  addTube(group, canale.asse, 0.22, nerveMaterial, 10);
  const uncinoMat = new THREE.MeshBasicMaterial({ color: 0xff6a2a });
  addTube(group, canale.uncino, 0.36, uncinoMat, 14).renderOrder = 6;
  [canale.apice, canale.uscita].forEach(p => addSphere(group, p, 0.55, uncinoMat));

  // 2) la fascia di confidenza: tubo attorno all'asse con raggio = confidenzaHalfWidth (raggio del nervo piu' l'errore del modello)
  if (confidenceHalfWidth > NERVO_RAGGIO_MM) {
    const fascia = new THREE.MeshBasicMaterial({ color: 0xb9a05a, transparent: true, opacity: 0.055, depthWrite: false, side: THREE.DoubleSide });
    addTube(state.sceneGroups.confidence, canale.asse, confidenceHalfWidth, fascia, 24).renderOrder = 5;
    const bordo = new THREE.MeshBasicMaterial({ color: 0xb9a05a, wireframe: true, transparent: true, opacity: 0.07, depthWrite: false });
    addTube(state.sceneGroups.confidence, canale.asse, confidenceHalfWidth, bordo, 16).renderOrder = 5;
  }

  const direction = new THREE.Vector3().subVectors(end, start);
  const offsetBase = new THREE.Vector3().crossVectors(direction, new THREE.Vector3(0, 0, 1));
  if (offsetBase.lengthSq() < 1e-5) offsetBase.set(1, 0, 0);
  offsetBase.normalize().multiplyScalar(1.9);

  [-1, 1].forEach(sign => {
    const offset = offsetBase.clone().multiplyScalar(sign);
    const geometry = new THREE.BufferGeometry().setFromPoints([
      start.clone().add(offset),
      end.clone().add(offset)
    ]);
    const line = new THREE.Line(geometry, safetyLineMaterial);
    line.computeLineDistances();
    group.add(line);
  });
}

function addSphere(group, pos, radius, material) {
  const geometry = new THREE.SphereGeometry(radius, 14, 14);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(pos.x, pos.y, pos.z);
  group.add(mesh);
  return mesh;
}

const implantGeometryCache = new Map();

function buildImplantGeometry(length, diam) {
  const safeLength = Math.max(3, Number(length) || 10);
  const safeDiam = Math.max(2, Number(diam) || 3.5);
  const key = `${safeLength.toFixed(3)}:${safeDiam.toFixed(3)}`;
  if (implantGeometryCache.has(key)) return implantGeometryCache.get(key);

  const r = safeDiam / 2;
  const points = [];
  const platformH = Math.min(0.6, safeLength * 0.08);
  const neckH = Math.min(1.5, safeLength * 0.2);
  const bodyStart = platformH + neckH;
  const bodyEnd = safeLength - Math.min(0.35, safeLength * 0.06);
  const pitch = 0.8;
  const threadDepth = 0.25;
  const bodyRadiusAt = y => r * (1 - 0.1 * Math.min(1, Math.max(0, (y - bodyStart) / Math.max(0.01, bodyEnd - bodyStart))));

  // Sezione chiusa: piattaforma con incavo centrale, collo, spire a dente di sega e apice arrotondato.
  points.push(new THREE.Vector2(r * 0.34, platformH * 0.65));
  points.push(new THREE.Vector2(r * 0.34, 0));
  points.push(new THREE.Vector2(r, 0));
  points.push(new THREE.Vector2(r, platformH));
  points.push(new THREE.Vector2(r * 0.97, platformH));
  points.push(new THREE.Vector2(r * 0.97, bodyStart));
  const bodyRadius = bodyRadiusAt(bodyStart);
  points.push(new THREE.Vector2(bodyRadius, bodyStart));
  for (let y = bodyStart; y < bodyEnd; y += pitch) {
    const base = bodyRadiusAt(y);
    const next = Math.min(bodyEnd, y + pitch);
    points.push(new THREE.Vector2(Math.max(0.1, base - threadDepth), Math.min(bodyEnd, y + pitch * 0.16)));
    points.push(new THREE.Vector2(bodyRadiusAt(next), next));
  }
  const tipRadius = bodyRadiusAt(bodyEnd);
  points.push(new THREE.Vector2(tipRadius * 0.72, safeLength - 0.16));
  points.push(new THREE.Vector2(tipRadius * 0.35, safeLength - 0.04));
  points.push(new THREE.Vector2(0.01, safeLength));
  points.push(new THREE.Vector2(0.01, 0));

  const geometry = new THREE.LatheGeometry(points, 48);
  geometry.computeVertexNormals();
  implantGeometryCache.set(key, geometry);
  return geometry;
}

function createImplantMesh(crest, axisDir, length, diam, material) {
  const geometry = buildImplantGeometry(length, diam);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(crest);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), axisDir.clone().normalize());
  return mesh;
}

function createCylinderMesh(p1, p2, radius, material, segments) {
  const start = p1.isVector3 ? p1 : new THREE.Vector3(p1.x, p1.y, p1.z);
  const end = p2.isVector3 ? p2 : new THREE.Vector3(p2.x, p2.y, p2.z);
  const direction = new THREE.Vector3().subVectors(end, start);
  const length = direction.length();

  if (length < 1e-4) return new THREE.Mesh();

  const geometry = new THREE.CylinderGeometry(radius, radius, length, segments || 16);
  const mesh = new THREE.Mesh(geometry, material);
  const middle = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  mesh.position.copy(middle);

  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.clone().normalize()
  );
  mesh.setRotationFromQuaternion(quaternion);
  return mesh;
}

function addCylinder(group, p1, p2, radius, material, segments) {
  const mesh = createCylinderMesh(p1, p2, radius, material, segments);
  group.add(mesh);
  return mesh;
}

function addLine(group, p1, p2, material) {
  const start = p1.isVector3 ? p1 : new THREE.Vector3(p1.x, p1.y, p1.z);
  const end = p2.isVector3 ? p2 : new THREE.Vector3(p2.x, p2.y, p2.z);
  const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
  const line = new THREE.Line(geometry, material);
  group.add(line);
  return line;
}

function buildSceneAnnotations(res, archPoints, accentLineMaterial) {
  const accent = cssColor("--color-accent");
  const fid = res.fiducials || {};

  if (fid.P0_Midline) {
    createSceneLabel("P0", point(fid.P0_Midline), { groupKey: "fiducials", side: "left" });
  }

  if (archPoints.length > 0) {
    const p1Index = Math.min(archPoints.length - 1, Math.floor(archPoints.length * 0.88));
    const p1 = archPoints[p1Index].clone();
    p1.z += 1.5;
    createSceneLabel("P1", p1, { groupKey: "arch", side: "right" });
  }

  if (fid.Foramen_Sinus_R) {
    createSceneLabel("Forami", point(fid.Foramen_Sinus_R), { groupKey: "fiducials", side: "left" });
  }

  if (fid.Nerve_Loop_R) {
    createSceneLabel("Uncino del nervo (ansa)", UNCINO_PUNTO ? UNCINO_PUNTO.clone() : point(fid.Nerve_Loop_R), { groupKey: "nerves", side: "left", accent: true });
  }

  if ((res.implants || []).length > 0) {
    const implants = res.implants;
    const center = implants.reduce((acc, imp) => {
      acc.x += imp.p_crest.x;
      acc.y += imp.p_crest.y;
      acc.z += imp.p_crest.z;
      return acc;
    }, { x: 0, y: 0, z: 0 });
    center.x /= implants.length;
    center.y /= implants.length;
    center.z /= implants.length;

    const topZ = Math.max(...implants.map(imp => imp.p_crest.z)) + 3.2;
    createSceneLabel("Impianti", new THREE.Vector3(center.x, center.y, topZ), { groupKey: "implants", side: "right" });
  }

  const closest = closestImplantToNerve(res);
  if (closest && closest.nervePoint) {
    const a = point(closest.implant.p_crest);
    const b = closest.nervePoint;
    const confidenceHalfWidth = readNonNegativeInput("inputNerveConfidence", 2.9);
    const confidenceGap = Number(closest.implant.nerve_clearance_mm) - confidenceHalfWidth;

    const tickDirection = new THREE.Vector3().subVectors(b, a).normalize()
      .cross(new THREE.Vector3(0, 0, 1));
    if (tickDirection.lengthSq() < 1e-5) tickDirection.set(1, 0, 0);
    tickDirection.normalize().multiplyScalar(1.1);

    const dimensionPoints = [
      a, b,
      a.clone().sub(tickDirection), a.clone().add(tickDirection),
      b.clone().sub(tickDirection), b.clone().add(tickDirection)
    ];
    const dimensionGeometry = new THREE.BufferGeometry().setFromPoints(dimensionPoints);
    state.sceneGroups.annotations.add(new THREE.LineSegments(dimensionGeometry, accentLineMaterial));

    const middle = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);

    createSceneLabel(
      `Distanza dal nervo ${fmtFixed(closest.implant.nerve_clearance_mm, 1)} mm`,
      middle,
      {
        groupKey: "annotations",
        accent: true,
        distance: true,
        side: middle.x >= 0 ? "right" : "left"
      }
    );

    const tone = confidenceGap < 0 ? "danger" : confidenceGap < 1 ? "warning" : "safe";
    const gapEnd = a.clone().add(b.clone().sub(a).normalize().multiplyScalar(confidenceGap));
    const toneColor = tone === "danger" ? 0xff5151 : tone === "warning" ? 0xffc247 : 0x55d68b;
    const gapGeometry = new THREE.BufferGeometry().setFromPoints([a, gapEnd]);
    state.sceneGroups.annotations.add(new THREE.Line(gapGeometry, new THREE.LineBasicMaterial({
      color: toneColor, transparent: true, opacity: 0.95, depthWrite: false
    })));
    const gapMiddle = new THREE.Vector3().addVectors(a, gapEnd).multiplyScalar(0.5);
    createSceneLabel(`${fmtFixed(confidenceGap, 1)} mm`, gapMiddle, {
      groupKey: "annotations", distance: true, tone,
      side: gapMiddle.x >= 0 ? "right" : "left"
    });

    const inside = confidenceGap < 0;
    const markerColor = inside ? 0xff5151 : 0xffd447;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.12, 8, 48), new THREE.MeshBasicMaterial({ color: markerColor }));
    ring.position.copy(b);
    ring.rotation.x = Math.PI / 2;
    ring.userData.pulse = true;
    state.sceneGroups.annotations.add(ring);
    addSphere(state.sceneGroups.annotations, b, 0.45, new THREE.MeshBasicMaterial({ color: markerColor }));
    createSceneLabel("➜ Guarda qui", b.clone().add(new THREE.Vector3(0, 0, 2.1)), { groupKey: "annotations", accent: true, side: "right" });
    state.focusPoint = b.clone();
  }
}

function updateCameraTween() {
  if (!state.cameraTween) return;
  const tween = state.cameraTween;
  const t = Math.min(1, (performance.now() - tween.start) / tween.duration);
  const eased = t * t * (3 - 2 * t);
  state.camera.position.lerpVectors(tween.fromPosition, tween.toPosition, eased);
  state.controls.target.lerpVectors(tween.fromTarget, tween.toTarget, eased);
  if (t >= 1) state.cameraTween = null;
}

function animateCameraTo(target, distance = 13, direzione = new THREE.Vector3(1, -1, 1)) {
  if (!target || !state.camera || !state.controls) return;
  state.cameraTween = {
    start: performance.now(), duration: 520,
    fromPosition: state.camera.position.clone(), toPosition: target.clone().add(direzione.clone().normalize().multiplyScalar(distance)),
    fromTarget: state.controls.target.clone(), toTarget: target.clone()
  };
}

function closestImplantToNerve(res) {
  if (!res || !Array.isArray(res.implants) || res.implants.length === 0) return null;
  const fid = res.fiducials || {};

  let best = null;
  res.implants.forEach(implant => {
    const clearance = Number(implant.nerve_clearance_mm);
    if (!best || clearance < Number(best.implant.nerve_clearance_mm)) {
      const loop = implant.p_crest.x >= 0 ? fid.Nerve_Loop_R : fid.Nerve_Loop_L;
      best = {
        implant,
        nervePoint: loop ? point(loop) : null
      };
    }
  });

  return best;
}

function point(obj) {
  return new THREE.Vector3(obj.x, obj.y, obj.z);
}

// ==============================================================================
// 4. ETICHETTE DI RICHIAMO SULLA SCENA
// ==============================================================================

function createSceneLabel(text, position, options) {
  const container = document.getElementById("sceneLabels");
  if (!container || !state.leaderSvg) return;

  const opts = options || {};
  const element = document.createElement("div");
  element.className = "scene-label";
  if (String(text).includes("Guarda qui")) element.classList.add("scene-focus-label");
  if (opts.accent) element.classList.add("accent");
  if (opts.distance) element.classList.add("scene-label-distance");
  if (opts.tone) element.classList.add(`tone-${opts.tone}`);
  if (opts.side === "left") element.classList.add("side-left");

  const label = document.createElement("span");
  label.className = "scene-label-text";
  label.textContent = text;

  element.appendChild(label);
  container.appendChild(element);

  const svgNs = "http://www.w3.org/2000/svg";
  const line = document.createElementNS(svgNs, "line");
  line.setAttribute("class", "scene-leader");
  if (opts.accent) line.classList.add("accent");
  if (opts.tone) line.classList.add(`tone-${opts.tone}`);
  state.leaderSvg.appendChild(line);

  const dot = document.createElementNS(svgNs, "circle");
  dot.setAttribute("r", "2.2");
  dot.setAttribute("class", "scene-leader-dot");
  if (opts.accent) dot.classList.add("accent");
  state.leaderSvg.appendChild(dot);

  state.labelAnchors.push({
    element,
    line,
    dot,
    position: position.clone(),
    groupKey: opts.groupKey || null,
    side: opts.side === "right" ? "right" : "left",
    accent: Boolean(opts.accent),
    distance: Boolean(opts.distance)
  });
}

// Mappa di dove il disegno occupa lo schermo: celle di 6 px segnate quando un punto della geometria visibile (osso, nervo, impianti, perni, guida)
// cade li'. La fascia di confidenza e le annotazioni non contano (sono trasparenti o sono le etichette stesse). Si ricalcola solo se la camera si muove.
const OCC_CELLA = 6;
const OCC_GRUPPI = ["arch", "fiducials", "implants", "mua", "nerves", "pins", "guideBar"];

function occupazioneScena(width, height) {
  const firma = state.camera.matrixWorld.elements.map(v => v.toFixed(3)).join(",") + `|${width}x${height}|` +
    OCC_GRUPPI.map(k => { const g = state.sceneGroups[k]; return g ? `${g.visible ? 1 : 0}${g.children.length}` : "x"; }).join("");
  if (state.occupazione && state.occupazione.firma === firma) return state.occupazione;
  const cols = Math.ceil(width / OCC_CELLA);
  const rows = Math.ceil(height / OCC_CELLA);
  const data = new Uint8Array(cols * rows);
  const v = new THREE.Vector3();
  const w0 = new THREE.Vector3();
  const w1 = new THREE.Vector3();
  const segna = (px, py) => {
    const c = Math.floor(px / OCC_CELLA);
    const r = Math.floor(py / OCC_CELLA);
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      const cc = c + dc;
      const rr = r + dr;
      if (cc >= 0 && rr >= 0 && cc < cols && rr < rows) data[rr * cols + cc] = 1;
    }
  };
  const aSchermo = p => { const q = p.clone().project(state.camera); return [(q.x * 0.5 + 0.5) * width, (-q.y * 0.5 + 0.5) * height, q.z]; };
  OCC_GRUPPI.forEach(chiave => {
    const gruppo = state.sceneGroups[chiave];
    if (!gruppo || !gruppo.visible) return;
    gruppo.updateWorldMatrix(true, true);
    gruppo.traverse(obj => {
      if (!obj.visible || !obj.geometry || !obj.geometry.attributes || !obj.geometry.attributes.position) return;
      if (obj.isLine && obj.material && obj.material.isLineDashedMaterial) return; // linee di sicurezza tratteggiate: non sono il disegno
      const pos = obj.geometry.attributes.position;
      const n = pos.count;
      const passo = Math.max(1, Math.floor(n / 6000));
      if (obj.isLineSegments) {
        for (let i = 0; i + 1 < n; i += 2 * passo) {
          w0.fromBufferAttribute(pos, i).applyMatrix4(obj.matrixWorld);
          w1.fromBufferAttribute(pos, i + 1).applyMatrix4(obj.matrixWorld);
          const [x0, y0, z0] = aSchermo(w0);
          const [x1, y1, z1] = aSchermo(w1);
          if (z0 > 1 && z1 > 1) continue;
          const passi = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / OCC_CELLA));
          for (let k = 0; k <= passi; k++) segna(x0 + (x1 - x0) * k / passi, y0 + (y1 - y0) * k / passi);
        }
      } else if (obj.isLine) {
        let prec = null;
        for (let i = 0; i < n; i += passo) {
          w0.fromBufferAttribute(pos, i).applyMatrix4(obj.matrixWorld);
          const cur = aSchermo(w0);
          if (prec) {
            const passi = Math.max(1, Math.ceil(Math.hypot(cur[0] - prec[0], cur[1] - prec[1]) / OCC_CELLA));
            for (let k = 0; k <= passi; k++) segna(prec[0] + (cur[0] - prec[0]) * k / passi, prec[1] + (cur[1] - prec[1]) * k / passi);
          }
          prec = cur;
        }
      } else {
        for (let i = 0; i < n; i += passo) {
          v.fromBufferAttribute(pos, i).applyMatrix4(obj.matrixWorld);
          const [x, y, z] = aSchermo(v);
          if (z <= 1) segna(x, y);
        }
      }
    });
  });
  state.occupazione = { firma, cols, rows, data };
  return state.occupazione;
}

function celleOccupate(occ, r) {
  const c0 = Math.max(0, Math.floor(r.x0 / OCC_CELLA));
  const c1 = Math.min(occ.cols - 1, Math.floor(r.x1 / OCC_CELLA));
  const r0 = Math.max(0, Math.floor(r.y0 / OCC_CELLA));
  const r1 = Math.min(occ.rows - 1, Math.floor(r.y1 / OCC_CELLA));
  let n = 0;
  for (let rr = r0; rr <= r1; rr++) for (let cc = c0; cc <= c1; cc++) n += occ.data[rr * occ.cols + cc];
  return n;
}

function updateSceneLabels() {
  if (!state.camera || !state.renderer) return;

  const canvas = state.renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (!width || !height) return;

  const projected = new THREE.Vector3();
  const compact = width <= 600;
  const narrow = width <= 760;
  const sideGap = narrow ? 18 : 44;
  const visible = [];

  let modelLeft = 0;
  let modelRight = width;
  const bounds = state.sceneBox || sceneBounds();
  if (bounds) {
    const points = [];
    for (const bx of [bounds.min.x, bounds.max.x]) {
      for (const by of [bounds.min.y, bounds.max.y]) {
        for (const bz of [bounds.min.z, bounds.max.z]) {
          points.push(new THREE.Vector3(bx, by, bz).project(state.camera));
        }
      }
    }
    const screenX = points.map(p => (p.x * 0.5 + 0.5) * width);
    modelLeft = Math.max(0, Math.min(...screenX));
    modelRight = Math.min(width, Math.max(...screenX));
  }

  let archLeft = modelLeft;
  let archRight = modelRight;
  const archPoints = state.currentResult && state.currentResult.arch_spline_points;
  if (Array.isArray(archPoints) && archPoints.length > 0) {
    const archScreenX = archPoints.map(p =>
      (new THREE.Vector3(p.x, p.y, p.z).project(state.camera).x * 0.5 + 0.5) * width
    );
    archLeft = Math.min(...archScreenX);
    archRight = Math.max(...archScreenX);
  }

  state.labelAnchors.forEach(anchor => {
    const group = anchor.groupKey ? state.sceneGroups[anchor.groupKey] : null;
    if ((group && !group.visible) || (compact && !anchor.distance)) {
      anchor.element.style.display = "none";
      anchor.line.style.display = "none";
      anchor.dot.style.display = "none";
      return;
    }

    projected.copy(anchor.position).project(state.camera);
    const isBehind = projected.z < -1 || projected.z > 1;
    const x = (projected.x * 0.5 + 0.5) * width;
    const y = (-projected.y * 0.5 + 0.5) * height;
    const isOutside = x < -120 || x > width + 120 || y < -90 || y > height + 90;

    if (isBehind || isOutside) {
      anchor.element.style.display = "none";
      anchor.line.style.display = "none";
      anchor.dot.style.display = "none";
      return;
    }

    anchor.element.style.display = "block";
    anchor.line.style.display = "";
    anchor.dot.style.display = "";
    visible.push({ anchor, x, y });
  });

  // Disposizione automatica: ogni etichetta il piu' vicino possibile al suo bersaglio, senza sovrapporsi alle altre etichette,
  // ai punti dei bersagli e senza uscire dalla scena. Si prova prima vicino e poi via via piu' lontano, in tutte le direzioni.
  const margine = 3;
  const bordo = 4;
  const occ = occupazioneScena(width, height);
  const piazzate = [];
  const puntiBersaglio = visible.map(v => ({ x0: v.x - 5, y0: v.y - 5, x1: v.x + 5, y1: v.y + 5, proprietario: v }));
  const sovrappone = (r, s) => !(r.x1 + margine < s.x0 || s.x1 + margine < r.x0 || r.y1 + margine < s.y0 || s.y1 + margine < r.y0);
  const ordine = visible.slice().sort((p, q) => (Number(q.anchor.accent) - Number(p.anchor.accent)) || (p.y - q.y));

  ordine.forEach(item => {
    const { anchor, x, y } = item;
    anchor.element.classList.toggle("compact", narrow);
    anchor.element.classList.remove("side-left");
    const w = anchor.element.offsetWidth || 90;
    const h = anchor.element.offsetHeight || 18;
    const preferita = anchor.side === "left" ? [-1, 1] : [1, -1];
    // direzioni (verso destra o sinistra, in alto o in basso), in ordine di preferenza
    const direzioni = [
      [preferita[0], 0], [preferita[1], 0], [0, -1], [0, 1],
      [preferita[0], -1], [preferita[0], 1], [preferita[1], -1], [preferita[1], 1]
    ];
    let migliore = null;
    let meno = null; // il candidato valido che copre meno disegno, se nessuno e' del tutto libero
    for (const raggio of [9, 20, 34, 50, 68, 90, 118, 150, 190]) {
      for (const [dx, dy] of direzioni) {
        let x0;
        let y0;
        if (dx === 0) x0 = x - w / 2;
        else if (dx > 0) x0 = x + raggio * (dy === 0 ? 1 : 0.75);
        else x0 = x - raggio * (dy === 0 ? 1 : 0.75) - w;
        if (dy === 0) y0 = y - h / 2;
        else if (dy < 0) y0 = y - raggio * (dx === 0 ? 1 : 0.75) - h;
        else y0 = y + raggio * (dx === 0 ? 1 : 0.75);
        const rect = { x0, y0, x1: x0 + w, y1: y0 + h };
        if (rect.x0 < bordo || rect.y0 < bordo || rect.x1 > width - bordo || rect.y1 > height - bordo) continue;
        if (piazzate.some(p => sovrappone(rect, p))) continue;
        if (puntiBersaglio.some(p => p.proprietario !== item && sovrappone(rect, p))) continue;
        const coperte = celleOccupate(occ, rect);
        if (coperte === 0) { migliore = rect; break; }
        if (!meno || coperte < meno.coperte) meno = { rect, coperte };
      }
      if (migliore) break;
    }
    if (!migliore && meno) migliore = meno.rect;
    if (!migliore) { // nessun posto libero: l'angolo piu' vicino dentro la scena
      const x0 = THREE.MathUtils.clamp(x + 9, bordo, width - bordo - w);
      const y0 = THREE.MathUtils.clamp(y - h / 2, bordo, height - bordo - h);
      migliore = { x0, y0, x1: x0 + w, y1: y0 + h };
    }
    piazzate.push(migliore);
    anchor.element.style.transform = `translate3d(${Math.round(migliore.x0)}px, ${Math.round(migliore.y0)}px, 0)`;
    // la linea parte dal punto del bordo dell'etichetta piu' vicino al bersaglio
    const px = THREE.MathUtils.clamp(x, migliore.x0, migliore.x1);
    const py = THREE.MathUtils.clamp(y, migliore.y0, migliore.y1);
    anchor.line.setAttribute("x1", px.toFixed(1));
    anchor.line.setAttribute("y1", py.toFixed(1));
    anchor.line.setAttribute("x2", x.toFixed(1));
    anchor.line.setAttribute("y2", y.toFixed(1));
    anchor.dot.setAttribute("cx", x.toFixed(1));
    anchor.dot.setAttribute("cy", y.toFixed(1));
  });
}

// ==============================================================================
// 5. GRAFICO DELLA STABILITA
// ==============================================================================

function renderStabilityChart(res) {
  const svg = document.getElementById("stabilitySvg");
  if (!svg) return;
  svg.innerHTML = "";

  const weeks = res.weeks || [];
  const plan = res.isq_curve || [];
  const base = (res.isq_bio && res.isq_bio.length > 0) ? res.isq_bio : (res.isq_mech || []);

  if (weeks.length === 0 || plan.length === 0) return;

  const width = 380;
  const height = 150;
  const padLeft = 38;
  const padRight = 14;
  const padTop = 14;
  const padBottom = 24;
  const minIsq = 35;
  const maxIsq = 90;

  const scaleX = value => padLeft + (value / 16) * (width - padLeft - padRight);
  const scaleY = value => height - padBottom - ((value - minIsq) / (maxIsq - minIsq)) * (height - padTop - padBottom);

  const svgNs = "http://www.w3.org/2000/svg";

  [45, 60, 75].forEach(value => {
    const y = scaleY(value);
    const line = document.createElementNS(svgNs, "line");
    line.setAttribute("x1", padLeft);
    line.setAttribute("x2", width - padRight);
    line.setAttribute("y1", y.toFixed(1));
    line.setAttribute("y2", y.toFixed(1));
    line.setAttribute("class", "chart-grid-line");
    line.setAttribute("stroke-dasharray", "2,3");
    svg.appendChild(line);

    const text = document.createElementNS(svgNs, "text");
    text.setAttribute("x", padLeft - 5);
    text.setAttribute("y", (y + 3).toFixed(1));
    text.setAttribute("text-anchor", "end");
    text.setAttribute("class", "chart-axis-text");
    text.textContent = value;
    svg.appendChild(text);
  });

  function pathFor(values) {
    return values.map((value, index) => {
      const x = scaleX(weeks[index]);
      const y = scaleY(value);
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(" ");
  }

  if (base.length > 0) {
    const basePath = document.createElementNS(svgNs, "path");
    basePath.setAttribute("d", pathFor(base));
    basePath.setAttribute("class", "chart-line-base");
    basePath.setAttribute("stroke-linejoin", "round");
    svg.appendChild(basePath);
  }

  const planPath = document.createElementNS(svgNs, "path");
  planPath.setAttribute("d", pathFor(plan));
  planPath.setAttribute("class", "chart-line-plan");
  planPath.setAttribute("stroke-linejoin", "round");
  svg.appendChild(planPath);

  function lineLabel(values, labelText, className, fraction, offsetY) {
    if (!values.length) return;
    const index = Math.max(0, Math.min(values.length - 1, Math.round((values.length - 1) * fraction)));
    const x = scaleX(weeks[index]);
    const y = scaleY(values[index]) + offsetY;
    const text = document.createElementNS(svgNs, "text");
    text.setAttribute("x", x.toFixed(1));
    text.setAttribute("y", y.toFixed(1));
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("class", `chart-line-label ${className}`);
    text.textContent = labelText;
    svg.appendChild(text);
  }

  lineLabel(base, "Base", "base", 0.16, -6);
  lineLabel(plan, "Piano attuale", "plan", 0.78, -7);

  if (res.min_week !== undefined && res.min_isq !== undefined) {
    const dipX = scaleX(res.min_week);
    const dipY = scaleY(res.min_isq);

    const dip = document.createElementNS(svgNs, "circle");
    dip.setAttribute("cx", dipX.toFixed(1));
    dip.setAttribute("cy", dipY.toFixed(1));
    dip.setAttribute("r", "3.5");
    dip.setAttribute("class", "chart-dip");
    svg.appendChild(dip);

    const dipText = document.createElementNS(svgNs, "text");
    dipText.setAttribute("x", dipX.toFixed(1));
    dipText.setAttribute("y", (dipY + 14).toFixed(1));
    dipText.setAttribute("text-anchor", "middle");
    dipText.setAttribute("class", "chart-dip-label");
    dipText.textContent = `Minimo W${res.min_week} · ISQ ${fmtSmart(res.min_isq)}`;
    svg.appendChild(dipText);
  }

  [0, 4, 8, 12, 16].forEach(value => {
    const text = document.createElementNS(svgNs, "text");
    text.setAttribute("x", scaleX(value).toFixed(1));
    text.setAttribute("y", height - 7);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("class", "chart-axis-text");
    text.textContent = `W${value}`;
    svg.appendChild(text);
  });
}

// ==============================================================================
// 6. DATI E PANNELLO DEI RISULTATI
// ==============================================================================

function fmtFixed(value, digits) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "—";
  return number.toFixed(digits).replace(".", ",");
}

function fmtSmart(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "—";
  return Number.isInteger(number) ? String(number) : number.toFixed(1).replace(".", ",");
}

function sentenceCase(text) {
  const normalized = String(text || "").replace(/\s+/g, " ").trim().toLocaleLowerCase("it-IT");
  if (!normalized) return "";
  return normalized.charAt(0).toLocaleUpperCase("it-IT") + normalized.slice(1);
}

function findSolverMismatch(res) {
  const solverText = String(res.load_verdict || "");
  const actualMicromotion = Number(res.micromotion_um);
  const microMatches = [...solverText.matchAll(/(\d+(?:[.,]\d+)?)\s*(?:µm|μm|um)/gi)];

  if (microMatches.length > 0) {
    const claimed = parseFloat(microMatches[0][1].replace(",", "."));
    if (Number.isFinite(claimed) && Math.abs(claimed - actualMicromotion) > 0.05) {
      return {
        field: "micromovimento",
        claimed: fmtSmart(claimed),
        actual: fmtSmart(actualMicromotion),
        unit: "µm"
      };
    }
  }

  const isqMatch = solverText.match(/ISQ\s*(\d+(?:[.,]\d+)?)/i);
  if (isqMatch) {
    const claimed = parseFloat(isqMatch[1].replace(",", "."));
    const actual = Number(res.min_isq);
    if (Number.isFinite(claimed) && Math.abs(claimed - actual) > 0.05) {
      return {
        field: "stabilità",
        claimed: fmtSmart(claimed),
        actual: fmtSmart(actual),
        unit: "ISQ"
      };
    }
  }

  return null;
}

function updateSolverNote(res) {
  const element = document.getElementById("solverNote");
  if (!element) return;

  const mismatch = findSolverMismatch(res);
  if (mismatch) {
    element.textContent =
      `Il testo del solutore non è stato copiato: cita ${mismatch.claimed} ${mismatch.unit} per ${mismatch.field}, ` +
      `mentre il valore calcolato è ${mismatch.actual} ${mismatch.unit}. Resta valido il numero mostrato.`;
    return;
  }

  const solverText = sentenceCase(res.load_verdict);
  element.textContent = solverText ? `Nota del solutore: ${solverText}` : "";
}

function updateVerdict(res, minNerve) {
  const body = document.getElementById("loadVerdict");
  const distance = document.getElementById("verdictDistance");
  const title = document.getElementById("verdictTitle");
  const sub = document.getElementById("verdictSub");
  const boneWarning = document.getElementById("verdictBoneWarning");

  if (!body || !distance || !title || !sub) return;

  const confidenceHalfWidth = readNonNegativeInput("inputNerveConfidence", 2.9);
  const requestedGap = readNonNegativeInput("inputConfidenceDistance", 0);
  const confidenceGap = minNerve - confidenceHalfWidth;
  const hasImplants = Array.isArray(res.implants) && res.implants.length > 0;
  const code = String(res.load_code || "").toUpperCase();
  const safetyMargin = Number((res.priors_used && res.priors_used.safety_margin_nerve_mm) || 2.0);

  body.classList.remove("safe", "warning", "danger");
  if (hasImplants && confidenceGap < 0) {
    body.classList.add("danger");
    title.textContent = "Dentro la confidenza";
  } else if (hasImplants && confidenceGap < requestedGap) {
    body.classList.add("warning");
    title.textContent = "Fuori, sotto la distanza voluta";
  } else if (code === "GREEN") {
    body.classList.add("safe");
    title.textContent = "Piano sicuro";
  } else if (code === "YELLOW") {
    body.classList.add("warning");
    title.textContent = "Margine ridotto";
  } else {
    body.classList.add("danger");
    title.textContent = "Carico da differire";
  }

  distance.textContent = fmtFixed(minNerve, 1);
  distance.classList.remove("value-updated");
  void distance.offsetWidth;
  distance.classList.add("value-updated");

  const marginText = minNerve >= safetyMargin
    ? `Sopra il margine di sicurezza di ${fmtFixed(safetyMargin, 1)} mm.`
    : `Sotto il margine di sicurezza di ${fmtFixed(safetyMargin, 1)} mm.`;
  sub.textContent =
    `Impianto più vicino: ${fmtFixed(minNerve, 1)} mm dal nervo, ${fmtFixed(confidenceGap, 1)} mm dal bordo della confidenza. ${marginText} ` +
    `Micromovimento ${fmtSmart(res.micromotion_um)} µm, stabilità minima ${fmtSmart(res.min_isq)} ISQ.`;

  const declaration = document.getElementById("confidenceDeclaration");
  if (declaration) {
    declaration.hidden = !hasImplants || confidenceGap >= 0;
    if (hasImplants && confidenceGap < 0) {
      const depth = fmtFixed(Math.abs(confidenceGap), 1);
      const chosen = closestImplantToNerve(res)?.implant;
      const selectedLength = chosen ? fmtFixed(Number(chosen.length), 1) : "—";
      const feasibility = state.outsideConfidenceResult;
      declaration.innerHTML = `<strong>L'impianto entra di ${depth} mm nel canale di confidenza del nervo.</strong> ${feasibility?.length != null
        ? `Per restare fuori dalla confidenza l'impianto più vicino al nervo non potrebbe superare ${fmtFixed(feasibility.length, 1)} mm; quello scelto è ${selectedLength} mm.`
        : feasibility?.missing != null
          ? `Nessun impianto del catalogo resta fuori dalla confidenza: mancano ${fmtFixed(feasibility.missing, 1)} mm.`
          : "Lunghezza massima fuori dalla confidenza non disponibile."} Il nervo vero può non essere dove lo dice il modello: la scelta è del medico.`;
    }
  }

  const implants = Array.isArray(res.implants) ? res.implants : [];
  const minBoneMargin = implants.length > 0
    ? Math.min(...implants.map(i => i.bone_margin_mm !== undefined && i.bone_margin_mm !== null ? Number(i.bone_margin_mm) : 999))
    : 999;

  if (boneWarning) {
    if (minBoneMargin < 1.0) {
      boneWarning.textContent = "Poco osso sotto un impianto, controlla l'altezza";
      boneWarning.style.display = "block";
    } else {
      boneWarning.textContent = "";
      boneWarning.style.display = "none";
    }
  }
}


function renderFiveModels(data) {
  const output = document.getElementById("neuralLiveOutput");
  if (!output) return;

  const tabpfn = data.tabpfn || {};
  const timesfm = data.timesfm || {};
  const e3x = data.e3x || {};
  const hyperbo = data.hyperbo || {};
  const optformer = data.optformer || {};

  const timesfmForecast = Array.isArray(timesfm.forecast_isq) && timesfm.forecast_isq.length > 0
    ? `${fmtSmart(timesfm.forecast_isq[0])} &rarr; ${fmtSmart(timesfm.forecast_isq[timesfm.forecast_isq.length - 1])} ISQ`
    : "8 settimane stabilizzate";

  const rows = [
    {
      name: "TabPFN v2",
      target: "Inclinazione e stabilità primaria",
      val: tabpfn.predicted_distal_tilt_deg !== undefined
        ? `Inclinazione ${fmtSmart(tabpfn.predicted_distal_tilt_deg)}°, ISQ ${fmtSmart(tabpfn.predicted_min_isq_dip)}, aggancio ${fmtSmart(tabpfn.predicted_torque_ncm)} Ncm`
        : "In attesa di avvio inferenza"
    },
    {
      name: "TimesFM 2.5",
      target: "Curva osteointegrazione a 16 settimane",
      val: timesfm.forecast_isq
        ? `Andamento ISQ previsto: ${timesfmForecast}`
        : "In attesa di avvio inferenza"
    },
    {
      name: "E3x",
      target: "Simmetria tensoriale 3D",
      val: e3x.quadrupolar_stress_tensor_l2 !== undefined
        ? `Tensione l2 ${fmtSmart(e3x.quadrupolar_stress_tensor_l2)}, errore SO(3) ${fmtSmart(e3x.so3_rototranslation_error)}`
        : "Disponibile sul caso"
    },
    {
      name: "HyperBO",
      target: "Inclinazione ottimale con incertezza",
      val: hyperbo.gp_posterior_tilt_mean_deg !== undefined
        ? `${fmtSmart(hyperbo.gp_posterior_tilt_mean_deg)}° ± ${fmtSmart(hyperbo.gp_posterior_tilt_std_deg)}° (EI ${fmtSmart(hyperbo.expected_improvement_ei)})`
        : "Disponibile sul caso"
    },
    {
      name: "OptFormer",
      target: "Assetto biomeccanico ottimale",
      val: optformer.optimal_distal_tilt_deg !== undefined
        ? `Inclinazione ${fmtSmart(optformer.optimal_distal_tilt_deg)}°, sbalzo ${fmtSmart(optformer.optimal_cantilever_mm)} mm, moncone H${fmtSmart(optformer.optimal_mua_h_mm)}`
        : "Disponibile sul caso"
    }
  ];

  output.innerHTML = rows.map(r => `
    <div class="model-row">
      <div class="model-meta">
        <strong class="model-name">${r.name}</strong>
        <span class="model-target">${r.target}</span>
      </div>
      <div class="model-val">${r.val}</div>
    </div>
  `).join("");
}

function updateUIResults(res) {
  state.currentResult = res;
  const overlay = document.getElementById("noCaseOverlay");
  if (overlay) overlay.style.display = "none";

  const implants = Array.isArray(res.implants) ? res.implants : [];
  const minNerve = implants.length > 0
    ? Math.min(...implants.map(implant => Number(implant.nerve_clearance_mm)))
    : 0;
  const maxTilt = implants.length > 0
    ? Math.max(...implants.map(implant => Number(implant.total_tilt)))
    : 0;

  updateVerdict(res, minNerve);
  updateSolverNote(res);

  setText("kpiTilt", fmtSmart(Math.round(maxTilt)));
  setText("kpiCantilever", fmtSmart(res.max_cantilever));
  setText("kpiTorque", fmtSmart(res.avg_torque));
  setText("kpiMinIsq", fmtSmart(res.min_isq));
  setText("kpiMicromotion", fmtSmart(res.micromotion_um));

  updateImperfectionNotes(res);
  updateSpectrumTable(res);
  updateImplantsTable(res, implants);
  updatePinsTable(res);
  updateLoadTestPanel(res);
  updateSpectrumBarsPanel(res);
  if (res.google_research) {
    renderFiveModels(res.google_research);
  }

  renderStabilityChart(res);
  update3DScene(res);
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function updateImperfectionNotes(res) {
  const element = document.getElementById("imperfectionNotes");
  if (!element) return;

  const notes = res.imperfection_notes || [];
  let html = notes.map(note => `&bull; ${note}`).join("<br>");

  if (res.surgeon_ml_prediction) {
    const prediction = res.surgeon_ml_prediction;
    html += `
      <div class="detail-row">
        <strong>Mano del medico (${prediction.trained_on_cases} casi)</strong>:
        inclinazione ${prediction.predicted_surgeon_tilt_R_deg}&deg;,
        sbalzo ${prediction.predicted_surgeon_cantilever_mm} mm,
        colletto MUA H${prediction.predicted_surgeon_mua_h_mm} mm.
        <a class="link-accent" href="ml_studio.html">Apri Mano del medico</a>
      </div>`;
  }

  if (res.google_research && res.google_research.e3x && res.google_research.hyperbo && res.google_research.optformer) {
    const research = res.google_research;
    html += `
      <div class="detail-row">
        <strong>Motori di ricerca</strong>:
        E3x l2 ${research.e3x.quadrupolar_stress_tensor_l2} (errore SO(3) ${research.e3x.so3_rototranslation_error}),
        HyperBO ${research.hyperbo.gp_posterior_tilt_mean_deg}&deg; &plusmn; ${research.hyperbo.gp_posterior_tilt_std_deg}&deg;,
        OptFormer inclinazione ${research.optformer.optimal_distal_tilt_deg}&deg; e sbalzo ${research.optformer.optimal_cantilever_mm} mm.
      </div>`;
  }

  element.innerHTML = html || "Nessuna compensazione anatomica segnalata.";
}


function updateLoadTestPanel(res) {
  const statusElem = document.getElementById("loadTestStatus");
  const tbody = document.getElementById("loadTestTableBody");
  if (!statusElem || !tbody) return;

  const history = Array.isArray(res.epoch_history) ? res.epoch_history : [];
  const passedEpoch = history.find(e => e.passed);
  const n = passedEpoch ? passedEpoch.epoch : (res.epochs_run || 1);

  statusElem.textContent = `Il piano ha superato le prove alla prova ${n}`;

  tbody.innerHTML = "";
  history.forEach(ep => {
    const tr = document.createElement("tr");
    const esitoText = ep.passed ? "Superata" : "Rifiutata";
    const esitoCls = ep.passed ? "val-accent" : "val-secondary";

    let modText = ep.mutation || "Geometria iniziale";
    modText = modText.replace(/OptFormer/gi, "Ottimizzatore")
                     .replace(/Tilt/gi, "inclinazione")
                     .replace(/Cantilever/gi, "sbalzo");

    tr.innerHTML = `
      <td>${ep.epoch}</td>
      <td>${modText}</td>
      <td class="${esitoCls}">${esitoText}</td>
    `;
    tbody.appendChild(tr);
  });
}

function updateSpectrumBarsPanel(res) {
  const container = document.getElementById("spectrumBarsList");
  if (!container) return;

  const spectrum = Array.isArray(res.implant_spectrum) ? res.implant_spectrum : [];
  const recommendedCode = String(res.recommended_architecture_code || "");

  const italianLabels = {
    "4": "4 impianti (2 a destra + 2 a sinistra)",
    "5_R": "5 impianti (3 a destra + 2 a sinistra)",
    "5_L": "5 impianti (2 a destra + 3 a sinistra)",
    "6": "6 impianti (3 a destra + 3 a sinistra)",
    "7": "7 impianti (4 a destra + 3 a sinistra)",
    "8": "8 impianti (4 a destra + 4 a sinistra)",
    "10": "10 impianti (5 a destra + 5 a sinistra)"
  };

  container.innerHTML = "";
  spectrum.forEach(arch => {
    const isRecommended = arch.is_recommended || arch.code === recommendedCode;
    const label = italianLabels[arch.code] || `${arch.total_implants || arch.code} impianti`;
    const prob = Number(arch.success_prob_pct || 0);

    const row = document.createElement("div");
    row.className = `spectrum-bar-row ${isRecommended ? "is-recommended" : ""}`;

    row.innerHTML = `
      <div class="spectrum-bar-meta">
        <span class="spectrum-bar-label">${label}</span>
        <span class="spectrum-bar-prob">${fmtSmart(prob)}%</span>
        ${isRecommended ? '<span class="spectrum-badge-rec">Consigliata</span>' : ""}
      </div>
      <div class="spectrum-track">
        <div class="spectrum-fill ${isRecommended ? "fill-accent" : "fill-blue"}" style="width: ${Math.min(100, Math.max(0, prob))}%;"></div>
      </div>
    `;

    row.addEventListener("click", () => {
      const select = document.getElementById("inputNImp");
      if (select) {
        select.value = arch.code;
        runCalculation();
      }
    });

    container.appendChild(row);
  });
}

function updateSpectrumTable(res) {
  const body = document.getElementById("spectrumTableBody");
  const badge = document.getElementById("recommendedArchBadge");
  const summary = document.getElementById("epochLogSummary");

  if (badge) {
    badge.textContent = res.recommended_architecture_label
      ? `Consigliata: ${res.recommended_architecture_label}`
      : "";
  }

  if (body && Array.isArray(res.implant_spectrum)) {
    body.innerHTML = "";

    res.implant_spectrum.forEach(row => {
      const tr = document.createElement("tr");
      const isActive = row.code === res.active_architecture_code;
      tr.className = isActive ? "spectrum-row is-active" : "spectrum-row";

      const activeBadge = isActive ? '<span class="badge-active">Attiva</span>' : "";
      const recommendedBadge = row.is_recommended ? '<span class="badge-recommended">Consigliata</span>' : "";

      tr.innerHTML = `
        <td><span class="spectrum-option">${row.label}</span>${activeBadge}${recommendedBadge}</td>
        <td class="val-secondary">${row.schema}</td>
        <td>${row.epochs_to_converge} ep</td>
        <td>${row.max_von_mises_mpa} MPa</td>
        <td>${row.min_tarnow_mm} mm</td>
        <td>${row.success_prob_pct}%</td>
        <td class="val-secondary">${row.status_badge}</td>
      `;

      tr.addEventListener("click", () => {
        const select = document.getElementById("inputNImp");
        if (select) {
          select.value = row.code;
          runCalculation();
        }
      });

      body.appendChild(tr);
    });
  }

  if (summary && Array.isArray(res.epoch_history) && res.epoch_history.length > 0) {
    const firstEpoch = res.epoch_history[0];
    const lastEpoch = res.epoch_history[res.epoch_history.length - 1];
    const stress = res.stress_test || {};

    if (res.epoch_history.length === 1) {
      summary.textContent =
        `Loop di stress test (${res.epochs_run} epoca): certificata al primo colpo. ` +
        `Von Mises massimo ${stress.max_von_mises_mpa} MPa, ` +
        `momento del collo ${stress.max_bending_moment_ncm} Ncm, ` +
        `Tarnow minimo ${stress.min_tarnow_distance_mm} mm.`;
    } else {
      summary.textContent =
        `Loop di riclassificazione (${res.epochs_run} epoche): ` +
        `epoca 1 con ${firstEpoch.von_mises_mpa} MPa e ${firstEpoch.micromotion_um} µm, ` +
        `poi ${lastEpoch.mutation}. ` +
        `Epoca ${lastEpoch.epoch}: ${lastEpoch.von_mises_mpa} MPa, ` +
        `${lastEpoch.micromotion_um} µm, ISQ ${lastEpoch.min_isq} e ${lastEpoch.success_prob_pct}% di successo.`;
    }
  }
}

function updateImplantsTable(res, implants) {
  const body = document.getElementById("implantsTableBody");
  if (!body) return;

  body.innerHTML = "";
  implants.forEach(implant => {
    const tr = document.createElement("tr");
    const crestZ = Number(implant.p_crest.z);
    const zText = `Z ${implant.p_crest.z}`;
    const boneMargin = implant.bone_margin_mm !== undefined && implant.bone_margin_mm !== null
      ? `${fmtFixed(implant.bone_margin_mm, 2)} mm`
      : "—";

    tr.innerHTML = `
      <td><strong>${implant.label}</strong></td>
      <td>&Oslash;${implant.diam} &times; ${implant.length}</td>
      <td>(${implant.p_crest.x}, ${implant.p_crest.y}, ${zText})</td>
      <td>${implant.tilt_md}&deg; / ${implant.tilt_bl}&deg;</td>
      <td>${implant.mua_angle}&deg; H${implant.mua_height} (rotazione ${implant.hex_rot}&deg;)</td>
      <td>${implant.nerve_clearance_mm} mm</td>
      <td>${boneMargin}</td>
      <td>${implant.torque_ncm} Ncm</td>
    `;
    body.appendChild(tr);
  });
}

function updatePinsTable(res) {
  const body = document.getElementById("pinsTableBody");
  if (!body) return;

  body.innerHTML = "";
  (res.pins || []).forEach(pin => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${pin.name}</td>
      <td>(${pin.entry.x}, ${pin.entry.y}, ${pin.entry.z})</td>
      <td>${pin.clearance_mm} mm</td>
      <td>${pin.closest_imp}</td>
    `;
    body.appendChild(tr);
  });
}

// ==============================================================================
// 7. FORM E CHIAMATE API
// ==============================================================================

function readNonNegativeInput(id, fallback) {
  const value = Number(document.getElementById(id)?.value);
  return Number.isFinite(value) ? Math.max(0, value) : fallback;
}

function getFormData() {
  return {
    arch: document.getElementById("inputArch").value,
    n_imp: document.getElementById("inputNImp").value,
    chord_R: parseFloat(document.getElementById("inputChordR").value),
    depth_R: parseFloat(document.getElementById("inputDepthR").value),
    chord_L: parseFloat(document.getElementById("inputChordL").value),
    depth_L: parseFloat(document.getElementById("inputDepthL").value),
    loop_R: parseFloat(document.getElementById("inputLoopR").value),
    loop_L: parseFloat(document.getElementById("inputLoopL").value),
    undercut: parseFloat(document.getElementById("inputUndercut").value),
    H_ant: parseFloat(document.getElementById("inputHAnt").value),
    H_post_R: parseFloat(document.getElementById("inputHPostR").value),
    H_post_L: parseFloat(document.getElementById("inputHPostL").value),
    W_ant: parseFloat(document.getElementById("inputWAnt").value),
    W_post: parseFloat(document.getElementById("inputWPost").value),
    hu_ant: parseFloat(document.getElementById("inputHuAnt").value),
    hu_post: parseFloat(document.getElementById("inputHuPost").value),
    V_prost: parseFloat(document.getElementById("inputVProst").value),
    z_drop_R: parseFloat(document.getElementById("inputZDropR").value || 0),
    z_drop_L: parseFloat(document.getElementById("inputZDropL").value || 0),
    defect_zone: document.getElementById("inputDefectZone").value || "none",
    defect_dz: parseFloat(document.getElementById("inputDefectDz").value || 0),
    defect_dw: parseFloat(document.getElementById("inputDefectDw").value || 0),
    bone_minimums: {
      altezza_mm: parseFloat(document.getElementById("inputMinAltezza").value || 0),
      larghezza_per_lato_mm: parseFloat(document.getElementById("inputMinLato").value || 0),
      // nerve_clearance_mm is measured from the implant surface to the nerve centerline.
      // Add the uncertainty half-width and requested gap to set the solver's target.
      nervo_mm: readNonNegativeInput("inputNerveConfidence", 2.9)
        + readNonNegativeInput("inputConfidenceDistance", 0)
    },
    collar_depth_mm: readNonNegativeInput("inputCollarDepth", 0),
    profile_name: (document.getElementById("selectProfiloMedico").value || "")
  };
}

function setFormData(params) {
  if (params.arch) document.getElementById("inputArch").value = params.arch;
  if (params.n_imp !== undefined) document.getElementById("inputNImp").value = params.n_imp;
  if (params.chord_R !== undefined) document.getElementById("inputChordR").value = params.chord_R;
  if (params.depth_R !== undefined) document.getElementById("inputDepthR").value = params.depth_R;
  if (params.chord_L !== undefined) document.getElementById("inputChordL").value = params.chord_L;
  if (params.depth_L !== undefined) document.getElementById("inputDepthL").value = params.depth_L;
  if (params.loop_R !== undefined) document.getElementById("inputLoopR").value = params.loop_R;
  if (params.loop_L !== undefined) document.getElementById("inputLoopL").value = params.loop_L;
  if (params.undercut !== undefined) document.getElementById("inputUndercut").value = params.undercut;
  if (params.H_ant !== undefined) document.getElementById("inputHAnt").value = params.H_ant;
  if (params.H_post_R !== undefined) document.getElementById("inputHPostR").value = params.H_post_R;
  if (params.H_post_L !== undefined) document.getElementById("inputHPostL").value = params.H_post_L;
  if (params.W_ant !== undefined) document.getElementById("inputWAnt").value = params.W_ant;
  if (params.W_post !== undefined) document.getElementById("inputWPost").value = params.W_post;
  if (params.hu_ant !== undefined) document.getElementById("inputHuAnt").value = params.hu_ant;
  if (params.hu_post !== undefined) document.getElementById("inputHuPost").value = params.hu_post;
  if (params.V_prost !== undefined) document.getElementById("inputVProst").value = params.V_prost;
  if (params.z_drop_R !== undefined) document.getElementById("inputZDropR").value = params.z_drop_R;
  if (params.z_drop_L !== undefined) document.getElementById("inputZDropL").value = params.z_drop_L;
  if (params.defect_zone !== undefined) document.getElementById("inputDefectZone").value = params.defect_zone;
  if (params.defect_dz !== undefined) document.getElementById("inputDefectDz").value = params.defect_dz;
  if (params.defect_dw !== undefined) document.getElementById("inputDefectDw").value = params.defect_dw;

  updateMischBadges();
}

function updateMischBadges() {
  const huAnt = parseFloat(document.getElementById("inputHuAnt").value) || 0;
  const huPost = parseFloat(document.getElementById("inputHuPost").value) || 0;

  function badgeFor(hu) {
    if (hu >= 1150) return { cls: "misch-d1", text: "D1, corticale densa oltre 1150 HU" };
    if (hu >= 750) return { cls: "misch-d2", text: "D2, cortico-spongiosa tra 750 e 1150 HU" };
    if (hu >= 350) return { cls: "misch-d3", text: "D3, trabecolare fine tra 350 e 750 HU" };
    return { cls: "misch-d4", text: "D4, bassa densità sotto 350 HU" };
  }

  const ant = badgeFor(huAnt);
  const antElement = document.getElementById("badgeMischAnt");
  if (antElement) {
    antElement.className = `misch-badge ${ant.cls}`;
    antElement.textContent = ant.text;
  }

  const post = badgeFor(huPost);
  const postElement = document.getElementById("badgeMischPost");
  if (postElement) {
    postElement.className = `misch-badge ${post.cls}`;
    postElement.textContent = post.text;
  }
}

async function runCalculation() {
  state.isSolving = true;
  const params = getFormData();
  try {
    // Modalita Offline Standalone: se disponibile il caso offline nativo, usa il calcolo gia sigillato
    if (window.OFFLINE_CASE_DATA && window.OFFLINE_CASE_DATA.solve_result) {
      const result = window.OFFLINE_CASE_DATA.solve_result;
      const presetSelect = document.getElementById("presetSelect");
      state.lastSolvedPreset = presetSelect ? presetSelect.value : (window.OFFLINE_CASE_DATA.preset ? window.OFFLINE_CASE_DATA.preset.id : "tf2_004");
      state.outsideConfidenceResult = null;
      updateUIResults(result);
      const overlay = document.getElementById("noCaseOverlay");
      if (overlay) overlay.style.display = "none";
      return result;
    }

    const response = await fetch("/api/solve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params)
    });
    const result = await response.json();

    if (result.error) {
      alert(`Errore calcolo: ${result.error}`);
      return;
    }

    const presetSelect = document.getElementById("presetSelect");
    state.lastSolvedPreset = presetSelect ? presetSelect.value : "";
    state.outsideConfidenceResult = null;
    const halfWidth = readNonNegativeInput("inputNerveConfidence", 2.9);
    const currentMin = Array.isArray(result.implants) && result.implants.length
      ? Math.min(...result.implants.map(i => Number(i.nerve_clearance_mm))) : Infinity;
    if (currentMin < halfWidth) {
      const outsideParams = structuredClone(params);
      outsideParams.bone_minimums.nervo_mm = halfWidth;
      try {
        const outsideResponse = await fetch("/api/solve", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(outsideParams) });
        const outsidePlan = await outsideResponse.json();
        const near = closestImplantToNerve(outsidePlan)?.implant;
        if (near && Number(near.nerve_clearance_mm) >= halfWidth) {
          state.outsideConfidenceResult = { length: Number(near.length) };
        } else {
          const solverMessage = String(outsidePlan.load_verdict || outsidePlan.error || "");
          const solverShortage = solverMessage.match(/mancano\s+(\d+(?:[.,]\d+)?)\s*mm/i);
          const shortage = Number(outsidePlan.nerve_shortfall_mm ?? outsidePlan.missing_nerve_mm ?? outsidePlan.missing_mm ?? (solverShortage && solverShortage[1].replace(",", ".")));
          if (Number.isFinite(shortage)) state.outsideConfidenceResult = { missing: shortage };
          else if (Number.isFinite(Number(outsidePlan.max_nerve_clearance_mm))) state.outsideConfidenceResult = { missing: Math.max(0, halfWidth - Number(outsidePlan.max_nerve_clearance_mm)) };
        }
      } catch (outsideError) { console.warn("Confronto piano fuori confidenza non disponibile", outsideError); }
    }
    updateUIResults(result);
    return result;
  } catch (error) {
    console.error("Errore chiamata API /api/solve:", error);
  } finally {
    state.isSolving = false;
  }
}

async function loadPresets() {
  try {
    // Se presente il caso offline, caricalo immediatamente
    if (window.OFFLINE_CASE_DATA && window.OFFLINE_CASE_DATA.preset) {
      const preset = window.OFFLINE_CASE_DATA.preset;
      state.presets = [preset];
      const select = document.getElementById("presetSelect");
      if (select) {
        select.innerHTML = `<option value="${preset.id}">${preset.badge}: ${preset.name}</option>`;
        select.value = preset.id;
      }
      setFormData(preset.params);
      const caseTag = document.getElementById("caseTag");
      if (caseTag) caseTag.textContent = preset.badge || "Caso Clinico";
      const overlay = document.getElementById("noCaseOverlay");
      if (overlay) overlay.style.display = "none";
      await runCalculation();
      return;
    }

    const response = await fetch("/api/presets");
    const data = await response.json();
    state.presets = data.presets || [];

    const select = document.getElementById("presetSelect");
    if (!select) return;

    select.innerHTML = '<option value="">Seleziona un caso</option>';
    state.presets.forEach(preset => {
      const option = document.createElement("option");
      option.value = preset.id;
      option.textContent = `${preset.badge}: ${preset.name}`;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Errore caricamento presets:", error);
  }
}

async function loadPriors() {
  try {
    const response = await fetch("/api/priors");
    state.priors = await response.json();
    updatePriorsSummaryUI(state.priors);
  } catch (error) {
    console.error("Errore caricamento priors:", error);
  }
}

async function loadProfili() {
  try {
    const response = await fetch("/api/profili");
    const data = await response.json();
    const select = document.getElementById("selectProfiloMedico");
    if (!select) return;
    select.innerHTML = '<option value="">nessun profilo</option>';
    (data.profili || []).forEach(p => {
      const option = document.createElement("option");
      option.value = p.nome;
      option.textContent = p.nome;
      option.dataset.min = JSON.stringify(p);
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Errore caricamento profili:", error);
  }
}

function applyProfilo(nome) {
  const select = document.getElementById("selectProfiloMedico");
  if (!select) return;
  const opt = Array.from(select.options).find(o => o.value === nome);
  if (!opt || !opt.dataset.min) return;
  const p = JSON.parse(opt.dataset.min);
  document.getElementById("inputMinAltezza").value = p.altezza_mm ?? 0;
  document.getElementById("inputMinLato").value = p.larghezza_per_lato_mm ?? 0;
  document.getElementById("inputMinNervo").value = p.nervo_mm ?? 0;
}

async function loadNeuralStatus() {
  try {
    const response = await fetch("/api/neural-status");
    const status = await response.json();
    const element = document.getElementById("neuralBadgeText");
    if (element) {
      element.textContent = status.timesfm_weights_present
        ? `TimesFM e TabPFN attivi (${status.dataset_cases_count} casi)`
        : "TimesFM e TabPFN, motore analitico";
    }
  } catch (error) {
    console.error("Errore neural status:", error);
  }
}

function updatePriorsSummaryUI(priors) {
  if (!priors) return;

  setText("priorCasesCount", priors.calibrated_cases_count || 0);
  setText("priorTiltBias", `${priors.distal_tilt_bias_deg > 0 ? "+" : ""}${fmtSmart(priors.distal_tilt_bias_deg)}°`);
  setText("priorNerveMargin", `${fmtFixed(priors.safety_margin_nerve_mm, 1)} mm`);
  setText("priorCantilever", `${priors.cantilever_conservatism}x`);
}

// ==============================================================================
// 8. EVENTI
// ==============================================================================

function initEventListeners() {
  async function selectPreset(presetId) {
    const select = document.getElementById("presetSelect");
    if (select) select.value = presetId;
    const selected = state.presets.find(preset => preset.id === presetId);
    if (selected && selected.params) {
      setFormData(selected.params);
      state.fitOnNextUpdate = true;
      const caseTag = document.getElementById("caseTag");
      if (caseTag) caseTag.textContent = selected.badge || "Caso";
      const overlay = document.getElementById("noCaseOverlay");
      if (overlay) overlay.style.display = "none";
      return await runCalculation();
    } else {
      const overlay = document.getElementById("noCaseOverlay");
      if (overlay) overlay.style.display = "flex";
    }
  }
  window.selectPreset = selectPreset;

  const presetSelect = document.getElementById("presetSelect");
  if (presetSelect) {
    presetSelect.addEventListener("change", event => selectPreset(event.target.value));
  }

  const huAnt = document.getElementById("inputHuAnt");
  const huPost = document.getElementById("inputHuPost");
  if (huAnt) huAnt.addEventListener("input", updateMischBadges);
  if (huPost) huPost.addEventListener("input", updateMischBadges);

  const calculateButton = document.getElementById("btnCalculate");
  if (calculateButton) calculateButton.addEventListener("click", runCalculation);

  ["inputNerveConfidence", "inputConfidenceDistance"].forEach(id => {
    const input = document.getElementById(id);
    if (input) input.addEventListener("change", () => {
      if (state.currentResult) runCalculation();
    });
  });

  const profiloSelect = document.getElementById("selectProfiloMedico");
  if (profiloSelect) profiloSelect.addEventListener("change", e => applyProfilo(e.target.value));

  const saveProfiloBtn = document.getElementById("btnSaveProfilo");
  if (saveProfiloBtn) saveProfiloBtn.addEventListener("click", async () => {
    const nome = document.getElementById("inputNomeProfilo").value.trim();
    if (!nome) { alert("Inserisci un nome profilo"); return; }
    const body = {
      nome: nome,
      altezza_mm: parseFloat(document.getElementById("inputMinAltezza").value || 0),
      larghezza_per_lato_mm: parseFloat(document.getElementById("inputMinLato").value || 0),
      nervo_mm: parseFloat(document.getElementById("inputMinNervo").value || 0),
      nota: "Profilo salvato dal cockpit"
    };
    try {
      const response = await fetch("/api/profili", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const res = await response.json();
      if (res.error) { alert(res.error); return; }
      await loadProfili();
      const select = document.getElementById("selectProfiloMedico");
      if (select) select.value = nome;
    } catch (e) {
      console.error(e);
    }
  });

  ["inputArch", "inputNImp", "inputZDropR", "inputZDropL", "inputDefectZone", "inputDefectDz", "inputDefectDw"]
    .forEach(id => {
      const element = document.getElementById(id);
      if (element) element.addEventListener("change", runCalculation);
    });

  const neuralButton = document.getElementById("btnRunNeural");
  if (neuralButton) {
    neuralButton.addEventListener("click", async () => {
      const output = document.getElementById("neuralLiveOutput");
      if (!output) return;

      output.innerHTML = '<p class="models-loading">Inferenza in corso sui cinque motori locali...</p>';
      neuralButton.disabled = true;

      try {
        const response = await fetch("/api/neural-infer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(getFormData())
        });
        const data = await response.json();

        if (data.status === "ok") {
          renderFiveModels(data);
        } else {
          output.innerHTML = `<p class="models-empty">Errore inferenza: ${data.error || "non disponibile"}</p>`;
        }
      } catch (error) {
        output.innerHTML = `<p class="models-empty">Errore chiamata /api/neural-infer: ${error}</p>`;
      } finally {
        neuralButton.disabled = false;
      }
    });
  }

  document.querySelectorAll(".cam-btn[data-cam]").forEach(button => {
    button.addEventListener("click", () => setCameraPreset(button.dataset.cam));
  });

  const fitButton = document.getElementById("btnFit");
  if (fitButton) fitButton.addEventListener("click", () => fitScene(state.currentView));

  const layerMap = {
    toggleArch: "arch",
    toggleImplants: "implants",
    toggleMua: "mua",
    toggleNerves: "nerves",
    toggleConfidence: "confidence",
    togglePins: "pins",
    toggleGuideBar: "guideBar",
    toggleFiducials: "fiducials"
  };

  Object.entries(layerMap).forEach(([elementId, groupName]) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.addEventListener("change", event => {
        if (state.sceneGroups[groupName]) {
          state.sceneGroups[groupName].visible = event.target.checked;
        }
      });
    }
  });

  const modal = document.getElementById("tuningModal");
  const openTuning = document.getElementById("btnOpenTuning");
  if (openTuning) {
    openTuning.addEventListener("click", () => {
      if (state.currentResult && state.currentResult.implants.length > 0) {
        const distals = state.currentResult.implants.filter(implant => implant.label.includes("Post"));
        const averageTilt = distals.length > 0 ? distals[0].total_tilt : 34.0;
        document.getElementById("tunePredTilt").value = averageTilt;
        document.getElementById("tuneSurgeonTilt").value = Math.round(averageTilt + 2.0);
        document.getElementById("tunePredCant").value = state.currentResult.max_cantilever;
        document.getElementById("tuneSurgeonCant").value = Math.max(8.0, state.currentResult.max_cantilever - 1.5);
        document.getElementById("tuneNerveMargin").value =
          state.priors ? state.priors.safety_margin_nerve_mm : 2.5;
      }
      if (modal) modal.classList.add("open");
    });
  }

  const closeTuning = document.getElementById("btnCloseTuning");
  if (closeTuning) {
    closeTuning.addEventListener("click", () => {
      if (modal) modal.classList.remove("open");
    });
  }

  const applyTuning = document.getElementById("btnApplyTuning");
  if (applyTuning) {
    applyTuning.addEventListener("click", async () => {
      const payload = {
        predicted_tilt: parseFloat(document.getElementById("tunePredTilt").value),
        surgeon_actual_tilt: parseFloat(document.getElementById("tuneSurgeonTilt").value),
        predicted_cantilever: parseFloat(document.getElementById("tunePredCant").value),
        surgeon_actual_cantilever: parseFloat(document.getElementById("tuneSurgeonCant").value),
        nerve_clearance_preferred: parseFloat(document.getElementById("tuneNerveMargin").value),
        current_params: getFormData()
      };

      try {
        const response = await fetch("/api/tune", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await response.json();

        if (data.status === "success") {
          state.priors = data.priors;
          updatePriorsSummaryUI(state.priors);
          if (data.recalculated) updateUIResults(data.recalculated);
          if (modal) modal.classList.remove("open");
        }
      } catch (error) {
        alert(`Errore aggiornamento calibrazione: ${error}`);
      }
    });
  }

  const resetPriors = document.getElementById("btnResetPriors");
  if (resetPriors) {
    resetPriors.addEventListener("click", async () => {
      if (!confirm("Ripristinare i valori iniziali della calibrazione?")) return;

      try {
        const response = await fetch("/api/reset-priors", { method: "POST" });
        const data = await response.json();
        state.priors = data.priors;
        updatePriorsSummaryUI(state.priors);
        runCalculation();
        if (modal) modal.classList.remove("open");
      } catch (error) {
        alert(`Errore reset calibrazione: ${error}`);
      }
    });
  }

  const exportStl = document.getElementById("btnExportStl");
  if (exportStl) {
    exportStl.addEventListener("click", async () => {
      if (!state.currentResult) return;

      try {
        const response = await fetch("/api/export-stl", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(state.currentResult)
        });
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `ArkAngEL_Guide_${state.currentResult.params.arch}_AllOn${state.currentResult.params.n_imp}.stl`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        alert(`Errore export STL: ${error}`);
      }
    });
  }

  const printReport = document.getElementById("btnPrintReport");
  if (printReport) {
    printReport.addEventListener("click", () => window.print());
  }
  const lookHere = document.getElementById("btnLookHere");
  if (lookHere) lookHere.addEventListener("click", () => {
    if (!state.focusPoint) return;
    if (!state.previousCamera) state.previousCamera = { position: state.camera.position.clone(), target: state.controls.target.clone() };
    animateCameraTo(state.focusPoint);
    const back = document.getElementById("btnReturnView");
    if (back) back.hidden = false;
  });
  const lookHook = document.getElementById("btnLookHook");
  if (lookHook) lookHook.addEventListener("click", () => {
    if (!UNCINO_PUNTO) return;
    if (!state.previousCamera) state.previousCamera = { position: state.camera.position.clone(), target: state.controls.target.clone() };
    // nella vista dell'uncino la parete del canale diventa quasi trasparente e la fascia si spegne, cosi' si vede la linea centrale col suo uncino
    (state.paretiNervo || []).forEach(m => { m.userData.opacitaPrima = m.userData.opacitaPrima ?? m.opacity; m.opacity = 0.05; });
    if (state.sceneGroups.confidence) { state.fasciaVisibilePrima = state.sceneGroups.confidence.visible; state.sceneGroups.confidence.visible = false; }
    animateCameraTo(UNCINO_PUNTO.clone(), 13, new THREE.Vector3(0.35, -0.35, 1));
    const back = document.getElementById("btnReturnView");
    if (back) back.hidden = false;
  });
  const returnView = document.getElementById("btnReturnView");
  if (returnView) returnView.addEventListener("click", () => {
    (state.paretiNervo || []).forEach(m => { if (m.userData.opacitaPrima != null) m.opacity = m.userData.opacitaPrima; });
    if (state.sceneGroups.confidence && state.fasciaVisibilePrima != null) state.sceneGroups.confidence.visible = state.fasciaVisibilePrima;
    if (state.previousCamera) {
      state.cameraTween = { start: performance.now(), duration: 520, fromPosition: state.camera.position.clone(), toPosition: state.previousCamera.position.clone(), fromTarget: state.controls.target.clone(), toTarget: state.previousCamera.target.clone() };
      state.previousCamera = null;
    }
    returnView.hidden = true;
  });
}
