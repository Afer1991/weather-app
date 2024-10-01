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
    renderContent(capFirstLetter(location), returnWeatherInfo(data).conditions, returnWeatherInfo(data).temp, returnWeatherInfo(data).feelsLike, returnWeatherInfo(data).humidity, returnWeatherInfo(data).wind);
    currentInput = location;
  } catch {
    alert("Location not found");
  };
};

function returnWeatherInfo(data) {
  const conditions = data.currentConditions.conditions;
  const temp = data.currentConditions.temp;
  const feelsLike = data.currentConditions.feelslike;
  const humidity = data.currentConditions.humidity;
  const wind = data.currentConditions.windspeed;

  return { conditions, temp, feelsLike, humidity, wind };
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

const capFirstLetter = (str) => {
  const splitArr = str.toLowerCase().split("");
  let newStr = "";
  for (i = 0; i < splitArr.length; i++) {
    if (i == 0) {
      newStr += splitArr[i].toUpperCase();
    } else {
      newStr += splitArr[i];
    }
  };
  return newStr;
};

const renderContent = (loc, cond, tp, flk, hmdt, wnd ) => {
  const container = document.createElement("div");
  container.classList.add("container");
  content.appendChild(container);

  const divider = document.createElement("div");
  divider.classList.add("divider");
  container.appendChild(divider);

  const header = document.createElement("h1");
  header.textContent = `${loc}`;
  divider.appendChild(header);

  const subheader = document.createElement("h3");
  subheader.textContent = `${cond}`;
  divider.appendChild(subheader);

  const temp = document.createElement("p");
  temp.classList.add("temp");
  temp.textContent = `${ celsius ? convertToF(tp) + " °C": tp + " °F"}`;
  divider.appendChild(temp);

  const feelsLike = document.createElement("p");
  feelsLike.textContent = `Feels Like: ${ celsius ? convertToF(flk) + " °C" : flk + " °F"}`;
  divider.appendChild(feelsLike);

  const wind = document.createElement("p");
  wind.textContent = `Wind: ${celsius ? Math.round(wnd * 1.60934) + " km/h" : wnd + " mph"}`;
  divider.appendChild(wind);

  const humidity = document.createElement("p");
  humidity.textContent = `Humidity: ${hmdt}%`;
  divider.appendChild(humidity);

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

