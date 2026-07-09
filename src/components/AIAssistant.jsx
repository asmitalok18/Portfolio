import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import TypewriterMessage from './TypewriterMessage';
import '../styles/AIAssistant.css';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      content: "✨ Hey! I'm Asmit's AI assistant. Ask me anything about his projects, skills, experience, or how to get in touch.",
      timestamp: new Date(),
      isTyping: false
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const panelRef = useRef(null);
  const launcherRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 100) + 'px';
    }
  }, [inputMessage]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        launcherRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 280);
    }
  }, [isOpen]);

  const sendMessage = async (messageText) => {
    const text = messageText ?? inputMessage;
    if (!text.trim() || isLoading) return;

    const userMessage = text.trim();
    setInputMessage('');
    setIsLoading(true);

    setMessages(prev => [...prev, {
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);

    try {
      const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const response = await fetch(`${BASE_URL}/api/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, session_id: sessionId }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(prev => [...prev, {
          type: 'ai',
          content: data.response,
          timestamp: new Date(),
          isTyping: true
        }]);
        setSessionId(data.session_id);
      } else {
        setMessages(prev => [...prev, {
          type: 'ai',
          content: '🔧 I hit a snag. Please try again or explore the portfolio directly.',
          timestamp: new Date(),
          isTyping: true
        }]);
      }
    } catch {
      setMessages(prev => [...prev, {
        type: 'ai',
        content: "🌐 Can't connect right now. Feel free to browse Asmit's projects and contact info below!",
        timestamp: new Date(),
        isTyping: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTypingComplete = (messageIndex) => {
    setMessages(prev => prev.map((msg, i) =>
      i === messageIndex ? { ...msg, isTyping: false } : msg
    ));
  };

  const quickChips = [
    { label: 'View Projects', query: 'What projects has Asmit worked on?' },
    { label: 'Skills', query: 'What are his technical skills?' },
    { label: 'Contact', query: 'How can I contact Asmit?' },
    { label: 'Resume', query: 'Tell me about his experience and resume.' },
  ];

  const handleChip = (query) => {
    sendMessage(query);
  };

  const formatTime = (timestamp) =>
    timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const markdownComponents = {
    p: ({ node, ...props }) => <p {...props} />,
    h1: ({ node, ...props }) => <h1 {...props} />,
    h2: ({ node, ...props }) => <h2 {...props} />,
    h3: ({ node, ...props }) => <h3 {...props} />,
    h4: ({ node, ...props }) => <h4 {...props} />,
    h5: ({ node, ...props }) => <h5 {...props} />,
    h6: ({ node, ...props }) => <h6 {...props} />,
    ul: ({ node, ...props }) => <ul {...props} />,
    ol: ({ node, ...props }) => <ol {...props} />,
    li: ({ node, ...props }) => <li {...props} />,
    code: ({ node, inline, ...props }) =>
      inline ? <code {...props} /> : <pre><code {...props} /></pre>,
    a: ({ node, ...props }) => <a {...props} />,
    blockquote: ({ node, ...props }) => <blockquote {...props} />,
    table: ({ node, ...props }) => <table {...props} />,
    thead: ({ node, ...props }) => <thead {...props} />,
    tbody: ({ node, ...props }) => <tbody {...props} />,
    tr: ({ node, ...props }) => <tr {...props} />,
    th: ({ node, ...props }) => <th {...props} />,
    td: ({ node, ...props }) => <td {...props} />,
    hr: ({ node, ...props }) => <hr {...props} />,
  };

  const toggleChat = () => setIsOpen(prev => !prev);

  const showChips = messages.length === 1 && !isLoading;

  return (
    <>
      {/* Launcher Button */}
      <button
        ref={launcherRef}
        className={`ai-launcher ${isOpen ? 'ai-launcher--open' : ''}`}
        onClick={toggleChat}
        aria-label={isOpen ? 'Close AI assistant' : 'Open Ask Asmit AI'}
        aria-expanded={isOpen}
        aria-controls="ai-chat-panel"
      >
        {isOpen ? (
          <svg className="ai-launcher__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <>
            <svg className="ai-launcher__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <circle cx="9" cy="10" r="0.8" fill="currentColor" />
              <circle cx="12" cy="10" r="0.8" fill="currentColor" />
              <circle cx="15" cy="10" r="0.8" fill="currentColor" />
            </svg>
            <span className="ai-launcher__label" aria-hidden="true">Ask Asmit AI</span>
            <span className="ai-launcher__status-dot" aria-hidden="true" />
          </>
        )}
      </button>

      {/* Chat Panel */}
      <div
        id="ai-chat-panel"
        ref={panelRef}
        className={`ai-panel ${isOpen ? 'ai-panel--open' : ''}`}
        role="dialog"
        aria-label="AI chat assistant"
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="ai-panel__header">
          <div className="ai-panel__header-glow" aria-hidden="true" />
          <div className="ai-panel__avatar" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <circle cx="9" cy="10" r="0.8" fill="currentColor" />
              <circle cx="12" cy="10" r="0.8" fill="currentColor" />
              <circle cx="15" cy="10" r="0.8" fill="currentColor" />
            </svg>
          </div>
          <div className="ai-panel__header-info">
            <span className="ai-panel__title">Ask Asmit AI</span>
            <span className="ai-panel__status">
              Portfolio assistant · Online
            </span>
          </div>
          <button
            className="ai-panel__close"
            onClick={() => { setIsOpen(false); launcherRef.current?.focus(); }}
            aria-label="Close chat panel"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="ai-panel__messages" role="log" aria-live="polite" aria-label="Chat messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`ai-msg ai-msg--${message.type}`}
            >
              <div className="ai-msg__bubble">
                {message.type === 'ai' ? (
                  message.isTyping ? (
                    <TypewriterMessage
                      content={message.content}
                      speed={15}
                      onComplete={() => handleTypingComplete(index)}
                      markdownComponents={markdownComponents}
                    />
                  ) : (
                    <div className="markdown-content">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  )
                ) : (
                  <span>{message.content}</span>
                )}
                <time className="ai-msg__time" dateTime={message.timestamp.toISOString()}>
                  {formatTime(message.timestamp)}
                </time>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="ai-msg ai-msg--ai">
              <div className="ai-msg__bubble ai-msg__bubble--typing">
                <div className="ai-typing" aria-label="AI is thinking">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Chips */}
        {showChips && (
          <div className="ai-chips" aria-label="Quick suggestions">
            <p className="ai-chips__label">Quick questions</p>
            <div className="ai-chips__list">
              {quickChips.map((chip) => (
                <button
                  key={chip.label}
                  className="ai-chip"
                  onClick={() => handleChip(chip.query)}
                  aria-label={`Ask: ${chip.query}`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="ai-panel__input-area">
          <textarea
            ref={textareaRef}
            className="ai-panel__textarea"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about Asmit's work..."
            rows={1}
            disabled={isLoading}
            aria-label="Type your message"
            aria-multiline="true"
          />
          <button
            className="ai-panel__send"
            onClick={() => sendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            aria-label="Send message"
          >
            {isLoading ? (
              <svg className="ai-panel__send-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default AIAssistant;