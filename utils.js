function random(low, high) {
  return Math.floor(Math.random() * (high - low + 1) + low)
}

async function sleep(t) {
  new Promise(resolve =>
    setTimeout(() => {
      console.log(`sleep: ${(t / 1000).toFixed(1)}s`)
      resolve()
    }, t)
  )
}

module.exports = { random, sleep }
