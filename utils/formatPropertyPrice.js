import Property from '../models/property.js'
import formatPrice from './formatPrice.js'

const formatPropertyPrice = async () => {
	try {
		const properties = await Property.find({
			$or: [{ numericalPrice: { $exists: false } }, { numericalPrice: null }],
		}).limit(100)

		await Promise.all(
			properties.map((property) => {
				const { priceNumeric, currencyCode } = formatPrice(property.price)
				property.priceNumeric = priceNumeric
				property.currencyCode = currencyCode
				property.save()
				console.log(property)
			})
		)
	} catch (error) {
		console.error('Error analyzing and correcting properties:', error)
	}
}

export default formatPropertyPrice
