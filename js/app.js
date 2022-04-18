'use strict';

// ******* Global Variables *********

let products = [];
let randomIndices = [];
let votingRounds = 25;

// ******* DOM References ***********



// ************ Main ****************

fillProductArray;
randomIndices = generateIndices(3);

/*Events/Handlers
Image Selection Listeners
Button Listener

Track Image Stats and create three more random photos
*/

// Functions

function generateIndices(numOfPics) {
  for(let i = 0; i < numOfPics; i++) {
    let randomIndex = randomInRange(0, products.length - 1);
    while(randomIndices.contains(randomIndex)) {
      randomIndex = randomInRange(0, products.length - 1);
    }
    randomIndices.push(randomIndex);
  }
  return randomIndices;
}

function renderPics() {

}

function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Product(name, fileExtension = '.jpg') {
  this.productName = name;
  this.URL = `img/${name}${fileExtension}`;
  this.views = 0;
  this.clicks = 0;

  products.push(this);
}

function fillProductArray() {
  let productNames = ['bag', 'banana', 'bathroom', 'boots', 'breakfast', 'bubblegum', 'chair', 'cthulhu', 'dog-dock', 'dragon', 'pen', 'pet-sweep', 'scissors', 'shark', 'sweep', 'tauntaun', 'unicorn', 'water-can', 'wineglass'];
  for(let i = 0; i < productNames.length; i++) {
    if(i !== 14) {
      new Product(productNames[i]);
    } else {
      new Product(productNames[i], 'png');
    }
  }
}
