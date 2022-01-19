var options = {
  weekday: "long",
  month: "long",
  day: "numeric",
};

const body = document.getElementById("body");
const searchBtn = document.getElementById("search");
const input = document.getElementById("inputsearch");
const cityCountry = document.getElementById("cityCountry");
const todayBtn = document.getElementById("today");
const nextFiveDaysBtn = document.getElementById("nextFiveDays");
const content = document.getElementById("content");
const values = [
  1.7138922996503343, -0.06991558547416332, -1.9226562627185988,
  1.0274127697679525, 1.3605242113163971, -1.7999009599620255,
  -1.249141253860098, -1.5288953131023453, 1.746312025781691,
];

const search = (query) => {
  fetch(
    `https://api.weatherapi.com/v1/current.json?key=2c1686eb401344239a0130331221901&q=${query}&aqi=no`
  )
    .then((res) => {
      input.value = "";
      return res.json();
    })
    .then((data) => {
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=c1a5363ae07a2ba4ee2be66ec99de005`
      )
        .then((result) => {
          return result.json();
        })
        .then((dt) => {
          const difference = (10800 - dt.city.timezone) / 3600;
          let today = new Date(new Date().getTime() - difference * 3600000);
          today = new Date(today.setHours(today.getHours() + 24));
          let minutes = new Date().toLocaleString();
          seconds = new Date(minutes).getTime() / 1000;

          cityCountry.innerText =
            data.location.name + ", " + data.location.country;

          const sunrise = dt.city.sunrise;
          const sunset = dt.city.sunset;
          seconds < sunrise || seconds > sunset
            ? (body.style.background =
                "linear-gradient(5deg, darkblue, rgba(50, 70, 100)) fixed")
            : (body.style.background =
                "linear-gradient(5deg, rgba(100, 100, 256), white) fixed");

          const todayBtnFunc = () => {
            let child = '<div class="hours">';
            dt["list"].slice(0, 9).forEach((hour, index) => {
              const time =
                new Date(hour["dt"] * 1000 - difference * 3600000).getHours() +
                ":00";
              const feelsLikeToday = Math.round(
                data.current.feelslike_c + values[index]
              );
              const cloudsToday = hour.clouds.all;
              let date = new Date(hour["dt"] * 1000 - difference * 3600000)
                .toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "2-digit",
                  year: "numeric",
                })
                .split("/");
              if (date[1].length == 1) date[1] = "0" + date[1];

              child += `<div class="hour"><div class="timeToday"><h3 style="margin: auto">${time}</h3> <p style="margin: auto">${date[1]}.${date[0]}.${date[2]}</p></div> <div class="temperatureToday"><p style="margin: auto">${feelsLikeToday}°C</p></div> <div class="cloudsToday">`;
              if (cloudsToday < 33) {
                child +=
                  "<img src='https://img.icons8.com/color/50/000000/summer--v1.png'/>";
              } else if (cloudsToday < 66) {
                child +=
                  "<img src='https://img.icons8.com/color/48/000000/partly-cloudy-day--v1.png'/>";
              } else {
                child +=
                  "<img src='https://img.icons8.com/color/50/000000/cloud.png'/>";
              }
              child += "</div></div>";
              if (index == 8) {
                content.innerHTML = child + "</div>";
              }
            });
          };
          todayBtn.addEventListener("click", function () {
            setTimeout(() => {
              todayBtnFunc();
            }, 100);
          });

          todayBtnFunc();
          const nextFiveDaysBtnFunc = () => {
            let child = '<div class="5days">';
            dt.list.forEach((day, index) => {
              if (index % 8 === 0) {
                const clouds = day.clouds.all;
                child += '<div class="day">';
                child += `<div class="time"><h3 style="margin: auto">${
                  new Date(day.dt * 1000).getDate() === new Date().getDate()
                    ? `Today`
                    : day.dt_txt.split(" ")[0].split("-").reverse().join(".")
                } </h3></div><div class="temperature"><p style="margin: auto">${Math.round(
                  data.current.feelslike_c + values[index / 8 + 2]
                )}°C</p></div> <div class="clouds">`;

                if (clouds < 33) {
                  child +=
                    "<img src='https://img.icons8.com/color/50/000000/summer--v1.png'/>";
                } else if (clouds < 66) {
                  child +=
                    "<img src='https://img.icons8.com/color/48/000000/partly-cloudy-day--v1.png'/>";
                } else {
                  child +=
                    "<img src='https://img.icons8.com/color/50/000000/cloud.png'/>";
                }
                child += "</div></div>";
              }
            });
            content.innerHTML = child + "</div>";
          };
          nextFiveDaysBtn.addEventListener("click", function () {
            setTimeout(() => {
              nextFiveDaysBtnFunc();
            }, 100);
          });
        });
    });
};

search("sofia");

searchBtn.addEventListener("click", function (e) {
  e.preventDefault();
  setTimeout(() => {
    search(input.value);
  }, 1200);
});
