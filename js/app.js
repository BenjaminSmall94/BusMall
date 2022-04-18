'use strict';

// ******* Global Variables *********

let products = [];
let votingRounds = 25;

// ******* DOM References ***********

function Product(name, fileExtension = '.jpg') {
  this.productName = name;
  this.URL = `img/${name}${fileExtension}`;
  this.views = 0;
  this.clicks = 0;

  products.push(this);
}

function fillProductArray() {
  let productNames = ['bag', 'banana', 'bathroom', 'boots', 'breakfast', 'bubblegum', 'chair', 'cthulhu', 'dog-dock', 'dragon', 'pen', 'pet-sweep', 'scissors', 'shark', 'sweep', 'tauntaun', 'unicorn', 'water-can', 'wineglass']
  for(let i = 0; i < productNames.length, i++) {
    if(i !== 14) {
      new Product(productNames[i]);
    } else {
      new Product(productNames[i], 'png');
    }
  }
}

/*Events/Handlers
    Image Selection Listeners
    Button Listener

    Track Image Stats and create three more random photos
*/

/*Functions
    Randomly Generate Three Images
    Display Randomly Selected Images
*/
