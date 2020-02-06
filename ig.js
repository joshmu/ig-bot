require('dotenv').config()
const pup = require('./pup.js')
const { random, sleep } = require('./utils.js')

async function ig(opts) {
  const { account, maxLikes } = opts
  const hashtags = account.hashtags
  console.log('ig scrape')

  const { browser, page } = await pup()

  await page.goto('https://instagram.com', {
    waitUntil: 'networkidle2'
  })
  await page.waitFor(random(2000, 3000))

  console.log('URL:', page.url())

  // LOGIN
  await loginInit({ account, page })

  // LIKE TAGS
  await likeTags({ page, hashtags, maxLikes })

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

async function likeTags(opts) {
  const { page, hashtags: tags, maxLikes } = opts
  const totalLikes = random(
    Math.round(maxLikes * 0.8),
    Math.round(maxLikes * 1.2)
  )
  console.log({ totalLikes })
  let likeCount = 0

  for (tag of tags) {
    console.log(`${tag}`)
    let url = `https://www.instagram.com/explore/tags/${tag}/`

    await page.goto(url, { waitUntil: 'networkidle2' })
    await page.waitFor(random(2500, 4000))

    // get recent images - 'document.querySelectorAll pup method'
    let posts = await page.$$('article > div:nth-child(3) a')

    // divide like total and slightly create variance
    let likeTotalforTag = Math.floor(totalLikes / tags.length) + random(-3, 3)
    let likeCountforTag = 0
    let postIndex = 0

    while (likeCountforTag <= likeTotalforTag && postIndex < posts.length - 1) {
      // open post
      await posts[postIndex].click()
      // await page.waitForSelector('#react-root[aria-hidden="true"]')
      await page.waitFor(random(2500, 4000))

      // check if it can be liked
      let likeBtn = await page.$('[aria-label="Like"]') // oposite is 'Unlike' > svg elem
      if (likeBtn) {
        await likeBtn.click()
        await page.waitFor(random(1000, 4000))
        likeCountforTag++
        likeCount++
        console.log(`${likeCount} likes`)
      }

      // close modal
      let closeModalBtn = await page.$x('//button[contains(text(),"Close")]')
      await closeModalBtn[0].click()
      // await page.waitForSelector('#react-root[aria-hidden="false"]')
      await page.waitFor(random(1500, 2500))

      // next post
      postIndex++
    }

    // tag finished
  }

  // like process finished
}
