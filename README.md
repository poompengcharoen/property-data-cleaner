# Property Data Cleaner

This project is a Node.js application designed to clean and enrich property data stored in a MongoDB database. It formats property prices, assigns relevant keywords using AI, and schedules periodic data cleaning tasks to ensure the database remains updated and consistent.

## Features

- **Property Price Formatting**: Parses and standardizes property price strings into numerical values and currency codes.
- **Keyword Assignment**: Generates targeted and relevant keywords for properties using an AI model.
- **Automated Scheduling**: Uses `node-cron` to schedule periodic data cleaning tasks.
- **Retry Mechanism**: Retries keyword generation in case of temporary failures.
- **MongoDB Integration**: Reads and updates property data in MongoDB.

## Project Structure

- **`app.js`**: Main entry point that connects to MongoDB, executes data cleaning tasks, and schedules them using `node-cron`.
- **`configs/db.js`**: Manages MongoDB connection and disconnection.
- **`utils/`**: Contains utility scripts:
  - `formatPropertyPrice.js`: Formats property price strings.
  - `assignPropertyKeywords.js`: Assigns keywords to properties.
  - `formatPrice.js`: Extracts numerical price and currency code from raw strings.
  - `extractPropertyKeywords.js`: Uses an AI model to generate keywords.
- **`models/property.js`**: Defines the MongoDB schema for property data.

## Requirements

- **Node.js** (v16 or higher recommended)
- **MongoDB** instance (local or cloud-based)
- Environment variables for MongoDB credentials (see setup instructions below)

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/poompengcharoen/property-data-cleaner.git
   cd property-data-cleaner
   ```

2. **Install dependencies**:

   ```bash
   yarn
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory with the following variables:

   ```plaintext
   DB_HOST=<your_db_host>
   DB_USER=<your_db_user>
   DB_PASSWORD=<your_db_password>
   DB_NAME=<your_db_name>
   DB_REPLICA_SET=<your_replica_set>
   ```

4. **Run the application**:
   - For production:
     ```bash
     yarn start
     ```
   - For development (with live reload):
     ```bash
     yarn dev
     ```

## Usage

To manually run the cleaning tasks:

```bash
yarn start
```

This will:

- Connect to MongoDB
- Format property prices
- Assign relevant keywords
- Disconnect from MongoDB

### Automated Scheduling with `node-cron`

The project uses `node-cron` to automate data cleaning at regular intervals. By default, the tasks run every minute for testing purposes. To customize the interval:

1. Open `app.js` and locate the cron schedule:
   ```javascript
   cron.schedule('* * * * *', async () => {
   	await main()
   })
   ```
2. Modify the cron expression to your desired schedule (e.g., midnight and midday daily: `0 0,12 * * *`).

## MongoDB Schema

Each property entry contains the following fields:

- **`title`**: The title of the property listing.
- **`type`**: Type of property (e.g., Condo, House).
- **`price`**: Original price string.
- **`priceNumeric`**: Extracted numerical price.
- **`currencyCode`**: Currency of the price (e.g., THB, USD).
- **`bedrooms`**, **`bathrooms`**: Number of bedrooms and bathrooms.
- **`propertySize`**: Size of the property.
- **`location`**: Location of the property.
- **`description`**: A brief description of the property.
- **`keywords`**: Keywords generated for the property.
- **`link`**: Unique URL for the property listing.

## Error Handling

- **Keyword Extraction**: Retries up to 3 times to ensure successful generation.
- **Database Connection**: Logs errors if unable to connect to MongoDB.
- **Duplicate Handling**: Ensures no duplicate entries for price or keywords by checking existing fields.

## Dependencies

- **dotenv**: For managing environment variables.
- **mongoose**: For MongoDB integration.
- **node-cron**: For scheduling periodic tasks.
- **ollama**: For AI-powered keyword generation.

## Contributing

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-branch
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add new feature'
   ```
4. Push to your branch:
   ```bash
   git push origin feature-branch
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please open an issue or contact [poom.pengcharoen@gmail.com].
