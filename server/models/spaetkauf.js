var mongoose = require('mongoose');
mongoose.set('debug', true);
var spaetKaufSchema = new mongoose.Schema({
  title: {
    type: String
  },
  createdAt: {
    type: Date
  },
  name: {
    type: String,
    required: true
  },
  address: {
    street: {
      type: String,
      required: true
    },
    postalcode: {
      type: Number,
      required: true
    }
  }

});

var SpaetKauf = mongoose.model('SpaetKauf', spaetKaufSchema);

module.exports = {
  SpaetKauf
};
