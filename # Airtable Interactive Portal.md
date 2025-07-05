# Airtable Interactive Portal

A React application that provides a web interface for viewing and managing Airtable data.

## Features

- Browse tables in your Airtable base
- View records in tables
- Create new records
- Edit existing records
- Delete records

## Prerequisites

- Node.js 16.x or later
- NPM or Yarn
- An Airtable account with API access

## Setup

1. Clone this repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Configure environment variables:

   Copy the `.env.local.example` file to `.env.local` and fill in your Airtable API key and Base ID:

```bash
cp .env.local.example .env.local
```

   Then edit `.env.local` to add your credentials:

```
AIRTABLE_API_KEY=your_api_key_here
AIRTABLE_BASE_ID=your_base_id_here
```

   You can find your Airtable API key in your account settings at https://airtable.com/account
   
   The Base ID can be found in the URL when viewing your base: `https://airtable.com/{BASE_ID}/...`

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Note on API Security

This application uses server-side API routes to securely communicate with Airtable. Your API key is stored as an environment variable and is not exposed to the client.

## Deployment

For production deployment, you can build and start the application:

```bash
npm run build
npm start
# or
yarn build
yarn start
```

Or deploy to a platform like Vercel or Netlify, making sure to configure the environment variables.
