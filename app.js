/* ---------------------------------
   WORLDGROW — APP v2 (LIVE SCENE)
   - personaggio vivo (idle/happy)
   - porta glow al completamento
---------------------------------- */

let photoCount = 0;
let energy = 0;
let world = 0;

const btnSnap   = document.getElementById("btnSnap");
const btnReset  = document.getElementById("btnReset");
const cameraInp = document.getElementById("camera");

const statusText = document.getElementById("statusText");
const energyEl   = document.getElementById("energy");
const worldEl    = document.getElementById("world");

const scene = document.getElementById("scene");
const pop   = document.getElementById("pop");

// mostra PNG se esiste, altrimenti fallback (gestito da onerror in HTML)
const char1Img = document.getElementById("char1Img");
const char1Fallback = document.getElementById("char1Fallback");

function updateCounters(){
  energyEl.textContent = energy;
  worldEl.textContent  = world;
}

function setStatus(txt){
  statusText.textContent = txt;
}

function setSceneMood(mode){
  // mode: "idle" | "happy"
  scene.classList.remove("idle","happy");
  scene.classList.add(mode);
}

// “effetti scena” al completamento
function playGrowScene(message){
  if(pop) pop.textContent = message || "Qualcosa è cresciuto.";

  // grow + pop + door glow
  scene.classList.remove("grow","pop","door");
  void scene.offsetWidth;
  scene.classList.add("grow","pop","door");

  setTimeout(()=>{
    scene.classList.remove("grow","pop","door");
  },1300);
}

function ensureCharacterVisible(){
  // se l'immagine non è in errore, mostriamo PNG
  // (onerror in HTML nasconde lui e mostra fallback)
  if(char1Img && !char1Img.classList.contains("hidden")){
    // ok
  } else if(char1Fallback && !char1Fallback.classList.contains("hidden")){
    // ok
  } else {
    // se nessuno è visibile, abilita fallback
    if(char1Fallback) char1Fallback.classList.remove("hidden");
  }
}

/* -------------------------------
   FOTO
-------------------------------- */

btnSnap.addEventListener("click", ()=>{
  cameraInp.click();
});

cameraInp.addEventListener("change", ()=>{
  if(!cameraInp.files || !cameraInp.files[0]) return;

  photoCount++;
  energy += 1;
  updateCounters();

  ensureCharacterVisible();

  if(photoCount === 1){
    setStatus("Foto 1 presa. Vai tranquillo, poi fai la foto finale.");
    setSceneMood("idle");
  }

  if(photoCount >= 2){
    // COMPITO FINITO
    world += 1;
    updateCounters();

    setStatus("Compito finito. Il mondo cambia.");
    setSceneMood("happy");
    playGrowScene("Qualcosa è cresciuto.");

    // torna idle dopo un attimo
    setTimeout(()=> setSceneMood("idle"), 2000);

    // reset per prossimo compito
    photoCount = 0;
    cameraInp.value = "";
  }
});

/* -------------------------------
   RESET
-------------------------------- */

btnReset.addEventListener("click", ()=>{
  photoCount = 0;
  setStatus("Nuovo compito: fai 2 foto (inizio + fine).");
  cameraInp.value = "";
  setSceneMood("idle");
});

/* -------------------------------
   INIT
-------------------------------- */

updateCounters();
setStatus("Nuovo compito: fai 2 foto (inizio + fine).");
setSceneMood("idle");
ensureCharacterVisible();
