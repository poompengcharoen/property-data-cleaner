import ollama from 'ollama'

const extractPropertyKeywords = async (property, retries = 3) => {
	const prompt = `
    Generate a list of up to 10 highly targeted and relevant keywords or phrases based on the provided property information. These keywords should:
    - Highlight the property's unique selling points (e.g., "beachfront villa," "luxury amenities").
    - Include location details such as specific neighborhoods, landmarks, or attractions where applicable.
    - Reflect buyer intent (e.g., "investment property," "holiday home").
    - Focus on property type, features, and lifestyle benefits (e.g., "modern villa," "ocean views").

    Ensure that:
    - Each keyword or phrase is limited to a maximum of 2 words.
    - The output is formatted as a comma-separated list of keywords or phrases.
    - Keywords avoid standalone numbers, generic terms (e.g., "real estate"), vague descriptions, or repeated entries.
		- No other text, explanations, or formatting is included in the output.

    Property Information:
    Title: ${property.title}
    Location: ${property.location}
    Type: ${property.type}
    Price: ${property.price}
    Bedrooms: ${property.bedrooms}
    Bathrooms: ${property.bathrooms}
    Property Size: ${property.propertySize}
    Description: ${property.description}

    Example Output:
    beachfront villa, luxury home, private pool, ocean view, modern condo, family retreat, tropical paradise, gated community, investment property, holiday home.
	`

	// Function to clean and validate keywords
	const cleanKeywords = (response) => {
		return response
			.split(',')
			.map((keyword) => keyword.trim().toLowerCase())
			.filter(isValidKeyword)
	}

	// Helper function to validate keywords
	const isValidKeyword = (keyword) => {
		// Exclude short words, standalone numbers, and invalid patterns
		return (
			/^[a-z\s]+$/.test(keyword) && // Only allow letters and spaces
			keyword.length > 2 && // Minimum length
			!keyword.match(/^\d+$/) && // Exclude standalone numbers
			!keyword.includes('based on') &&
			!keyword.includes('here are') &&
			!keyword.includes('here is') &&
			!keyword.includes("here's") &&
			!keyword.includes("it's") &&
			!keyword.includes('this is')
		)
	}

	// Deduplicate keywords and ensure diversity
	const deduplicateAndOptimize = (keywords) => {
		const uniqueKeywords = [...new Set(keywords)] // Remove duplicates
		return uniqueKeywords.slice(0, 10) // Limit to 10 keywords
	}

	let attempt = 0
	while (attempt < retries) {
		try {
			const result = await ollama.generate({ model: 'tinyllama', prompt })
			const cleanedKeywords = cleanKeywords(result.response)
			return deduplicateAndOptimize(cleanedKeywords)
		} catch (error) {
			console.error(`Attempt ${attempt + 1} failed`, error)
			attempt++
		}
	}

	return null // Return null after exhausting retries
}

export default extractPropertyKeywords
