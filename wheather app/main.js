const API_KEY = "4117ea024cbde6e1fe4d2fc68964230f";

const getCurrentWeatherData = async () => {
  const city = "pune";
  const response = await fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&appid=" +
      API_KEY +
      "&units=metric"
  );
  return response.json();
};

const gethourlyForecast = async ({ name: city }) => {
  const response = await fetch(
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
      city +
      "&appid=" +
      API_KEY +
      "&units=metric"
  );
  const data = await response.json();
  return data.list.map((forecast) => {
    const {
      main: { temp, temp_max, temp_min },
      dt,
      dt_txt,
      weather: [{ description, icon }],
    } = forecast;
    return { temp, temp_max, temp_min, dt, dt_txt, description, icon };
  });
};

const createIconURL = (icon) =>
  "http://openweathermap.org/img/wn/" + icon + "@2x.png";

loadCurrentForecast = ({
  name,
  main: { temp, temp_max, temp_min },
  weather: [{ description }],
}) => {
  const currentForecastElement = document.querySelector("#current-forecast");
  currentForecastElement.querySelector(".city").textContent = name;
  currentForecastElement.querySelector(".temp").textContent = temp + "º";
  currentForecastElement.querySelector(".description").textContent =
    description;
  currentForecastElement.querySelector(".high-low").textContent =
    "Max-" + temp_max + "º &  " + "Min-" + temp_min + "º";
};

const loadHourlyForecast = (hourlyForecast) => {
  console.log(hourlyForecast);
  let dataFor12Hours = hourlyForecast.slice(1, 13);
  const hourlyContainer = document.querySelector(".hourly-container");
  let innerHTMLString = ``;

  for (let { temp, icon, dt_txt } of dataFor12Hours) {
    innerHTMLString += `<article>
    <h2 class="time">${dt_txt.split(" ")[1]}</h2>
    <img class="icon" src="${createIconURL(icon)}" />
    <p class="hourly-temp">${temp + "°"}</p>
    </article>`;
  }
  hourlyContainer.innerHTML = innerHTMLString;
};

const loadFeelsLike = ({ main: { feels_like } }) => {
  let container = document.querySelector("#feels-like");
  container.querySelector(".feels-like-temp").textContent = feels_like + "°";
};

const loadHumidity = ({ main: { humidity } }) => {
  let container = document.querySelector("#humidity");
  container.querySelector(".humidity_temp").textContent = humidity + "%";
};
document.addEventListener("DOMContentLoaded", async () => {
  const currentWeather = await getCurrentWeatherData();
  loadCurrentForecast(currentWeather);
  const hourlyForecast = await gethourlyForecast(currentWeather);
  loadHourlyForecast(hourlyForecast);
  loadFeelsLike(currentWeather);
  loadHumidity(currentWeather);
});
