require('colors')
const ig = require('./ig.js')
const { random, sleep } = require('./utils.js')
const fs = require('fs')

const igBot = async () => {
  const notifier = require('node-notifier')
  const db = require('./db.json')

  // check waitUntil
  if (keepWaiting(db)) {
    console.log(`waiting until: ${new Date(db.waitUntil)}`.cyan)
    return
  }

  // LETS DO THIS
  console.log('IG BOT'.yellow.bold)

  const accounts = require('./accounts.js')

  for (account of accounts) {
    const { login, password, hashtags } = account
    const hashtag = hashtags[random(0, hashtags.length - 1)]
    const { maxLikes } = db

    console.log(`${login.toUpperCase()}`.yellow.bold)
    console.log(`Hashtag: ${hashtag}`.cyan)
    await sleep(random(2000, 8000))

    // scrape hashtag with max potential likes
    const results = await ig({ account, hashtag, maxLikes })

    notifier.notify({
      title: `${login.toUpperCase()}`,
      message: `${JSON.stringify(results, null, 1)}`
    })
  }

  await updateDb(db)
  console.log('done'.yellow)
  return
}

;(async () => {
  igBot()
})()

module.exports = igBot

function keepWaiting(db) {
  return db.waitUntil > new Date().getTime()
}

async function updateDb(db) {
  // next round will need to wait atleast 8 - 36 hours
  const waitUntil =
    new Date().getTime() + random(1000 * 60 * 60 * 8, 1000 * 60 * 60 * 36)
  const timestamp = new Date(waitUntil)
  const maxLikes = db.maxLikes + random(-1, 4)
  if (maxLikes <= 0) maxLikes = 5 // just incase we are unlucky in the beginning
  // save db
  const newDb = { waitUntil, timestamp, maxLikes }
  console.log({ newDb })
  try {
    fs.writeFileSync('./db.json', JSON.stringify(newDb))
  } catch (e) {
    console.error('db save failed.', e)
    return
  }
}

//POST EXAMPLE
/*
[ {
  taken_at: 1580866256,       // new Date(post.taken_at * 1000)
  pk: '2236790737844628109',
  id: '2236790737844628109_25840842069',
  device_timestamp: '1580866106687672',
  media_type: 8,
  code: 'B8KrVM2HOqN',
  client_cache_key: 'MjIzNjc5MDczNzg0NDYyODEwOQ==.2',
  filter_type: 0,
  carousel_media_count: 2,
  carousel_media: [ [Object], [Object] ],
  can_see_insights_as_brand: false,
  user: {
    pk: 25840842069,
    username: 'styles_byerika',
    full_name: 'Erika',
    is_private: false,
    profile_pic_url: 'https://scontent-syd2-1.cdninstagram.com/v/t51.2885-19/s150x150/74902088_3015225615168683_7874779583248072704_n.jpg?_nc_ht=scontent-syd2-1.cdninstagram.com&_nc_ohc=bs85i7yTQxUAX8-EJ8T&oh=b2029e5e647fb2e4b67a3268bd206500&oe=5ED080D8',
    profile_pic_id: '2194625311476770536_25840842069',
    friendship_status: [Object],
    has_anonymous_profile_picture: false,
    is_unpublished: false,
    is_favorite: false
  },
  can_viewer_reshare: true,
  caption_is_edited: false,
  comment_likes_enabled: false,
  comment_threading_enabled: true,
  has_more_comments: false,
  max_num_visible_preview_comments: 2,
  preview_comments: [],
  can_view_more_preview_comments: false,
  comment_count: 0,
  like_count: 0,
  has_liked: false,
  likers: [],
  photo_of_you: false,
  caption: {
    pk: '17845420957941797',
    user_id: 25840842069,
    text: 'Sunset eyes 🧡 #sunset #makeup #brighteyeshadow #brightmakeup #pastels #pastelmakeup #boldmakeup #mua #makeupartist #aspiringmua #icyfantasypalette #icyfantasy #morphe #cosmetics #cosmetology #cosmetologystudent #paulmitchell #paulmitchelltheschool #pnw #wastate #kennewickwa #richlandwa #pascowa',
    type: 1,
    created_at: 1580866257,
    created_at_utc: 1580866257,
    content_type: 'comment',
    status: 'Active',
    bit_flags: 0,
    did_report_as_spam: false,
    share_enabled: false,
    user: [Object],
    media_id: '2236790737844628109'
  },
  can_viewer_save: true,
  organic_tracking_token: 'eyJ2ZXJzaW9uIjo1LCJwYXlsb2FkIjp7ImlzX2FuYWx5dGljc190cmFja2VkIjp0cnVlLCJ1dWlkIjoiNDVkZTM4MjE3MGEyNGQwMmI4Yjg2ODAyZTJiNzFiNDcyMjM2NzkwNzM3ODQ0NjI4MTA5Iiwic2VydmVyX3Rva2VuIjoiMTU4MDg2NjI3NTcyMnwyMjM2NzkwNzM3ODQ0NjI4MTA5fDg5ODkyMTMzOTV8MGE5NDc4OTU4N2YyMzYyNWM5NjE0ZjFhZWM5NWIyODYzOWE2OGEwNmFhNDRhMWIwNjYxYjVmODQ4MWQxYTFiYiJ9LCJzaWduYXR1cmUiOiIifQ==',
  comes_from: 'recent_hashtag'
}]
*/
