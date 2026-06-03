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

// 16 punktów teseraktu (4D: x,y,z,w)
let points = [];

for (let i = 0; i < 16; i++) {
  points.push({
    x: (i & 1) ? 1 : -1,
    y: (i & 2) ? 1 : -1,
    z: (i & 4) ? 1 : -1,
    w: (i & 8) ? 1 : -1,
  });
}

let angle = 0;

// rotacja 4D
function rotate4D(p, a) {
  let cos = Math.cos(a);
  let sin = Math.sin(a);

  let x = p.x * cos - p.w * sin;
  let w = p.x * sin + p.w * cos;

  return { ...p, x, w };
}

// projekcja 4D → 3D
function project(p) {
  let distance = 2;
  let scale = 200 / (distance - p.w);

  return {
    x: p.x * scale,
    y: p.y * scale,
  };
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let rotated = points.map(p => rotate4D(p, angle));
  let projected = rotated.map(project);

  ctx.strokeStyle = "white";

  // rysuj punkty
  projected.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x + 200, p.y + 200, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  angle += 0.02;

  requestAnimationFrame(draw);
}

draw();