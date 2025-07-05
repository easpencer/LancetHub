const fs = require('fs');
const path = require('path');

// Create necessary directories
console.log('Setting up document directories...');
const publicDocDir = path.join(process.cwd(), 'public', 'documents');

// Create directories if they don't exist
if (!fs.existsSync(publicDocDir)) {
  fs.mkdirSync(publicDocDir, { recursive: true });
  console.log('Created public/documents directory');
}

// Create placeholder PDF for Lancet Commission Announcement
console.log('Creating placeholder documents...');

// Check if the file already exists
const announcementPath = path.join(publicDocDir, 'PIIS0140673624027211.pdf');
if (!fs.existsSync(announcementPath)) {
  // Create a simple placeholder file - in production you would copy the actual PDF
  fs.writeFileSync(announcementPath, 'Placeholder for Lancet Commission Announcement PDF');
  console.log('Created placeholder announcement PDF');
}

// Create other placeholder documents
const documents = [
  { 
    name: 'community-resilience-framework.pdf',
    content: 'Placeholder for Community Resilience Framework'
  },
  { 
    name: 'social-cohesion-report.pdf',
    content: 'Placeholder for Social Cohesion Report'
  },
  { 
    name: 'Lancet roadmap deck 2025.pptx',
    content: 'Placeholder for Lancet Roadmap Deck'
  },
  { 
    name: 'Lancet 3.0.docx',
    content: 'Placeholder for Lancet 3.0 Framework'
  },
];

documents.forEach(doc => {
  const docPath = path.join(publicDocDir, doc.name);
  if (!fs.existsSync(docPath)) {
    fs.writeFileSync(docPath, doc.content);
    console.log(`Created placeholder for ${doc.name}`);
  }
});

console.log('Document setup complete!');
