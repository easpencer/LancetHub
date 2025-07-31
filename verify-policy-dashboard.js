const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Policy Investment Dashboard Setup...\n');

// Check if key files exist
const filesToCheck = [
  'app/pandemic-vulnerability/PolicyInvestmentDashboard.js',
  'app/pandemic-vulnerability/PolicyInvestmentDashboard.module.css',
  'app/api/policy-modeling/investment/route.js',
  'utils/data-sources-config.js',
  'utils/investment-data-fetcher.js',
  'utils/investment-resilience-models.js',
  'utils/fact-checker.js',
  'utils/citation-tracker.js'
];

let allFilesExist = true;

console.log('📁 Checking Files:');
filesToCheck.forEach(file => {
  const filePath = path.join(__dirname, file);
  const exists = fs.existsSync(filePath);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

console.log('\n📄 Checking page.js integration:');
const pageJsPath = path.join(__dirname, 'app/pandemic-vulnerability/page.js');
if (fs.existsSync(pageJsPath)) {
  const pageContent = fs.readFileSync(pageJsPath, 'utf8');
  
  const checks = [
    { pattern: /PolicyInvestmentDashboard/, desc: 'PolicyInvestmentDashboard import' },
    { pattern: /activeTab === 'policy'/, desc: 'Policy tab logic' },
    { pattern: /💰 Policy Investment/, desc: 'Policy Investment button' }
  ];
  
  checks.forEach(check => {
    const found = check.pattern.test(pageContent);
    console.log(`${found ? '✅' : '❌'} ${check.desc}`);
  });
}

console.log('\n🔧 Checking export statement:');
const dashboardPath = path.join(__dirname, 'app/pandemic-vulnerability/PolicyInvestmentDashboard.js');
if (fs.existsSync(dashboardPath)) {
  const dashboardContent = fs.readFileSync(dashboardPath, 'utf8');
  const hasExport = /export default PolicyInvestmentDashboard/.test(dashboardContent);
  console.log(`${hasExport ? '✅' : '❌'} Export statement found`);
}

console.log('\n📊 Summary:');
if (allFilesExist) {
  console.log('✅ All files are in place!');
  console.log('\n🚀 Next steps:');
  console.log('1. Run: npm install');
  console.log('2. Run: npm run dev');
  console.log('3. Navigate to: http://localhost:3000/pandemic-vulnerability');
  console.log('4. Click on the "💰 Policy Investment" tab');
} else {
  console.log('❌ Some files are missing. Please check the setup.');
}

console.log('\n💡 If you still don\'t see the Policy Investment tab:');
console.log('1. Clear Next.js cache: rm -rf .next');
console.log('2. Check browser console for errors');
console.log('3. Try a hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)');