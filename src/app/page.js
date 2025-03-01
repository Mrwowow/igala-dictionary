// src/app/page.js
import IgalaDictionary from '../components/IgalaDictionary';
import { promises as fs } from 'fs';
import path from 'path';

export default async function Home() {
  // Load dictionary data at build time
  const dictionaryPath = path.join(process.cwd(), 'public', 'dictionary-data.json');
  const dictionaryData = await fs.readFile(dictionaryPath, 'utf8');
  const dictionary = JSON.parse(dictionaryData);
  
  return (
    <main>
      <IgalaDictionary initialDictionary={dictionary} />
    </main>
  );
}