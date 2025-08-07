// Quick Case Studies System Check
console.log('🔍 QUICK CASE STUDIES SYSTEM CHECK\n');

// 1. API Test
console.log('1️⃣ Testing API endpoint...');
try {
  const response = await fetch('http://localhost:3000/api/case-studies');
  if (response.ok) {
    const data = await response.json();
    console.log(`✅ API works: ${data.count} case studies from ${data.source}`);
    
    if (data.count >= 24) {
      console.log('✅ All 24 case studies found!');
    } else {
      console.log(`⚠️  Only ${data.count}/24 case studies found`);
    }
  } else {
    console.log(`❌ API error: ${response.status}`);
  }
} catch (error) {
  console.log(`❌ API test failed: ${error.message}`);
  console.log('Make sure your server is running: npm run dev');
}

// 2. Page Test
console.log('\n2️⃣ Testing case studies page...');
try {
  const response = await fetch('http://localhost:3000/case-studies');
  if (response.ok) {
    console.log('✅ Case studies page loads');
  } else {
    console.log(`❌ Page error: ${response.status}`);
  }
} catch (error) {
  console.log(`❌ Page test failed: ${error.message}`);
}

// 3. Individual Study Test
console.log('\n3️⃣ Testing individual study page...');
try {
  const apiResponse = await fetch('http://localhost:3000/api/case-studies');
  if (apiResponse.ok) {
    const data = await apiResponse.json();
    if (data.caseStudies && data.caseStudies.length > 0) {
      const firstStudyId = data.caseStudies[0].id;
      const studyResponse = await fetch(`http://localhost:3000/case-studies/${encodeURIComponent(firstStudyId)}`);
      
      if (studyResponse.ok) {
        console.log('✅ Individual study pages work');
      } else {
        console.log(`❌ Individual study error: ${studyResponse.status}`);
      }
    } else {
      console.log('❌ No case studies available to test');
    }
  }
} catch (error) {
  console.log(`❌ Individual study test failed: ${error.message}`);
}

console.log('\n✅ Quick check complete!');