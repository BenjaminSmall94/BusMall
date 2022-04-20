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
form.addEventListener('submit', reset);

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
    chooseRenderPics();
  } else {
    imgContainer.innerHTML = '';
    resultsButton.addEventListener('click', handleButtonClick);
    form.style.display = 'none';
    resultsButton.style.display = 'flex';
  }
}

function handleButtonClick() {
  resultsButton.removeEventListener('click', handleButtonClick);
  resultsContainer.style.display = 'block';
  form.style.display = 'flex';
  resultsButton.style.display = 'none';
  buildFirstRow();
  buildMainDisplays();
  buildLastRow();
  localStorage.setItem('products', JSON.stringify(products));
  console.log(products);
}

function reset(e) {
  e.preventDefault();
  resetData();
  updateNums(e);
  resetPage();
  chooseRenderPics();
}

function updateNums(e) {
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

function resetData() {
  for(let i = 0; i < products.length; i++) {
    // products[i].views = 0;
    // products[i].clicks = 0;
    beenSeen[i] = false;
  }
}

function resetPage() {
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

function buildMainDisplays() {
  let productNames = [];
  let productVotes = [];
  let productViews = [];
  for(let i = 0; i < products.length; i++) {
    let row = document.createElement('tr');
    renderBodyRow(row, products[i]);
    resultsContainer.appendChild(row);
    productNames.push(products[i].productName);
    productVotes.push(products[i].clicks);
    productViews.push(products[i].views);
  }
  myChart = new Chart(ctx, new ChartObj('bar', productNames, productVotes, productViews));
  ctx.style.display = 'block';
}

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

function renderBodyRow(row, product) {
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

function buildFirstRow() {
  let firstRow = document.createElement('tr');
  firstRow.className = 'firstRow';
  renderFirstRow(firstRow);
  resultsContainer.appendChild(firstRow);
}

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

function buildLastRow() {
  let lastRow = document.createElement('tr');
  lastRow.className = 'lastRow';
  renderLastRow(lastRow);
  resultsContainer.appendChild(lastRow);
}

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

function createImageElements() {
  let imageElements = [];
  for(let i = 0; i < numOfPics; i++) {
    let currImage = document.createElement('img');
    imgContainer.appendChild(currImage);
    imageElements.push(currImage);
  }
  return imageElements;
}

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
