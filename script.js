 //My api key from  Openweathermap.org
 const apiKey = '8c290fd559fab5640b999e58f664b55c'

 //GlobalData from api for all functions
 let data = 0

 //User input hours (default 40, the max amount of input from api)
 let userInputHours = 40

 //add event listener for userInputHours
 const intervalSelect = document.getElementById('intervalSelect')
 intervalSelect.addEventListener('change', function () {
   userInputHours = parseInt(this.value)
 })

// function to convert city name to coordinates
function convertCityNameToLatLon() {
  const userInputSearchCity = document.getElementById('userInputSearchCity').value;
  const coordinatesApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${userInputSearchCity}&limit=5&appid=${apiKey}`;

  fetch(coordinatesApiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          'Error: ' + response.status + ' ' + response.statusText
        );
      }
      return response.json();
    })
    .then((data) => {
      if (data.length > 0) {
        callLocationFromApi(data[0].lat, data[0].lon);
      } else {
        throw new Error('No location found for the given city.');
      }
    })
    .catch((error) => {
      if (error.message.includes('TypeError')) {
        alert('Input a valid location.');
      } else {
        alert('Something went wrong. Please try again later.');
      }
    });
}


//Function return weather information from api.
 function callLocationFromApi(lat, lon) {
   //Url for weather in lat & lon, output in metric
   const weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`

   fetch(weatherApiUrl)
     .then((response) => {
       if (!response.ok) {
         throw new Error(
           'Error: ' + response.status + ' ' + response.statusText
         )
       }
       return response.json()
     })
     .then((fetchedData) => {
       //To add this to global variable
       data = fetchedData
       displayInfo()
     })
     .catch((error) => {
       alert('An error occurred - Cant show location')
     })
 }

 function displayInfo() {
   //Get the div from html
   const weatherDiv = document.getElementById('weather')
   //Clean weatherDiv
   weatherDiv.innerHTML = ''

   //Create topBar for weather info
   const cityName = document.createElement('h1')
   const description = document.createElement('h1')
   const gridSpace = document.createElement('div')
   const tempText = document.createElement('h1')
   const windText = document.createElement('h1')

   //Add content topBar
   cityName.innerText = data.city.name
   description.innerText = 'Description'
   tempText.innerText = 'Temp'
   windText.innerText = 'Wind'

   //append to topBar
   weatherDiv.appendChild(cityName)
   weatherDiv.appendChild(description)
   weatherDiv.appendChild(gridSpace)
   weatherDiv.appendChild(tempText)
   weatherDiv.appendChild(windText)

   //ForLoop display all the weatherInfo
   for (let i = 0; i < userInputHours; i++) {
     //Create element
     const dateTime = document.createElement('h2')
     const descriptionInfo = document.createElement('h2')
     const weatherSymbol = document.createElement('img')
     const temp = document.createElement('h2')
     const wind = document.createElement('h2')

     //Content (weatherInfo)
     dateTime.innerText = data.list[i].dt_txt
     descriptionInfo.innerText = data.list[i].weather[0].description
     weatherSymbol.src = `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png`
     temp.innerText = data.list[i].main.temp + '°C'
     wind.innerText = data.list[i].wind.speed + 'm/s'

     //append to weatherDiv
     weatherDiv.appendChild(dateTime)
     weatherDiv.appendChild(descriptionInfo)
     weatherDiv.appendChild(weatherSymbol)
     weatherDiv.appendChild(temp)
     weatherDiv.appendChild(wind)

     //Change color of temperature text biased on temperatures
     if (data.list[i].main.temp < 15) {
       temp.style.color = 'Blue'
     } else if (
       data.list[i].main.temp <= 15 &&
       data.list[i].main.temp <= 20
     ) {
       temp.style.color = 'Black'
     } else if (data.list[i].main.temp > 20) {
       temp.style.color = 'Red'
     }
   }
 }