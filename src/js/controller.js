import * as model from './model';
import mapView from './views/view';

const controlSearchResults = async function () {
  try {
    //load spinner
    mapView.renderSpinner();

    //Get query eg: city
    const query = mapView.getQuery();


    if (!query) return;

    //Load City and coordinates
    await model.loadCity(query);

    //Get coordinates
    const coords = model.state.city.flatMap((el) => [el.lat, el.lon]);
    //Render map
    mapView.renderMap(coords);
  } catch (err) {
    console.error(err);
    mapView.renderError();
  }
};

const controlDefaultMap = function () {
  //Render Default map
  mapView.getPositionAndRenderMap();
};

const controlMarker = function (place) {
  model.storePlaces(place);
};

const controlBackspace = function () {
  mapView.backspace();
};


//This function will start Program first
const init = function () {
  mapView.addHandlerRender(controlSearchResults);
  //Render Default map based on coords of device
  controlDefaultMap();
  mapView.addHandlerRenderMarker(controlMarker);
  controlBackspace();
};
init();

