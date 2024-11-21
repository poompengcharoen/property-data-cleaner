import { connectDb, disconnectDb } from './configs/db.js'

import assignPropertyKeywords from './utils/assignPropertyKeywords.js'
import cron from 'node-cron'
import formatPropertyPrice from './utils/formatPropertyPrice.js'

const main = async () => {
	try {
		// Connect to database
		await connectDb()

		// Format property price
		console.log('Formatting property price...')
		await formatPropertyPrice()

		// Assign each property with keywords
		console.log('Assigning property keywords...')
		await assignPropertyKeywords()

		// Disconnect from database
		await disconnectDb()

		console.log('Done!')
	} catch (error) {
		console.error('Error:', error)
	}
}

// Clean immediately when the script starts
await main()

// Schedule the cron job to run at midnight and midday every day
cron.schedule('* * * * *', async () => {
	await main()
})
