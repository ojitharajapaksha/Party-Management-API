# Vercel Deployment Guide for Party Management API

## Prerequisites
1. MongoDB Atlas account (for cloud database)
2. Vercel account
3. Git repository (GitHub, GitLab, or Bitbucket)

## Step-by-Step Deployment

### 1. Set up MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster (free tier is available)
3. Create a database user
4. Get your connection string (should look like: `mongodb+srv://username:password@cluster.mongodb.net/party-management`)
5. Add your IP address to the IP Access List (or use 0.0.0.0/0 for all IPs)

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to your backend directory
cd "Party Management API"

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name: party-management-api (or your preferred name)
# - Directory: ./
```

#### Option B: Using Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Set the root directory to "Party Management API"
5. Click Deploy

### 3. Configure Environment Variables in Vercel
In your Vercel project dashboard:
1. Go to Settings → Environment Variables
2. Add these variables:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string
   - `NODE_ENV`: production
   - `BCRYPT_SALT_ROUNDS`: 12

### 4. Update Frontend Configuration
After deployment, you'll get a Vercel URL like: `https://your-project-name.vercel.app`

Update your frontend's API configuration to use this URL instead of localhost.

### 5. Update CORS Configuration
In the deployed `app.js`, make sure to replace `'https://your-frontend-domain.vercel.app'` with your actual frontend Vercel URL.

## Important Notes

1. **MongoDB Connection**: Make sure your MongoDB Atlas cluster allows connections from anywhere (0.0.0.0/0) or add Vercel's IP ranges.

2. **Environment Variables**: Never commit your `.env` file. Use Vercel's environment variable settings.

3. **CORS**: Update the allowed origins in `app.js` to include your frontend's Vercel domain.

4. **API Endpoints**: Your API will be available at:
   - `https://your-backend-domain.vercel.app/health`
   - `https://your-backend-domain.vercel.app/tmf-api/party/v5/individual`
   - `https://your-backend-domain.vercel.app/tmf-api/party/v5/organization`

## Testing Your Deployment

1. Test the health endpoint: `https://your-backend-domain.vercel.app/health`
2. Test API endpoints with tools like Postman or curl
3. Update your frontend to use the new backend URL

## Troubleshooting

1. **MongoDB Connection Issues**: Check your Atlas IP whitelist and connection string
2. **CORS Errors**: Verify your frontend domain is in the allowed origins
3. **Function Timeout**: Vercel has a 10-second timeout for serverless functions
4. **Environment Variables**: Double-check all required environment variables are set in Vercel

## Frontend Update Required

After backend deployment, update your frontend's API base URL:

```typescript
// In your frontend's api.ts or similar file
const API_BASE_URL = 'https://your-backend-domain.vercel.app';
```
