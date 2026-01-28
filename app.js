(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const stage = $("stage");
  const hint = $("hint");
  const pop = $("pop");

  const btnSnap = $("btnSnap");
  const btnReset = $("btnResetTask");
  const btnDemo = $("btnDemo");
  const camera = $("camera");

  const energyEl = $("energy");
  const growthEl = $("growth");

  let photoCount = 0;
  let energy = 0;
  let growth = 0;

  // helper: stato scena
  function setState(cls, on) {
    stage.classList.toggle(cls, !!on);
  }

  function say(text, ms = 1200) {
    pop.textContent = text;
    stage.classList.add("pop");
    clearTimeout(say._t);
    say._t = setTimeout(() => stage.classList.remove("pop"), ms);
  }

  function updateHUD() {
    energyEl.textContent = String(energy);
    growthEl.textContent = String(growth);
  }

  function resetTask() {
    photoCount = 0;
    setState("armed", false);
    setState("event", false);
    hint.textContent = "Nuovo compito: fai 2 foto (inizio + fine).";
    say("Nuovo compito! ⚡", 900);
  }

  function onPhotoTaken() {
    photoCount++;

    // “energia” cresce sempre
    energy += 2;
    updateHUD();

    if (photoCount === 1) {
      // Foto 1 → tensione
      setState("armed", true);
      setState("event", false);
      hint.textContent = "Foto 1 presa. Ora finisci: la scena sta per cambiare…";
      say("Ooh… sta per succedere 😳", 1200);
      return;
    }

    if (photoCount >= 2) {
      // Foto 2 → evento
      setState("armed", false);
      setState("event", true);

      growth += 1;
      updateHUD();

      hint.textContent = "Compito FINITO. Il mondo cresce (e i personaggi reagiscono).";
      say("BOOM! È apparso qualcosa ✨", 1400);

      // dopo un po’ torna a idle (ma i personaggi restano vivi)
      setTimeout(() => {
        setState("event", false);
        hint.textContent = "Nuovo compito: fai 2 foto (inizio + fine).";
        photoCount = 0;
      }, 1400);
    }
  }

  // Foto compito: apri camera (ma se browser blocca, la Demo funziona sempre)
  btnSnap.addEventListener("click", () => {
    try {
      camera.click();
    } catch {
      // fallback
      onPhotoTaken();
    }
  });

  camera.addEventListener("change", () => {
    // non ci interessa leggere l’immagine ora: basta capire che “una foto è stata fatta”
    onPhotoTaken();
    camera.value = "";
  });

  btnReset.addEventListener("click", resetTask);

  // DEMO: simula Foto1 poi Foto2 (cartone)
  btnDemo.addEventListener("click", () => {
    resetTask();
    setTimeout(() => onPhotoTaken(), 180);
    setTimeout(() => onPhotoTaken(), 1050);
  });

  // init
  updateHUD();
  resetTask();

})();
