import { connectDb, disconnectDb } from './configs/db.js'

import assignPropertyKeywords from './utils/assignPropertyKeywords.js'
import cron from 'node-cron'
import formatPropertyPrice from './utils/formatPropertyPrice.js'

let dbConnection = null

// Initialize and manage a persistent database connection
const initDbConnection = async () => {
	if (!dbConnection) {
		try {
			dbConnection = await connectDb()
			console.log('Database connected.')
		} catch (error) {
			console.error('Failed to connect to database:', error)
			throw error
		}
	}
}

// Close the database connection
const closeDbConnection = async () => {
	if (dbConnection) {
		try {
			await disconnectDb()
			dbConnection = null
			console.log('Database disconnected.')
		} catch (error) {
			console.error('Failed to disconnect from database:', error)
		}
	}
}

// Task wrapper with connection and error handling
const runTask = async (taskName, taskFn) => {
	try {
		console.log(`[${taskName}] Task started...`)
		await initDbConnection() // Ensure the database is connected
		await taskFn()
		console.log(`[${taskName}] Task completed successfully.`)
	} catch (error) {
		console.error(`[${taskName}] Error:`, error)
	}
}

// Define tasks
const formatPricesTask = () => runTask('Format Prices', formatPropertyPrice)
const assignKeywordsTask = () => runTask('Assign Keywords', assignPropertyKeywords)

// Execute tasks immediately
;(async () => {
	try {
		await initDbConnection()
		await formatPricesTask()
		await assignKeywordsTask()
	} catch (error) {
		console.error('Initial task execution failed:', error)
	} finally {
		await closeDbConnection()
	}
})()

// Schedule the tasks
cron.schedule('*/1 * * * *', formatPricesTask) // Run every 1 minute
cron.schedule('*/10 * * * *', assignKeywordsTask) // Run every 10 minutes

console.log('Cron jobs scheduled successfully!')
