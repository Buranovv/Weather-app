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
    document.body.style.backgroundImage = `url("https://cdn.kimkim.com/files/a/content_articles/featured_photos/8ae6b5357f5cf29da8fdc119435ec36f98fa0543/original-897975b9089b200fb8c6551aa2d47365.jpg")`;
    if (condition === "Clear") {
    } else if (condition === "Rain") {
      document.body.style.backgroundImage = `url("https://www.mkgifs.com/wp-content/uploads/2022/04/havy-rain.gif")`;
    } else if (condition === "Clouds") {
      document.body.style.backgroundImage = `url("https://i.pinimg.com/originals/1e/b4/0e/1eb40e8f6c568d75f45bcb41ad97bdf9.gif")`;
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
