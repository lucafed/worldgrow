(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const elMsg = $("msg");
  const elEnergy = $("energy");
  const elWorld = $("world");
  const elScene = $("scene");
  const inputCam = $("camera");
  const btnSnap = $("btnSnap");
  const btnReset = $("btnResetTask");

  // --- Stato semplice (MVP) ---
  const SKEY = "worldgrow_v1_state";
  const state = loadState();

  // 4 scene nello sprite 2x2:
  // 0 = alto-sinistra, 1 = alto-destra, 2 = basso-sinistra, 3 = basso-destra
  function applyStage(stage) {
    const map = [
      "0% 0%",
      "100% 0%",
      "0% 100%",
      "100% 100%"
    ];
    elScene.style.backgroundPosition = map[stage % 4];
  }

  function flashScene() {
    elScene.classList.add("flash");
    setTimeout(() => elScene.classList.remove("flash"), 260);
  }

  function render() {
    elEnergy.textContent = String(state.energy);
    elWorld.textContent = String(state.world);

    const stage = state.world % 4;
    applyStage(stage);

    if (state.photosInTask === 0) {
      elMsg.textContent = "Nuovo compito: fai 2 foto (inizio + fine).";
    } else if (state.photosInTask === 1) {
      elMsg.textContent = "Foto 1 presa. Vai tranquillo, poi fai la foto finale.";
    } else {
      elMsg.textContent = "Compito finito! Il mondo cresce.";
    }
  }

  // --- Logica foto: 2 foto = completato ---
  function onTakePhoto() {
    state.photosInTask += 1;

    // energia: +2 per ogni foto (come prima)
    state.energy += 2;

    if (state.photosInTask >= 2) {
      // COMPLETATO: cresce
      state.world += 1;
      state.photosInTask = 0;

      // animazione crescita
      flashScene();
      // piccola attesa e poi cambia scena (fade)
      setTimeout(() => {
        applyStage(state.world % 4);
      }, 180);

      elMsg.textContent = "Bravo. Hai finito. Il mondo è cambiato.";
    }

    saveState();
    render();
  }

  // --- Camera input (MVP: basta “selezionare” la foto) ---
  inputCam.addEventListener("change", () => {
    if (inputCam.files && inputCam.files.length) onTakePhoto();
    inputCam.value = "";
  });

  btnSnap.addEventListener("click", () => inputCam.click());

  btnReset.addEventListener("click", () => {
    state.photosInTask = 0;
    saveState();
    render();
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
