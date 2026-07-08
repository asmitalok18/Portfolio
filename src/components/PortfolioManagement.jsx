import React, { useState, useEffect } from 'react';
import { 
  FaTachometerAlt, FaUser, FaCode, FaBriefcase, 
  FaFileAlt, FaEnvelope, FaPlus, FaEdit, 
  FaTrash, FaCloudUploadAlt, FaSignOutAlt, FaLink,
  FaMapMarkerAlt, FaPhoneAlt, FaCheckCircle, FaProjectDiagram,
  FaSpinner
} from 'react-icons/fa';
import '../styles/PortfolioManagement.css';

const BASE_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_BASE_URL || 'http://localhost:8000';

const PortfolioManagement = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  
  // Data States
  const [dashboardStats, setDashboardStats] = useState({});
  const [heroData, setHeroData] = useState({});
  const [profileData, setProfileData] = useState({});
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [projects, setProjects] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [contactData, setContactData] = useState({});

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/check/`, { credentials: 'include' });
      const data = await response.json();
      setIsAuthenticated(data.authenticated);
      if (data.authenticated) {
        loadAllData();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/api/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(loginData)
      });
      
      const data = await response.json();
      if (data.success) {
        setIsAuthenticated(true);
        loadAllData();
      } else {
        alert(data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${BASE_URL}/api/auth/logout/`, {
        method: 'POST',
        credentials: 'include'
      });
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const loadAllData = async () => {
    try {
      // 1. Dashboard Stats
      const statsRes = await fetch(`${BASE_URL}/api/manage/dashboard/`, { credentials: 'include' });
      if (statsRes.ok) setDashboardStats(await statsRes.json());

      // 2. Hero Section
      const heroRes = await fetch(`${BASE_URL}/api/manage/hero/`, { credentials: 'include' });
      if (heroRes.ok) setHeroData(await heroRes.json());

      // 3. Profile Info
      const profileRes = await fetch(`${BASE_URL}/api/manage/profile/`, { credentials: 'include' });
      if (profileRes.ok) setProfileData(await profileRes.json());

      // 4. Skills
      const skillsRes = await fetch(`${BASE_URL}/api/manage/skills/`, { credentials: 'include' });
      if (skillsRes.ok) setSkills(await skillsRes.json());

      // 5. Experience
      const expRes = await fetch(`${BASE_URL}/api/manage/experiences/`, { credentials: 'include' });
      if (expRes.ok) setExperiences(await expRes.json());

      // 6. Projects
      const projectsRes = await fetch(`${BASE_URL}/api/manage/projects/`, { credentials: 'include' });
      if (projectsRes.ok) setProjects(await projectsRes.json());

      // 7. Resumes
      const resumesRes = await fetch(`${BASE_URL}/api/manage/resume/`, { credentials: 'include' });
      if (resumesRes.ok) setResumes(await resumesRes.json());

      // 8. Contact Info
      const contactRes = await fetch(`${BASE_URL}/api/manage/contact/`, { credentials: 'include' });
      if (contactRes.ok) setContactData(await contactRes.json());

    } catch (error) {
      console.error('Failed to load portfolio data:', error);
    }
  };

  const refreshStats = async () => {
    const statsRes = await fetch(`${BASE_URL}/api/manage/dashboard/`, { credentials: 'include' });
    if (statsRes.ok) setDashboardStats(await statsRes.json());
  };

  if (loading) {
    return <div className="management-loading">Initializing Admin System...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="management-login">
        <div className="login-container">
          <h2>Resumify Admin</h2>
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
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                required
              />
            </div>
            <button type="submit">Access Console</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-management">
      {/* Sidebar Navigation */}
      <div className="management-sidebar">
        <div className="sidebar-brand">
          <h2>Resumify</h2>
          <span>Admin Console</span>
        </div>
        <div className="sidebar-nav">
          <button 
            className={`sidebar-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <FaTachometerAlt /> Dashboard
          </button>
          <button 
            className={`sidebar-nav-btn ${activeTab === 'hero' ? 'active' : ''}`}
            onClick={() => setActiveTab('hero')}
          >
            <FaUser /> Hero Section
          </button>
          <button 
            className={`sidebar-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <FaUser /> Personal Profile
          </button>
          <button 
            className={`sidebar-nav-btn ${activeTab === 'skills' ? 'active' : ''}`}
            onClick={() => setActiveTab('skills')}
          >
            <FaCode /> Skills Matrix
          </button>
          <button 
            className={`sidebar-nav-btn ${activeTab === 'experience' ? 'active' : ''}`}
            onClick={() => setActiveTab('experience')}
          >
            <FaBriefcase /> Work Experience
          </button>
          <button 
            className={`sidebar-nav-btn ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <FaProjectDiagram /> Projects CRUD
          </button>
          <button 
            className={`sidebar-nav-btn ${activeTab === 'resume' ? 'active' : ''}`}
            onClick={() => setActiveTab('resume')}
          >
            <FaFileAlt /> Resume Manager
          </button>
          <button 
            className={`sidebar-nav-btn ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            <FaEnvelope /> Contact Details
          </button>
        </div>
        <div className="sidebar-footer">
          <button className="sidebar-nav-btn" onClick={handleLogout} style={{ color: '#ff6b6b' }}>
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Panel */}
      <div className="management-main">
        <div className="management-topbar">
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
              <span>Administrator</span>
            </div>
          </div>
        </div>

        <div className="management-content-container">
          {activeTab === 'dashboard' && <DashboardTab stats={dashboardStats} />}
          {activeTab === 'hero' && <HeroTab data={heroData} setData={setHeroData} />}
          {activeTab === 'profile' && <ProfileTab data={profileData} setData={setProfileData} />}
          {activeTab === 'skills' && <SkillsTab skills={skills} setSkills={setSkills} refreshStats={refreshStats} />}
          {activeTab === 'experience' && <ExperienceTab experiences={experiences} setExperiences={setExperiences} refreshStats={refreshStats} />}
          {activeTab === 'projects' && <ProjectsTab projects={projects} setProjects={setProjects} refreshStats={refreshStats} />}
          {activeTab === 'resume' && <ResumeTab resumes={resumes} setResumes={setResumes} refreshStats={refreshStats} />}
          {activeTab === 'contact' && <ContactTab data={contactData} setData={setContactData} />}
        </div>
      </div>
    </div>
  );
};

