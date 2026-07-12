import React, { useState, useEffect } from 'react';
import { 
  FaTachometerAlt, FaUser, FaCode, FaBriefcase, 
  FaFileAlt, FaEnvelope, FaPlus, FaEdit, 
  FaTrash, FaCloudUploadAlt, FaSignOutAlt, FaLink,
  FaMapMarkerAlt, FaPhoneAlt, FaCheckCircle, FaProjectDiagram,
  FaSpinner, FaEye, FaEyeSlash, FaBars, FaTimes
} from 'react-icons/fa';
import '../styles/PortfolioManagement.css';
import PremiumLoader, { PremiumLoaderButton } from './PremiumLoader';
import toast, { Toaster } from 'react-hot-toast';

const BASE_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_BASE_URL || 'http://localhost:8000';

const PortfolioManagement = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/check/`, { credentials: 'include' });
      const data = await response.json();
      setIsAuthenticated(data.authenticated);
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const response = await fetch(`${BASE_URL}/api/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(loginData)
      });
      
      const data = await response.json();
      if (response.ok && data.success) {
        setIsAuthenticated(true);
      } else if (response.status === 429 || data?.error?.code === 'RATE_LIMIT_EXCEEDED') {
        const retryAfter = data?.error?.retryAfter || response.headers.get('Retry-After') || 60;
        toast.error(data?.error?.message || `You have made too many requests. Please try again in ${retryAfter} seconds.`);
      } else {
        toast.error(data.message || 'Invalid credentials');
      }
    } catch (error) {
      toast.error('Login failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await fetch(`${BASE_URL}/api/auth/logout/`, {
        method: 'POST',
        credentials: 'include'
      });
      setIsAuthenticated(false);
      setLoginData({ username: '', password: '' });
      window.history.replaceState(null, '', window.location.pathname);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div style={{ background: 'var(--dark-bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <PremiumLoader text="INITIALIZING ADMIN SYSTEM" />
      </div>
    );
  }

  if (isLoggingOut) {
    return (
      <div style={{ background: 'var(--dark-bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <PremiumLoader text="SIGNING OUT SECURELY..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="management-login">
        <Toaster position="bottom-right" toastOptions={{
          style: { background: '#1a1a24', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }
        }} />
        <div className="login-container">
          <h2>Asmit's Admin Panel</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Username"
                value={loginData.username}
                onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                required
              />
            </div>
            <div className="form-group" style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                required
                style={{ paddingRight: '40px' }}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#aebdcc', cursor: 'pointer', padding: '5px' }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <button type="submit" disabled={isLoggingIn}>
              {isLoggingIn ? <PremiumLoaderButton size={24} /> : "Access Console"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-management">
      <Toaster position="bottom-right" toastOptions={{
        style: { background: '#1a1a24', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' },
        success: { iconTheme: { primary: '#60a5fa', secondary: '#fff' } }
      }} />
      
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}
      
      <div className={`management-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <h2>Asmit</h2>
          <span>Admin Console</span>
          <button className="mobile-close-btn" onClick={() => setIsSidebarOpen(false)}>
            <FaTimes />
          </button>
        </div>
        <div className="sidebar-nav">
          <button className={`sidebar-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => {setActiveTab('dashboard'); setIsSidebarOpen(false);}}>
            <FaTachometerAlt /> Dashboard
          </button>
          <button className={`sidebar-nav-btn ${activeTab === 'hero' ? 'active' : ''}`} onClick={() => {setActiveTab('hero'); setIsSidebarOpen(false);}}>
            <FaUser /> Hero Section
          </button>
          <button className={`sidebar-nav-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => {setActiveTab('profile'); setIsSidebarOpen(false);}}>
            <FaUser /> Personal Profile
          </button>
          <button className={`sidebar-nav-btn ${activeTab === 'skills' ? 'active' : ''}`} onClick={() => {setActiveTab('skills'); setIsSidebarOpen(false);}}>
            <FaCode /> Skills Matrix
          </button>
          <button className={`sidebar-nav-btn ${activeTab === 'experience' ? 'active' : ''}`} onClick={() => {setActiveTab('experience'); setIsSidebarOpen(false);}}>
            <FaBriefcase /> Work Experience
          </button>
          <button className={`sidebar-nav-btn ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => {setActiveTab('projects'); setIsSidebarOpen(false);}}>
            <FaProjectDiagram /> Projects CRUD
          </button>
          <button className={`sidebar-nav-btn ${activeTab === 'resume' ? 'active' : ''}`} onClick={() => {setActiveTab('resume'); setIsSidebarOpen(false);}}>
            <FaFileAlt /> Resume Manager
          </button>
          <button className={`sidebar-nav-btn ${activeTab === 'contact' ? 'active' : ''}`} onClick={() => {setActiveTab('contact'); setIsSidebarOpen(false);}}>
            <FaEnvelope /> Contact Details
          </button>
        </div>
        <div className="sidebar-footer">
          <button className="sidebar-nav-btn" onClick={handleLogout} style={{ color: '#ff6b6b' }}>
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </div>

      <div className="management-main">
        <div className="management-topbar">
          <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
            <FaBars />
          </button>
          <div className="topbar-title">
            <h1>
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'hero' && 'Hero Section Management'}
              {activeTab === 'profile' && 'Personal Profile Details'}
              {activeTab === 'skills' && 'Skills Matrix CRUD'}
              {activeTab === 'experience' && 'Professional Experience CRUD'}
              {activeTab === 'projects' && 'Projects Showcase CRUD'}
              {activeTab === 'resume' && 'Resume Files Manager'}
              {activeTab === 'contact' && 'Contact & Social Details'}
            </h1>
          </div>
          <div className="topbar-actions">
            <div className="topbar-user">
              <div className="user-avatar">A</div>
              <span className="user-name-text">Administrator</span>
            </div>
          </div>
        </div>

        <div className="management-content-container">
          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'hero' && <HeroTab />}
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'skills' && <SkillsTab />}
          {activeTab === 'experience' && <ExperienceTab />}
          {activeTab === 'projects' && <ProjectsTab />}
          {activeTab === 'resume' && <ResumeTab />}
          {activeTab === 'contact' && <ContactTab />}
        </div>
      </div>
    </div>
  );
};

