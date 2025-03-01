// scripts/parse-dictionary.js
const fs = require('fs');

// Read the document content
const docContent = fs.readFileSync('./Igala_Dictionary_App.txt', 'utf8');
const lines = docContent.split('\n');

const dictionaryEntries = [];
let currentEntry = null;

for (const line of lines) {
  const trimmedLine = line.trim();
  
  // Skip empty lines and headers
  if (!trimmedLine || trimmedLine.match(/^[A-Z]$/) || trimmedLine.includes('_____')) {
    continue;
  }
  
  // Check if this line starts a new entry
  if (trimmedLine.match(/^[A-Z][\w-]+ \([^)]+\)/)) {
    // Save previous entry if it exists
    if (currentEntry) {
      dictionaryEntries.push(currentEntry);
    }
    
    // Extract the Igala word and English meaning
    const match = trimmedLine.match(/^([A-Z][\w-]+) \(([^)]+)\)/);
    if (match) {
      currentEntry = {
        igalaWord: match[1],
        englishMeaning: match[2],
        description: ''
      };
    }
  } else if (currentEntry) {
    // This is a continuation of a description
    currentEntry.description += (currentEntry.description ? ' ' : '') + trimmedLine;
  }
}

// Add the last entry
if (currentEntry) {
  dictionaryEntries.push(currentEntry);
}

// Write the JSON file
fs.writeFileSync('./public/dictionary-data.json', JSON.stringify(dictionaryEntries, null, 2));
console.log(`Parsed ${dictionaryEntries.length} dictionary entries.`);