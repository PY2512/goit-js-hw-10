import './css/styles.css';
import { fetchCountries } from "./fetchCountries";
import { debounce } from 'lodash';
import Notiflix from 'notiflix';

const searchBox = document.querySelector('#search-box');
const infoEl = document.querySelector('.country-info');
const countryEl = document.querySelector('.country-list')
const DEBOUNCE_DELAY = 300;

function performEl() {
    countryEl.innerHTML = '';
    infoEl.innerHTML = '';
};

searchBox.addEventListener('input', debounce(event => {
    event.preventDefault();
    if (searchBox.value) {
        const name = searchBox.value.trim();
        return fetchCountries(name).then(showCountries).catch(error);
    } else {
        performEl()
    }

}, DEBOUNCE_DELAY));

function showCountries(countries) {
    performEl()
    if (countries.length > 10) {
        return Notiflix.Notify.info('Too many matches found. Please enter a more specific name.', { timeout: 1000 })
    }
    if (countries.length >= 2) {
        markupCountries(countries);
    }
    if (countries.length === 1) {
        markupCountrie(countries);
    }
};

function markupCountries(countries) {
    const markupCountries = countries.map(({ name, flags, }) => {
        return `<li><img src="${flags.svg}" alt="Flag of ${name.official}" style="height: 1em; width: 1em"> ${name.official}</li>`
    }).join('');
    countryEl.innerHTML = markupCountries;
};

function markupCountrie(countries) {
    countries.map(({ name, capital, population, flags, languages }) => {
        const markup =
            `<h1 style="
            display: flex;
            justify-content: center;
            align-items: flex-start;
            flex-direction: column;
            align-content: flex-start;
            flex-wrap: nowrap;
        "><img src="${flags.svg}" alt="Flag of ${name.official}" style="height: 4em; width: 7em; margin-right:10px;">${name.official}</h1>
        <li>Capital: ${capital}</li>
        <li>Population: ${population}</li>
        <li>Languages: ${Object.values(languages)}</li>`;
        infoEl.innerHTML = markup;
    })

}

function error() {
    return Notiflix.Notify.failure('Oops, there is no country with that name', { timeout: 1000 });
};