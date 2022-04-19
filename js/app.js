'use strict';

// ******* Global Variables *********

const products = [];
const numOfPics = 3;
const beenSeen = [];
const totalVotingRounds = 5;
let currentVotingRounds = totalVotingRounds;

// ******* DOM References ***********

const imgContainer = document.getElementById('img-container');
const imageElements = createImageElements(numOfPics);
const roundsRemainingEl = document.getElementById('rounds-remaining');
const resultsButton = document.getElementById('btn');
const resultsContainer = document.getElementById('results-container');

// ************ Main ****************

roundsRemainingEl.textContent = currentVotingRounds;
resultsButton.style.display = 'none';
fillProductArray();
renderPics(numOfPics);

// ************ Events **************

imgContainer.addEventListener('click', handleImgClick);

// ************ Handlers ************

function handleImgClick(e) {
  let productName = e.target.alt;
  for(let i = 0; i < products.length; i++) {
    if(productName === products[i].productName) {
      products[i].clicks++;
      break;
    }
  }
  roundsRemainingEl.textContent = --currentVotingRounds;
  if(currentVotingRounds !== 0) {
    renderPics(numOfPics);
  } else {
    hidePics();
    imgContainer.removeEventListener('click', handleImgClick);
    resultsButton.addEventListener('click', handleButtonClick);
    resultsButton.style.display = 'Flex';
    resultsButton.textContent = 'View Results';
  }
}

function handleButtonClick() {
  resultsButton.removeEventListener('click', handleButtonClick);
  resultsButton.textContent = 'Reset';
  let firstRow = document.createElement("tr");
  firstRow.className = 'firstRow';
  buildFirstRow(firstRow);
  resultsContainer.appendChild(firstRow);
  for(let i = 0; i < products.length; i++) {
    let row = document.createElement('tr');
    buildBodyRow(row, products[i]);
    resultsContainer.appendChild(row);
  }
  let lastRow = document.createElement("tr");
  lastRow.className = 'lastRow';
  buildLastRow(lastRow);
  resultsContainer.appendChild(lastRow);
  resultsButton.addEventListener('click', reset);
}

function reset() {
  resultsButton.removeEventListener('click', reset);
  resetData();
  resetPage();
  unhidePics();
  renderPics(numOfPics);
  imgContainer.addEventListener('click', handleImgClick);
}

function resetData() {
  currentVotingRounds = totalVotingRounds;
  for(let i = 0; i < products.length; i++) {
    products[i].views = 0;
    products[i].clicks = 0;
    beenSeen[i] = false;
  }
}

function resetPage() {
  resultsButton.style.display = 'none';
  resultsContainer.innerHTML = '';
  roundsRemainingEl.textContent = currentVotingRounds;
}

function buildBodyRow(row, product) {
  let productNameElem = document.createElement("th");
  let clicksElem = document.createElement("td");
  let viewsElem = document.createElement("td");
  let percentElem = document.createElement('td');
  productNameElem.textContent = product.productName;
  clicksElem.textContent = product.clicks;
  viewsElem.textContent = product.views;
  if(product.views !== 0) {
    percentElem.textContent = `${(product.clicks / product.views * 100).toFixed(1)}%`;
  }
  row.appendChild(productNameElem);
  row.appendChild(clicksElem);
  row.appendChild(viewsElem);
  row.appendChild(percentElem);
}

function buildFirstRow(firstRow) {
  let nameHeader = document.createElement("th");
  let clickHeader = document.createElement("th");
  let viewHeader = document.createElement("th");
  let percentClickedHeader = document.createElement("th");
  nameHeader.textContent = 'Name';
  clickHeader.textContent = 'Clicks';
  viewHeader.textContent = 'Views';
  percentClickedHeader.textContent = 'Percent';
  firstRow.appendChild(nameHeader);
  firstRow.appendChild(clickHeader);
  firstRow.appendChild(viewHeader);
  firstRow.appendChild(percentClickedHeader);
}

function buildLastRow(lastRow) {
  let totalClicks = 0;
  let totalViews = 0;
  for(let i = 0; i < products.length; i++) {
    totalClicks += products[i].clicks;
    totalViews += products[i].views;
  }
  let rowLabel = document.createElement('th');
  let totalClicksEl = document.createElement('th');
  let totalViewsEl = document.createElement('th');
  let totalPercentEl = document.createElement('th');
  rowLabel.textContent = 'Total';
  totalClicksEl.textContent = totalClicks;
  totalViewsEl.textContent = totalViews;
  totalPercentEl.textContent = (totalClicks / totalViews * 100).toFixed(1);
  lastRow.appendChild(rowLabel);
  lastRow.appendChild(totalClicksEl);
  lastRow.appendChild(totalViewsEl);
  lastRow.appendChild(totalPercentEl);
}


// *************** Functions *****************

function createImageElements(numOfPics) {
  let imageElements = [];
  for(let i = 0; i < numOfPics; i++) {
    let currImage = document.createElement('img');
    imgContainer.appendChild(currImage);
    imageElements.push(currImage);
  }
  return imageElements;
}

function generateIndices(numOfPics) {
  const randomIndices = [];
  for(let i = 0; i < numOfPics; i++) {
    let randomIndex = randomInRange(0, products.length - 1);
    if(!beenSeen.includes(false)) {
      while(randomIndices.includes(randomIndex)) {
        randomIndex = randomInRange(0, products.length - 1);
      }
    } else {
      while(beenSeen[randomIndex]) {
        randomIndex = randomInRange(0, products.length - 1);
      }
      beenSeen[randomIndex] = true;
    }
    randomIndices.push(randomIndex);
  }
  return randomIndices;
}

function renderPics(numOfPics) {
  const randomIndices = generateIndices(numOfPics);
  for(let i = 0; i < imageElements.length; i++) {
    imageElements[i].src = products[randomIndices[i]].URL;
    imageElements[i].alt = products[randomIndices[i]].productName;
    products[randomIndices[i]].views++;
  }
}

function hidePics() {
  for(let i = 0; i < imageElements.length; i++) {
    imageElements[i].src = '';
    imageElements[i].alt = '';
    imageElements[i].style.display = 'none';
  }
}

function unhidePics() {
  for(let i = 0; i < imageElements.length; i++) {
    imageElements[i].style.display = 'inline';
  }
}

function Product(name, fileExtension = '.jpg') {
  this.productName = name;
  this.URL = `img/${name}${fileExtension}`;
  this.views = 0;
  this.clicks = 0;

  products.push(this);
}

function fillProductArray() {
  let productNames = ['bag', 'banana', 'bathroom', 'boots', 'breakfast', 'bubblegum', 'chair', 'cthulhu', 'dog-duck', 'dragon', 'pen', 'pet-sweep', 'scissors', 'shark', 'sweep', 'tauntaun', 'unicorn', 'water-can', 'wine-glass'];
  for(let i = 0; i < productNames.length; i++) {
    beenSeen[i] = false;
    if(i !== 14) {
      new Product(productNames[i]);
    } else {
      new Product(productNames[i], '.png');
    }
  }
}

function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
