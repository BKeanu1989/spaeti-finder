var axios = require('axios');

Vue.component('my-spaeti', {
  props: ['spaetkauf'],
  template: `<div class="single_spaetkauf">

    <a v-bind:href="\'/spaetkauf/\' + spaetkauf.title" target="_blank">
      {{ spaetkauf.name }}
    </a>
    <table>
    <tr>
      <td>Bezirk:</td><td>{{ spaetkauf.district }} </td>
      </tr>
      <tr>
        <td>Adresse:</td><td>{{ spaetkauf.address.street }} {{spaetkauf.address.street_number}}</td>
      </tr>
      <tr>
        <td></td><td>{{ spaetkauf.address.postalCode }} </td>
      </tr>
    </table>
  </div>`
})

Vue.component('my-test', {template: `<div>test</div>`})

Vue.component('google-map', {
  props: ['name'],
  template: `
  <div class="wrapper">
    <div class="google-map" :id="mapName"></div>
  </div>`,
  data: function() {
    return {
      mapName: this.name + "-map",
      markerCoordinates: [
        {
          latitude: 51.501527,
          longitude: -0.1921837
        }, {
          latitude: 51.505874,
          longitude: -0.1838486
        }, {
          latitude: 51.4998973,
          longitude: -0.202432
        }
      ]
    }
  },
  mounted: function() {
    const element = document.getElementById(this.mapName);
    const options = {
      zoom: 14,
      center: new google.maps.LatLng(51.501527, -0.1921837)
    };
    const map = new google.maps.Map(element, options);
    this.markerCoordinates.forEach((coord) => {
      const position = new google.maps.LatLng(coord.latitude, coord.longitude);
      const marker = new google.maps.Marker({position, map});
    });
  }
})

var app = new Vue({
  el: '#vue',
  data: {
    spaetKaufs: [
      {
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
    ]
  },
  mounted() {
    axios.get('/json').then((response) => {
      console.log("from within");
      console.log(response);

      console.log("response data", response.data);
      this.spaetKaufs = response.data;
      // window["app"]["spaetKaufs"] = response;

    }).catch(function(error) {
      console.log(error);
    });
  }
})

app.message = "ttt";
