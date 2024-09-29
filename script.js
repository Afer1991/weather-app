const form = document.querySelector("form");
const input = document.getElementById("city");
const content = document.getElementById("content");
let celsius = false;
let currentInput;

const fetchWeatherData = async (location) => {
  try {
    const res = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=NMYVKGRNDCRUPXVBFYYXS86SR`);
    const data = await res.json();
    clearContent();
    renderContent(returnWeatherInfo(data).location, returnWeatherInfo(data).conditions, returnWeatherInfo(data).temp, returnWeatherInfo(data).feelsLike, returnWeatherInfo(data).humidity, returnWeatherInfo(data).wind);
    currentInput = location;
  } catch {
    alert("Location not found");
  };
};

function returnWeatherInfo(data) {
  const location = data.resolvedAddress;
  const conditions = data.currentConditions.conditions;
  const temp = data.currentConditions.temp;
  const feelsLike = data.currentConditions.feelslike;
  const humidity = data.currentConditions.humidity;
  const wind = data.currentConditions.windspeed;

  return { location, conditions, temp, feelsLike, humidity, wind };
};

const convertToF = (F) => {
  const C = Math.round((F - 32) * 5/9);
  return C;
};

const clearContent = () => {
  while (content.hasChildNodes()) {
    content.removeChild(content.firstChild); 
  };
};

const renderContent = (loc, cond, tp, flk, hmdt, wnd ) => {
  const container = document.createElement("div");
  container.classList.add("container");
  content.appendChild(container);

  const divider = document.createElement("div");
  divider.classList.add("divider");
  container.appendChild(divider);

  const location = document.createElement("div");
  location.classList.add("location");
  divider.appendChild(location);

  const para1 = document.createElement("p");
  para1.textContent = `${loc}`;
  location.appendChild(para1);

  const para2 = document.createElement("p");
  para2.textContent = `${cond}`;
  location.appendChild(para2);

  const conditions = document.createElement("div");
  conditions.classList.add("conditions");
  divider.appendChild(conditions);

  const temp = document.createElement("div");
  temp.classList.add("temp");
  conditions.appendChild(temp);

  const para3 = document.createElement("p");
  para3.textContent = `${ celsius ? convertToF(tp) + " °C": tp + " °F"}`;
  temp.appendChild(para3);

  const stats = document.createElement("div");
  stats.classList.add("stats");
  conditions.appendChild(stats);

  const para4 = document.createElement("p");
  para4.textContent = `Feels Like: ${ celsius ? convertToF(flk) + " °C" : flk + " °F"}`;
  stats.appendChild(para4);

  const para5 = document.createElement("p");
  para5.textContent = `Humidity: ${hmdt}%`;
  stats.appendChild(para5);

  const para6 = document.createElement("p");
  para6.textContent = `Wind: ${celsius ? Math.round(wnd * 1.60934) + " km/h" : wnd + " mph"}`;
  stats.appendChild(para6);

  const btnContainer = document.createElement("div");
  btnContainer.classList.add("btn-container");
  content.appendChild(btnContainer);

  const switchBtn = document.createElement("button");
  switchBtn.textContent = `${celsius ? "°F" : "°C"}`;
  btnContainer.appendChild(switchBtn);

  switchBtn.addEventListener("click", switchUnits);
};

const switchUnits = () => {
  if (celsius) {
    celsius = false;
  } else {
    celsius = true;
  }
 
  fetchWeatherData(currentInput);
};


form.addEventListener("submit", (e) => {
  e.preventDefault();
  fetchWeatherData(input.value);
  form.reset();
});

