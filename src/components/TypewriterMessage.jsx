import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const TypewriterMessage = ({ content, speed = 30, onComplete, markdownComponents }) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!content) return;

    let currentIndex = 0;
    setDisplayedContent('');
    setIsComplete(false);

    const typeWriter = () => {
      if (currentIndex < content.length) {
        setDisplayedContent(content.slice(0, currentIndex + 1));
        currentIndex++;
        
        // Adjust speed based on character type
        let currentSpeed = speed;
        const currentChar = content[currentIndex - 1];
        
        // Slower for punctuation to create natural pauses
        if (['.', '!', '?'].includes(currentChar)) {
          currentSpeed = speed * 3;
        } else if ([',', ';', ':'].includes(currentChar)) {
          currentSpeed = speed * 2;
        } else if (currentChar === ' ') {
          currentSpeed = speed * 0.5;
        }
        
        setTimeout(typeWriter, currentSpeed);
      } else {
        setIsComplete(true);
        if (onComplete) {
          onComplete();
        }
      }
    };

    // Start typing after a small delay
    const timer = setTimeout(typeWriter, 200);

    return () => clearTimeout(timer);
  }, [content, speed, onComplete]);

  return (
    <div className="markdown-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {displayedContent + (!isComplete ? ' ▍' : '')}
      </ReactMarkdown>
    </div>
  );
};

export default TypewriterMessage;