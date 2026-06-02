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
