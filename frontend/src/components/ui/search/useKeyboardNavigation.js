import { useState, useCallback } from 'react';

const useKeyboardNavigation = (results, suggestions, onResultClick, onSuggestionClick) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isNavigatingResults, setIsNavigatingResults] = useState(true);

  const totalItems = (isNavigatingResults ? results : suggestions).length;

  const handleKeyDown = useCallback((e) => {
    if (totalItems === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => {
          const newIndex = prev < totalItems - 1 ? prev + 1 : 0;
          return newIndex;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => {
          const newIndex = prev > 0 ? prev - 1 : totalItems - 1;
          return newIndex;
        });
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          if (isNavigatingResults) {
            onResultClick(results[selectedIndex]);
          } else {
            onSuggestionClick(suggestions[selectedIndex]);
          }
        }
        break;
      case 'Tab':
        if (e.shiftKey) {
          // Switch between results and suggestions
          setIsNavigatingResults(prev => !prev);
          setSelectedIndex(-1);
        }
        break;
    }
  }, [totalItems, selectedIndex, isNavigatingResults, results, suggestions, onResultClick, onSuggestionClick]);

  const resetSelection = useCallback(() => {
    setSelectedIndex(-1);
    setIsNavigatingResults(true);
  }, []);

  return { selectedIndex, isNavigatingResults, handleKeyDown, resetSelection };
};

export default useKeyboardNavigation; 