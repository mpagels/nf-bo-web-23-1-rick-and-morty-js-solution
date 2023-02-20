import { createCharacterCard } from "./components/card/card.js";

const cardContainer = document.querySelector('[data-js="card-container"]');
const searchBarContainer = document.querySelector(
  '[data-js="search-bar-container"]'
);
const searchBar = document.querySelector('[data-js="search-bar"]');
const navigation = document.querySelector('[data-js="navigation"]');
const prevButton = document.querySelector('[data-js="button-prev"]');
const nextButton = document.querySelector('[data-js="button-next"]');
const pagination = document.querySelector('[data-js="pagination"]');

nextButton.addEventListener("click", handleNextClick);
prevButton.addEventListener("click", handlePrevClick);

// States
let maxPage = 1;
let page = 1;
const searchQuery = "";

// Constants
const CHARACTERS_ENDPOINT = "https://rickandmortyapi.com/api/character/";

let characters = [];

// render characters on load

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
renderCharacters();

// fetch characters

async function fetchCharacters() {
  try {
    const response = await fetch(`${CHARACTERS_ENDPOINT}?page=${page}`);
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

fetchCharacters();
