require('dotenv').config()

module.exports = [
  {
    login: process.env.ACCOUNT1,
    password: process.env.PASS1,
    hashtags: ['beauty', 'cosmetics', 'vanity', 'makeup', 'makeupideas'],
  },
  {
    login: process.env.ACCOUNT2,
    password: process.env.PASS2,
    hashtags: ['beauty', 'cosmetics', 'vanity', 'makeup', 'makeupideas'],
  },
]
