import L, { DomUtil, popup, tileLayer } from 'leaflet';
import { ZOOM_LEVEL } from '../config';
import Place from './markerView';

class MapView {
  #mapEvent;
  #map;
  #parentEl = document.querySelector('.container-map');
  searchForm = document.querySelector('.search');
  containerMark = document.querySelector('.input__container');
  inputLocation = document.querySelector('.input__location');
  inputPlaceInfo = document.querySelector('.input__note');

  addHandlerRender(handler) {
    this.searchForm.addEventListener('submit', function (e) {
      e.preventDefault();

      handler();
    });
  }

  getQuery() {
    const query = this.inputLocation.value;
    this.clearInputField();
    return query;
  }

  clearInputField() {
    this.inputLocation.value = '';
  }

  createDiv() {
    const div = document.createElement('div');
    div.setAttribute('id', 'map');
    this.#parentEl.prepend(div);
  }

  clearContainer() {
    this.#parentEl.innerHTML = '';
  }

  renderDefaultMap(coords) {
    this.renderMap(coords);
  }

  focus() {
    this.inputLocation.focus();
  }

  getPositionAndRenderMap() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        this.renderDefaultMap([latitude, longitude]);
      },
      () => {
        new Error('Could not found Location');
      }
    );
  }

  renderMap(coords) {
    this.focus();

    document.querySelector('.input__container').classList.add('hidden');

    this.clearContainer();
    this.createDiv();

    this.#map = L.map('map').setView(coords, ZOOM_LEVEL);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    //Listen click event on map
    this.#map.on('click', (mapEv) => {
      this.#mapEvent = mapEv;
      this.displayForm();
      document.querySelector('.input__note').focus();
    });

    return this.#map;
  }

  displayForm() {
    this.containerMark.classList.remove('hidden');
  }

  hideForm() {
    this.containerMark.classList.add('hidden');
  }

  renderError() {
    this.clearMapContainer();
    const html = `<p style="text-align:center">Invalid Location! Please try other one.</p>`;
    this.#parentEl.innerHTML = html;
  }

  renderSpinner() {
    const spinner = `
    <div class="spinner-border text-dark" role="status">
    <span class="visually-hidden">Loading...</span>
    </div>`;

    this.#parentEl.insertAdjacentHTML('afterbegin', spinner);
  }

  renderPlaceMarker(place) {
    L.marker(place.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 200,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: 'place__popup',
          keepInView: true,
        })
      )
      .setPopupContent(`${place.place}`)
      .openPopup();
  }

  addHandlerRenderMarker(handler) {
    document.querySelector('.form__mark').addEventListener('submit', (e) => {
      e.preventDefault();

      //Read input
      const inputPlace = this.inputPlaceInfo.value;
      if (!inputPlace) return;

      //Create new place object
      const place = new Place(inputPlace, this.#mapEvent.latlng);

      this.renderPlaceMarker(place);
      handler(place);

      //clear
      this.inputPlaceInfo.value = '';

      //hide form
      this.hideForm();
    });
  }

  backspace() {
    document.addEventListener('keydown', (e) => {
      e.key === 'Escape' && !this.containerMark.classList.contains('hidden')
        ? this.hideForm()
        : '';
    });
  }
}

export default new MapView();
