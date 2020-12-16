const express = require('express');
const router = express.Router();
const axios = require('axios')

router.get('/', function(req, res, next) {
  console.log(213123)
  res.send('started')

  axios.get(`${process.env.UNSPLASH_API_BASE_URL}/photos/?client_id=${process.env.UNSPLASH_API_CLIENT_ID}`).then(function (response) {
    // handle success
    console.log(response)
  }).catch(function (error) {
    // handle error
    console.log(error)
  }).then(function () {
    // always executed
  })
});

module.exports = router;
