import React, { useState, useEffect, useRef } from 'react';
import './SearchBar.css';

// Define types for suggestion data (could be an interface if more complex)
type Suggestion = string;

// Mock suggestions (replace with API call in real use)
const mockSuggestions: Suggestion[] = [
  'React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 
  'HTML', 'CSS', 'GraphQL', 'Redux', 'Next.js'
];

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Debounced search handler
  const handleSearch = (value: string) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (value.trim() === '') {
        setSuggestions([]);
        return;
      }

      // Simulate API call with filtering
      const filteredSuggestions = mockSuggestions
        .filter((item) => item.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5); // Limit to 5 suggestions
      setSuggestions(filteredSuggestions);
    }, 300); // 300ms debounce
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
    setHighlightedIndex(-1); // Reset highlight on new input
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion: Suggestion) => {
    setQuery(suggestion);
    setSuggestions([]);
    setIsFocused(false);
    inputRef.current?.focus();
  };

  // Clear input
  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[highlightedIndex]);
    } else if (e.key === 'Escape') {
      setSuggestions([]);
      setIsFocused(false);
    }
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, []);

  return (
    <div className="search-bar-container">
      <div className="input-wrapper">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 100)} // Delay to allow click
          onKeyDown={handleKeyDown}
          placeholder="Search..."
          className="search-input"
        />
        {query && (
          <button onClick={handleClear} className="clear-button">
            ×
          </button>
        )}
      </div>
      {isFocused && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion}
              className={`suggestion-item ${index === highlightedIndex ? 'highlighted' : ''}`}
              onMouseDown={() => handleSelectSuggestion(suggestion)} // MouseDown to prevent blur
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;