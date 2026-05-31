let zmienione = false;

function zmienTekst() {
  const tekst = document.getElementById("tekst");

  if (zmienione === false) {
    tekst.innerText = "Kliknąłeś i działa JavaScript 🚀";
    zmienione = true;
  } else {
    tekst.innerText = "Moja strona działa teraz z JavaScript!";
    zmienione = false;
  }
}
