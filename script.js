 //My api key
 const apiKey = '8c290fd559fab5640b999e58f664b55c'

 //Data from api for all functions
 let data = 0

 //User input hours (default 40, max amount of input from api)
 let userInputHours = 40

 //add event listener for userInputHours
 const intervalSelect = document.getElementById('intervalSelect')
 intervalSelect.addEventListener('change', function () {
   userInputHours = parseInt(this.value)
 })

 function callLocation() {
   const userInputSearchCity = document.getElementById(
     'userInputSearchCity'
   ).value
   //Url call to convert city name to coordinates
   const cordinatesApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${userInputSearchCity}&limit=5&appid=${apiKey}`

   fetch(cordinatesApiUrl)
     .then((response) => {
       if (!response.ok) {
         throw new Error(
           'Error: ' + response.status + ' ' + response.statusText
         )
       }
       return response.json()
     })
     .then((data) => {
       ConvertToCoordinates(data[0].lat, data[0].lon)
     })
     .catch((error) => {
       alert('An error occurred - Cant find location')
     })
 }

 function ConvertToCoordinates(lat, lon) {
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
   //Get the div in html
   const weatherDiv = document.getElementById('weather')
   //Clean weatherDiv
   weatherDiv.innerHTML = ''

   //Create topbar for weather info
   const cityName = document.createElement('h1')
   const description = document.createElement('h1')
   const gridSpace = document.createElement('div')
   const temp = document.createElement('h1')
   const wind = document.createElement('h1')

   //Add content topbar
   cityName.innerText = data.city.name
   description.innerText = 'Description'
   temp.innerText = 'Temp'
   wind.innerText = 'Wind'

   //add elements to top bar div
   weatherDiv.appendChild(cityName)
   weatherDiv.appendChild(description)
   weatherDiv.appendChild(gridSpace)
   weatherDiv.appendChild(temp)
   weatherDiv.appendChild(wind)

   for (let i = 0; i < userInputHours; i++) {
     //Create element
     const dateTime = document.createElement('h2')
     const descriptionInfo = document.createElement('h2')
     const weatherSymbol = document.createElement('img')
     const tempLoop = document.createElement('h2')
     const windLoop = document.createElement('h2')

     //Content (weatherInfo)
     dateTime.innerText = data.list[i].dt_txt
     descriptionInfo.innerText = data.list[i].weather[0].description
     weatherSymbol.src = `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png`
     tempLoop.innerText = data.list[i].main.temp + '°C'
     windLoop.innerText = data.list[i].wind.speed + 'm/s'

     //append to weatherDiv
     weatherDiv.appendChild(dateTime)
     weatherDiv.appendChild(descriptionInfo)
     weatherDiv.appendChild(weatherSymbol)
     weatherDiv.appendChild(tempLoop)
     weatherDiv.appendChild(windLoop)

     //Change color of temperature text biased on temperatures
     if (data.list[i].main.temp < 15) {
       tempLoop.style.color = 'Blue'
     } else if (
       data.list[i].main.temp <= 15 &&
       data.list[i].main.temp <= 20
     ) {
       tempLoop.style.color = 'Black'
     } else if (data.list[i].main.temp > 20) {
       tempLoop.style.color = 'Red'
     }
   }
 }