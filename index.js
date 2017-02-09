var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
var Dispatcher = require('./dispatcher/AppDispatcher');

var Catalog = require('./components/Catalog.react');

// React tutorial https://facebook.github.io/react/docs/tutorial.html
// http://stackoverflow.com/questions/22639534/pass-props-to-parent-component-in-react-js

// Flux cheatsheet http://ricostacruz.com/cheatsheets/flux.html

// http://english.stackexchange.com/questions/147892/on-the-air-or-on-air
// var n=Math.floor(Math.random()*11);
// var k = Math.floor(Math.random()* 1000000);
// var m = String.fromCharCode(n)+k;
//
// let unique = localStorage.getItem('lsCatalog' + catalogType);
//
// if(unique === null){
//   localStorage.setItem('lsCatalog' + catalogType, m);
//   unique = m;
// }
CatalogReact = ReactDOM.render(
  <Catalog />,
  document.getElementById('react-catalog')
);

var a = 20;
