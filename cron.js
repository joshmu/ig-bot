const igBot = require('./bots/bot.js')
const isOnline = require('is-online')

const CronJob = require('cron').CronJob

console.log(`STARTING CRON...`)
const job = new CronJob('0 */15 * * * *', async () => {
  // every 15 minutes to check
  // seconds / minutes / hours / daysOfMonth / month / dayOfWeek
  if (await isOnline()) await igBot()
})
job.start()
