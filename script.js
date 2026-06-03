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

canvas.width = 400;
canvas.height = 400;

// 16 wierzchołków
let points = [];

for (let i = 0; i < 16; i++) {
  points.push([
    (i & 1) ? 1 : -1,
    (i & 2) ? 1 : -1,
    (i & 4) ? 1 : -1,
    (i & 8) ? 1 : -1
  ]);
}

// krawędzie tesseraktu (to jest KLUCZ)
let edges = [];

for (let i = 0; i < 16; i++) {
  for (let j = i + 1; j < 16; j++) {
    let diff = 0;
    for (let k = 0; k < 4; k++) {
      if (points[i][k] !== points[j][k]) diff++;
    }
    if (diff === 1) edges.push([i, j]);
  }
}

let angle = 0;

// rotacja 4D (XW + YW)
function rotate([x, y, z, w], a) {
  let cos = Math.cos(a);
  let sin = Math.sin(a);

  // XW
  let x1 = x * cos - w * sin;
  let w1 = x * sin + w * cos;

  // YZ (druga rotacja dla efektu 4D)
  let y1 = y * cos - z * sin;
  let z1 = y * sin + z * cos;

  return [x1, y1, z1, w1];
}

// projekcja 4D → 3D
function project([x, y, z, w]) {
  let d = 3;
  let scale = d / (d - w);

  return [
    x * scale,
    y * scale,
    z * scale
  ];
}

// 3D → 2D
function to2D([x, y, z]) {
  let f = 200;
  return [
    x * f + 200,
    y * f + 200
  ];
}

function draw() {
  ctx.clearRect(0, 0, 400, 400);

  let rotated = points.map(p => rotate(p, angle));
  let projected = rotated.map(project);
  let screen = projected.map(to2D);

  // rysuj krawędzie
  ctx.strokeStyle = "white";
  edges.forEach(([a, b]) => {
    ctx.beginPath();
    ctx.moveTo(screen[a][0], screen[a][1]);
    ctx.lineTo(screen[b][0], screen[b][1]);
    ctx.stroke();
  });

  angle += 0.02;

  requestAnimationFrame(draw);
}

draw();