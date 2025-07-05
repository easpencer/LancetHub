# Airtable Setup Guide for LancetHub

This guide will walk you through setting up Airtable to work with LancetHub.

## 1. Prerequisites

- An Airtable account
- API access privileges for your Airtable account

## 2. Create a New Base

1. Log in to your Airtable account
2. Click "Add a base" > "Start from scratch"
3. Name your base "LancetHub"

## 3. Create Required Tables

Create the following tables in your base with exactly these names:

### Papers

Fields:
- Title (Single line text)
- Authors (Long text)
- Publication (Single line text)
- Year (Single line text)
- URL (URL)
- DOI (Single line text)
- Abstract (Long text)
- Status (Single select: Published, In Review, etc.)
- Keywords (Long text)

### Case study forms

Fields:
- Case Study Title (Single line text)
- Name (Single line text)
- Section (Single line text)
- Date (Date)
- Resilient Dimensions (Long text)
- Short Description (Long text)
- Study Focus (Long text)
- Relevance to Community/Societal Resilience (Long text)

### People

Fields:
- Name (Single line text)
- Affiliation (Single line text)
- Role (Single line text)
- Contact (Email)
- Expertise (Long text)
- Bio (Long text)
- Photo (Attachment)
- Order (Number)

### Landscape topics

Fields:
- Dimension (Single line text)
- Topic (Single line text)
- Context (Long text)
- Leadership (Long text)
- Teamwork (Long text)
- Data (Long text)
- Resources (Long text)

## 4. Importing Your Data

1. Download your CSV files from the provided links
2. In Airtable, click on each table you created
3. Click "Import" in the top-right corner
4. Upload the corresponding CSV file
5. Map the CSV columns to the correct Airtable fields
6. Click "Import"

## 5. Getting Your API Key and Base ID

1. Go to your [Airtable Account](https://airtable.com/account)
2. Under "API" section, generate an API key if you don't have one
3. Copy your API key

4. Go to the [Airtable API documentation page](https://airtable.com/api)
5. Select your LancetHub base
6. Look for "The ID of this base is..." in the introduction
7. Copy the Base ID (it looks like `appXXXXXXXXXXXXXX`)

## 6. Configure Environment Variables

1. Open your `.env.local` file
2. Update the following variables:
