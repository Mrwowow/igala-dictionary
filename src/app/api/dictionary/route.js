// src/app/api/dictionary/route.js
import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';
  const letter = searchParams.get('letter') || '';
  
  try {
    const dictionaryPath = path.join(process.cwd(), 'public', 'dictionary-data.json');
    const dictionaryData = await fs.readFile(dictionaryPath, 'utf8');
    const dictionary = JSON.parse(dictionaryData);
    
    let filteredDictionary = dictionary;
    
    if (letter) {
      filteredDictionary = dictionary.filter(entry => 
        entry.igalaWord.trim().toUpperCase().startsWith(letter.toUpperCase())
      );
    }
    
    if (query) {
      filteredDictionary = filteredDictionary.filter(entry => 
        entry.igalaWord.toLowerCase().includes(query.toLowerCase()) || 
        entry.englishMeaning.toLowerCase().includes(query.toLowerCase()) ||
        entry.description.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    return NextResponse.json({ entries: filteredDictionary });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load dictionary' }, { status: 500 });
  }
}