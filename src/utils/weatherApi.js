import axios from 'axios';
import NodeGeocoder from 'node-geocoder';

const options = {
    provider: 'openstreetmap',
    httpAdapter: 'https', // Use HTTPS
    timeout: 10000, // Set timeout to 10 seconds
  };

const geocoder = NodeGeocoder(options);
const MAX_RETRIES = 2

const getWeather = async (city, state, retries = 0) => {
  try {
    // Geocode the city and state to get latitude and longitude
    const geoResponse = await geocoder.geocode(`${city}, ${state}`);
    const { latitude, longitude } = geoResponse[0];

    // Get the weather grid points
    const pointsUrl = `https://api.weather.gov/points/${latitude},${longitude}`;
    const pointsResponse = await axios.get(pointsUrl, {
      headers: { 'User-Agent': 'wxbot' },
    });

    // Get the forecast URL
    const forecastUrl = pointsResponse.data.properties.forecastHourly;

    // Get the current weather
    const weatherResponse = await axios.get(forecastUrl, {
      headers: { 'User-Agent': 'wxbot' },
    });

    // Extract the current weather details
    const currentWeather = weatherResponse.data.properties.periods[0];
    console.log(`Current weather in ${city}, ${state}: ${currentWeather.temperature}° ${currentWeather.temperatureUnit}, ${currentWeather.shortForecast}`);
    return `Current weather in ${city}, ${state}: ${currentWeather.temperature}° ${currentWeather.temperatureUnit}, ${currentWeather.shortForecast}`;
  } catch (error) {
    console.error('An error occurred:', error);

    // Check if the error is a timeout and if we haven't reached the max retries
    if (error.code === 'ERR_SOCKET_CONNECTION_TIMEOUT' && retries < MAX_RETRIES) {
      console.log(`Retrying (${retries + 1}/${MAX_RETRIES})...`);
      return getWeather(city, state, retries + 1); // Recursive call with incremented retries
    }

    return 'An error occurred while fetching the weather. Please try again later.';
  }
};

export { getWeather };