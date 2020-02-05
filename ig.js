require('dotenv').config()
const pup = require('./pup.js')
const { random, sleep } = require('./utils.js')

async function ig(opts) {
  const { account, hashtag, maxLikes } = opts
  console.log('ig scrape')

  const { browser, page } = await pup()

  await page.goto('https://instagram.com', {
    waitUntil: 'networkidle2'
  })
  await page.waitFor(random(2000, 3000))

  console.log('URL:', page.url())

  // LOGIN
  await loginInit({ account, page })

  await sleep(10000)
  process.exit(0)

  /////////////

  let data = {}
  // INSTAGRAM SCRAPE
  // get posts
  let posts = await recentHashtagList(acc, hashtag)

  // grab posts which have not been liked
  posts = posts.filter(p => !p.has_liked)
  console.log('Number of posts:', posts.length)
  console.log('Already liked:', posts.filter(p => p.has_liked).length)

  // randomizing maxcount
  const maxCount = random(
    maxLikes - Math.floor(maxLikes / random(3, 6)),
    maxLikes
  )
  console.log(`maxCount: ${maxCount}`.cyan)

  for (let i = 0; i < maxCount; i++) {
    // grab an early post randomly
    const [randomPost] = posts.splice(random(0, random(3, 6)), 1)
    console.log(`${i + 1} / ${maxCount}`)
    console.log(`https://www.instagram.com/p/${randomPost.code}/`.green)
    // super random sleep time before liking post
    await sleep(random(random(1000, 4500), random(5000, 10000)))
    await likePost(acc, randomPost)
  }

  await browser.close()
  return data
}

module.exports = ig

async function loginInit({ account, page }) {
  // select log in route
  let loginBtn = await page.$x('//a[contains(text(),"Log in")]')
  await loginBtn[0].click()
  // await instagram.page.waitForNavigation({ waitUntil: "networkidle2" });
  await page.waitFor(3000)

  // add credentials
  await page.type('input[name="username"]', account.login, {
    delay: 50
  })
  await page.waitFor(1000)
  await page.type('input[name="password"]', account.password, {
    delay: 50
  })
  await page.waitFor(1000)
  await page.click('button[type="submit"]')
  await page.waitForNavigation({ waitUntil: 'networkidle2' })
  await page.waitFor(random(2000, 3000))
}