const DashboardTab = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [chats, setChats] = useState([]);
  const [chatsLoading, setChatsLoading] = useState(true);
  const [chatsPage, setChatsPage] = useState(1);
  const [chatsTotalPages, setChatsTotalPages] = useState(1);
  const [chatsHasNext, setChatsHasNext] = useState(false);
  const [chatsHasPrev, setChatsHasPrev] = useState(false);
  const [totalChats, setTotalChats] = useState(0);
  const [selectedChats, setSelectedChats] = useState([]);
  const [expandedChats, setExpandedChats] = useState([]);

  const refreshStats = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/manage/dashboard/`, { credentials: 'include' });
      if (res.ok) {
        setStats(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchChats = async (page = 1) => {
    setChatsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/manage/chats/?page=${page}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setChats(data.results || []);
        setTotalChats(data.count || 0);
        setChatsTotalPages(Math.ceil((data.count || 0) / 10) || 1);
        setChatsHasNext(!!data.next);
        setChatsHasPrev(!!data.previous);
      }
    } catch (e) {
      toast.error('Failed to load chat history');
    } finally {
      setChatsLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await refreshStats();
      await fetchChats(1);
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchChats(chatsPage);
    }
  }, [chatsPage]);

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, type: null, id: null, isDeleting: false });

  const handleDeleteChat = (id, e) => {
    e.stopPropagation();
    setDeleteModal({ isOpen: true, type: 'single', id });
  };

  const handleBulkDelete = () => {
    if (selectedChats.length === 0) return;
    setDeleteModal({ isOpen: true, type: 'bulk', id: null });
  };

  const confirmDelete = async () => {
    setDeleteModal(prev => ({ ...prev, isDeleting: true }));
    if (deleteModal.type === 'single') {
      try {
        const res = await fetch(`${BASE_URL}/api/manage/chats/${deleteModal.id}/`, {
          method: 'DELETE',
          credentials: 'include'
        });
        if (res.ok) {
          toast.success('Query deleted successfully');
          let newPage = chatsPage;
          if (chats.length === 1 && chatsPage > 1) {
            newPage = chatsPage - 1;
            setChatsPage(newPage);
          } else {
            fetchChats(chatsPage);
          }
          refreshStats();
        } else {
          toast.error('Failed to delete query');
        }
      } catch (error) {
        toast.error('Error deleting query');
      }
    } else if (deleteModal.type === 'bulk') {
      try {
        const res = await fetch(`${BASE_URL}/api/manage/chats/bulk-delete/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ ids: selectedChats })
        });
        if (res.ok) {
          toast.success('Selected logs deleted successfully');
          setSelectedChats([]);
          let newPage = chatsPage;
          const remainingInTotal = totalChats - selectedChats.length;
          const maxPages = Math.ceil(remainingInTotal / 10) || 1;
          if (chatsPage > maxPages) {
            newPage = maxPages;
            setChatsPage(newPage);
          } else {
            fetchChats(chatsPage);
          }
          refreshStats();
        } else {
          toast.error('Failed to delete selected logs');
        }
      } catch (error) {
        toast.error('Error deleting selected logs');
      }
    }
    setDeleteModal({ isOpen: false, type: null, id: null, isDeleting: false });
  };

  const toggleSelectChat = (id, e) => {
    e.stopPropagation();
    if (selectedChats.includes(id)) {
      setSelectedChats(selectedChats.filter(x => x !== id));
    } else {
      setSelectedChats([...selectedChats, id]);
    }
  };

  const toggleSelectAll = () => {
    const currentPageIds = chats.map(c => c.id);
    const allSelected = currentPageIds.every(id => selectedChats.includes(id));
    if (allSelected) {
      setSelectedChats(selectedChats.filter(id => !currentPageIds.includes(id)));
    } else {
      const newSelection = [...selectedChats];
      currentPageIds.forEach(id => {
        if (!newSelection.includes(id)) {
          newSelection.push(id);
        }
      });
      setSelectedChats(newSelection);
    }
  };

  const toggleExpandChat = (id) => {
    if (expandedChats.includes(id)) {
      setExpandedChats(expandedChats.filter(x => x !== id));
    } else {
      setExpandedChats([...expandedChats, id]);
    }
  };

  const isAllSelected = chats.length > 0 && chats.map(c => c.id).every(id => selectedChats.includes(id));

  if (loading) return <div style={{padding: '50px', display: 'flex', justifyContent: 'center'}}><PremiumLoader text="LOADING DASHBOARD..." /></div>;

  return (
    <div className="dashboard-overview">
      <div className="dashboard-stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="dashboard-stat-card">
          <div className="stat-card-icon"><FaProjectDiagram /></div>
          <div className="stat-card-info">
            <span className="stat-card-label">Projects</span>
            <span className="stat-card-value">{stats?.total_projects || 0}</span>
          </div>
        </div>
        <div className="dashboard-stat-card">
          <div className="stat-card-icon"><FaCode /></div>
          <div className="stat-card-info">
            <span className="stat-card-label">Skills Listed</span>
            <span className="stat-card-value">{stats?.total_skills || 0}</span>
          </div>
        </div>
        <div className="dashboard-stat-card">
          <div className="stat-card-icon"><FaBriefcase /></div>
          <div className="stat-card-info">
            <span className="stat-card-label">Experiences</span>
            <span className="stat-card-value">{stats?.total_experiences || 0}</span>
          </div>
        </div>
      </div>

      <div className="recent-chats-panel">
        <div className="chats-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
          <h3 style={{ margin: 0 }}>
            Recent AI Assistant Queries ({totalChats} total queries)
          </h3>
          <div className="chats-actions" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {chats.length > 0 && (
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: 'var(--text-muted)' }}>
                <input 
                  type="checkbox" 
                  checked={isAllSelected} 
                  onChange={toggleSelectAll}
                  style={{ cursor: 'pointer' }}
                />
                Select All on Page
              </label>
            )}
            <button 
              onClick={handleBulkDelete}
              disabled={selectedChats.length === 0}
              className="btn-premium-cancel"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '8px 16px', 
                fontSize: '14px', 
                background: selectedChats.length > 0 ? 'var(--accent-main)' : 'rgba(255, 255, 255, 0.05)', 
                color: selectedChats.length > 0 ? '#0f172a' : 'rgba(255, 255, 255, 0.3)',
                cursor: selectedChats.length > 0 ? 'pointer' : 'not-allowed',
                border: 'none',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                fontWeight: selectedChats.length > 0 ? '600' : 'normal'
              }}
            >
              <FaTrash /> Delete Selected ({selectedChats.length})
            </button>
          </div>
        </div>

        {chatsLoading ? (
          <div style={{ padding: '30px', display: 'flex', justifyContent: 'center' }}><PremiumLoader text="FETCHING CONVERSATIONS..." /></div>
        ) : (
          <>
            <div className="recent-chats-list">
              {chats.length > 0 ? (
                chats.map((msg) => {
                  const isExpanded = expandedChats.includes(msg.id);
                  const isSelected = selectedChats.includes(msg.id);
                  return (
                    <div 
                      key={msg.id} 
                      className={`recent-chat-item ${isExpanded ? 'expanded' : ''}`}
                      onClick={() => toggleExpandChat(msg.id)}
                      style={{ 
                        cursor: 'pointer', 
                        flexDirection: 'column', 
                        alignItems: 'stretch',
                        border: isSelected ? '1px solid var(--accent-main)' : '1px solid rgba(255, 255, 255, 0.03)',
                        background: isSelected ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.02)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', width: '100%' }}>
                        <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center' }}>
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={(e) => toggleSelectChat(msg.id, e)}
                            style={{ cursor: 'pointer' }}
                          />
                        </div>
                        <div className="chat-item-content" style={{ flex: 1 }}>
                          <p className="chat-item-text" style={{ whiteSpace: isExpanded ? 'normal' : 'nowrap', wordBreak: 'break-word' }}>
                            "{msg.user_message}"
                          </p>
                          <div className="chat-item-meta">
                            <span>Session: {msg.session_id.substring(0, 8)}...</span>
                            <span className="chat-time-badge">{new Date(msg.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <button 
                            onClick={(e) => handleDeleteChat(msg.id, e)}
                            className="btn-icon delete"
                            title="Delete query log"
                            style={{ 
                              background: 'none', 
                              border: 'none', 
                              color: 'var(--text-muted)', 
                              cursor: 'pointer',
                              padding: '5px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '14px',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-main)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div 
                          className="chat-details-expanded" 
                          style={{ 
                            marginTop: '15px', 
                            paddingTop: '15px', 
                            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                          }}
                        >
                          <div>
                            <strong style={{ color: 'var(--accent-main)', fontSize: '13px', display: 'block', marginBottom: '4px' }}>User Query:</strong>
                            <p style={{ margin: 0, fontSize: '14px', color: '#e2e8f0', lineHeight: 1.5 }}>{msg.user_message}</p>
                          </div>
                          <div>
                            <strong style={{ color: '#10b981', fontSize: '13px', display: 'block', marginBottom: '4px' }}>AI Response:</strong>
                            <div 
                              style={{ 
                                margin: 0, 
                                fontSize: '14px', 
                                color: '#cbd5e1', 
                                lineHeight: 1.6, 
                                background: 'rgba(0, 0, 0, 0.2)', 
                                padding: '12px', 
                                borderRadius: '8px',
                                border: '1px solid rgba(255, 255, 255, 0.03)',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word'
                              }}
                            >
                              {msg.ai_response || 'No response recorded.'}
                            </div>
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            <strong>Full Session ID:</strong> {msg.session_id}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>No AI assistant queries available.</p>
              )}
            </div>

            {chatsTotalPages > 1 && (
              <div className="pagination-controls" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
                <button 
                  disabled={!chatsHasPrev} 
                  onClick={() => setChatsPage(chatsPage - 1)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: chatsHasPrev ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.01)',
                    color: chatsHasPrev ? '#fff' : 'rgba(255, 255, 255, 0.3)',
                    cursor: chatsHasPrev ? 'pointer' : 'not-allowed',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Previous
                </button>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                  Page {chatsPage} of {chatsTotalPages}
                </span>
                <button 
                  disabled={!chatsHasNext} 
                  onClick={() => setChatsPage(chatsPage + 1)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: chatsHasNext ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.01)',
                    color: chatsHasNext ? '#fff' : 'rgba(255, 255, 255, 0.3)',
                    cursor: chatsHasNext ? 'pointer' : 'not-allowed',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="premium-form-card" style={{ width: '100%', maxWidth: '400px', padding: '30px', margin: '20px', background: 'var(--card-bg)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '15px', color: 'var(--text-light)', fontSize: '18px', fontWeight: '600' }}>Confirm Deletion</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '25px', lineHeight: '1.5', fontSize: '15px' }}>
              {deleteModal.type === 'bulk' 
                ? `Are you sure you want to delete ${selectedChats.length} selected session logs?` 
                : 'Are you sure you want to delete this session log?'}
              <br/><br/>This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
              <button 
                className="btn-premium-cancel" 
                onClick={() => setDeleteModal({ isOpen: false, type: null, id: null })}
                style={{ padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-light)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
              >
                Cancel
              </button>
              <button 
                className="btn-premium-submit" 
                onClick={confirmDelete}
                disabled={deleteModal.isDeleting}
                style={{ 
                  padding: '8px 20px', 
                  borderRadius: '8px', 
                  background: deleteModal.isDeleting ? 'rgba(255,255,255,0.1)' : 'var(--accent-main)', 
                  color: deleteModal.isDeleting ? 'rgba(255,255,255,0.5)' : '#0f172a',
                  border: 'none',
                  fontWeight: '600',
                  cursor: deleteModal.isDeleting ? 'not-allowed' : 'pointer'
                }}
              >
                {deleteModal.isDeleting ? <PremiumLoaderButton size={20} /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const HeroTab = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [formData, setFormData] = useState({
    name: '', role: '', main_headline: '', subtitle: '',
    availability_badge: '', cta_labels: '', cta_links: '',
    profile_image: '', resume_link: '', tech_badges: '',
    linkedin: '', github: '', whatsapp: '', telegram: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/manage/hero/`, { credentials: 'include' });
        if (res.ok) {
          setData(await res.json());
        }
      } catch (e) {
        toast.error('Failed to load hero');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      const links = data.social_links || {};
      setFormData({
        name: data.name || '',
        role: data.role || '',
        main_headline: data.main_headline || '',
        subtitle: data.subtitle || '',
        availability_badge: data.availability_badge || '',
        cta_labels: data.cta_labels || '',
        cta_links: data.cta_links || '',
        profile_image: data.profile_image || '',
        resume_link: data.resume_link || '',
        tech_badges: data.tech_badges || '',
        linkedin: links.linkedin || '',
        github: links.github || '',
        whatsapp: links.whatsapp || '',
        telegram: links.telegram || ''
      });
    }
  }, [data]);

  if (loading) return <div style={{padding: '50px', display: 'flex', justifyContent: 'center'}}><PremiumLoader text="LOADING HERO DATA..." /></div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      social_links: {
        linkedin: formData.linkedin,
        github: formData.github,
        whatsapp: formData.whatsapp,
        telegram: formData.telegram
      }
    };
    delete payload.linkedin;
    delete payload.github;
    delete payload.whatsapp;
    delete payload.telegram;

    try {
      const response = await fetch(`${BASE_URL}/api/manage/hero/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setData(await response.json());
        toast.success('Hero settings saved successfully!');
      }
    } catch (error) {
      console.error('Failed to update Hero:', error);
    }
  };

  return (
    <div className="premium-form-card">
      <h3>Edit Hero Landing Details</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-grid-2">
          <div className="form-group-premium">
            <label>Name / Display Title</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div className="form-group-premium">
            <label>Main Headline Title</label>
            <input type="text" value={formData.main_headline} onChange={(e) => setFormData({...formData, main_headline: e.target.value})} required />
          </div>
        </div>
        <div className="form-grid-2">
          <div className="form-group-premium">
            <label>Hero Role Subtitle</label>
            <input type="text" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} required />
          </div>
          <div className="form-group-premium">
            <label>Availability Badge text</label>
            <input type="text" value={formData.availability_badge} onChange={(e) => setFormData({...formData, availability_badge: e.target.value})} />
          </div>
        </div>
        <div className="form-group-premium">
          <label>Hero Description / Intro text</label>
          <textarea value={formData.subtitle} onChange={(e) => setFormData({...formData, subtitle: e.target.value})} required />
        </div>
        <div className="form-grid-2">
          <div className="form-group-premium">
            <label>CTA Button Labels (comma separated)</label>
            <input type="text" value={formData.cta_labels} onChange={(e) => setFormData({...formData, cta_labels: e.target.value})} />
          </div>
          <div className="form-group-premium">
            <label>CTA Button Links (comma separated)</label>
            <input type="text" value={formData.cta_links} onChange={(e) => setFormData({...formData, cta_links: e.target.value})} />
          </div>
        </div>
        <div className="form-grid-2">
          <div className="form-group-premium">
            <label>Profile Image File URL</label>
            <input type="text" value={formData.profile_image} onChange={(e) => setFormData({...formData, profile_image: e.target.value})} />
          </div>
          <div className="form-group-premium">
            <label>Resume Download URL</label>
            <input type="text" value={formData.resume_link} onChange={(e) => setFormData({...formData, resume_link: e.target.value})} />
          </div>
        </div>
        <div className="form-group-premium">
          <label>Hero Technologies Badges (comma separated)</label>
          <input type="text" value={formData.tech_badges} onChange={(e) => setFormData({...formData, tech_badges: e.target.value})} />
        </div>

        <h3 style={{ marginTop: '40px' }}>Hero Social Links</h3>
        <div className="form-grid-2">
          <div className="form-group-premium">
            <label>LinkedIn URL</label>
            <input type="url" value={formData.linkedin} onChange={(e) => setFormData({...formData, linkedin: e.target.value})} />
          </div>
          <div className="form-group-premium">
            <label>GitHub URL</label>
            <input type="url" value={formData.github} onChange={(e) => setFormData({...formData, github: e.target.value})} />
          </div>
        </div>
        <div className="form-grid-2">
          <div className="form-group-premium">
            <label>WhatsApp Link</label>
            <input type="url" value={formData.whatsapp} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} />
          </div>
          <div className="form-group-premium">
            <label>Telegram Link</label>
            <input type="url" value={formData.telegram} onChange={(e) => setFormData({...formData, telegram: e.target.value})} />
          </div>
        </div>

        <div className="form-actions-premium">
          <button type="submit" className="btn-premium-save">Save Settings</button>
        </div>
      </form>
    </div>
  );
};


const ProfileTab = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '', email: '', phone: '', location: '',
    short_bio: '', long_bio: '', current_role: '', current_status: '',
    linkedin: '', github: '', whatsapp: '', telegram: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/manage/profile/`, { credentials: 'include' });
        if (res.ok) {
          setData(await res.json());
        }
      } catch (e) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      const profiles = data.social_profiles || {};
      setFormData({
        full_name: data.full_name || '',
        email: data.email || '',
        phone: data.phone || '',
        location: data.location || '',
        short_bio: data.short_bio || '',
        long_bio: data.long_bio || '',
        current_role: data.current_role || '',
        current_status: data.current_status || '',
        linkedin: profiles.linkedin || '',
        github: profiles.github || '',
        whatsapp: profiles.whatsapp || '',
        telegram: profiles.telegram || ''
      });
    }
  }, [data]);

  if (loading) return <div style={{padding: '50px', display: 'flex', justifyContent: 'center'}}><PremiumLoader text="LOADING PROFILE..." /></div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      social_profiles: {
        linkedin: formData.linkedin,
        github: formData.github,
        whatsapp: formData.whatsapp,
        telegram: formData.telegram
      }
    };
    delete payload.linkedin;
    delete payload.github;
    delete payload.whatsapp;
    delete payload.telegram;

    try {
      const response = await fetch(`${BASE_URL}/api/manage/profile/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setData(await response.json());
        toast.success('Personal Profile saved successfully!');
      }
    } catch (error) {
      console.error('Failed to update Profile:', error);
    }
  };

  return (
    <div className="premium-form-card">
      <h3>Edit Profile / About Me Details</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-grid-2">
          <div className="form-group-premium">
            <label>Full Name</label>
            <input type="text" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} required />
          </div>
          <div className="form-group-premium">
            <label>Current Status</label>
            <input type="text" value={formData.current_status} onChange={(e) => setFormData({...formData, current_status: e.target.value})} required />
          </div>
        </div>
        <div className="form-grid-3">
          <div className="form-group-premium">
            <label>Email Address</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          </div>
          <div className="form-group-premium">
            <label>Phone Number</label>
            <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div className="form-group-premium">
            <label>Location</label>
            <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required />
          </div>
        </div>
        <div className="form-grid-2">
          <div className="form-group-premium">
            <label>Current Role Title</label>
            <input type="text" value={formData.current_role} onChange={(e) => setFormData({...formData, current_role: e.target.value})} required />
          </div>
          <div className="form-group-premium">
            <label>Short Bio</label>
            <input type="text" value={formData.short_bio} onChange={(e) => setFormData({...formData, short_bio: e.target.value})} required />
          </div>
        </div>
        <div className="form-group-premium">
          <label>Detailed Bio / Story</label>
          <textarea value={formData.long_bio} onChange={(e) => setFormData({...formData, long_bio: e.target.value})} required />
        </div>

        <h3 style={{ marginTop: '40px' }}>Social Profiles</h3>
        <div className="form-grid-2">
          <div className="form-group-premium">
            <label>LinkedIn</label>
            <input type="url" value={formData.linkedin} onChange={(e) => setFormData({...formData, linkedin: e.target.value})} />
          </div>
          <div className="form-group-premium">
            <label>GitHub</label>
            <input type="url" value={formData.github} onChange={(e) => setFormData({...formData, github: e.target.value})} />
          </div>
        </div>
        <div className="form-grid-2">
          <div className="form-group-premium">
            <label>WhatsApp</label>
            <input type="url" value={formData.whatsapp} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} />
          </div>
          <div className="form-group-premium">
            <label>Telegram</label>
            <input type="url" value={formData.telegram} onChange={(e) => setFormData({...formData, telegram: e.target.value})} />
          </div>
        </div>

        <div className="form-actions-premium">
          <button type="submit" className="btn-premium-save">Save Profile</button>
        </div>
      </form>
    </div>
  );
};


const SkillsTab = () => {
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, isDeleting: false });
  const [formData, setFormData] = useState({
    name: '', category: 'Frontend Development', level: 80, icon: '', display_order: 0, is_featured: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/manage/skills/`, { credentials: 'include' });
        if (res.ok) {
          setSkills(await res.json());
        }
      } catch (e) {
        toast.error('Failed to load skills');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{padding: '50px', display: 'flex', justifyContent: 'center'}}><PremiumLoader text="LOADING SKILLS..." /></div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingSkill 
        ? `${BASE_URL}/api/manage/skills/${editingSkill.id}/`
        : `${BASE_URL}/api/manage/skills/`;
      const method = editingSkill ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updated = await response.json();
        if (editingSkill) {
          setSkills(skills.map(s => s.id === editingSkill.id ? updated : s));
        } else {
          setSkills([...skills, updated].sort((a,b) => a.display_order - b.display_order));
        }
        resetForm();
      }
    } catch (error) {
      console.error('Failed to save skill:', error);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', category: 'Frontend Development', level: 80, icon: '', display_order: 0, is_featured: true });
    setShowForm(false);
    setEditingSkill(null);
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      icon: skill.icon || '',
      display_order: skill.display_order,
      is_featured: skill.is_featured
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setDeleteModal({ isOpen: true, id, isDeleting: false });
  };

  const confirmDelete = async () => {
    setDeleteModal(prev => ({ ...prev, isDeleting: true }));
    try {
      const response = await fetch(`${BASE_URL}/api/manage/skills/${deleteModal.id}/`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (response.ok) {
        setSkills(skills.filter(s => s.id !== deleteModal.id));
        toast.success('Skill deleted successfully');
      } else {
        toast.error('Failed to delete skill');
      }
    } catch (error) {
      console.error('Failed to delete skill:', error);
      toast.error('Failed to delete skill');
    } finally {
      setDeleteModal({ isOpen: false, id: null, isDeleting: false });
    }
  };

  return (
    <div className="crud-tab-container">
      <div className="crud-header">
        <div className="crud-title">
          <h2>Skills Matrix</h2>
          <p>Add, edit, or delete skills displayed in the public frontend chart</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-premium-save" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaPlus /> Add Skill
        </button>
      </div>

      {showForm && (
        <div className="premium-form-card">
          <h3>{editingSkill ? 'Modify Skill Details' : 'Add New Skill'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid-2">
              <div className="form-group-premium">
                <label>Skill Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="form-group-premium">
                <label>Category Group</label>
                <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                  <option value="Frontend Development">Frontend Development</option>
                  <option value="Backend Development">Backend Development</option>
                  <option value="Database & DevOps">Database & DevOps</option>
                  <option value="Tools">Tools</option>
                </select>
              </div>
            </div>
            <div className="form-grid-3">
              <div className="form-group-premium">
                <label>Proficiency Level (0 - 100)</label>
                <input type="number" min="0" max="100" value={formData.level} onChange={(e) => setFormData({...formData, level: parseInt(e.target.value)})} required />
              </div>
              <div className="form-group-premium">
                <label>React Icon Name (e.g. FaReact, SiPython)</label>
                <input type="text" placeholder="FaReact" value={formData.icon} onChange={(e) => setFormData({...formData, icon: e.target.value})} />
              </div>
              <div className="form-group-premium">
                <label>Display Order</label>
                <input type="number" value={formData.display_order} onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value)})} />
              </div>
            </div>
            <div className="form-group-premium form-group-checkbox">
              <input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({...formData, is_featured: e.target.checked})} id="is_featured" />
              <label htmlFor="is_featured">Featured / Featured Skill Chart</label>
            </div>
            <div className="form-actions-premium">
              <button type="submit" className="btn-premium-save">{editingSkill ? 'Save Changes' : 'Create Skill'}</button>
              <button type="button" className="btn-premium-cancel" onClick={resetForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="premium-cards-grid">
        {skills.map(skill => (
          <div key={skill.id} className="premium-item-card" style={{ paddingBottom: '0', overflow: 'hidden' }}>
            <div style={{ padding: '25px 25px 0 25px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4>{skill.name}</h4>
                  <span className="premium-card-tag" style={{ marginTop: '8px', display: 'inline-block' }}>{skill.category}</span>
                </div>
                <div className="stat-card-icon" style={{ width: '40px', height: '40px', fontSize: '16px' }}><FaCode /></div>
              </div>
              <div className="premium-card-desc" style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                  <span>Proficiency Level</span>
                  <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>{skill.level}%</span>
                </div>
                <div className="custom-progress" style={{ height: '6px' }}>
                  <div className="progress-bar" style={{ width: `${skill.level}%`, height: '100%' }}></div>
                </div>
              </div>
              <div className="premium-card-footer" style={{ borderTop: 'none', paddingTop: '0', paddingBottom: '15px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Order: {skill.display_order}</span>
              </div>
            </div>
            <div className="project-card-actions" style={{ display: 'flex', gap: '10px', padding: '15px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', background: 'rgba(0, 0, 0, 0.2)' }}>
              <button 
                onClick={() => handleEdit(skill)} 
                title="Edit"
                style={{ 
                  flex: 1, 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  color: 'var(--text-light)', 
                  padding: '8px', 
                  borderRadius: '6px', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.2s',
                  fontSize: '13px'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-main)'; e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.borderColor = 'var(--accent-main)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-light)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              >
                <FaEdit /> Edit
              </button>
              <button 
                onClick={() => handleDelete(skill.id)} 
                title="Delete"
                style={{ 
                  flex: 1, 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  color: 'var(--text-muted)', 
                  padding: '8px', 
                  borderRadius: '6px', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.2s',
                  fontSize: '13px'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-main)'; e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.borderColor = 'var(--accent-main)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="premium-form-card" style={{ width: '100%', maxWidth: '400px', padding: '30px', margin: '20px', background: 'var(--card-bg)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '15px', color: 'var(--text-light)', fontSize: '18px', fontWeight: '600' }}>Confirm Deletion</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '25px', lineHeight: '1.5', fontSize: '15px' }}>
              Are you sure you want to delete this skill?
              <br/><br/>This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
              <button 
                className="btn-premium-cancel" 
                onClick={() => setDeleteModal({ isOpen: false, id: null, isDeleting: false })}
                style={{ padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-light)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
              >
                Cancel
              </button>
              <button 
                className="btn-premium-submit" 
                onClick={confirmDelete}
                disabled={deleteModal.isDeleting}
                style={{ 
                  padding: '8px 20px', 
                  borderRadius: '8px', 
                  background: deleteModal.isDeleting ? 'rgba(255,255,255,0.1)' : 'var(--accent-main)', 
                  color: deleteModal.isDeleting ? 'rgba(255,255,255,0.5)' : '#0f172a',
                  border: 'none',
                  fontWeight: '600',
                  cursor: deleteModal.isDeleting ? 'not-allowed' : 'pointer'
                }}
              >
                {deleteModal.isDeleting ? <PremiumLoaderButton size={20} /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


const ExperienceTab = () => {
  const [loading, setLoading] = useState(true);
  const [experiences, setExperiences] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, isDeleting: false });
  const [formData, setFormData] = useState({
    role: '', company: '', location: '', duration: '', type: 'Full-time', responsibilities: '', technologies: '', display_order: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/manage/experiences/`, { credentials: 'include' });
        if (res.ok) {
          setExperiences(await res.json());
        }
      } catch (e) {
        toast.error('Failed to load experiences');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{padding: '50px', display: 'flex', justifyContent: 'center'}}><PremiumLoader text="LOADING EXPERIENCES..." /></div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Parse responsibilities as JSON if it is stringified JSON, or else convert it
    let finalResponsibilities = formData.responsibilities;
    try {
      // Check if it is a JSON array
      const parsed = JSON.parse(formData.responsibilities);
      if (Array.isArray(parsed)) {
        finalResponsibilities = JSON.stringify(parsed);
      } else {
        finalResponsibilities = JSON.stringify([formData.responsibilities]);
      }
    } catch {
      // Convert newline separated string into JSON array
      const arr = formData.responsibilities.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      finalResponsibilities = JSON.stringify(arr);
    }

    const payload = { ...formData, responsibilities: finalResponsibilities };

    try {
      const url = editingExp 
        ? `${BASE_URL}/api/manage/experiences/${editingExp.id}/`
        : `${BASE_URL}/api/manage/experiences/`;
      const method = editingExp ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const updated = await response.json();
        if (editingExp) {
          setExperiences(experiences.map(e => e.id === editingExp.id ? updated : e));
        } else {
          setExperiences([...experiences, updated].sort((a,b) => a.display_order - b.display_order));
        }
        resetForm();
      }
    } catch (error) {
      console.error('Failed to save experience:', error);
    }
  };

  const resetForm = () => {
    setFormData({ role: '', company: '', location: '', duration: '', type: 'Full-time', responsibilities: '', technologies: '', display_order: 0 });
    setShowForm(false);
    setEditingExp(null);
  };

  const handleEdit = (exp) => {
    setEditingExp(exp);
    // Parse responsibilities list into string
    let respText = exp.responsibilities;
    try {
      const parsed = JSON.parse(exp.responsibilities);
      if (Array.isArray(parsed)) {
        respText = parsed.join('\n');
      }
    } catch {}

    setFormData({
      role: exp.role,
      company: exp.company,
      location: exp.location || '',
      duration: exp.duration,
      type: exp.type,
      responsibilities: respText,
      technologies: exp.technologies || '',
      display_order: exp.display_order
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setDeleteModal({ isOpen: true, id, isDeleting: false });
  };

  const confirmDelete = async () => {
    setDeleteModal(prev => ({ ...prev, isDeleting: true }));
    try {
      const response = await fetch(`${BASE_URL}/api/manage/experiences/${deleteModal.id}/`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (response.ok) {
        setExperiences(experiences.filter(e => e.id !== deleteModal.id));
        toast.success('Experience deleted successfully');
      } else {
        toast.error('Failed to delete experience');
      }
    } catch (error) {
      console.error('Failed to delete experience:', error);
      toast.error('Failed to delete experience');
    } finally {
      setDeleteModal({ isOpen: false, id: null, isDeleting: false });
    }
  };

  return (
    <div className="crud-tab-container">
      <div className="crud-header">
        <div className="crud-title">
          <h2>Professional Experiences</h2>
          <p>Display timeline items on work history dynamically</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-premium-save" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaPlus /> Add Work Card
        </button>
      </div>

      {showForm && (
        <div className="premium-form-card">
          <h3>{editingExp ? 'Modify Work History' : 'Add Experience Card'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid-2">
              <div className="form-group-premium">
                <label>Job Title / Role</label>
                <input type="text" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} required />
              </div>
              <div className="form-group-premium">
                <label>Company / Project Name</label>
                <input type="text" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} required />
              </div>
            </div>
            <div className="form-grid-3">
              <div className="form-group-premium">
                <label>Duration (e.g. Feb 2025 - Present)</label>
                <input type="text" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} required />
              </div>
              <div className="form-group-premium">
                <label>Location (e.g. Gurugram, India)</label>
                <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
              </div>
              <div className="form-group-premium">
                <label>Employment Type</label>
                <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>
            </div>
            <div className="form-group-premium">
              <label>Responsibilities & Achievements (one bullet per line)</label>
              <textarea placeholder="Developed a comprehensive GenAI application using Angular 18+..." value={formData.responsibilities} onChange={(e) => setFormData({...formData, responsibilities: e.target.value})} required />
            </div>
            <div className="form-grid-2">
              <div className="form-group-premium">
                <label>Technologies Used (comma separated)</label>
                <input type="text" placeholder="Angular, Django, PostgreSQL" value={formData.technologies} onChange={(e) => setFormData({...formData, technologies: e.target.value})} />
              </div>
              <div className="form-group-premium">
                <label>Display Order</label>
                <input type="number" value={formData.display_order} onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value)})} />
              </div>
            </div>
            <div className="form-actions-premium">
              <button type="submit" className="btn-premium-save">{editingExp ? 'Update History' : 'Save Experience'}</button>
              <button type="button" className="btn-premium-cancel" onClick={resetForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="premium-cards-grid">
        {experiences.map(exp => {
          let bullets = [];
          try {
            bullets = JSON.parse(exp.responsibilities);
          } catch {
            bullets = [exp.responsibilities];
          }

          return (
            <div key={exp.id} className="premium-item-card active-item" style={{ paddingBottom: '0', overflow: 'hidden' }}>
              <div style={{ padding: '25px 25px 0 25px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4>{exp.role}</h4>
                    <p className="premium-card-meta">{exp.company} &bull; {exp.duration}</p>
                  </div>
                  <div className="stat-card-icon" style={{ width: '40px', height: '40px', fontSize: '16px' }}><FaBriefcase /></div>
                </div>
                <div className="premium-card-desc" style={{ flex: 1 }}>
                  <ul style={{ paddingLeft: '15px', margin: '0 0 15px 0', fontSize: '13px' }}>
                    {bullets.slice(0, 2).map((b, i) => (
                      <li key={i} style={{ marginBottom: '6px' }}>{b}</li>
                    ))}
                    {bullets.length > 2 && <li style={{ listStyle: 'none', color: 'var(--text-muted)' }}>+ {bullets.length - 2} more points</li>}
                  </ul>
                  <div className="premium-card-tags">
                    {(exp.technologies || '').split(',').map((t, idx) => (
                      <span key={idx} className="premium-card-tag">{t.trim()}</span>
                    ))}
                  </div>
                </div>
                <div className="premium-card-footer" style={{ borderTop: 'none', paddingTop: '0', paddingBottom: '15px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Location: {exp.location}</span>
                </div>
              </div>
              <div className="project-card-actions" style={{ display: 'flex', gap: '10px', padding: '15px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', background: 'rgba(0, 0, 0, 0.2)' }}>
                <button 
                  onClick={() => handleEdit(exp)} 
                  title="Edit"
                  style={{ 
                    flex: 1, 
                    background: 'rgba(255,255,255,0.05)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    color: 'var(--text-light)', 
                    padding: '8px', 
                    borderRadius: '6px', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s',
                    fontSize: '13px'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-main)'; e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.borderColor = 'var(--accent-main)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-light)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                >
                  <FaEdit /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(exp.id)} 
                  title="Delete"
                  style={{ 
                    flex: 1, 
                    background: 'rgba(255,255,255,0.05)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    color: 'var(--text-muted)', 
                    padding: '8px', 
                    borderRadius: '6px', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s',
                    fontSize: '13px'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-main)'; e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.borderColor = 'var(--accent-main)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="premium-form-card" style={{ width: '100%', maxWidth: '400px', padding: '30px', margin: '20px', background: 'var(--card-bg)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '15px', color: 'var(--text-light)', fontSize: '18px', fontWeight: '600' }}>Confirm Deletion</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '25px', lineHeight: '1.5', fontSize: '15px' }}>
              Are you sure you want to delete this experience card?
              <br/><br/>This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
              <button 
                className="btn-premium-cancel" 
                onClick={() => setDeleteModal({ isOpen: false, id: null, isDeleting: false })}
                style={{ padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-light)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
              >
                Cancel
              </button>
              <button 
                className="btn-premium-submit" 
                onClick={confirmDelete}
                disabled={deleteModal.isDeleting}
                style={{ 
                  padding: '8px 20px', 
                  borderRadius: '8px', 
                  background: deleteModal.isDeleting ? 'rgba(255,255,255,0.1)' : 'var(--accent-main)', 
                  color: deleteModal.isDeleting ? 'rgba(255,255,255,0.5)' : '#0f172a',
                  border: 'none',
                  fontWeight: '600',
                  cursor: deleteModal.isDeleting ? 'not-allowed' : 'pointer'
                }}
              >
                {deleteModal.isDeleting ? <PremiumLoaderButton size={20} /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



const ProjectsTab = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [saving, setSaving] = useState(false);
  const [pageData, setPageData] = useState({ page: 1, total_pages: 1, has_next: false, has_previous: false });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, isDeleting: false });
  const [formData, setFormData] = useState({
    name: '', slug: '', description: '', short_description: '', technologies: '', features_list: '', github_url: '', live_url: '', status: 'Completed', is_featured: true, display_order: 0, image: null, category: 'Web Application'
  });

  const fetchProjects = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/manage/projects/?page=${page}&page_size=6`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        if (data.results) {
          setProjects(data.results);
          setPageData({
            page: data.current_page || page,
            total_pages: data.total_pages || Math.ceil(data.count / 6),
            has_next: data.next !== null,
            has_previous: data.previous !== null
          });
          window.history.replaceState(null, '', `?page=${page}`);
        } else {
          setProjects(data); // fallback if not paginated
        }
      }
    } catch (e) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = parseInt(params.get('page')) || 1;
    fetchProjects(p);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const form = new FormData();
    
    let finalFeatures = formData.features_list;
    try {
      const parsed = JSON.parse(formData.features_list);
      finalFeatures = Array.isArray(parsed) ? JSON.stringify(parsed) : JSON.stringify([formData.features_list]);
    } catch {
      const arr = formData.features_list.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      finalFeatures = JSON.stringify(arr);
    }

    const payload = { ...formData, features_list: finalFeatures };

    Object.keys(payload).forEach(key => {
      if (key === 'image' || key === 'image_url') return;
      if (payload[key] !== null && payload[key] !== '') {
        form.append(key, payload[key]);
      }
    });

    if (formData.image instanceof File) {
      form.append('image_url', formData.image);
    }

    try {
      const url = editingProject 
        ? `${BASE_URL}/api/manage/projects/${editingProject.id}/`
        : `${BASE_URL}/api/manage/projects/`;
      const method = editingProject ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        credentials: 'include',
        body: form
      });

      if (response.ok) {
        toast.success(`Project ${editingProject ? 'updated' : 'added'} successfully!`);
        resetForm();
        fetchProjects(pageData.page);
      } else {
        const errData = await response.json();
        toast.error('Failed to save project: ' + JSON.stringify(errData));
      }
    } catch (error) {
      toast.error('Error saving project: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', slug: '', description: '', short_description: '', technologies: '', features_list: '', github_url: '', live_url: '', status: 'Completed', is_featured: true, display_order: 0, image: null, category: 'Web Application' });
    setShowForm(false);
    setEditingProject(null);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    let featText = project.features_list;
    try {
      const parsed = JSON.parse(project.features_list);
      if (Array.isArray(parsed)) featText = parsed.join('\n');
    } catch {}

    setFormData({
      name: project.name,
      slug: project.slug || '',
      description: project.description,
      short_description: project.short_description || '',
      technologies: project.technologies,
      features_list: featText || '',
      github_url: project.github_url || '',
      live_url: project.live_url || '',
      status: project.status || 'Completed',
      is_featured: project.is_featured,
      display_order: project.display_order || 0,
      image: null,
      category: project.category || 'Web Application'
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setDeleteModal({ isOpen: true, id, isDeleting: false });
  };

  const confirmDelete = async () => {
    setDeleteModal(prev => ({ ...prev, isDeleting: true }));
    try {
      const response = await fetch(`${BASE_URL}/api/manage/projects/${deleteModal.id}/`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (response.ok) {
        toast.success('Project deleted');
        let newPage = pageData.page;
        if (projects.length === 1 && newPage > 1) newPage -= 1;
        fetchProjects(newPage);
      }
    } catch (error) {
      toast.error('Failed to delete project');
    } finally {
      setDeleteModal({ isOpen: false, id: null, isDeleting: false });
    }
  };

  if (loading && projects.length === 0) {
     return <div style={{padding: '50px', display: 'flex', justifyContent: 'center'}}><PremiumLoader text="LOADING PROJECTS..." /></div>;
  }

  return (
    <div className="crud-tab-container">
      <div className="crud-header">
        <div className="crud-title">
          <h2>Projects Catalog</h2>
          <p>Publish portfolio work and sync live repositories and demos</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-premium-save" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaPlus /> Add Project
        </button>
      </div>

      <div className="projects-grid">
        {projects.length > 0 ? projects.map(project => (
          <div key={project.id} className="project-card compact-card">
            <div className="project-card-image">
              {project.image_url ? (
                <img src={project.image_url.startsWith('http') ? project.image_url : `${BASE_URL}${project.image_url}`} alt={project.name} draggable="false" onDragStart={(e) => e.preventDefault()} style={{ userSelect: 'none' }} />
              ) : (
                <div className="placeholder-image"><FaProjectDiagram /></div>
              )}
              <div className="project-category-badge">{project.category || 'Project'}</div>
            </div>
            <div className="project-card-content">
              <div className="project-card-header">
                <h3>{project.name}</h3>
                <span className={`status-badge ${project.status === 'Completed' ? 'completed' : 'progress'}`}>
                  {project.status}
                </span>
              </div>
              <p className="project-card-desc">{project.short_description || project.description.substring(0, 100) + '...'}</p>
              <div className="project-tech-tags">
                {project.technologies.split(',').slice(0, 3).map((tech, i) => (
                  <span key={i} className="tech-tag">{tech.trim()}</span>
                ))}
                {project.technologies.split(',').length > 3 && <span className="tech-tag">+{project.technologies.split(',').length - 3} more</span>}
              </div>
            </div>
            <div className="project-card-actions" style={{ display: 'flex', gap: '10px', padding: '15px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', background: 'rgba(0, 0, 0, 0.2)' }}>
              <button 
                onClick={() => handleEdit(project)} 
                title="Edit"
                style={{ 
                  flex: 1, 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  color: 'var(--text-light)', 
                  padding: '8px', 
                  borderRadius: '6px', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.2s',
                  fontSize: '13px'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-main)'; e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.borderColor = 'var(--accent-main)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-light)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              >
                <FaEdit /> Edit
              </button>
              <button 
                onClick={() => handleDelete(project.id)} 
                title="Delete"
                style={{ 
                  flex: 1, 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  color: 'var(--text-muted)', 
                  padding: '8px', 
                  borderRadius: '6px', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.2s',
                  fontSize: '13px'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-main)'; e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.borderColor = 'var(--accent-main)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        )) : (
          <div className="empty-state">No projects found. Add one!</div>
        )}
      </div>

      {pageData.total_pages > 1 && (
        <div className="pagination-controls">
          <button disabled={!pageData.has_previous} onClick={() => fetchProjects(pageData.page - 1)}>Previous</button>
          <span>Page {pageData.page} of {pageData.total_pages}</span>
          <button disabled={!pageData.has_next} onClick={() => fetchProjects(pageData.page + 1)}>Next</button>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content project-modal">
            <div className="modal-header">
              <h3>{editingProject ? 'Modify Showcase Project' : 'Add Showcase Project'}</h3>
              <button className="modal-close" onClick={resetForm}><FaTimes /></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-grid-2">
                  <div className="form-group-premium">
                    <label>Project Title / Display Title</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required disabled={saving} />
                  </div>
                  <div className="form-group-premium">
                    <label>Slug URL string (e.g. ecommerce-react)</label>
                    <input type="text" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} disabled={saving} />
                  </div>
                </div>
                <div className="form-group-premium">
                  <label>Short Description (simple summary card)</label>
                  <input type="text" value={formData.short_description} onChange={(e) => setFormData({...formData, short_description: e.target.value})} disabled={saving} />
                </div>
                <div className="form-group-premium">
                  <label>Full Deep-Dive Description (supports markdown/HTML)</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required disabled={saving} rows="4" />
                </div>
                <div className="form-grid-2">
                  <div className="form-group-premium">
                    <label>Technologies Used (comma separated)</label>
                    <input type="text" value={formData.technologies} onChange={(e) => setFormData({...formData, technologies: e.target.value})} required disabled={saving} />
                  </div>
                  <div className="form-group-premium">
                    <label>Category (e.g. Web Application, Mobile App)</label>
                    <input type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} disabled={saving} />
                  </div>
                </div>
                <div className="form-group-premium">
                  <label>Key Features (One per line)</label>
                  <textarea value={formData.features_list} onChange={(e) => setFormData({...formData, features_list: e.target.value})} required disabled={saving} rows="4" placeholder="User Authentication\nReal-time Chat\nPayment Integration" />
                </div>
                <div className="form-grid-2">
                  <div className="form-group-premium">
                    <label>GitHub Source URL</label>
                    <input type="text" value={formData.github_url} onChange={(e) => setFormData({...formData, github_url: e.target.value})} disabled={saving} />
                  </div>
                  <div className="form-group-premium">
                    <label>Live Demo URL</label>
                    <input type="text" value={formData.live_url} onChange={(e) => setFormData({...formData, live_url: e.target.value})} disabled={saving} />
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group-premium">
                    <label>Development Status</label>
                    <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} disabled={saving}>
                      <option value="Completed">Completed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Planning">Planning</option>
                    </select>
                  </div>
                  <div className="form-group-premium">
                    <label>Project Cover Image</label>
                    <input type="file" accept="image/*" onChange={(e) => setFormData({...formData, image: e.target.files[0]})} disabled={saving} />
                    {editingProject && editingProject.image_url && <small style={{display: 'block', marginTop: '5px', color: 'var(--accent-main)'}}>Current: {editingProject.image_url.split('/').pop()}</small>}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-cancel" onClick={resetForm} disabled={saving}>Cancel</button>
                  <button type="submit" className="btn-premium-save" disabled={saving}>
                    {saving ? <PremiumLoaderButton size={20} /> : (editingProject ? 'Update Project' : 'Publish Project')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal for Projects */}
      {deleteModal.isOpen && (
        <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="premium-form-card" style={{ width: '100%', maxWidth: '400px', padding: '30px', margin: '20px', background: 'var(--card-bg)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '15px', color: 'var(--text-light)', fontSize: '18px', fontWeight: '600' }}>Confirm Deletion</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '25px', lineHeight: '1.5', fontSize: '15px' }}>
              Are you sure you want to delete this project?
              <br/><br/>This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
              <button 
                className="btn-premium-cancel" 
                onClick={() => setDeleteModal({ isOpen: false, id: null, isDeleting: false })}
                style={{ padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-light)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
              >
                Cancel
              </button>
              <button 
                className="btn-premium-submit" 
                onClick={confirmDelete}
                disabled={deleteModal.isDeleting}
                style={{ 
                  padding: '8px 20px', 
                  borderRadius: '8px', 
                  background: deleteModal.isDeleting ? 'rgba(255,255,255,0.1)' : 'var(--accent-main)', 
                  color: deleteModal.isDeleting ? 'rgba(255,255,255,0.5)' : '#0f172a',
                  border: 'none',
                  fontWeight: '600',
                  cursor: deleteModal.isDeleting ? 'not-allowed' : 'pointer'
                }}
              >
                {deleteModal.isDeleting ? <PremiumLoaderButton size={20} /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ResumeTab = () => {
  const [loading, setLoading] = useState(true);
  const [resumes, setResumes] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, isDeleting: false });
  const [formData, setFormData] = useState({ title: '', version_name: 'v1.0', is_active: true });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/manage/resume/`, { credentials: 'include' });
        if (res.ok) {
          setResumes(await res.json());
        }
      } catch (e) {
        toast.error('Failed to load resume');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{padding: '50px', display: 'flex', justifyContent: 'center'}}><PremiumLoader text="LOADING RESUMES..." /></div>;

  const handleUpload = async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('resume-file');
    const file = fileInput.files[0];
    if (!file) {
      toast.success('Please select a PDF file first.');
      return;
    }

    setUploading(true);
    const form = new FormData();
    form.append('file', file);
    form.append('title', formData.title || file.name.split('.')[0]);
    form.append('version_name', formData.version_name);
    form.append('is_active', formData.is_active ? 'true' : 'false');

    try {
      const response = await fetch(`${BASE_URL}/api/manage/resume/`, {
        method: 'POST',
        credentials: 'include',
        body: form
      });

      if (response.ok) {
        const newResume = await response.json();
        setResumes([newResume, ...(resumes || []).map(r => ({...r, is_active: formData.is_active ? false : r.is_active}))]);
        toast.success('Resume version uploaded successfully!');
        setFormData({ title: '', version_name: 'v1.0', is_active: true });
        fileInput.value = '';
      }
    } catch (error) {
      console.error('Failed to upload resume:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (id) => {
    setDeleteModal({ isOpen: true, id, isDeleting: false });
  };

  const confirmDelete = async () => {
    setDeleteModal(prev => ({ ...prev, isDeleting: true }));
    try {
      const response = await fetch(`${BASE_URL}/api/manage/resume/${deleteModal.id}/`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (response.ok) {
        setResumes(resumes.filter(r => r.id !== deleteModal.id));
        toast.success('Resume version deleted successfully');
      } else {
        toast.error('Failed to delete resume version');
      }
    } catch (error) {
      console.error('Failed to delete resume:', error);
      toast.error('Failed to delete resume version');
    } finally {
      setDeleteModal({ isOpen: false, id: null, isDeleting: false });
    }
  };

  return (
    <div className="crud-tab-container">
      <div className="crud-header">
        <div className="crud-title">
          <h2>Resume Files Manager</h2>
          <p>Upload new PDF resumes and toggle active downloadable copies</p>
        </div>
      </div>

      <div className="premium-form-card">
        <h3>Upload New Resume File</h3>
        <form onSubmit={handleUpload}>
          <div className="form-grid-2">
            <div className="form-group-premium">
              <label>Resume Name / Label</label>
              <input type="text" placeholder="Asmit Alok Resume" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="form-group-premium">
              <label>PDF Document</label>
              <input type="file" id="resume-file" accept=".pdf" required />
            </div>
          </div>
          <div className="form-group-premium form-group-checkbox">
            <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} id="is_active_resume" />
            <label htmlFor="is_active_resume">Set Active Downloadable Copy</label>
          </div>
          <div className="form-actions-premium">
            <button type="submit" className="btn-premium-save" disabled={uploading}>
              {uploading ? 'Uploading PDF...' : 'Upload PDF Document'}
            </button>
          </div>
        </form>
      </div>

      <div className="premium-cards-grid">
        {resumes.map(res => (
          <div key={res.id} className={`premium-item-card ${res.is_active ? 'active-item' : ''}`} style={{ paddingBottom: '0', overflow: 'hidden' }}>
            <div style={{ padding: '25px 25px 0 25px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4>{res.title}</h4>
                  <p className="premium-card-meta">Uploaded: {new Date(res.uploaded_at).toLocaleDateString()}</p>
                </div>
                <div className="stat-card-icon" style={{ width: '40px', height: '40px', fontSize: '16px' }}><FaFileAlt /></div>
              </div>
              <div className="premium-card-footer" style={{ borderTop: 'none', paddingTop: '15px', paddingBottom: '15px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {res.is_active ? <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>ACTIVE DOWNLOAD</span> : 'Archived'}
                </span>
              </div>
            </div>
            <div className="project-card-actions" style={{ display: 'flex', gap: '10px', padding: '15px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', background: 'rgba(0, 0, 0, 0.2)' }}>
              <a 
                href={`${BASE_URL}/api/resume/download/`} 
                target="_blank" 
                rel="noopener noreferrer"
                title="Download"
                style={{ 
                  flex: 1, 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  color: 'var(--text-light)', 
                  padding: '8px', 
                  borderRadius: '6px', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.2s',
                  fontSize: '13px',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-main)'; e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.borderColor = 'var(--accent-main)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-light)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              >
                <FaLink /> Download
              </a>
              <button 
                onClick={() => handleDelete(res.id)} 
                title="Delete"
                style={{ 
                  flex: 1, 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  color: 'var(--text-muted)', 
                  padding: '8px', 
                  borderRadius: '6px', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.2s',
                  fontSize: '13px'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-main)'; e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.borderColor = 'var(--accent-main)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="premium-form-card" style={{ width: '100%', maxWidth: '400px', padding: '30px', margin: '20px', background: 'var(--card-bg)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '15px', color: 'var(--text-light)', fontSize: '18px', fontWeight: '600' }}>Confirm Deletion</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '25px', lineHeight: '1.5', fontSize: '15px' }}>
              Are you sure you want to delete this resume version?
              <br/><br/>This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
              <button 
                className="btn-premium-cancel" 
                onClick={() => setDeleteModal({ isOpen: false, id: null, isDeleting: false })}
                style={{ padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-light)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
              >
                Cancel
              </button>
              <button 
                className="btn-premium-submit" 
                onClick={confirmDelete}
                disabled={deleteModal.isDeleting}
                style={{ 
                  padding: '8px 20px', 
                  borderRadius: '8px', 
                  background: deleteModal.isDeleting ? 'rgba(255,255,255,0.1)' : 'var(--accent-main)', 
                  color: deleteModal.isDeleting ? 'rgba(255,255,255,0.5)' : '#0f172a',
                  border: 'none',
                  fontWeight: '600',
                  cursor: deleteModal.isDeleting ? 'not-allowed' : 'pointer'
                }}
              >
                {deleteModal.isDeleting ? <PremiumLoaderButton size={20} /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


const ContactTab = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [formData, setFormData] = useState({
    email: '', phone: '', location: '', cta_heading: '', cta_subtitle: '', meeting_link: '',
    linkedin: '', github: '', whatsapp: '', telegram: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/manage/contact/`, { credentials: 'include' });
        if (res.ok) {
          setData(await res.json());
        }
      } catch (e) {
        toast.error('Failed to load contact');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      const links = data.social_links || {};
      setFormData({
        email: data.email || '',
        phone: data.phone || '',
        location: data.location || '',
        cta_heading: data.cta_heading || '',
        cta_subtitle: data.cta_subtitle || '',
        meeting_link: data.meeting_link || '',
        linkedin: links.linkedin || '',
        github: links.github || '',
        whatsapp: links.whatsapp || '',
        telegram: links.telegram || ''
      });
    }
  }, [data]);

  if (loading) return <div style={{padding: '50px', display: 'flex', justifyContent: 'center'}}><PremiumLoader text="LOADING CONTACT INFO..." /></div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      social_links: {
        linkedin: formData.linkedin,
        github: formData.github,
        whatsapp: formData.whatsapp,
        telegram: formData.telegram
      }
    };
    delete payload.linkedin;
    delete payload.github;
    delete payload.whatsapp;
    delete payload.telegram;

    try {
      const response = await fetch(`${BASE_URL}/api/manage/contact/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setData(await response.json());
        toast.success('Contact details updated successfully!');
      }
    } catch (error) {
      console.error('Failed to update Contact:', error);
    }
  };

  return (
    <div className="premium-form-card">
      <h3>Edit Contact Form & CTA Section</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-grid-3">
          <div className="form-group-premium">
            <label>Public Contact Email</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          </div>
          <div className="form-group-premium">
            <label>Public Phone Line</label>
            <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div className="form-group-premium">
            <label>Physical Location</label>
            <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required />
          </div>
        </div>
        <div className="form-grid-2">
          <div className="form-group-premium">
            <label>CTA Section Main Title</label>
            <input type="text" value={formData.cta_heading} onChange={(e) => setFormData({...formData, cta_heading: e.target.value})} required />
          </div>
          <div className="form-group-premium">
            <label>CTA Section Subtitle / Instructions</label>
            <input type="text" value={formData.cta_subtitle} onChange={(e) => setFormData({...formData, cta_subtitle: e.target.value})} required />
          </div>
        </div>
        <div className="form-group-premium">
          <label>Meeting Link (Calendly or Google Meet)</label>
          <input type="url" placeholder="https://calendly.com/your-username" value={formData.meeting_link} onChange={(e) => setFormData({...formData, meeting_link: e.target.value})} />
        </div>

        <h3 style={{ marginTop: '40px' }}>Social Redirection Profiles</h3>
        <div className="form-grid-2">
          <div className="form-group-premium">
            <label>LinkedIn URL</label>
            <input type="url" value={formData.linkedin} onChange={(e) => setFormData({...formData, linkedin: e.target.value})} />
          </div>
          <div className="form-group-premium">
            <label>GitHub URL</label>
            <input type="url" value={formData.github} onChange={(e) => setFormData({...formData, github: e.target.value})} />
          </div>
        </div>
        <div className="form-grid-2">
          <div className="form-group-premium">
            <label>WhatsApp Link</label>
            <input type="url" value={formData.whatsapp} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} />
          </div>
          <div className="form-group-premium">
            <label>Telegram Link</label>
            <input type="url" value={formData.telegram} onChange={(e) => setFormData({...formData, telegram: e.target.value})} />
          </div>
        </div>

        <div className="form-actions-premium">
          <button type="submit" className="btn-premium-save">Save Contact Info</button>
        </div>
      </form>
    </div>
  );
};



export default PortfolioManagement;
