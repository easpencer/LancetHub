// Test if CSS module can be imported
try {
  const styles = require('./app/pandemic-vulnerability/PolicyInvestmentDashboard.module.css');
  console.log('CSS module imported successfully');
  console.log('Available classes:', Object.keys(styles).slice(0, 10));
} catch (error) {
  console.error('Failed to import CSS module:', error.message);
}