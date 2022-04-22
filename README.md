# BusMall

## Overview

This website simulates an online survey that a hypothetial transit company would publish in order to gain data on which products will be most popular for customers to buy from a catalog while traveling.

## Functionality

It functions by showing the user a set of photos and allowing them to choose which is their favorite. This process is repeated for a set number of rounds until complete. At this point the user has the option to view the results. When ready the user may reset the page for the next round.

In choosing the photos to display to the user, the program ensures that the photo is unique in the current set and is not repeated from the previous set.

The last level of interactivity is provided by a form element and allow the user to determine how many photos to view per set as well as the number of total rounds until complete.

## Data Display and Storage

The total data is displayed in an HTML table as well as a canvas element utilizing Chart.js. Additionally after completion of each round, the data is stored to local storage, so that even when the user leaves the page or closes the browser, the data is stored and will be reference upon the next return to the website.