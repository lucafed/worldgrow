/* ---------------------------------
   WORLDGROW — APP v1
   logica semplice, rituale chiaro
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

/* -------------------------------
   UI helpers
-------------------------------- */

function updateCounters(){
  energyEl.textContent = energy;
  worldEl.textContent  = world;
}

function setStatus(txt){
  statusText.textContent = txt;
}

/* -------------------------------
   SCENA: crescita gentile
-------------------------------- */

function playGrowScene(message){
  if(!scene) return;

  if(pop){
    pop.textContent = message || "Qualcosa è cresciuto.";
  }

  scene.classList.remove("grow","pop");
  void scene.offsetWidth; // reflow
  scene.classList.add("grow","pop");

  setTimeout(()=>{
    scene.classList.remove("grow","pop");
  },1300);
}

/* -------------------------------
   LOGICA FOTO
-------------------------------- */

btnSnap.addEventListener("click", ()=>{
  cameraInp.click();
});

cameraInp.addEventListener("change", ()=>{
  if(!cameraInp.files || !cameraInp.files[0]) return;

  photoCount++;
  energy += 1;
  updateCounters();

  if(photoCount === 1){
    setStatus("Foto 1 presa. Vai tranquillo, poi fai la foto finale.");
  }

  if(photoCount >= 2){
    // COMPITO FINITO
    world += 1;
    updateCounters();

    setStatus("Compito finito. Il mondo cambia.");
    playGrowScene("Qualcosa è cresciuto.");

    // reset automatico per prossimo compito
    photoCount = 0;
    cameraInp.value = "";
  }
});

/* -------------------------------
   RESET MANUALE
-------------------------------- */

btnReset.addEventListener("click", ()=>{
  photoCount = 0;
  setStatus("Nuovo compito: fai 2 foto (inizio + fine).");
  cameraInp.value = "";
});

/* -------------------------------
   INIT
-------------------------------- */

updateCounters();
setStatus("Nuovo compito: fai 2 foto (inizio + fine).");
