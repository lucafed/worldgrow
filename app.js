(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const stage = $("stage");
  const subtitle = $("subtitle");
  const pop = $("pop");
  const btnSnap = $("btnSnap");
  const btnNew = $("btnNew");
  const btnDemo = $("btnDemo");
  const camera = $("camera");

  const energyEl = $("energy");
  const worldEl = $("world");

  const gobo = $("gobo");
  const floof = $("floof");
  const goboArmL = $("goboArmL");
  const goboArmR = $("goboArmR");
  const flEyeBig = $("flEyeBig");
  const flEyeSmall = $("flEyeSmall");

  const LS = {
    energy: "wg_energy",
    world: "wg_world",
    step: "wg_step" // 0 = nulla, 1 = foto1 fatta
  };

  const state = {
    step: 0,
    energy: 0,
    world: 0,
    demoRunning: false,
  };

  function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }

  function load() {
    state.energy = parseInt(localStorage.getItem(LS.energy) || "0", 10);
    state.world  = parseInt(localStorage.getItem(LS.world)  || "0", 10);
    state.step   = parseInt(localStorage.getItem(LS.step)   || "0", 10);
    render();
    applyStageFromStep();
  }

  function save() {
    localStorage.setItem(LS.energy, String(state.energy));
    localStorage.setItem(LS.world, String(state.world));
    localStorage.setItem(LS.step, String(state.step));
  }

  function render() {
    energyEl.textContent = String(state.energy);
    worldEl.textContent = String(state.world);
  }

  function setPop(text, ms=1400){
    pop.textContent = text;
    stage.classList.add("pop");
    clearTimeout(setPop._t);
    setPop._t = setTimeout(() => stage.classList.remove("pop"), ms);
  }

  function setStage(mode){
    stage.classList.remove("idle","armed","event");
    stage.classList.add(mode);
  }

  function applyStageFromStep(){
    if (state.step === 0){
      setStage("idle");
      subtitle.textContent = "Nuovo compito: fai 2 foto (inizio + fine).";
    } else if (state.step === 1){
      setStage("armed");
      subtitle.textContent = "Foto 1 presa. Ora fai la foto finale.";
    } else {
      setStage("idle");
    }
  }

  // ---- ANIMAZIONI “VERAMENTE VISIBILI” (JS) ----
  function nudgeEyes(){
    // micro-movimenti occhi (strambi)
    const dx1 = (Math.random()*10)-5;
    const dy1 = (Math.random()*6)-3;
    const dx2 = (Math.random()*10)-5;
    const dy2 = (Math.random()*6)-3;
    $("goboP1")?.setAttribute("transform", `translate(${dx1},${dy1})`);
    $("goboP2")?.setAttribute("transform", `translate(${dx2},${dy2})`);

    const s1 = 1 + (Math.random()*0.12);
    const s2 = 1 + (Math.random()*0.12);
    flEyeBig.setAttribute("transform", `scale(${s1})`);
    flEyeSmall.setAttribute("transform", `scale(${s2})`);
  }

  function waveArms(){
    // braccia “molle”
    const a = (Math.random()*10)-5;
    const b = (Math.random()*12)-6;
    goboArmL.setAttribute("transform", `rotate(${a} 90 150)`);
    goboArmR.setAttribute("transform", `rotate(${b} 170 150)`);
  }

  // loop idle sempre attivo
  setInterval(() => {
    if(state.demoRunning) return;
    nudgeEyes();
    waveArms();
  }, 650);

  // ---- FLUSSO FOTO ----
  function onPhotoTaken(){
    if (state.step === 0){
      state.step = 1;
      setStage("armed");
      setPop("😳 Oho... qualcosa si muove...");
      subtitle.textContent = "Foto 1 presa. Ora fai la foto finale.";
      save();
      return;
    }

    if (state.step === 1){
      state.step = 0;

      // reward
      state.energy += 2;
      state.world += 1;
      render();
      save();

      // EVENTO: reazione forte + portale
      setStage("event");
      setPop("💥 BOOM! Il mondo cambia!", 1600);
      subtitle.textContent = "Bravo! Guarda cosa è cambiato.";

      // movimento “azione” (corrono verso porta)
      runToDoor().then(() => {
        // torna idle dopo un attimo
        setTimeout(() => {
          setStage("idle");
          subtitle.textContent = "Nuovo compito: fai 2 foto (inizio + fine).";
        }, 900);
      });

      return;
    }
  }

  function openCamera(){
    camera.value = "";
    camera.click();
  }

  camera.addEventListener("change", () => {
    // qui non usiamo la foto per ora, basta il trigger
    if (camera.files && camera.files.length){
      onPhotoTaken();
    }
  });

  btnSnap.addEventListener("click", () => {
    if(state.demoRunning) return;
    openCamera();
  });

  btnNew.addEventListener("click", () => {
    if(state.demoRunning) return;
    state.step = 0;
    save();
    applyStageFromStep();
    setPop("✨ Nuovo compito pronto!");
  });

  // ---- DEMO: mostra tutto senza foto ----
  btnDemo.addEventListener("click", async () => {
    if(state.demoRunning) return;
    state.demoRunning = true;

    // reset visual
    state.step = 0;
    applyStageFromStep();
    setPop("▶ Demo: guarda i personaggi!", 1200);

    await sleep(900);

    // “Foto 1” finta
    state.step = 1;
    setStage("armed");
    setPop("😬 Uh-oh... stanno tremando!", 1400);
    subtitle.textContent = "Demo: Foto 1 presa. Sta per succedere qualcosa...";
    await sleep(1500);

    // “Foto 2” finta
    state.step = 0;
    setStage("event");
    setPop("🌀 PORTALE! CORRI!", 1500);
    subtitle.textContent = "Demo: Foto 2 presa. Azione!";
    await runToDoor();

    await sleep(600);
    setStage("idle");
    subtitle.textContent = "Nuovo compito: fai 2 foto (inizio + fine).";
    state.demoRunning = false;
  });

  function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

  async function runToDoor(){
    // animazione “cartone”: saltino + scivolata verso sinistra (porta)
    const startG = {x: 0, y: 0};
    const startF = {x: 0, y: 0};

    for (let i=0; i<10; i++){
      const t = i/9;
      const x = -clamp(120*t, 0, 120); // verso sinistra
      const y = -Math.sin(t*Math.PI)*18; // saltino
      gobo.style.transform = `translate(${x}px, ${y}px) rotate(${(Math.random()*6)-3}deg)`;
      floof.style.transform = `translate(${x*0.8}px, ${y*0.8}px) rotate(${(Math.random()*6)-3}deg)`;
      waveArms();
      nudgeEyes();
      await sleep(70);
    }

    // “guarda la porta” finale
    gobo.style.transform = `translate(-120px, 0px) rotate(-2deg)`;
    floof.style.transform = `translate(-96px, 0px) rotate(2deg)`;
    await sleep(180);

    // reset transform (così non resta storto)
    gobo.style.transform = "";
    floof.style.transform = "";
    goboArmL.setAttribute("transform", "");
    goboArmR.setAttribute("transform", "");
  }

  load();
})();