// 1. Dashboard Tab Component
const DashboardTab = ({ stats }) => (
  <div className="dashboard-overview">
    <div className="dashboard-stats-grid">
      <div className="dashboard-stat-card">
        <div className="stat-card-icon"><FaProjectDiagram /></div>
        <div className="stat-card-info">
          <span className="stat-card-label">Projects</span>
          <span className="stat-card-value">{stats.total_projects || 0}</span>
        </div>
      </div>
      <div className="dashboard-stat-card">
        <div className="stat-card-icon"><FaCode /></div>
        <div className="stat-card-info">
          <span className="stat-card-label">Skills Listed</span>
          <span className="stat-card-value">{stats.total_skills || 0}</span>
        </div>
      </div>
      <div className="dashboard-stat-card">
        <div className="stat-card-icon"><FaBriefcase /></div>
        <div className="stat-card-info">
          <span className="stat-card-label">Experiences</span>
          <span className="stat-card-value">{stats.total_experiences || 0}</span>
        </div>
      </div>
      <div className="dashboard-stat-card">
        <div className="stat-card-icon"><FaFileAlt /></div>
        <div className="stat-card-info">
          <span className="stat-card-label">Active Resume</span>
          <span className="stat-card-value" style={{ color: stats.active_resume ? '#ff6a00' : '#ff6b6b', fontSize: '18px', fontWeight: 'bold' }}>
            {stats.active_resume ? 'ACTIVE' : 'INACTIVE'}
          </span>
        </div>
      </div>
    </div>

    <div className="recent-chats-panel">
      <h3>Recent AI Assistant Queries ({stats.total_chats || 0} total sessions)</h3>
      <div className="recent-chats-list">
        {stats.recent_messages && stats.recent_messages.length > 0 ? (
          stats.recent_messages.map((msg, index) => (
            <div key={index} className="recent-chat-item">
              <div className="chat-item-content">
                <p className="chat-item-text">"{msg.user_message}"</p>
                <div className="chat-item-meta">
                  <span>Session Conversation</span>
                  <span className="chat-time-badge">{new Date(msg.timestamp).toLocaleString()}</span>
                </div>
              </div>
              <div className="stat-card-icon" style={{ width: '36px', height: '36px', fontSize: '14px' }}><FaEnvelope /></div>
            </div>
          ))
        ) : (
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>No recent AI assistant logs available.</p>
        )}
      </div>
    </div>
  </div>
);

