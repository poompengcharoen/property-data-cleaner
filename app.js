import { connectDb, disconnectDb } from './configs/db.js'

import assignPropertyKeywords from './utils/assignPropertyKeywords.js'
import cron from 'node-cron'
import formatPropertyPrice from './utils/formatPropertyPrice.js'

// Function to format property prices
const formatPricesTask = async () => {
	try {
		await connectDb()
		console.log('Formatting property prices...')
		await formatPropertyPrice()
		await disconnectDb()
		console.log('Price formatting done!')
	} catch (error) {
		console.error('Error formatting property prices:', error)
	}
}

// Function to assign property keywords
const assignKeywordsTask = async () => {
	try {
		await connectDb()
		console.log('Assigning property keywords...')
		await assignPropertyKeywords()
		await disconnectDb()
		console.log('Keyword assignment done!')
	} catch (error) {
		console.error('Error assigning property keywords:', error)
	}
}

formatPricesTask()
assignKeywordsTask()

// Schedule the tasks
cron.schedule('*/1 * * * *', formatPricesTask) // Run every 1 minute
cron.schedule('*/10 * * * *', assignKeywordsTask) // Run every 10 minutes

console.log('Cron jobs scheduled successfully!')
