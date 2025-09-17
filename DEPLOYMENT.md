# Payroll Management System - Deployment Guide

This guide explains how to deploy the Payroll Management System to Vercel and Railway with Neon for PostgreSQL database.

## Project Structure
- `frontend/`: React frontend application
- `backend/`: Spring Boot backend API
- `db-scripts/`: Database setup scripts

## Deployment Instructions

### Database Setup with Neon

1. Create a Neon account at https://neon.tech
2. Create a new project
3. In the Neon Console, create a new database named `payroll_db`
4. Get your connection string from the Connection Details tab
5. Execute the `db-scripts/db-schema.sql` script using the Neon SQL Editor
6. Alternatively, use the provided `deploy-schema.bat` or `deploy-schema.sh` script to deploy the schema from your local machine:

   ```bash
   # Windows
   set NEON_DB_URL=postgres://user:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname
   cd db-scripts
   deploy-schema.bat
   
   # Linux/macOS
   export NEON_DB_URL=postgres://user:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname
   cd db-scripts
   chmod +x deploy-schema.sh
   ./deploy-schema.sh
   ```

### Backend Deployment (Railway)

1. Create a Railway account at https://railway.app/
2. Install the Railway CLI: `npm i -g @railway/cli`
3. Login to Railway: `railway login`
4. Initialize project: `cd backend && railway init`
5. Deploy backend: `railway up`
6. Set environment variables in Railway dashboard:
   - `SPRING_PROFILES_ACTIVE=neon`
   - `SPRING_DATASOURCE_URL=jdbc:postgresql://[NEON_HOST]:[PORT]/[DB_NAME]`
   - `SPRING_DATASOURCE_USERNAME=[NEON_USERNAME]`
   - `SPRING_DATASOURCE_PASSWORD=[NEON_PASSWORD]`

### Frontend Deployment (Vercel)

1. Create a Vercel account at https://vercel.com/
2. Install Vercel CLI: `npm i -g vercel`
3. Login to Vercel: `vercel login`
4. Deploy frontend: `cd frontend && vercel`
5. Set environment variables in Vercel dashboard:
   - `REACT_APP_API_URL=[YOUR_RAILWAY_BACKEND_URL]/api`

### Connecting Frontend to Backend

1. After deploying the backend, copy your Railway app URL
2. Set this URL as the `REACT_APP_API_URL` environment variable in Vercel
3. Redeploy frontend if needed: `vercel --prod`

## Database Setup on Neon

After creating your database on Neon:

1. Connect to the database using the credentials from Neon dashboard
2. Run the script from `db-scripts/db-schema.sql` to set up your database schema
3. You can also use the deployment scripts which simplify the process:
   - `deploy-schema.bat` for Windows
   - `deploy-schema.sh` for Linux/macOS

## Benefits of Using Neon for PostgreSQL

1. **Serverless Architecture**: Neon offers serverless PostgreSQL which automatically scales with your application needs
2. **Branching**: You can create database branches for development and testing
3. **Cost Efficiency**: Neon's serverless model means you only pay for what you use
4. **Built-in Connection Pooling**: Handles multiple concurrent connections efficiently
5. **Free Tier**: Generous free tier perfect for development and small applications
6. **Web SQL Editor**: Built-in editor for running SQL commands directly in the browser

## Continuous Deployment

Both Vercel and Railway support continuous deployment from GitHub:

1. Connect your GitHub repository to your Vercel and Railway projects
2. Configure auto-deployment settings in both platforms
3. Any push to the main branch will trigger a new deployment

## Monitoring and Maintenance

### Neon Database
- Monitor database performance in the Neon dashboard
- Set up usage alerts to avoid exceeding free tier limits
- Regularly create backups of your database

### Railway Backend
- Check logs in the Railway dashboard to troubleshoot any issues
- Monitor API performance
- Set up alerts for high CPU/memory usage

### Vercel Frontend
- Monitor analytics in the Vercel dashboard
- Check deployment and build logs
- Configure custom domains if needed