function getElement(element, parent = document) {
  return parent.querySelector(element);
}

const speech = new webkitSpeechRecognition();
speech.continuous = true;

const API = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = "bb135bcf8834afdbca0a43e456fe5a57";
const elCard = getElement(".card");
const elForm = getElement("#form");
const search = getElement(".search");
const mic = getElement(".mic");
const template = getElement("#template").content;

class Weather {
  changeBg(condition) {
    if (condition === "Clear") {
      document.body.style.backgroundImage = `url("../clear.jpg")`;
    } else if (condition === "Rain") {
      document.body.style.backgroundImage = `url("../havy-rain.gif")`;
    } else if (condition === "Clouds") {
      document.body.style.backgroundImage = `url("../clouds.gif")`;
    } else if (condition === "Snow") {
      document.body.style.backgroundImage = `url("https://i.gifer.com/Mhx.gif")`;
    }
  }
  renderFn(data, element, parent) {
    parent.innerHTML = null;

    const newCard = element.cloneNode(true);
    const city = getElement("#city", newCard);
    const date = getElement("#date", newCard);
    const temp = getElement("#temp", newCard);
    const windSpeed = getElement("#windSpeed", newCard);
    const main = getElement("#main", newCard);

    const dateDay = new Date().toLocaleString("en-us", { weekday: "long" });
    const dateMonth = new Date().toLocaleString("en-us", { month: "long" });
    const getDate = new Date().getDate();
    const getYear = new Date().getFullYear();

    city.textContent = data.name;
    date.textContent = `${dateDay} ${getDate} ${dateMonth} ${getYear}`;
    temp.textContent = `${data.main.temp}°c`;
    main.textContent = data.weather[0].main;
    windSpeed.textContent = `${data.wind.speed}km/h`;

    const condition = data.weather[0].main;
    weather.changeBg(condition);

    parent.appendChild(newCard);
  }

  getData(url) {
    fetch(url)
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("The city name was entered incorrectly!");
        }
        return res.json();
      })
      .then((data) => {
        weather.renderFn(data, template, elCard);
      })
      .catch((err) => {
        console.log(err);
        alert(err);
      });
  }
}

const weather = new Weather();
weather.getData(`${API}?q=tashkent&units=metric&appid=${API_KEY}`);

elForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const findCity = search.value;
  console.log(findCity);

  weather.getData(`${API}?q=${findCity}&units=metric&appid=${API_KEY}`);

  elForm.reset();
});

mic.addEventListener("click", () => {
  speech.start();

  speech.onresult = (event) => {
    const text = event.results[0][0].transcript;

    console.log(text);

    weather.getData(`${API}?q=${text}&units=metric&appId=${API_KEY}`);
    speech.stop();
  };
});
