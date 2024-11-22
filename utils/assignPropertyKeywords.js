import Property from '../models/property.js'
import extractPropertyKeywords from './extractPropertyKeywords.js'

const assignPropertyKeywords = async () => {
	try {
		const properties = await Property.find({
			$or: [{ keywords: { $exists: false } }, { keywords: { $size: 0 } }],
		}).limit(5)

		await Promise.all(
			properties.map(async (property) => {
				const keywords = await extractPropertyKeywords(property.toObject())
				if (keywords) {
					property.keywords = keywords
					await property.save()
				}
			})
		)
	} catch (error) {
		console.error('Error:', error)
	}
}

export default assignPropertyKeywords
