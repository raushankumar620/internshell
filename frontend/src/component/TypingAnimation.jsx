import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';

const TypingAnimation = ({ 
  texts = [], 
  speed = 150, 
  delay = 2000,
  variant = "h4",
  color = "text.primary",
  sx = {},
  component = "div"
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(speed);

  useEffect(() => {
    if (texts.length === 0) return;

    const currentString = texts[currentTextIndex];

    const timer = setTimeout(() => {
      if (isDeleting) {
        // Deleting phase
        setCurrentText(currentString.substring(0, currentText.length - 1));
        setTypingSpeed(speed / 2);
        
        // If finished deleting, move to next text
        if (currentText === '') {
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
          setTypingSpeed(speed);
        }
      } else {
        // Typing phase
        setCurrentText(currentString.substring(0, currentText.length + 1));
        setTypingSpeed(speed);
        
        // If finished typing, start deleting after delay
        if (currentText === currentString) {
          setTimeout(() => setIsDeleting(true), delay);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentTextIndex, texts, speed, delay, typingSpeed]);

  return (
    <Typography 
      variant={variant} 
      color={color}
      component={component}
      sx={{ 
        ...sx,
        display: 'inline-block',
        position: 'relative'
      }}
    >
      {currentText}
      <span style={{ 
        display: 'inline-block',
        width: '2px',
        height: '1.2em',
        backgroundColor: 'currentColor',
        marginLeft: '2px',
        animation: 'blink 1s infinite'
      }} />
      
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </Typography>
  );
};

export default TypingAnimation;