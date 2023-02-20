import { createCharacterCard } from "./components/card/card.js";
import { createNavPagination } from "./components/nav-pagination/nav-pagination.js";
import { createSearchBar } from "./components/search-bar/search-bar.js";
import { createNavButton } from "./components/nav-button/nav-button.js";

// States
let maxPage = 1;
let page = 1;
let searchQuery = "";
let characters = [];

// Constants
const CHARACTERS_ENDPOINT = "https://rickandmortyapi.com/api/character/";

const cardContainer = document.querySelector('[data-js="card-container"]');

const searchBarContainer = document.querySelector(
  '[data-js="search-bar-container"]'
);
const searchBar = createSearchBar();
searchBar.addEventListener("submit", handleSubmitSearch);
searchBarContainer.append(searchBar);

const navigation = document.querySelector('[data-js="navigation"]');
const prevButton = createNavButton("previous", handlePrevClick);
const nextButton = createNavButton("next", handleNextClick);
const pagination = createNavPagination();
navigation.append(prevButton, pagination, nextButton);

// event handlers

function handleSubmitSearch(event) {
  event.preventDefault();
  page = 1;
  searchQuery = event.target.elements.query.value;
  fetchCharacters();
}

function handleNextClick() {
  if (page < maxPage) {
    page++;
    fetchCharacters();
  }
}
function handlePrevClick() {
  if (page > 1) {
    page--;
    fetchCharacters();
  }
}

// UI update functions

function renderCharacters() {
  cardContainer.innerHTML = "";
  characters.forEach((character) => {
    const card = createCharacterCard(character);
    cardContainer.append(card);
  });
}

function renderPagination() {
  pagination.innerText = `${page} / ${maxPage}`;
}

// service functions

async function fetchCharacters() {
  try {
    const response = await fetch(
      `${CHARACTERS_ENDPOINT}?page=${page}&name=${searchQuery}`
    );
    if (response.ok) {
      const data = await response.json();
      maxPage = data.info.pages;
      characters = data.results.map((item) => {
        return {
          ...item,
          imgSrc: item.image,
          occurrences: item.episode.length,
        };
      });
      renderCharacters();
      renderPagination();
    } else {
      console.log(`HTTP request failed with error code ${response.status}`);
    }
  } catch (error) {
    console.log(error);
  }
}

// main
fetchCharacters();
