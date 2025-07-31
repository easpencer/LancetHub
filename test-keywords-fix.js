// Test to verify Keywords array handling fix
console.log('🔍 Testing Keywords Array Handling Fix\n');

// Simulate the scenarios we need to handle
const testCases = [
  {
    name: 'Array Keywords',
    Keywords: ['United States', 'Organization', 'Individual'],
    expected: 'Should handle as array'
  },
  {
    name: 'String Keywords',
    Keywords: 'United States, Organization, Individual',  
    expected: 'Should handle as string'
  },
  {
    name: 'Empty String',
    Keywords: '',
    expected: 'Should not render'
  },
  {
    name: 'Null/Undefined',
    Keywords: null,
    expected: 'Should not render'
  }
];

testCases.forEach(testCase => {
  console.log(`📋 Testing: ${testCase.name}`);
  console.log(`  Input: ${JSON.stringify(testCase.Keywords)}`);
  
  // Test the condition logic
  const shouldRender = testCase.Keywords && (Array.isArray(testCase.Keywords) ? testCase.Keywords.length > 0 : testCase.Keywords.trim());
  console.log(`  Should render: ${shouldRender}`);
  
  if (shouldRender) {
    // Test the rendering logic
    const kw = testCase.Keywords || '';
    if (Array.isArray(kw)) {
      console.log(`  Render as array: ${kw.map(k => k.trim()).join(', ')}`);
    } else {
      console.log(`  Render as string: ${kw.split(',').map(k => k.trim()).join(', ')}`);
    }
  }
  
  console.log(`  Expected: ${testCase.expected}`);
  console.log('');
});

console.log('✅ All test cases should now work without errors!');
console.log('🚀 Refresh your browser to see the fix in action.');