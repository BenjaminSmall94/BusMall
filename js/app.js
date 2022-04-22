'use strict';

// ******* Global Variables *********


const beenSeen = [];
let products = [];
let randomIndices = [];
let totalVotingRounds = 25;
let currentVotingRounds = totalVotingRounds;
let prevNumOfPics = 0;
let numOfPics = 3;
let myChart;

// ******* DOM References ***********

const roundsRemainingEl = document.getElementById('rounds-remaining');
const resultsButton = document.getElementById('btn');
const resultsContainer = document.getElementById('results-container');
const form = document.getElementById('round-info');
const ctx = document.getElementById('chart-holder');
const imgContainer = document.getElementById('img-container');
let imageElements = createImageElements();

// ******** Local Storage ***********

let retrievedProducts = localStorage.getItem('products');
let parsedProducts = JSON.parse(retrievedProducts);

// ************ Main ****************

if(retrievedProducts) {
  products = parsedProducts;
} else {
  fillProductArray();
}
roundsRemainingEl.textContent = currentVotingRounds;
chooseRenderPics(0);

// ************ Events **************

imgContainer.addEventListener('click', handleImgClick);
form.addEventListener('submit', resetPage);

// ************ Handlers ************

// Keeps track of which photos are clicked and viewed and then renders the next set of images. Or upon round completion gives the user a button to display the results
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
    chooseRenderPics();
  } else {
    imgContainer.innerHTML = '';
    resultsButton.addEventListener('click', handleViewResultsClick);
    form.style.display = 'none';
    resultsButton.style.display = 'flex';
  }
}

// Displays the results of the previous rounds on the page.
function handleViewResultsClick() {
  resultsButton.removeEventListener('click', handleViewResultsClick);
  resultsContainer.style.display = 'block';
  form.style.display = 'flex';
  resultsButton.style.display = 'none';
  buildFirstRow();
  buildMainDisplays();
  buildLastRow();
  localStorage.setItem('products', JSON.stringify(products));
}

// Resets the page displays and data from the current round back to its original state
function resetPage(e) {
  e.preventDefault();
  resetBeenSeen();
  updateNumRoundsAndPhotos(e);
  renderReset();
  chooseRenderPics();
}

// Allows the user to change the number or rounds or displayed photos upon form submission
function updateNumRoundsAndPhotos(e) {
  let photoNumInput = parseInt(e.target.numPics.value);
  let roundNumInput = parseInt(e.target.rounds.value);
  if(!isNaN(photoNumInput) && photoNumInput >= 2 && photoNumInput <= 9) {
    numOfPics = photoNumInput;
  }
  if(!isNaN(roundNumInput) && roundNumInput > 0) {
    totalVotingRounds = roundNumInput;
  }
  currentVotingRounds = totalVotingRounds;
}

// Resets the beenSeen array for the next round
function resetBeenSeen() {
  for(let i = 0; i < products.length; i++) {
    beenSeen[i] = false;
  }
}

// Resets all the displays on the page to their original state
function renderReset() {
  resultsContainer.innerHTML = '';
  imgContainer.innerHTML = '';
  imageElements = createImageElements();
  resultsContainer.style.display = 'none';
  roundsRemainingEl.textContent = currentVotingRounds;
  if(myChart) {
    myChart.destroy();
  }
  ctx.style.display = 'none';
}

// Builds the first row and appends it to the table container
function buildFirstRow() {
  let firstRow = document.createElement('tr');
  firstRow.className = 'firstRow';
  renderFirstRow(firstRow);
  resultsContainer.appendChild(firstRow);
}

// Renders the first row data and appends it to the row
function renderFirstRow(firstRow) {
  let nameHeader = document.createElement('th');
  let clickHeader = document.createElement('th');
  let viewHeader = document.createElement('th');
  let percentClickedHeader = document.createElement('th');
  nameHeader.textContent = 'Name';
  clickHeader.textContent = 'Clicks';
  viewHeader.textContent = 'Views';
  percentClickedHeader.textContent = 'Percent';
  firstRow.appendChild(nameHeader);
  firstRow.appendChild(clickHeader);
  firstRow.appendChild(viewHeader);
  firstRow.appendChild(percentClickedHeader);
}

// Renders the body of the table and appends it to the table container as well as constructs the Chart.js graphic
function buildMainDisplays() {
  let productNames = [];
  let productVotes = [];
  let productViews = [];
  for(let i = 0; i < products.length; i++) {
    let row = document.createElement('tr');
    renderTableBodyData(row, products[i]);
    resultsContainer.appendChild(row);
    productNames.push(products[i].productName);
    productVotes.push(products[i].clicks);
    productViews.push(products[i].views);
  }
  myChart = new Chart(ctx, new ChartObj('bar', productNames, productVotes, productViews));
  ctx.style.display = 'block';
}

// Displays the number of clicks and views for each object in rows of the table
function renderTableBodyData(row, product) {
  let productNameElem = document.createElement('th');
  let clicksElem = document.createElement('td');
  let viewsElem = document.createElement('td');
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

// Builds the last row of the table and appends it to the table container
function buildLastRow() {
  let lastRow = document.createElement('tr');
  lastRow.className = 'lastRow';
  renderLastRow(lastRow);
  resultsContainer.appendChild(lastRow);
}

// Sums up the number of total clicks and views for all objects and displays the data in the last row of the table
function renderLastRow(lastRow) {
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
  totalPercentEl.textContent = (totalClicks / totalViews * 100).toFixed(1) + '%';
  lastRow.appendChild(rowLabel);
  lastRow.appendChild(totalClicksEl);
  lastRow.appendChild(totalViewsEl);
  lastRow.appendChild(totalPercentEl);
}


// *************** Functions *****************

// Creates a specified number of img elements and returns their DOM references in an array
function createImageElements() {
  let imageElements = [];
  for(let i = 0; i < numOfPics; i++) {
    let currImage = document.createElement('img');
    imgContainer.appendChild(currImage);
    imageElements.push(currImage);
  }
  return imageElements;
}

// Chooses a specied number of random unique photos and displays them on the page
function chooseRenderPics(prev = prevNumOfPics) {
  generateIndices();
  for(let i = 0; i < numOfPics; i++) {
    imageElements[i].src = products[randomIndices[i + prev]].URL;
    imageElements[i].alt = products[randomIndices[i + prev]].productName;
    products[randomIndices[i + prev]].views++;
  }
  randomIndices = randomIndices.slice(prevNumOfPics);
  prevNumOfPics = numOfPics;
}

// Provides random unique indices corresponding to the product array, guarantees no repeats between subsequent rounds
function generateIndices() {
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
}

// Initializes Product Array with names of files to be viewed
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

// ************* Product Array Constructor ***************

function Product(name, fileExtension = '.jpg') {
  this.productName = name;
  this.URL = `img/${name}${fileExtension}`;
  this.views = 0;
  this.clicks = 0;

  products.push(this);
}

// *********** Chart Obj Constructor for Chart.js ***********

function ChartObj(type, productNames, productVotes, productViews) {
  this.type = type;
  this.data = {
    labels: productNames,
    datasets: [{
      label: 'Votes',
      data: productVotes,
      backgroundColor: [
        'white'
      ],
      borderColor: [
        'black'
      ],
      borderWidth: 1
    },
    {
      label: 'Views',
      data: productViews,
      backgroundColor: [
        'black'
      ],
      borderColor: [
        'black'
      ],
      borderWidth: 1
    }]
  };
  this.options = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
}
