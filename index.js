const axios = require('axios')
require('dotenv').config()
const schedule = require('node-schedule')
const _ = require('lodash')
const User = require('./models/User')

const db = require('./models/db')

let emailRegExp = new RegExp(
  '(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])')

let page = parseInt(process.env.CURRENT_MACHINE_PAGES_FROM)

const getPhotos = async () => {
  await axios.get(
    `${process.env.UNSPLASH_API_BASE_URL}/photos/?client_id=${process.env.UNSPLASH_API_CLIENT_ID}&page=${page}&per_page=30`).
    then(function (response) {
      const pickedUsers = _.map(response.data,
        _.partialRight(_.pick, [
          'user.username',
          'user.bio',
          'user.portfolio_url',
          'user.first_name',
          'user.last_name',
          'user.location',
          'user.twitter_username',
          'user.instagram_username']))

      const users = _.map(pickedUsers, (element) => {
        if(element.user) {
          const emails = emailRegExp.exec(element.user.bio);
          if(emails) {
            element.user.email = emails[0];
          } else {
            element.user.email = '';
          }
        }
        return element.user
      })

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

const j = schedule.scheduleJob('*/72 * * * * *', function () {
  if (page <= process.env.CURRENT_MACHINE_PAGES_TO) {
    getPhotos()
    page += 1
  }
})
