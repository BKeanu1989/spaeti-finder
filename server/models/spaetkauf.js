var mongoose = require('mongoose');
mongoose.set('debug', true);
var spaetKaufSchema = new mongoose.Schema({
  title: {
    type: String
  },
  createdAt: {
    type: Date
  },
  district: {
    type: String
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
  },
  position: {
    latitude: {
      type: Number
    },
    longitude: {
      type: Number
    }
  },
  open: {
    monday: {
      from: {
        type: Number
      },
      until: {
        type: Number
      }
    },
    tuesday: {
      from: {
        type: Number
      },
      until: {
        type: Number
      }
    },
    wednesday: {
      from: {
        type: Number
      },
      until: {
        type: Number
      }
    },
    thursday: {
      from: {
        type: Number
      },
      until: {
        type: Number
      }
    },
    friday: {
      from: {
        type: Number
      },
      until: {
        type: Number
      }
    },
    saturday: {
      from: {
        type: Number
      },
      until: {
        type: Number
      }
    },
    sunday: {
      from: {
        type: Number
      },
      until: {
        type: Number
      }
    }
  }

});

var SpaetKauf = mongoose.model('SpaetKauf', spaetKaufSchema);

module.exports = {
  SpaetKauf
};
