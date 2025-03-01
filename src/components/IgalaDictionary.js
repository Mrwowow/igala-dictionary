'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function IgalaDictionary() {
  const [dictionary, setDictionary] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentLetter, setCurrentLetter] = useState('A');
  const [filteredWords, setFilteredWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [showDetailsMobile, setShowDetailsMobile] = useState(false);
  
  useEffect(() => {
    const loadDictionary = async () => {
      try {
        const response = await fetch('/dictionary-data.json');
        const data = await response.json();
        setDictionary(data);
        
        // Initialize with words starting with 'A'
        const wordsWithA = data.filter(entry => 
          entry.igalaWord.trim().toUpperCase().startsWith('A')
        );
        setFilteredWords(wordsWithA);
        setLoading(false);
      } catch (error) {
        console.error('Error loading dictionary:', error);
        setLoading(false);
      }
    };
    
    loadDictionary();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === '') {
      // If search is cleared, show words for current letter
      const wordsWithCurrentLetter = dictionary.filter(entry => 
        entry.igalaWord.trim().toUpperCase().startsWith(currentLetter)
      );
      setFilteredWords(wordsWithCurrentLetter);
    } else {
      // Filter by search term (match in Igala word or English meaning)
      const results = dictionary.filter(entry => 
        entry.igalaWord.toLowerCase().includes(term.toLowerCase()) || 
        entry.englishMeaning.toLowerCase().includes(term.toLowerCase()) ||
        entry.description.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredWords(results);
    }
  };

  const handleLetterClick = (letter) => {
    setCurrentLetter(letter);
    setSearchTerm('');
    
    const wordsWithLetter = dictionary.filter(entry => 
      entry.igalaWord.trim().toUpperCase().startsWith(letter)
    );
    setFilteredWords(wordsWithLetter);
    setSelectedWord(null);
    setShowDetailsMobile(false);
  };

  const handleWordClick = (word) => {
    setSelectedWord(word);
    setShowDetailsMobile(true);
    
    // Scroll to top on mobile when selecting a word
    if (window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToList = () => {
    setShowDetailsMobile(false);
  };

  // Get all available starting letters from the dictionary
  const getAvailableLetters = () => {
    const letters = new Set();
    dictionary.forEach(entry => {
      if (entry.igalaWord && entry.igalaWord.trim()) {
        letters.add(entry.igalaWord.trim().toUpperCase().charAt(0));
      }
    });
    return Array.from(letters).sort();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-primary-700 dark:bg-primary-900 text-white p-4 shadow-md dark:shadow-gray-800 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Igala Dictionary</h1>
          <ThemeToggle />
        </div>
      </header>
      
      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 p-4 shadow-sm dark:shadow-gray-700 sticky top-16 z-10">
        <div className="container mx-auto relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Search Igala or English words..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
      
      {/* Alphabet Navigation */}
      <div className="bg-white dark:bg-gray-800 p-2 flex flex-wrap justify-center gap-1 shadow-sm dark:shadow-gray-700 sticky top-32 z-10">
        {getAvailableLetters().map(letter => (
          <button
            key={letter}
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm 
              ${currentLetter === letter 
                ? 'bg-primary-600 dark:bg-primary-700 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
            onClick={() => handleLetterClick(letter)}
          >
            {letter}
          </button>
        ))}
      </div>
      
      {/* Mobile Word Details (shows up when a word is selected) */}
      {selectedWord && showDetailsMobile && (
        <div className="md:hidden bg-white dark:bg-gray-800 p-4 mb-2 shadow-md dark:shadow-gray-700">
          <button 
            onClick={handleBackToList}
            className="mb-4 text-primary-700 dark:text-primary-400 flex items-center"
          >
            ← Back to list
          </button>
          
          <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-300 mb-2">{selectedWord.igalaWord}</h2>
          <div className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-300 px-3 py-1 rounded-full inline-block mb-4">
            {selectedWord.englishMeaning}
          </div>
          
          {selectedWord.description && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</h3>
              <p className="text-gray-600 dark:text-gray-400">{selectedWord.description}</p>
            </div>
          )}
          
          <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Usage Examples</h3>
            <p className="text-gray-500 dark:text-gray-400 italic">Examples not available for this entry.</p>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Word List (hidden on mobile when details are showing) */}
        <div className={`${showDetailsMobile ? 'hidden md:block' : ''} w-full md:w-1/3 bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700 overflow-y-auto max-h-[calc(100vh-12rem)]`}>
          {loading ? (
            <div className="p-4 text-center dark:text-gray-300">Loading dictionary...</div>
          ) : filteredWords.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredWords.map((entry, index) => (
                <li 
                  key={index} 
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${selectedWord === entry ? 'bg-primary-50 dark:bg-primary-900/40 border-l-4 border-primary-500 dark:border-primary-600' : ''}`}
                  onClick={() => handleWordClick(entry)}
                >
                  <div className="px-4 py-3">
                    <div className="font-medium text-primary-800 dark:text-primary-300">{entry.igalaWord}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{entry.englishMeaning}</div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">No words found</div>
          )}
        </div>
        
        {/* Word Details (Desktop version) */}
        <div className={`hidden md:block md:w-2/3 bg-gray-50 dark:bg-gray-850 p-6 overflow-y-auto max-h-[calc(100vh-12rem)]`}>
          {selectedWord ? (
            <div>
              <h2 className="text-3xl font-bold text-primary-800 dark:text-primary-300 mb-2">{selectedWord.igalaWord}</h2>
              <div className="bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-300 px-3 py-1 rounded-full inline-block mb-4">
                {selectedWord.englishMeaning}
              </div>
              {selectedWord.description && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</h3>
                  <p className="text-gray-600 dark:text-gray-400">{selectedWord.description}</p>
                </div>
              )}
              
              <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Usage Examples</h3>
                <p className="text-gray-500 dark:text-gray-400 italic">Examples not available for this entry.</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <div className="text-6xl mb-4">📚</div>
              <p>Select a word to view details</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-950 text-white p-3 text-center text-sm">
        <p>© {new Date().getFullYear()} Igala Dictionary | Contributing to the preservation of Igala language and culture</p>
      </footer>
    </div>
  );
}