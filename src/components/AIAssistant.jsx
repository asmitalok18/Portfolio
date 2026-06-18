import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import TypewriterMessage from './TypewriterMessage';
import '../styles/AIAssistant.css';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      content: "👋 Hey there! I'm Asmit's AI assistant powered by advanced intelligence. I can tell you all about his projects, skills, experience, and professional background. What would you like to know?",
      timestamp: new Date(),
      isTyping: false
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputMessage]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    // Add user message to chat
    const newUserMessage = {
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);

    try {
      const response = await fetch('http://localhost:8000/api/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          session_id: sessionId
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        const aiMessage = {
          type: 'ai',
          content: data.response,
          timestamp: new Date(),
          isTyping: true
        };
        setMessages(prev => [...prev, aiMessage]);
        setSessionId(data.session_id);
      } else {
        const errorMessage = {
          type: 'ai',
          content: '🔧 Oops! I encountered a technical issue. Please try asking your question again, or feel free to explore the portfolio directly.',
          timestamp: new Date(),
          isTyping: true
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage = {
        type: 'ai',
        content: '🌐 I\'m having trouble connecting right now. While I get back online, feel free to browse through Asmit\'s projects and contact information!',
        timestamp: new Date(),
        isTyping: true
      };
      setMessages(prev => [...prev, errorMessage]);
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
    setMessages(prev => prev.map((msg, index) => 
      index === messageIndex ? { ...msg, isTyping: false } : msg
    ));
  };

  const quickQuestions = [
    "🚀 What projects has Asmit worked on?",
    "💻 What are his technical skills?",
    "📧 How can I contact him?",
    "🎯 Tell me about his experience",
    "🔧 What technologies does he use?",
    "📱 Show me his mobile projects"
  ];

  const handleQuickQuestion = (question) => {
    // Remove emoji from the question for cleaner input
    const cleanQuestion = question.replace(/^[^\w\s]+\s*/, '');
    setInputMessage(cleanQuestion);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const markdownComponents = {
    p: ({node, ...props}) => <p {...props} />,
    h1: ({node, ...props}) => <h1 {...props} />,
    h2: ({node, ...props}) => <h2 {...props} />,
    h3: ({node, ...props}) => <h3 {...props} />,
    h4: ({node, ...props}) => <h4 {...props} />,
    h5: ({node, ...props}) => <h5 {...props} />,
    h6: ({node, ...props}) => <h6 {...props} />,
    ul: ({node, ...props}) => <ul {...props} />,
    ol: ({node, ...props}) => <ol {...props} />,
    li: ({node, ...props}) => <li {...props} />,
    code: ({node, inline, ...props}) => 
      inline ? <code {...props} /> : <pre><code {...props} /></pre>,
    a: ({node, ...props}) => <a {...props} />,
    blockquote: ({node, ...props}) => <blockquote {...props} />,
    table: ({node, ...props}) => <table {...props} />,
    thead: ({node, ...props}) => <thead {...props} />,
    tbody: ({node, ...props}) => <tbody {...props} />,
    tr: ({node, ...props}) => <tr {...props} />,
    th: ({node, ...props}) => <th {...props} />,
    td: ({node, ...props}) => <td {...props} />,
    hr: ({node, ...props}) => <hr {...props} />,
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    // Focus on input when opening
    if (!isOpen) {
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 300);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div 
        className={`ai-chat-toggle ${isOpen ? 'open' : ''}`}
        onClick={toggleChat}
        title={isOpen ? 'Close chat' : 'Ask my intelligent assistant about Asmit'}
      >
        <div className="chat-icon">
          {isOpen ? '✕' : (
            <div className="ai-icon-custom">
              <div className="ai-dot"></div>
              <div className="ai-pulse"></div>
            </div>
          )}
        </div>
        {!isOpen && <span className="chat-tooltip">Ask my AI about me!</span>}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="ai-chat-window">
          <div className="chat-header">
            <h3>Asmit's Assistant</h3>
            <button 
              className="close-btn"
              onClick={() => setIsOpen(false)}
              title="Close chat"
            >
              ✕
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.type}`}
              >
                <div className="message-content">
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
                    message.content
                  )}
                  <div className="message-time" style={{
                    fontSize: '11px',
                    opacity: 0.6,
                    marginTop: '5px',
                    textAlign: message.type === 'user' ? 'right' : 'left'
                  }}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="message ai">
                <div className="message-content typing">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && !isLoading && (
            <div className="quick-questions">
              <p>💡 Quick Questions</p>
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  className="quick-question-btn"
                  onClick={() => handleQuickQuestion(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          <div className="chat-input">
            <textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about Asmit's work..."
              rows="1"
              disabled={isLoading}
              style={{ minHeight: '50px', maxHeight: '120px' }}
            />
            <button 
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="send-btn"
              title="Send message"
            >
              {isLoading ? '⏳' : '➤'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;