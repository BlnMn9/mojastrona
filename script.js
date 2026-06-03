let zmienione = false;

function zmienTekst() {
  const tekst = document.getElementById("tekst");

  if (!tekst) {
    console.log("Nie znaleziono elementu o id 'tekst'");
    return;
  }

  if (zmienione === false) {
    tekst.innerText = "Kliknąłeś i działa JavaScript 🚀";
    zmienione = true;
  } else {
    tekst.innerText = "Moja strona działa teraz z JavaScript!";
    zmienione = false;
  }
}




function przelaczMotyw() {
  document.body.classList.toggle("dark");

  const btn = document.getElementById("darkModeBtn");

  if (document.body.classList.contains("dark")) {
    btn.innerText = "☀️ Light Mode";

    localStorage.setItem("motyw", "dark");
  } else {
    btn.innerText = "🌙 Dark Mode";

    localStorage.setItem("motyw", "light");
  }
}




const zapisanyMotyw = localStorage.getItem("motyw");

if (zapisanyMotyw === "dark") {
  document.body.classList.add("dark");

  const btn = document.getElementById("darkModeBtn");

  if (btn) {
    btn.innerText = "☀️ Light Mode";
  }
}




let canHold = false;
let holdStart = 0;
let targetTime = 0;
let timeout;

function startHoldGame() {
  document.getElementById("wynik").innerText = "";
  document.getElementById("holdBtn").disabled = true;

  targetTime = Math.random() * 4000 + 1000;

  const status = document.getElementById("status");

  status.innerText = "🟩";

  setTimeout(() => {
    status.innerText = "Odtwórz ten czas! ⏱️";

    canHold = true;
    document.getElementById("holdBtn").disabled = false;
  }, targetTime);
}



function startHold() {
  if (!canHold) return;

  holdStart = Date.now();
}

function endHold() {
  if (!canHold) return;

  let holdTime = Date.now() - holdStart;

  canHold = false;
  document.getElementById("holdBtn").disabled = true;

  let diff = Math.abs(holdTime - targetTime);

  let wynik = "";

  if (diff < 200) {
    wynik = "🔥 PERFECT!";
  } else if (diff < 500) {
    wynik = "👍 DOBRZE!";
  } else {
    wynik = "❌ słabo";
  }

  document.getElementById("wynik").innerText =
    `Twój czas: ${holdTime} ms | cel: ${targetTime.toFixed(0)} ms → ${wynik}`;

  document.getElementById("status").innerText =
    "Kliknij START żeby zagrać ponownie";
}




const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// Teserakt: 16 wierzchołków 4D (każda kombinacja ±1 dla x,y,z,w)
const vertices4D = [];
for (let x of [-1, 1])
  for (let y of [-1, 1])
    for (let z of [-1, 1])
      for (let w of [-1, 1])
        vertices4D.push([x, y, z, w]);

// Krawędzie: dwa wierzchołki połączone jeśli różnią się dokładnie jedną współrzędną
const edges = [];
for (let i = 0; i < 16; i++) {
  for (let j = i + 1; j < 16; j++) {
    let diff = 0;
    for (let k = 0; k < 4; k++) {
      if (vertices4D[i][k] !== vertices4D[j][k]) diff++;
    }
    if (diff === 1) edges.push([i, j]);
  }
}

// Obrót 4D w płaszczyznach XZ i YW
function rotate4D([x, y, z, w], angleXZ, angleYW) {
  const cosXZ = Math.cos(angleXZ), sinXZ = Math.sin(angleXZ);
  const cosYW = Math.cos(angleYW), sinYW = Math.sin(angleYW);

  // obrót w płaszczyźnie XZ
  const x1 = x * cosXZ - z * sinXZ;
  const z1 = x * sinXZ + z * cosXZ;

  // obrót w płaszczyźnie YW
  const y1 = y * cosYW - w * sinYW;
  const w1 = y * sinYW + w * cosYW;

  return [x1, y1, z1, w1];
}

// Rzut perspektywiczny 4D → 3D
function project4Dto3D([x, y, z, w]) {
  const d4 = 3; // odległość obserwatora w 4D
  const scale = d4 / (d4 - w);
  return [x * scale, y * scale, z * scale];
}

// Rzut perspektywiczny 3D → 2D
function project3Dto2D([x, y, z]) {
  const d3 = 4;
  const scale = d3 / (d3 - z);
  return [
    x * scale * 120 + canvas.width / 2,
    y * scale * 120 + canvas.height / 2
  ];
}

// Głębokość wierzchołka (do kolorowania krawędzi)
function depth4D([x, y, z, w]) {
  return z + w * 0.5;
}

let angleXZ = 0;
let angleYW = 0;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Obróć wszystkie 16 wierzchołków 4D
  const rotated4D = vertices4D.map(v => rotate4D(v, angleXZ, angleYW));

  // Rzutuj do 2D
  const screen = rotated4D.map(v => project3Dto2D(project4Dto3D(v)));

  // Sortuj krawędzie po głębokości (painter's algorithm) – głębsze rysuj pierwsze
  const sortedEdges = [...edges].sort((a, b) => {
    const dA = depth4D(rotated4D[a[0]]) + depth4D(rotated4D[a[1]]);
    const dB = depth4D(rotated4D[b[0]]) + depth4D(rotated4D[b[1]]);
    return dA - dB;
  });

  sortedEdges.forEach(([a, b]) => {
    const avgDepth = (depth4D(rotated4D[a]) + depth4D(rotated4D[b])) / 2;
    // Kolor od głębokości: od niebieskiego (głęboko) do cyjanowego (blisko)
    const t = (avgDepth + 2.5) / 5; // normalizuj do [0,1]
    const r = Math.round(30 + t * 80);
    const g = Math.round(180 + t * 75);
    const blue = Math.round(255);
    const alpha = 0.4 + t * 0.6;

    ctx.strokeStyle = `rgba(${r}, ${g}, ${blue}, ${alpha})`;
    ctx.lineWidth = 0.8 + t * 1.2;

    ctx.beginPath();
    ctx.moveTo(screen[a][0], screen[a][1]);
    ctx.lineTo(screen[b][0], screen[b][1]);
    ctx.stroke();
  });

  // Rysuj wierzchołki
  screen.forEach((pt, i) => {
    const d = depth4D(rotated4D[i]);
    const t = (d + 2.5) / 5;
    const r = Math.round(100 + t * 155);
    const g = Math.round(200 + t * 55);
    ctx.beginPath();
    ctx.arc(pt[0], pt[1], 1.5 + t * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r}, ${g}, 255, ${0.6 + t * 0.4})`;
    ctx.fill();
  });

  // Dwa różne kąty dla efektu 4D
  angleXZ += 0.012;
  angleYW += 0.007;

  requestAnimationFrame(draw);
}

draw();
