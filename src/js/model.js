import { API_KEY, API_URL_GEO } from './config';
import { getJSON } from './helpers';

export const state = {
  city: {},
  places: [],
};

const loadCity = async function (query) {
  try {
    const data = await getJSON(
      `${API_URL_GEO}${query}&limit=&appid=${API_KEY}`
    );

    state.city = data.map((city) => {
      return {
        name: city.name,
        state: city.state,
        lat: city.lat,
        lon: city.lon,
      };
    });
  } catch (err) {
    throw err;
  }
};

const storePlaces = function (place) {
  state.places.push(place);
};

export {
  loadCity,
  loadCoordinates,
  storePlaces,
  setLocalStorage,
  loadLocalStorage,
};
