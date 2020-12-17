const axios = require('axios')
require('dotenv').config()
const schedule = require('node-schedule')
const _ = require('lodash')
const User = require('./models/User');

const db = require('./models/db')

let page = parseInt(process.env.CURRENT_MACHINE_PAGES_FROM);

const getPhotos = async () => {
  await axios.get(
    `${process.env.UNSPLASH_API_BASE_URL}/photos/?client_id=${process.env.UNSPLASH_API_CLIENT_ID}&page=${page}&per_page=30`).
    then(function (response) {
      // console.log(response.data)
      // handle success
      // console.log(response.data)
      const pickedUsers = _.map(response.data,
        _.partialRight(_.pick, ['user.username']))

      const users = _.map(pickedUsers, (element) => {
        return element.user
      });

      User.collection.insertMany(users,{ ordered: false }, onBulkUsersInsert);
    }).
    catch(function (error) {
      // handle error
      console.log(error)
    })
}

function onBulkUsersInsert (err, docs) {
  if (err) {
    console.log(err)
  } else {
    console.log(docs)
    console.info('stores')
  }
}

const j = schedule.scheduleJob('*/72 * * * * *', function(){
  if(page <= process.env.CURRENT_MACHINE_PAGES_TO) {
    getPhotos()
    page += 1;
  }
});
