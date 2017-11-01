var express = require('express');
var router = express.Router();
var {SpaetKauf} = require('../models/spaetkauf');

router.get('/', (req, res) => {

  var spaetis = SpaetKauf.find({});
  Promise.resolve(spaetis).then((spaetis) => {
    console.log(spaetis);
    res.json(spaetis);
  })
  // res.send('hello world');
})

module.exports = router;
