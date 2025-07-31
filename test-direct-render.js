// Direct test to check what's being rendered
const fs = require('fs');
const path = require('path');

console.log('🔍 Direct Component Check\n');

// Check pandemic-vulnerability page.js
const pageJsPath = path.join(__dirname, 'app/pandemic-vulnerability/page.js');
const pageContent = fs.readFileSync(pageJsPath, 'utf8');

// Extract the tab button section
const tabButtonMatch = pageContent.match(/tabNavigation[\s\S]*?<\/div>/);
if (tabButtonMatch) {
  console.log('📱 Tab buttons found in page.js:');
  const buttons = tabButtonMatch[0].match(/💰 Policy Investment|🗺️ Interactive Map|📊 Deep Dive Analytics/g);
  if (buttons) {
    buttons.forEach(btn => console.log(`  ✓ ${btn}`));
  }
  
  // Check if Policy Investment tab is there
  if (tabButtonMatch[0].includes('💰 Policy Investment')) {
    console.log('\n✅ Policy Investment tab IS in the code!');
  } else {
    console.log('\n❌ Policy Investment tab is NOT in the code!');
  }
}

// Check Navigation.js
console.log('\n🧭 Navigation.js content:');
const navPath = path.join(__dirname, 'components/Navigation.js');
const navContent = fs.readFileSync(navPath, 'utf8');

// Extract navLinks array
const navLinksMatch = navContent.match(/navLinks\s*=\s*\[[\s\S]*?\]/);
if (navLinksMatch) {
  console.log('Navigation links found:');
  const links = navLinksMatch[0].match(/label:\s*'([^']+)'/g);
  if (links) {
    links.forEach((link, i) => {
      const label = link.match(/label:\s*'([^']+)'/)[1];
      console.log(`  ${i + 1}. ${label}`);
      if (label === 'Policy Modeling') {
        console.log('     ⚠️  FOUND "Policy Modeling" - THIS SHOULD NOT BE HERE!');
      }
    });
  }
}

// Check if there might be another Navigation component
console.log('\n🔍 Searching for other Navigation components...');
const searchDirs = ['.', '../ResilientHub', '../'];
searchDirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (fs.existsSync(fullPath)) {
    try {
      const files = fs.readdirSync(fullPath, { recursive: true })
        .filter(f => f.includes('Navigation') && f.endsWith('.js') && !f.includes('node_modules'));
      if (files.length > 0) {
        console.log(`\nFound in ${dir}:`);
        files.forEach(f => console.log(`  - ${f}`));
      }
    } catch (e) {
      // Ignore errors
    }
  }
});

console.log('\n💡 Debugging suggestions:');
console.log('1. Check which port your server is running on');
console.log('2. Run: lsof -i :3000 (to see what\'s using port 3000)');
console.log('3. Run: lsof -i :3001 (to see what\'s using port 3001)');
console.log('4. Make sure you\'re in the LancetHubCurrentBackup folder when running npm run dev');
console.log('5. Try: curl http://localhost:3000/api/health to test the server');