
var axios = require('axios');

Vue.component('spaeti', {
  props: ['spaetkauf'],
  template: `<div>test</div>`
});

var app = new Vue({
  el: '#vue',
  data: {
    spaetKaufs: {
      _id: 1,
      name: 'BB Test',
      title: 'bb-test',
      district: 'Schöneberg',
      address: {
        street: "Badensche Straße",
        street_number: "50",
        postalCode: 12345
      }
    }
  }
});

axios.get('/json').then(function (response) {
  console.log(response);
}).catch(function (error) {
  console.log(error);
});

app.message = "ttt";
