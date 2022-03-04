"use strict";

const sidenav = document.querySelector(".sidenav");
const input = document.querySelector("input");
const btn = document.querySelector(".btn");
const wind = document.querySelector(".wind");
const humidity = document.querySelector(".humidity");
const visibility = document.querySelector(".visibility");
const pressure = document.querySelector(".pressure");
const progress = document.querySelector(".progress");
const activity = document.querySelector(".activity");
const temp1 = document.querySelector(".temp");
const city = document.querySelector(".place");
const week = document.querySelector(".week");
const d = document.querySelector(".d");
const m = document.querySelector(".m");
const img = document.querySelector(".img");
const collection = document.querySelector(".collection");
const farenheit = document.querySelector(".farenheit");
const celcius = document.querySelector(".cel");
let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

//Event Listners
btn.addEventListener("click", initial);


//Functions
function closeNav() {
  sidenav.style.width = "0px";
}

function openNav() {
  if(window.innerWidth<=815)
  sidenav.style.width = "100vw";
  else
  sidenav.style.width = "30vw";

}

async function getLocation(place) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=c80431e7f167a32dc305872403d7a779`
  );
  const data = await response.json();
  // if(data.cod==='404') throw new Error(`${data.message}`);
  console.log(data);
  return data;
}
initial();

async function initial() {
  try{
  const val = input.value?input.value:'Dehradun';
 const  data=await getLocation(val);
 if(data.cod==='404') throw new Error(`${data.message}`);
  
  closeNav();
  change(data);
  displayDay();
  fiveDays(data);
  afterSearch(data);
  switchTemp(data);
  input.value = "";
  }catch(err){
  alert(err)
  input.value = "";
  closeNav();
  }
}
async function init(place) {
  console.log(place);
    const val = input.value?input.value:'Dehradun'; 
   const data=await getLocation(place);

  closeNav();
  change(data);
  displayDay();
  fiveDays(data);
  switchTemp(data);
  input.value = "";
}

async function afterSearch(data) {
  const html = `  <div class="added">
  <span>${data.city.name}</span>
  <span class="material-icons right">navigate_next</span>
</div>`;

  sidenav.insertAdjacentHTML("beforeend", html);

  document.querySelectorAll('.added').forEach((n)=>n.addEventListener('click',function(){
    console.log(n.children[0].innerText);
init(n.children[0].innerText)
    
  }))
}
async function change(data) {

  ///////////section 1 blocks
  activity.innerHTML = `${data.list[0].weather[0].main}`;


  //Display image
  img.src = `${images(data.list[0].weather[0].main)}`;


  //kelvin to celcius
  const temp = kelToCel(data.list[0].main.temp);
  temp1.innerHTML = `${temp}৹C`;
  city.innerHTML = `${data.city.name}`;

  ////////////////section 3 blocks
  visibility.innerHTML = `${data.list[0].visibility} `;
  humidity.innerHTML = `${data.list[0].main.humidity}`;
  pressure.innerHTML = `${data.list[0].main.pressure}`;
  wind.innerHTML = `${data.list[0].wind.speed}`;
  progress.style.width = `${data.list[0].main.humidity}%`;
}

function displayDay() {
  const Todaydate = new Date();
  const date = Todaydate.getDate();
  const month = Todaydate.getMonth();
  const day = Todaydate.getDay();
  week.innerHTML = `${days[day]}`;
  d.innerHTML = `${date}`;
  m.innerHTML = `${months[month]}`;
}

function switchTemp(data) {
  farenheit.addEventListener("click", function (e) {
    collection.innerHTML = "";
    fiveDays(data, e.target.dataset.set);
  });

  celcius.addEventListener("click", function (e) {
    collection.innerHTML = "";
    fiveDays(data, e.target.dataset.set);
  });
}
function images(s) {
  let image;

  if (s == "Clouds") image = "images/HeavyCloud.png";
  else if (s == "Thunderstorm") image = "images/Thunderstorm.png";
  else if (s == "Drizzle") image = "images/Shower.png";
  else if (s == "Mist") image = "images/HeavyCloud.png";
  else if (s == "Snow") image = "images/Snow.png";
  else if (s == "Rain") image = "images/LightRain.png";
  else if (s == "Clear") image = "images/Clear.png";

  return image;
}

async function fiveDays(data, deg) {
  collection.innerHTML = "";
  for (let i = 0; i < 5; i++) {
    const curr = new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * (i + 1));
    const currday = curr.getDay();
    const currMon = curr.getMonth();
    const currDate = curr.getDate();
    const tempy1 = kelToCel(data.list[i].main.temp_min);
    const tempy2 = kelToCel(data.list[i].main.temp_max);
    const tempy3 = kelToFah(data.list[i].main.temp_min);
    const tempy4 = kelToFah(data.list[i].main.temp_max);
    const image = images(data.list[i].weather[0].main);
    if (deg == "fah")
      display(
        days[currday],
        currDate,
        months[currMon],
        tempy3,
        tempy4,
        image,
        1
      );
    else
      display(
        days[currday],
        currDate,
        months[currMon],
        tempy1,
        tempy2,
        image
      );
  }
}
function display( day, date, mon, tempy1, tempy2, image, x) {
  const html = `  <div class="block">
    <div class="date">${day}, ${date} ${mon}</div>
    <img src="${image}" class="weather">
    <div class="range">
      <div class="temp1">${tempy1}${x ? "৹F" : "৹C"}</div>
      <div class="temp1">${tempy2}${x ? "৹F" : "৹C"}</div>
    </div>
  </div>`;

  collection.insertAdjacentHTML("beforeend", html);
}

function kelToCel(kel) {
  const temp = (kel - 273).toPrecision(2);
  return temp;
}

function kelToFah(kel) {
  const temp = ((9 / 5) * (kel - 273) + 32).toPrecision(2);
  return temp;
}
