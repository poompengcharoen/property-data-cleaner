import { connectDb, disconnectDb } from './configs/db.js'

import cron from 'node-cron'
import formatPropertyPrice from './utils/formatPropertyPrice.js'

// Database connection management
let dbConnection = null

const initDbConnection = async () => {
	if (!dbConnection) {
		try {
			dbConnection = await connectDb()
			console.log('Database connected.')
		} catch (error) {
			console.error('Database connection error:', error)
			throw error
		}
	}
}

const closeDbConnection = async () => {
	if (dbConnection) {
		try {
			await disconnectDb()
			dbConnection = null
			console.log('Database disconnected.')
		} catch (error) {
			console.error('Error while disconnecting from database:', error)
		}
	}
}

// Task runner with connection management and logging
const runTask = async (taskName, taskFn) => {
	console.log(`[${taskName}] Task started.`)
	try {
		await taskFn()
		console.log(`[${taskName}] Task completed successfully.`)
	} catch (error) {
		console.error(`[${taskName}] Error:`, error)
	}
}

// Scheduled task initialization
const createScheduledTask = (cronExpression, taskName, taskFn) => {
	cron.schedule(cronExpression, async () => {
		try {
			await initDbConnection()
			await runTask(taskName, taskFn)
		} catch (error) {
			console.error(`[${taskName}] Failed during scheduled run:`, error)
		} finally {
			await closeDbConnection()
		}
	})
	console.log(`[${taskName}] Scheduled with cron expression: ${cronExpression}`)
}

// Task definitions
const formatPricesTask = () => runTask('Format Prices', formatPropertyPrice)

// Initial execution and scheduling
;(async () => {
	try {
		await initDbConnection()
		await formatPricesTask()
	} catch (error) {
		console.error('Initial task execution error:', error)
	} finally {
		await closeDbConnection()
	}

	// Schedule the tasks
	createScheduledTask('*/1 * * * *', 'Format Prices', formatPropertyPrice)

	console.log('All tasks scheduled successfully.')
})()
