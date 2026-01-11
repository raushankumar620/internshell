import React, { useState, useEffect } from 'react';

const TypewriterText = ({ text, speed = 150, loopCount = 3 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopIteration, setLoopIteration] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (isCompleted) return;

    const type = () => {
      if (isDeleting) {
        // Deleting phase
        if (displayText.length > 0) {
          setDisplayText(prev => prev.slice(0, -1));
        } else {
          // Finished deleting, check if we should continue looping
          if (loopIteration < loopCount - 1) {
            // Continue to next loop
            setIsDeleting(false);
            setLoopIteration(prev => prev + 1);
            setCurrentIndex(0);
          } else {
            // Completed all loops
            setIsCompleted(true);
            setShowCursor(false);
          }
        }
      } else {
        // Typing phase
        if (currentIndex < text.length) {
          setDisplayText(prev => prev + text[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        } else {
          // Finished typing, start deleting after a pause
          setTimeout(() => setIsDeleting(true), 1000);
        }
      }
    };

    const timeout = setTimeout(type, isDeleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [displayText, currentIndex, text, speed, isDeleting, loopIteration, loopCount, isCompleted]);

  // Blink cursor effect (only when not completed)
  useEffect(() => {
    if (isCompleted) return;

    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, [isCompleted]);

  return (
    <span>
      {displayText}
      <span style={{ display: showCursor ? 'inline' : 'none' }}>
        |
      </span>
    </span>
  );
};

export default TypewriterText;