# Property Data Cleaner

This project is a Node.js application designed to clean and enrich property data stored in a MongoDB database. It formats property prices, assigns relevant keywords using AI, and schedules periodic data cleaning tasks to ensure the database remains updated and consistent.

## Features

- **Property Price Formatting**: Parses and standardizes property price strings into numerical values and currency codes, scheduled to run every minute.
- **Keyword Assignment**: Generates targeted and relevant keywords for properties using an AI model, scheduled to run every 10 minutes.
- **Automated Scheduling**: Uses `node-cron` to independently schedule periodic data cleaning tasks.
- **MongoDB Integration**: Reads and updates property data in MongoDB.

## Project Structure

- **`app.js`**: Main entry point that initializes and schedules data cleaning tasks.
- **`configs/db.js`**: Manages MongoDB connection and disconnection.
- **`utils/`**: Contains utility scripts:
  - `formatPropertyPrice.js`: Formats property price strings.
  - `assignPropertyKeywords.js`: Assigns keywords to properties.
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

The application performs the following tasks:

- **Manual Execution**: To run the cleaning tasks manually, execute:

  ```bash
  yarn start
  ```

  This will:

  - Connect to MongoDB
  - Format property prices
  - Assign relevant keywords
  - Disconnect from MongoDB

- **Automated Scheduling**: The application automatically schedules the tasks:
  - Formats property prices every minute.
  - Assigns property keywords every 10 minutes.

### Customizing the Schedule

To modify the schedule, open `app.js` and locate the `node-cron` configuration:

```javascript
cron.schedule('*/1 * * * *', formatPricesTask) // Format prices every 1 minute
cron.schedule('*/10 * * * *', assignKeywordsTask) // Assign keywords every 10 minutes
```

Change the cron expressions as needed.

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
