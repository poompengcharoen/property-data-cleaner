import { connectDb, disconnectDb } from './configs/db.js'

import assignPropertyKeywords from './utils/assignPropertyKeywords.js'
import cron from 'node-cron'
import formatPropertyPrice from './utils/formatPropertyPrice.js'

let isDbConnected = false

// Initialize database connection
const initDbConnection = async () => {
	if (!isDbConnected) {
		try {
			await connectDb()
			isDbConnected = true
			console.log('Database connected.')
		} catch (error) {
			console.error('Failed to connect to database:', error)
			throw error
		}
	}
}

// Close database connection
const closeDbConnection = async () => {
	if (isDbConnected) {
		try {
			await disconnectDb()
			isDbConnected = false
			console.log('Database disconnected.')
		} catch (error) {
			console.error('Failed to disconnect from database:', error)
		}
	}
}

// Task wrapper with error handling
const runTask = async (taskName, taskFn) => {
	try {
		console.log(`[${taskName}] Task started...`)
		await initDbConnection()
		await taskFn()
		console.log(`[${taskName}] Task completed successfully.`)
	} catch (error) {
		console.error(`[${taskName}] Error:`, error)
	} finally {
		await closeDbConnection()
	}
}

// Define tasks
const formatPricesTask = () => runTask('Format Prices', formatPropertyPrice)
const assignKeywordsTask = () => runTask('Assign Keywords', assignPropertyKeywords)

// Execute tasks immediately
formatPricesTask()
assignKeywordsTask()

// Schedule the tasks
cron.schedule('*/1 * * * *', formatPricesTask) // Run every 1 minute
cron.schedule('*/10 * * * *', assignKeywordsTask) // Run every 10 minutes

console.log('Cron jobs scheduled successfully!')
