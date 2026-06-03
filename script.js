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

let points = [];

// cube A
for (let x of [-1, 1]) {
  for (let y of [-1, 1]) {
    for (let z of [-1, 1]) {
      points.push([x, y, z]);
    }
  }
}

// cube B (większy)
for (let x of [-1, 1]) {
  for (let y of [-1, 1]) {
    for (let z of [-1, 1]) {
      points.push([x * 2 + 3, y * 2 + 3, z * 2 + 3]);
    }
  }
}


let edges = [];

// cube A
for (let i = 0; i < 8; i++) {
  for (let j = i + 1; j < 8; j++) {
    if (isEdge(points[i], points[j])) edges.push([i, j]);
  }
}

// cube B
for (let i = 0; i < 8; i++) {
  for (let j = i + 1; j < 8; j++) {
    if (isEdge(points[i + 8], points[j + 8])) edges.push([i + 8, j + 8]);
  }
}

// łączenia między cube
for (let i = 0; i < 8; i++) {
  edges.push([i, i + 8]);
}


function isEdge(a, b) {
  let diff = 0;
  for (let i = 0; i < 3; i++) {
    if (a[i] !== b[i]) diff++;
  }
  return diff === 1;
}



function rotate([x, y, z], a) {
  let cos = Math.cos(a);
  let sin = Math.sin(a);

  let x1 = x * cos - z * sin;
  let z1 = x * sin + z * cos;

  return [x1, y, z1];
}




function to2D([x, y, z]) {
  let f = 150;
  return [
    x * f + canvas.width / 2,
    y * f + canvas.height / 2
  ];
}



let angle = 0;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let rotated = points.map(p => rotate(p, angle));
  let projected = rotated.map(to2D);
  let screen = projected;

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