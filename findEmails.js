const Crawler = require('crawler')
const User = require('./models/User')
const Contact = require('./models/Contact')
const db = require('./models/db')

let emailRegExp = new RegExp(
    '(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])')

const findEmail = new Crawler({
  maxConnections: 500000,
  rateLimit: 10,

  callback: function (error, res, done) {
    if (error) {
      console.log(error)
    } else {
      const contact = {
        email: "",
        instagram: "",
        twitter: "",
        username: "",
        website: ""
      }

      if(res.request.uri.href.includes("https://unsplash.com/")) {
        const $ = res.$;
        const userBlock = $('[data-test=\'users-route\']').html();
        const emails = emailRegExp.exec(userBlock)
        if (emails) {
          contact.email = emails[0];
        } else {
          findEmail.queue(`https://unsplash.com/@${(res.options.uri.split('/@'))[1].split('/')[0]}/portfolio`)
        }
      } else {
        if (!res.request.uri.href.includes('https://unsplash.com/')) {
          if(res.request.uri.href.includes('https://www.instagram.com/')) {
            contact.instagram = res.request.uri.href;
          } else if(res.request.uri.href.includes('https://www.twitter.com/')){
            contact.twitter = res.request.uri.href;
          } else {
            contact.website = res.request.uri.href
          }
        }
      }
      contact.username = (res.options.uri.split('/@'))[1].split('/')[0];

      Contact.collection.insertOne(contact,{ ordered: false }, onContactInsert);
    }
    done()
  },
})

function onContactInsert (err, docs) {
  if (err) {
    console.log(err)
  } else {
    console.log(docs)
    console.info('stores')
  }
}

User.find({}, function (err, users) {
  users.forEach(function (user) {
    findEmail.queue(`https://unsplash.com/@${user.username}/portfolio`)
  })
})
