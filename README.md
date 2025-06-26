# TMF632 Party Management API

This is a TMF632-compliant Party Management API that handles Individual and Organization party data according to the TM Forum standards.

## Features

- **TMF632 Compliance**: Full compliance with TM Forum 632 Party Management standards
- **Individual Party Management**: Create, read, update, and delete individual parties
- **Organization Party Management**: Create, read, update, and delete organization parties
- **Authentication Context**: Secure password handling with bcrypt hashing
- **CORS Support**: Configured for frontend integration
- **Validation**: Comprehensive input validation using express-validator
- **MongoDB Integration**: Persistent data storage with Mongoose ODM

## Project Structure

```
Party Management API/
├── app.js                 # Express application setup
├── server.js              # Server entry point
├── package.json           # Dependencies and scripts
├── .env.example           # Environment variables template
├── controllers/           # Route handlers
│   ├── individualController.js
│   └── organizationController.js
├── models/                # MongoDB schemas (TMF632 compliant)
│   ├── Individual.js
│   └── Organization.js
├── routes/                # API routes
│   ├── individualRoutes.js
│   └── organizationRoutes.js
└── validators/            # Input validation rules
    ├── individualValidator.js
    └── organizationValidator.js
```

## Installation

1. **Navigate to the API directory:**
   ```bash
   cd "Party Management API"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   MONGO_URI=mongodb://localhost:27017/party-management
   PORT=3000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   JWT_SECRET=your-secret-key-here
   BCRYPT_SALT_ROUNDS=12
   ```

4. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

5. **Start the server:**
   ```bash
   npm start
   ```

The API will be available at `http://localhost:3000`

## API Endpoints

### Health Check
- `GET /health` - API health status

### Individual Party Management
- `POST /tmf-api/party/v5/individual` - Create an individual party
- `GET /tmf-api/party/v5/individual` - List all individual parties
- `GET /tmf-api/party/v5/individual/:id` - Get specific individual party
- `PATCH /tmf-api/party/v5/individual/:id` - Update individual party
- `DELETE /tmf-api/party/v5/individual/:id` - Delete individual party

### Organization Party Management
- `POST /tmf-api/party/v5/organization` - Create an organization party
- `GET /tmf-api/party/v5/organization` - List all organization parties
- `GET /tmf-api/party/v5/organization/:id` - Get specific organization party
- `PATCH /tmf-api/party/v5/organization/:id` - Update organization party
- `DELETE /tmf-api/party/v5/organization/:id` - Delete organization party

## TMF632 Compliance

### Individual Party Structure
- **Core Attributes**: givenName, familyName, birthDate, gender, maritalStatus, etc.
- **Contact Information**: Email, phone, address with TMF632 contactMedium structure
- **Identifications**: Passport, national ID, driving license with TMF632 identification structure
- **Skills & Languages**: Professional skills and language abilities
- **Relationships**: Related parties and external references

### Organization Party Structure
- **Core Attributes**: name, tradingName, organizationType, legal entity status
- **Contact Information**: Business contact details with TMF632 contactMedium structure
- **Identifications**: Business registration, tax ID, VAT numbers
- **Relationships**: Parent/child organization relationships
- **Credit Information**: Credit ratings and financial data

## Frontend Integration

The API is designed to work seamlessly with the frontend signup forms. When a user submits the signup form:

1. **Data Transformation**: Frontend form data is automatically transformed to TMF632 format
2. **Password Security**: Passwords are hashed using bcrypt before storage
3. **Validation**: Comprehensive validation ensures data quality
4. **Response Format**: Clean JSON responses with proper error handling

### Example Frontend Usage

```typescript
import { partyManagementService } from './services/partyManagementService';

// Create individual party
const individualData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  password: 'SecurePassword123',
  agreeToTerms: true,
  subscribeToNewsletter: false
};

try {
  const response = await partyManagementService.createIndividual(individualData);
  console.log('Individual created:', response);
} catch (error) {
  console.error('Error:', error.message);
}
```

## Development

### Running in Development Mode
```bash
npm run dev
```

### Environment Variables
- `MONGO_URI`: MongoDB connection string
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `FRONTEND_URL`: Frontend URL for CORS
- `BCRYPT_SALT_ROUNDS`: Password hashing complexity (default: 12)

### Data Models

The API uses Mongoose schemas that fully implement TMF632 Party Management specifications:

- **Validation**: Built-in schema validation for all TMF632 fields
- **Indexing**: Optimized database indexes for common queries
- **Virtuals**: Computed fields for enhanced functionality
- **Security**: Sensitive data exclusion from API responses

## Security Features

- **Password Hashing**: bcrypt with configurable salt rounds
- **Input Validation**: express-validator for all inputs
- **CORS Configuration**: Secure cross-origin requests
- **Error Handling**: Comprehensive error responses
- **Data Sanitization**: Clean and safe data storage

## Production Deployment

1. **Set production environment variables**
2. **Configure MongoDB Atlas or production database**
3. **Set up proper CORS origins**
4. **Configure reverse proxy (nginx/Apache)**
5. **Enable process management (PM2)**

Example PM2 configuration:
```json
{
  "name": "party-management-api",
  "script": "server.js",
  "env": {
    "NODE_ENV": "production",
    "PORT": 3000
  }
}
```

## Contributing

1. Follow TMF632 standards for any new features
2. Add comprehensive validation for new fields
3. Include proper error handling
4. Update documentation for API changes
5. Test with both individual and organization data types

## License

This project is licensed under the ISC License.
