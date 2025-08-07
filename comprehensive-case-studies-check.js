#!/usr/bin/env node

// Comprehensive Case Studies System Check
console.log('🔍 COMPREHENSIVE CASE STUDIES SYSTEM CHECK');
console.log('==========================================\n');

// 1. Configuration Check
console.log('1️⃣ CONFIGURATION CHECK');
console.log('----------------------');

import fs from 'fs';
import path from 'path';

// Check .env.local
const envPath = '.env.local';
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('✅ .env.local exists');
  
  const useAirtable = envContent.includes('USE_AIRTABLE=true');
  console.log(`📊 USE_AIRTABLE: ${useAirtable ? '✅ true' : '❌ false'}`);
  
  const hasApiKey = envContent.includes('AIRTABLE_API_KEY=');
  const hasBaseId = envContent.includes('AIRTABLE_BASE_ID=');
  console.log(`🔑 AIRTABLE_API_KEY: ${hasApiKey ? '✅ present' : '❌ missing'}`);
  console.log(`🏠 AIRTABLE_BASE_ID: ${hasBaseId ? '✅ present' : '❌ missing'}`);
} else {
  console.log('❌ .env.local missing');
}

// 2. File Structure Check
console.log('\n2️⃣ FILE STRUCTURE CHECK');
console.log('------------------------');

const requiredFiles = [
  'app/case-studies/page.js',
  'app/case-studies/[slug]/page.js',
  'app/api/case-studies/route.js',
  'utils/airtable.js',
  'utils/airtable-config.js'
];

requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
});

// 3. API Route Check
console.log('\n3️⃣ API ROUTE CHECK');
console.log('------------------');

try {
  const response = await fetch('http://localhost:3000/api/case-studies');
  if (response.ok) {
    const data = await response.json();
    console.log(`✅ API responds successfully`);
    console.log(`📊 Count: ${data.count || 0} case studies`);
    console.log(`🔗 Source: ${data.source || 'unknown'}`);
    
    if (data.count >= 24) {
      console.log('✅ All 24 case studies found');
    } else if (data.count > 0) {
      console.log(`⚠️  Only ${data.count} case studies found (expected 24)`);
    } else {
      console.log('❌ No case studies found');
    }
  } else {
    console.log(`❌ API error: ${response.status} ${response.statusText}`);
    const errorText = await response.text();
    console.log(`Error details: ${errorText}`);
  }
} catch (error) {
  console.log(`❌ API request failed: ${error.message}`);
  console.log('Make sure your development server is running (npm run dev)');
}

// 4. Airtable Connection Check
console.log('\n4️⃣ AIRTABLE CONNECTION CHECK');
console.log('-----------------------------');

try {
  console.log('Testing direct Airtable connection...');
  
  // Load environment variables
  import dotenv from 'dotenv';
  dotenv.config({ path: '.env.local' });
  
  const { fetchCaseStudies } = await import('./utils/airtable.js');
  const testRecords = await fetchCaseStudies({ maxRecords: 3 });
  
  console.log(`✅ Direct Airtable connection successful`);
  console.log(`📊 Test fetch returned ${testRecords.length} records`);
  
  if (testRecords.length > 0) {
    const firstRecord = testRecords[0];
    console.log(`📝 Sample fields: ${Object.keys(firstRecord).slice(0, 10).join(', ')}...`);
    
    // Check for array fields
    const dimensions = firstRecord['Resilient Dimensions '];
    const keywords = firstRecord['Key Words '];
    
    console.log(`🏷️  Dimensions type: ${Array.isArray(dimensions) ? 'Array' : typeof dimensions}`);
    console.log(`🔤 Keywords type: ${Array.isArray(keywords) ? 'Array' : typeof keywords}`);
  }
  
} catch (error) {
  console.log(`❌ Airtable connection failed: ${error.message}`);
}

// 5. Array Handling Check
console.log('\n5️⃣ ARRAY HANDLING CHECK');
console.log('------------------------');

// Check for proper array handling in key files
const filesToCheck = [
  'app/case-studies/page.js',
  'app/case-studies/[slug]/page.js',
  'app/api/case-studies/route.js'
];

filesToCheck.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for unsafe .split() calls
    const unsafeSplits = content.match(/\.(split\([^)]*\))/g) || [];
    const safeSplits = content.match(/Array\.isArray/g) || [];
    
    console.log(`📄 ${filePath}:`);
    console.log(`   Split calls: ${unsafeSplits.length}`);
    console.log(`   Array checks: ${safeSplits.length}`);
    
    if (unsafeSplits.length > 0 && safeSplits.length === 0) {
      console.log(`   ⚠️  May have unsafe array handling`);
    } else {
      console.log(`   ✅ Array handling looks safe`);
    }
  }
});

// 6. Page Functionality Check
console.log('\n6️⃣ PAGE FUNCTIONALITY CHECK');
console.log('----------------------------');

try {
  const pageResponse = await fetch('http://localhost:3000/case-studies');
  if (pageResponse.ok) {
    console.log('✅ Case studies page loads');
    
    // Check if we can access individual study
    const apiResponse = await fetch('http://localhost:3000/api/case-studies');
    if (apiResponse.ok) {
      const data = await apiResponse.json();
      if (data.caseStudies && data.caseStudies.length > 0) {
        const firstStudyId = data.caseStudies[0].id;
        const studyResponse = await fetch(`http://localhost:3000/case-studies/${encodeURIComponent(firstStudyId)}`);
        
        if (studyResponse.ok) {
          console.log('✅ Individual case study pages load');
        } else {
          console.log(`❌ Individual study page error: ${studyResponse.status}`);
        }
      }
    }
  } else {
    console.log(`❌ Case studies page error: ${pageResponse.status}`);
  }
} catch (error) {
  console.log(`❌ Page check failed: ${error.message}`);
}

// 7. GitHub Location Sync Check
console.log('\n7️⃣ GITHUB LOCATION SYNC CHECK');
console.log('------------------------------');

const githubPath = '/Users/eliah/Documents/GitHub/Lancet/LancetHubCurrentBackup';
const desktopPath = '/Users/eliah/Desktop/ResilientHubMaster/LancetHubCurrentBackup';

const keyFiles = [
  '.env.local',
  'app/case-studies/page.js',
  'app/case-studies/[slug]/page.js',
  'app/api/case-studies/route.js',
  'utils/airtable.js'
];

keyFiles.forEach(file => {
  const desktopFile = path.join(desktopPath, file);
  const githubFile = path.join(githubPath, file);
  
  const desktopExists = fs.existsSync(desktopFile);
  const githubExists = fs.existsSync(githubFile);
  
  let status = '❌';
  if (desktopExists && githubExists) {
    // Check if files are identical
    const desktopContent = fs.readFileSync(desktopFile, 'utf8');
    const githubContent = fs.readFileSync(githubFile, 'utf8');
    status = desktopContent === githubContent ? '✅' : '⚠️ ';
  } else if (desktopExists || githubExists) {
    status = '⚠️ ';
  }
  
  console.log(`${status} ${file} (Desktop: ${desktopExists ? '✅' : '❌'}, GitHub: ${githubExists ? '✅' : '❌'})`);
});

console.log('\n✅ COMPREHENSIVE CHECK COMPLETE');
console.log('================================');
console.log('If all checks pass, your case studies system should be fully functional!');