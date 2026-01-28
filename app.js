const stage = document.getElementById("stage");
const energyEl = document.getElementById("energy");
const worldEl = document.getElementById("world");
const msg = document.getElementById("msg");
const pop = document.getElementById("pop");

const cam = document.getElementById("camera");
const btnSnap = document.getElementById("btnSnap");
const btnReset = document.getElementById("btnReset");
const btnDemo = document.getElementById("btnDemo");

let photos = 0;
let energy = 0;
let world = 0;

function update(){
  energyEl.textContent = energy;
  worldEl.textContent = world;
}

function say(text){
  pop.textContent = text;
  pop.classList.add("show");
  setTimeout(()=>pop.classList.remove("show"),1400);
}

btnSnap.onclick = ()=>cam.click();

cam.onchange = ()=>{
  if(!cam.files.length) return;
  photos++;
  energy+=2;

  if(photos===1){
    stage.classList.add("armed");
    msg.textContent="Qualcosa si muove...";
    say("Ti hanno visto.");
  }
  if(photos===2){
    photos=0;
    world++;
    stage.classList.remove("armed");
    stage.classList.add("event");
    msg.textContent="È successo qualcosa.";
    say("La porta reagisce.");
    setTimeout(()=>stage.classList.remove("event"),2000);
  }
  update();
  cam.value="";
};

btnReset.onclick=()=>{
  photos=0;
  stage.classList.remove("armed","event");
  msg.textContent="Nuovo compito.";
};

btnDemo.onclick=()=>{
  cam.onchange({files:[1]});
  setTimeout(()=>cam.onchange({files:[1]}),800);
};

update();
