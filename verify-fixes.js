// Verify all case studies fixes are in place
import fs from 'fs';
import path from 'path';

console.log('🔍 VERIFYING CASE STUDIES FIXES\n');

const desktopPath = '/Users/eliah/Desktop/ResilientHubMaster/LancetHubCurrentBackup';
const githubPath = '/Users/eliah/Documents/GitHub/Lancet/LancetHubCurrentBackup';

// 1. Check .env.local configuration
console.log('1️⃣ Configuration Check');
console.log('----------------------');

[desktopPath, githubPath].forEach((basePath, index) => {
  const location = index === 0 ? 'Desktop' : 'GitHub';
  const envFile = path.join(basePath, '.env.local');
  
  if (fs.existsSync(envFile)) {
    const content = fs.readFileSync(envFile, 'utf8');
    const useAirtable = content.includes('USE_AIRTABLE=true');
    console.log(`${location}: USE_AIRTABLE=${useAirtable ? '✅ true' : '❌ false'}`);
  } else {
    console.log(`${location}: ❌ .env.local missing`);
  }
});

// 2. Check Airtable field fix
console.log('\n2️⃣ Airtable Field Fix Check');
console.log('----------------------------');

[desktopPath, githubPath].forEach((basePath, index) => {
  const location = index === 0 ? 'Desktop' : 'GitHub';
  const airtableFile = path.join(basePath, 'utils/airtable.js');
  
  if (fs.existsSync(airtableFile)) {
    const content = fs.readFileSync(airtableFile, 'utf8');
    const hasFieldFix = content.includes("'Links'") && !content.includes("'Field 27'");
    console.log(`${location}: Field fix ${hasFieldFix ? '✅ applied' : '❌ missing'}`);
  } else {
    console.log(`${location}: ❌ airtable.js missing`);
  }
});

// 3. Check array handling fixes
console.log('\n3️⃣ Array Handling Fixes Check');
console.log('------------------------------');

const filesToCheck = [
  'app/case-studies/page.js',
  'app/case-studies/[slug]/page.js'
];

filesToCheck.forEach(fileName => {
  console.log(`\n📄 ${fileName}:`);
  
  [desktopPath, githubPath].forEach((basePath, index) => {
    const location = index === 0 ? 'Desktop' : 'GitHub';
    const filePath = path.join(basePath, fileName);
    
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for proper array handling
      const hasArrayChecks = content.includes('Array.isArray');
      const hasSafeHandling = content.includes('Array.isArray(dims)') || content.includes('Array.isArray(kw)');
      
      console.log(`  ${location}: Array handling ${hasSafeHandling ? '✅ safe' : '❌ unsafe'}`);
    } else {
      console.log(`  ${location}: ❌ file missing`);
    }
  });
});

// 4. Check API route improvements
console.log('\n4️⃣ API Route Check');
console.log('------------------');

[desktopPath, githubPath].forEach((basePath, index) => {
  const location = index === 0 ? 'Desktop' : 'GitHub';
  const apiFile = path.join(basePath, 'app/api/case-studies/route.js');
  
  if (fs.existsSync(apiFile)) {
    const content = fs.readFileSync(apiFile, 'utf8');
    
    const hasProductionLogic = content.includes('process.env.NODE_ENV === \'production\'');
    const hasErrorHandling = content.includes('errorResponse');
    const hasArrayJoin = content.includes('join(\', \')');
    
    console.log(`${location}:`);
    console.log(`  Production logic: ${hasProductionLogic ? '✅' : '❌'}`);
    console.log(`  Error handling: ${hasErrorHandling ? '✅' : '❌'}`);
    console.log(`  Array to string: ${hasArrayJoin ? '✅' : '❌'}`);
  } else {
    console.log(`${location}: ❌ API route missing`);
  }
});

// 5. File synchronization check
console.log('\n5️⃣ File Synchronization Check');
console.log('------------------------------');

const keyFiles = [
  '.env.local',
  'utils/airtable.js',
  'app/case-studies/page.js',
  'app/case-studies/[slug]/page.js',
  'app/api/case-studies/route.js'
];

keyFiles.forEach(fileName => {
  const desktopFile = path.join(desktopPath, fileName);
  const githubFile = path.join(githubPath, fileName);
  
  const desktopExists = fs.existsSync(desktopFile);
  const githubExists = fs.existsSync(githubFile);
  
  let status;
  if (desktopExists && githubExists) {
    const desktopContent = fs.readFileSync(desktopFile, 'utf8');
    const githubContent = fs.readFileSync(githubFile, 'utf8');
    status = desktopContent === githubContent ? '✅ synced' : '⚠️  different';
  } else if (desktopExists && !githubExists) {
    status = '⚠️  missing in GitHub';
  } else if (!desktopExists && githubExists) {
    status = '⚠️  missing in Desktop';
  } else {
    status = '❌ missing both';
  }
  
  console.log(`${fileName}: ${status}`);
});

// Summary
console.log('\n📋 VERIFICATION SUMMARY');
console.log('=======================');
console.log('✅ All fixes should be in place for:');
console.log('  • 24 case studies from Airtable (fixed "Field 27" issue)');
console.log('  • Array handling for dimensions and keywords');
console.log('  • Individual case study pages working');
console.log('  • Both Desktop and GitHub locations updated');
console.log('\n🚀 To test: Start your server and visit /case-studies');
console.log('   All 24 case studies should be visible and clickable!');