import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import TypewriterMessage from './TypewriterMessage';
import {
  loadSessions,
  createSession,
  saveSession,
  deleteSession,
  setActiveSessionId,
  getActiveSessionId,
  rehydrateMessages,
  getTimeRemaining,
} from '../utils/chatSessionManager';
import '../styles/AIAssistant.css';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [backendSessionId, setBackendSessionId] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null); // session id to confirm delete

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const launcherRef = useRef(null);

  // ── Bootstrap sessions on mount ─────────────────────────────────────────
  useEffect(() => {
    let allSessions = loadSessions();
    if (allSessions.length === 0) {
      const fresh = createSession(0);
      allSessions = [fresh];
    }
    setSessions(allSessions);

    const lastActive = getActiveSessionId();
    const target = allSessions.find(s => s.id === lastActive) || allSessions[0];
    activateSession(target);
  }, []);

  const activateSession = useCallback((session) => {
    setActiveId(session.id);
    setBackendSessionId(session.backendSessionId);
    setMessages(rehydrateMessages(session.messages));
    setActiveSessionId(session.id);
    setShowSidebar(false);
  }, []);

  // ── Auto-scroll ──────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Auto-resize textarea ─────────────────────────────────────────────────
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 100) + 'px';
    }
  }, [inputMessage]);

  // ── Escape key ───────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        if (showSidebar) { setShowSidebar(false); return; }
        if (isOpen) { setIsOpen(false); launcherRef.current?.focus(); }
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, showSidebar]);

  // ── Focus on open ────────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen && !showSidebar) {
      setTimeout(() => textareaRef.current?.focus(), 280);
    }
  }, [isOpen, showSidebar]);

  // ── Persist messages whenever they change ────────────────────────────────
  useEffect(() => {
    if (!activeSessionId || messages.length === 0) return;
    saveSession(activeSessionId, messages, backendSessionId);
    setSessions(loadSessions());
  }, [messages, backendSessionId, activeSessionId]);

  // ── Send message ─────────────────────────────────────────────────────────
  const sendMessage = async (messageText) => {
    const text = (messageText ?? inputMessage).trim();
    if (!text || isLoading) return;
    setInputMessage('');
    setIsLoading(true);

    const userMsg = { type: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);

    try {
      const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const res = await fetch(`${BASE_URL}/api/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, session_id: backendSessionId }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [...prev, { type: 'ai', content: data.response, timestamp: new Date(), isTyping: true }]);
        setBackendSessionId(data.session_id);
      } else {
        setMessages(prev => [...prev, { type: 'ai', content: '🔧 I hit a snag. Please try again.', timestamp: new Date(), isTyping: true }]);
      }
    } catch {
      setMessages(prev => [...prev, { type: 'ai', content: "🌐 Can't connect right now. Feel free to browse Asmit's projects below!", timestamp: new Date(), isTyping: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handleTypingComplete = (idx) => {
    setMessages(prev => prev.map((m, i) => i === idx ? { ...m, isTyping: false } : m));
  };

  // ── Session actions ──────────────────────────────────────────────────────
  const handleNewSession = () => {
    const fresh = createSession(sessions.length);
    setSessions(loadSessions());
    activateSession(fresh);
  };

  const handleSwitchSession = (session) => {
    if (session.id === activeSessionId) { setShowSidebar(false); return; }
    activateSession(session);
  };

  const handleDeleteSession = (id) => {
    const remaining = deleteSession(id);
    setSessions(remaining);
    setConfirmDelete(null);
    if (id === activeSessionId) {
      if (remaining.length > 0) {
        activateSession(remaining[0]);
      } else {
        const fresh = createSession(0);
        setSessions(loadSessions());
        activateSession(fresh);
      }
    }
  };

  // ── Helpers ──────────────────────────────────────────────────────────────
  const formatTime = (ts) =>
    (ts instanceof Date ? ts : new Date(ts)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const quickChips = [
    { label: 'View Projects', query: 'What projects has Asmit worked on?' },
    { label: 'Skills', query: 'What are his technical skills?' },
    { label: 'Contact', query: 'How can I contact Asmit?' },
    { label: 'Resume', query: 'Tell me about his experience and resume.' },
  ];

  const markdownComponents = {
    p: ({ node, ...props }) => <p {...props} />,
    h1: ({ node, ...props }) => <h1 {...props} />,
    h2: ({ node, ...props }) => <h2 {...props} />,
    h3: ({ node, ...props }) => <h3 {...props} />,
    ul: ({ node, ...props }) => <ul {...props} />,
    ol: ({ node, ...props }) => <ol {...props} />,
    li: ({ node, ...props }) => <li {...props} />,
    code: ({ node, inline, ...props }) => inline ? <code {...props} /> : <pre><code {...props} /></pre>,
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

  const showChips = messages.length === 1 && !isLoading;
  const isInputDisabled = isLoading || messages.some(m => m.isTyping);
  const activeSession = sessions.find(s => s.id === activeSessionId);

  return (
    <>
      {/* Launcher */}
      <button
        ref={launcherRef}
        className={`ai-launcher ${isOpen ? 'ai-launcher--open' : ''}`}
        onClick={() => setIsOpen(p => !p)}
        aria-label={isOpen ? 'Close AI assistant' : 'Open Ask Asmit AI'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <svg className="ai-launcher__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        ) : (
          <>
            <svg className="ai-launcher__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <circle cx="9" cy="10" r="0.8" fill="currentColor" /><circle cx="12" cy="10" r="0.8" fill="currentColor" /><circle cx="15" cy="10" r="0.8" fill="currentColor" />
            </svg>
            <span className="ai-launcher__label">Ask Asmit AI</span>
          </>
        )}
      </button>

      {/* Chat Panel */}
      <div id="ai-chat-panel" className={`ai-panel ${isOpen ? 'ai-panel--open' : ''}`} role="dialog" aria-label="AI chat assistant" aria-hidden={!isOpen}>

        {/* Header */}
        <div className="ai-panel__header">
          <div className="ai-panel__header-glow" aria-hidden="true" />
          {/* Sessions toggle */}
          <button className="ai-panel__sessions-btn" onClick={() => setShowSidebar(p => !p)} aria-label="Manage sessions" title="Chat Sessions">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
          </button>
          <div className="ai-panel__avatar" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <circle cx="9" cy="10" r="0.8" fill="currentColor" /><circle cx="12" cy="10" r="0.8" fill="currentColor" /><circle cx="15" cy="10" r="0.8" fill="currentColor" />
            </svg>
          </div>
          <div className="ai-panel__header-info">
            <span className="ai-panel__title">Ask Asmit AI</span>
            <span className="ai-panel__status">Portfolio assistant · Online</span>
          </div>
          <button className="ai-panel__close" onClick={() => { setIsOpen(false); launcherRef.current?.focus(); }} aria-label="Close chat panel">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        {/* Session Sidebar Overlay */}
        {showSidebar && (
          <div className="ai-sidebar">
            <div className="ai-sidebar__header">
              <span className="ai-sidebar__title">Chat Sessions</span>
              <button className="ai-sidebar__new" onClick={handleNewSession} aria-label="New chat session">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                New Chat
              </button>
            </div>
            <div className="ai-sidebar__list">
              {sessions.map(session => (
                <div
                  key={session.id}
                  className={`ai-sidebar__item ${session.id === activeSessionId ? 'ai-sidebar__item--active' : ''}`}
                >
                  <button className="ai-sidebar__item-btn" onClick={() => handleSwitchSession(session)}>
                    <span className="ai-sidebar__item-name">{session.name}</span>
                    <span className="ai-sidebar__item-meta">
                      {session.messages.length - 1} msg · {getTimeRemaining(session)}
                    </span>
                  </button>
                  {confirmDelete === session.id ? (
                    <div className="ai-sidebar__confirm">
                      <button className="ai-sidebar__confirm-yes" onClick={() => handleDeleteSession(session.id)}>Delete</button>
                      <button className="ai-sidebar__confirm-no" onClick={() => setConfirmDelete(null)}>Cancel</button>
                    </div>
                  ) : (
                    <button className="ai-sidebar__delete" onClick={() => setConfirmDelete(session.id)} aria-label="Delete session">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="ai-sidebar__footer">Sessions clear after 48 hours</p>
          </div>
        )}

        {/* Messages */}
        <div className="ai-panel__messages" role="log" aria-live="polite" aria-label="Chat messages">
          {messages.map((message, index) => (
            <div key={index} className={`ai-msg ai-msg--${message.type}`}>
              <div className="ai-msg__bubble">
                {message.type === 'ai' ? (
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    {index === 0 && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ai-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px', marginRight: '10px' }}>
                        <polyline points="15 18 21 12 15 6"/><polyline points="9 6 3 12 9 18"/>
                        <circle cx="12" cy="12" r="2.5"/><line x1="12" y1="3" x2="12" y2="9.5"/><line x1="12" y1="14.5" x2="12" y2="21"/>
                      </svg>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {message.isTyping ? (
                        <TypewriterMessage content={message.content} speed={15} onComplete={() => handleTypingComplete(index)} markdownComponents={markdownComponents} />
                      ) : (
                        <div className="markdown-content">
                          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{message.content}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <span>{message.content}</span>
                )}
                <time className="ai-msg__time" dateTime={message.timestamp instanceof Date ? message.timestamp.toISOString() : new Date(message.timestamp).toISOString()}>
                  {formatTime(message.timestamp)}
                </time>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="ai-msg ai-msg--ai">
              <div className="ai-msg__bubble ai-msg__bubble--typing">
                <div className="ai-typing" aria-label="AI is thinking"><span /><span /><span /></div>
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
              {quickChips.map(chip => (
                <button key={chip.label} className="ai-chip" onClick={() => !isInputDisabled && sendMessage(chip.query)} disabled={isInputDisabled} aria-label={`Ask: ${chip.query}`}>
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
            onChange={e => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isInputDisabled ? 'AI is typing…' : "Ask about Asmit's work…"}
            rows={1}
            disabled={isInputDisabled}
            aria-label="Type your message"
          />
          <button className="ai-panel__send" onClick={() => sendMessage()} disabled={!inputMessage.trim() || isInputDisabled} aria-label="Send message">
            {isLoading ? (
              <svg className="ai-panel__send-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default AIAssistant;