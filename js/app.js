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

/*Events/Handlers
    Image Selection Listeners
    Button Listener

    Track Image Stats and create three more random photos
*/

/*Functions
    Randomly Generate Three Images
    Display Randomly Selected Images
*/