// 2. Hero Tab Component
const HeroTab = ({ data, setData }) => {
  const [formData, setFormData] = useState({
    name: '', role: '', main_headline: '', subtitle: '',
    availability_badge: '', cta_labels: '', cta_links: '',
    profile_image: '', resume_link: '', tech_badges: '',
    linkedin: '', github: '', whatsapp: '', telegram: ''
  });

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
        alert('Hero settings saved successfully!');
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

// 3. Profile Tab Component
const ProfileTab = ({ data, setData }) => {
  const [formData, setFormData] = useState({
    full_name: '', email: '', phone: '', location: '',
    short_bio: '', long_bio: '', current_role: '', current_status: '',
    linkedin: '', github: '', whatsapp: '', telegram: ''
  });

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
        alert('Personal Profile saved successfully!');
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

// 4. Skills Tab Component
const SkillsTab = ({ skills, setSkills, refreshStats }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState({
    name: '', category: 'Frontend Development', level: 80, icon: '', display_order: 0, is_featured: true
  });

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
        refreshStats();
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

  const handleDelete = async (id) => {
    if (window.confirm('Delete this skill from the matrix?')) {
      try {
        const response = await fetch(`${BASE_URL}/api/manage/skills/${id}/`, {
          method: 'DELETE',
          credentials: 'include'
        });
        if (response.ok) {
          setSkills(skills.filter(s => s.id !== id));
          refreshStats();
        }
      } catch (error) {
        console.error('Failed to delete skill:', error);
      }
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
          <div key={skill.id} className="premium-item-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h4>{skill.name}</h4>
                <span className="premium-card-tag" style={{ marginTop: '8px', display: 'inline-block' }}>{skill.category}</span>
              </div>
              <div className="stat-card-icon" style={{ width: '40px', height: '40px', fontSize: '16px' }}><FaCode /></div>
            </div>
            <div className="premium-card-desc">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                <span>Proficiency Level</span>
                <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>{skill.level}%</span>
              </div>
              <div className="custom-progress" style={{ height: '6px' }}>
                <div className="progress-bar" style={{ width: `${skill.level}%`, height: '100%' }}></div>
              </div>
            </div>
            <div className="premium-card-footer">
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Order: {skill.display_order}</span>
              <div className="premium-card-actions">
                <button className="btn-card-edit" onClick={() => handleEdit(skill)}><FaEdit /></button>
                <button className="btn-card-delete" onClick={() => handleDelete(skill.id)}><FaTrash /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 5. Experience Tab Component
const ExperienceTab = ({ experiences, setExperiences, refreshStats }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [formData, setFormData] = useState({
    role: '', company: '', location: '', duration: '', type: 'Full-time', responsibilities: '', technologies: '', display_order: 0
  });

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
        refreshStats();
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

  const handleDelete = async (id) => {
    if (window.confirm('Delete this experience card?')) {
      try {
        const response = await fetch(`${BASE_URL}/api/manage/experiences/${id}/`, {
          method: 'DELETE',
          credentials: 'include'
        });
        if (response.ok) {
          setExperiences(experiences.filter(e => e.id !== id));
          refreshStats();
        }
      } catch (error) {
        console.error('Failed to delete experience:', error);
      }
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
            <div key={exp.id} className="premium-item-card active-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4>{exp.role}</h4>
                  <p className="premium-card-meta">{exp.company} &bull; {exp.duration}</p>
                </div>
                <div className="stat-card-icon" style={{ width: '40px', height: '40px', fontSize: '16px' }}><FaBriefcase /></div>
              </div>
              <div className="premium-card-desc">
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
              <div className="premium-card-footer">
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Location: {exp.location}</span>
                <div className="premium-card-actions">
                  <button className="btn-card-edit" onClick={() => handleEdit(exp)}><FaEdit /></button>
                  <button className="btn-card-delete" onClick={() => handleDelete(exp.id)}><FaTrash /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 6. Projects Tab Component
const ProjectsTab = ({ projects, setProjects, refreshStats }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '', slug: '', description: '', short_description: '', technologies: '', features_list: '', github_url: '', live_url: '', status: 'Completed', is_featured: true, display_order: 0, image: null, category: 'Web Application'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const form = new FormData();
    
    // Convert features list newline to JSON
    let finalFeatures = formData.features_list;
    try {
      const parsed = JSON.parse(formData.features_list);
      if (Array.isArray(parsed)) {
        finalFeatures = JSON.stringify(parsed);
      } else {
        finalFeatures = JSON.stringify([formData.features_list]);
      }
    } catch {
      const arr = formData.features_list.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      finalFeatures = JSON.stringify(arr);
    }

    const payload = { ...formData, features_list: finalFeatures };

    Object.keys(payload).forEach(key => {
      if (payload[key] !== null && payload[key] !== '') {
        form.append(key, payload[key]);
      }
    });

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
        const updated = await response.json();
        if (editingProject) {
          setProjects(projects.map(p => p.id === editingProject.id ? updated : p));
        } else {
          setProjects([updated, ...projects]);
        }
        resetForm();
        refreshStats();
      } else {
        const errData = await response.json();
        alert('Failed to save project: ' + JSON.stringify(errData));
      }
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('Error saving project: ' + error.message);
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
      if (Array.isArray(parsed)) {
        featText = parsed.join('\n');
      }
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

  const handleDelete = async (id) => {
    if (window.confirm('Delete this project forever?')) {
      try {
        const response = await fetch(`${BASE_URL}/api/manage/projects/${id}/`, {
          method: 'DELETE',
          credentials: 'include'
        });
        if (response.ok) {
          setProjects(projects.filter(p => p.id !== id));
          refreshStats();
        }
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

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

      {showForm && (
        <div className="premium-form-card">
          <h3>{editingProject ? 'Modify Showcase Project' : 'Add Showcase Project'}</h3>
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
            <div className="form-grid-3">
              <div className="form-group-premium">
                <label>Short Description (simple summary card)</label>
                <input type="text" value={formData.short_description} onChange={(e) => setFormData({...formData, short_description: e.target.value})} disabled={saving} />
              </div>
              <div className="form-group-premium">
                <label>Tech Stack / Badges (comma separated)</label>
                <input type="text" placeholder="React, Express, Node.js" value={formData.technologies} onChange={(e) => setFormData({...formData, technologies: e.target.value})} required disabled={saving} />
              </div>
              <div className="form-group-premium">
                <label>Project Category</label>
                <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} disabled={saving}>
                  <option value="Web Application">Web Application</option>
                  <option value="SaaS">SaaS</option>
                  <option value="Mobile Application">Mobile Application</option>
                  <option value="AI / Machine Learning">AI / Machine Learning</option>
                  <option value="Content Management">Content Management</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="form-group-premium">
              <label>Detailed Description</label>
              <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required disabled={saving} />
            </div>
            <div className="form-group-premium">
              <label>Key Features & Highlights (one per line)</label>
              <textarea placeholder="Payment gateway integration&#10;Real-time dashboard analytics..." value={formData.features_list} onChange={(e) => setFormData({...formData, features_list: e.target.value})} disabled={saving} />
            </div>
            <div className="form-grid-3">
              <div className="form-group-premium">
                <label>GitHub Repository URL</label>
                <input type="url" value={formData.github_url} onChange={(e) => setFormData({...formData, github_url: e.target.value})} disabled={saving} />
              </div>
              <div className="form-group-premium">
                <label>Live Demo URL</label>
                <input type="url" value={formData.live_url} onChange={(e) => setFormData({...formData, live_url: e.target.value})} disabled={saving} />
              </div>
              <div className="form-group-premium">
                <label>Project Status</label>
                <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} disabled={saving}>
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>
            <div className="form-grid-2">
              <div className="form-group-premium">
                <label>Project Card Image File (overrides URL)</label>
                <input type="file" accept="image/*" onChange={(e) => setFormData({...formData, image: e.target.files[0]})} disabled={saving} />
              </div>
              <div className="form-group-premium">
                <label>Display Order Priority</label>
                <input type="number" value={formData.display_order} onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value)})} disabled={saving} />
              </div>
            </div>
            <div className="form-group-premium form-group-checkbox">
              <input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({...formData, is_featured: e.target.checked})} id="is_featured_project" disabled={saving} />
              <label htmlFor="is_featured_project">Featured Showcase Item</label>
            </div>
            <div className="form-actions-premium">
              <button type="submit" className="btn-premium-save" disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {saving ? (
                  <>
                    <FaSpinner className="spinner-icon" /> Saving...
                  </>
                ) : (
                  editingProject ? 'Save Showcase' : 'Launch Project'
                )}
              </button>
              <button type="button" className="btn-premium-cancel" onClick={resetForm} disabled={saving}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="premium-cards-grid">
        {projects.map(proj => (
          <div key={proj.id} className="premium-item-card">
            {proj.image_url && (
              <div 
                className="overflow-hidden" 
                style={{ 
                  margin: '-25px -25px 20px -25px', 
                  width: 'calc(100% + 50px)', 
                  aspectRatio: '16/9',
                  background: 'linear-gradient(135deg, #09090b, #18181b)',
                  borderBottom: '1px solid rgba(255, 122, 26, 0.1)',
                  borderRadius: '16px 16px 0 0'
                }}
              >
                <img 
                  src={`${BASE_URL}${proj.image_url}`} 
                  alt={proj.name} 
                  className="project-image" 
                  style={{ 
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'center',
                    padding: '8px'
                  }} 
                />
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h4>{proj.name}</h4>
                <p className="premium-card-meta">{proj.status}</p>
              </div>
              <div className="premium-card-tag">{proj.category || 'Web Application'}</div>
            </div>
            <p className="premium-card-desc">{proj.short_description || proj.description.substring(0, 100) + '...'}</p>
            <div className="premium-card-footer">
              <div className="premium-card-tags">
                {proj.technologies.split(',').slice(0, 3).map((t, i) => (
                  <span key={i} className="premium-card-tag">{t.trim()}</span>
                ))}
              </div>
              <div className="premium-card-actions">
                <button className="btn-card-edit" onClick={() => handleEdit(proj)}><FaEdit /></button>
                <button className="btn-card-delete" onClick={() => handleDelete(proj.id)}><FaTrash /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 7. Resume Tab Component
const ResumeTab = ({ resumes, setResumes, refreshStats }) => {
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({ title: '', version_name: 'v1.0', is_active: true });

  const handleUpload = async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('resume-file');
    const file = fileInput.files[0];
    if (!file) {
      alert('Please select a PDF file first.');
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
        alert('Resume version uploaded successfully!');
        setFormData({ title: '', version_name: 'v1.0', is_active: true });
        fileInput.value = '';
        refreshStats();
      }
    } catch (error) {
      console.error('Failed to upload resume:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this resume version?')) {
      try {
        const response = await fetch(`${BASE_URL}/api/manage/resume/${id}/`, {
          method: 'DELETE',
          credentials: 'include'
        });
        if (response.ok) {
          setResumes(resumes.filter(r => r.id !== id));
          refreshStats();
        }
      } catch (error) {
        console.error('Failed to delete resume:', error);
      }
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
          <div key={res.id} className={`premium-item-card ${res.is_active ? 'active-item' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h4>{res.title}</h4>
                <p className="premium-card-meta">Uploaded: {new Date(res.uploaded_at).toLocaleDateString()}</p>
              </div>
              <div className="stat-card-icon" style={{ width: '40px', height: '40px', fontSize: '16px' }}><FaFileAlt /></div>
            </div>
            <div className="premium-card-footer">
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {res.is_active ? <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>ACTIVE DOWNLOAD</span> : 'Archived'}
              </span>
              <div className="premium-card-actions">
                <a href={`${BASE_URL}/api/resume/download/`} target="_blank" rel="noopener noreferrer" className="btn-card-edit" style={{ display: 'flex', alignItems: 'center' }}><FaLink /> Download</a>
                <button className="btn-card-delete" onClick={() => handleDelete(res.id)}><FaTrash /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 8. Contact Tab Component
const ContactTab = ({ data, setData }) => {
  const [formData, setFormData] = useState({
    email: '', phone: '', location: '', cta_heading: '', cta_subtitle: '', meeting_link: '',
    linkedin: '', github: '', whatsapp: '', telegram: ''
  });

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
        alert('Contact details updated successfully!');
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