(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const stage = $("stage");
  const elMsg = $("msg");
  const elEnergy = $("energy");
  const elWorld = $("world");
  const pop = $("pop");
  const flash = $("flash");

  const inputCam = $("camera");
  const btnSnap = $("btnSnap");
  const btnReset = $("btnResetTask");
  const btnDemo = $("btnDemo");

  const SKEY = "worldgrow_story_v1";

  const state = loadState(); // {energy, world, photosInTask}

  function render() {
    elEnergy.textContent = String(state.energy);
    elWorld.textContent = String(state.world);

    stage.classList.remove("armed", "event");

    if (state.photosInTask === 0) {
      elMsg.textContent = "Apri l’app: gli abitanti aspettano. Poi fai 2 foto (inizio + fine).";
      // idle
    } else if (state.photosInTask === 1) {
      elMsg.textContent = "Foto 1 presa. Qualcosa si muove… finisci e fai la foto finale.";
      stage.classList.add("armed");
    } else {
      elMsg.textContent = "Compito finito. È successo qualcosa.";
      stage.classList.add("event");
    }
  }

  function showPop(text) {
    pop.textContent = text;
    pop.classList.add("show");
    setTimeout(() => pop.classList.remove("show"), 1400);
  }

  function doFlash() {
    flash.classList.add("on");
    setTimeout(() => flash.classList.remove("on"), 220);
  }

  // Sequenza evento “foto2”
  function runEventSequence() {
    stage.classList.add("event");
    doFlash();
    showPop("La porta ha sentito l’energia…");

    // dopo un attimo: “portale”
    setTimeout(() => showPop("Si apre un varco."), 900);

    // dopo un po’: torna idle (ma mondo aumentato)
    setTimeout(() => {
      stage.classList.remove("event");
      showPop("Ok. Si è calmato tutto… per ora.");
    }, 2300);
  }

  function onTakePhoto() {
    state.photosInTask += 1;
    state.energy += 2;

    if (state.photosInTask === 1) {
      // “Sta per succedere”
      stage.classList.add("armed");
      doFlash();
      showPop("Gli abitanti ti hanno visto.");
    }

    if (state.photosInTask >= 2) {
      // COMPLETATO
      state.world += 1;
      state.photosInTask = 0;

      saveState();
      render();
      runEventSequence();
      return;
    }

    saveState();
    render();
  }

  // camera input (MVP)
  inputCam.addEventListener("change", () => {
    if (inputCam.files && inputCam.files.length) onTakePhoto();
    inputCam.value = "";
  });

  btnSnap.addEventListener("click", () => inputCam.click());

  btnReset.addEventListener("click", () => {
    state.photosInTask = 0;
    saveState();
    stage.classList.remove("armed", "event");
    showPop("Nuovo compito. Tutti in attesa.");
    render();
  });

  btnDemo.addEventListener("click", () => {
    // demo: simula foto1 + foto2 (senza usare la camera)
    if (state.photosInTask !== 0) state.photosInTask = 0;
    saveState();
    render();

    setTimeout(() => { onTakePhoto(); }, 150);
    setTimeout(() => { onTakePhoto(); }, 900);
  });

  function loadState() {
    try {
      const raw = localStorage.getItem(SKEY);
      if (!raw) return { energy: 0, world: 0, photosInTask: 0 };
      const x = JSON.parse(raw);
      return {
        energy: Number(x.energy || 0),
        world: Number(x.world || 0),
        photosInTask: Number(x.photosInTask || 0),
      };
    } catch {
      return { energy: 0, world: 0, photosInTask: 0 };
    }
  }
  function saveState() {
    localStorage.setItem(SKEY, JSON.stringify(state));
  }

  render();
})();
