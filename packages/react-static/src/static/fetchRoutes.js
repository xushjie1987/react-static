import chalk from 'chalk'
import exportSharedRouteData from './exportSharedRouteData'
import getRouteData, { sharedDataByHash } from './getRouteData'
import { progress, time, timeEnd, poolAll } from '../utils'

export default (async function fetchRoutes(state) {
  const { config, routes } = state
  console.log('=> Fetching Route Data...')
  const dataProgress = progress(routes.length)
  time(chalk.green('=> [\u2713] Route Data Downloaded'))

  // Use a traditional for loop here for perf
  const downloadTasks = []
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i]
    /* eslint-disable no-loop-func */
    downloadTasks.push(async () => {
      routes[i] = await getRouteData(route, state)
      dataProgress.tick()
    })
  }
  await poolAll(downloadTasks, Number(config.outputFileRate))
  timeEnd(chalk.green('=> [\u2713] Route Data Downloaded'))

  return exportSharedRouteData(config, sharedDataByHash)
})
