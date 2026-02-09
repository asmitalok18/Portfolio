import React, { useState, useEffect } from 'react';
import '../styles/PortfolioManagement.css';

const PortfolioManagement = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [projects, setProjects] = useState([]);
  const [personalInfo, setPersonalInfo] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({});

  // Check authentication status
  useEffect(() => {
    // Temporarily bypass authentication for testing
    // Remove this and uncomment the real auth check when backend is ready
    setIsAuthenticated(true);
    setLoading(false);
    
    // Real authentication check (uncomment when backend is running):
    // checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/check/');
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
    try {
      const response = await fetch('http://localhost:8000/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(loginData)
      });
      
      const data = await response.json();
      if (data.success) {
        setIsAuthenticated(true);
        loadDashboardData();
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8000/api/auth/logout/', {
        method: 'POST',
        credentials: 'include'
      });
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const loadDashboardData = async () => {
    try {
      const [statsRes, projectsRes, personalRes, resumesRes] = await Promise.all([
        fetch('http://localhost:8000/api/manage/dashboard/', { credentials: 'include' }),
        fetch('http://localhost:8000/api/manage/projects/', { credentials: 'include' }),
        fetch('http://localhost:8000/api/manage/personal-info/', { credentials: 'include' }),
        fetch('http://localhost:8000/api/manage/resume/', { credentials: 'include' })
      ]);

      // Handle each response with error checking
      if (statsRes.ok) {
        const stats = await statsRes.json();
        setDashboardStats(stats);
      }
      
      if (projectsRes.ok) {
        const projects = await projectsRes.json();
        setProjects(Array.isArray(projects) ? projects : []);
      }
      
      if (personalRes.ok) {
        const personal = await personalRes.json();
        setPersonalInfo(Array.isArray(personal) ? personal : []);
      }
      
      if (resumesRes.ok) {
        const resumes = await resumesRes.json();
        setResumes(Array.isArray(resumes) ? resumes : []);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      // Set default empty arrays to prevent map errors
      setProjects([]);
      setPersonalInfo([]);
      setResumes([]);
      setDashboardStats({});
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  if (loading) {
    return <div className="management-loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="management-login">
        <div className="login-container">
          <h2>Portfolio Management</h2>
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
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-management">
      <div className="management-header">
        <h1>Portfolio Management</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      <div className="management-tabs">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={activeTab === 'projects' ? 'active' : ''}
          onClick={() => setActiveTab('projects')}
        >
          Projects
        </button>
        <button 
          className={activeTab === 'personal' ? 'active' : ''}
          onClick={() => setActiveTab('personal')}
        >
          Personal Info
        </button>
        <button 
          className={activeTab === 'resume' ? 'active' : ''}
          onClick={() => setActiveTab('resume')}
        >
          Resume
        </button>
      </div>

      <div className="management-content">
        {activeTab === 'dashboard' && <DashboardTab stats={dashboardStats} />}
        {activeTab === 'projects' && <ProjectsTab projects={projects} setProjects={setProjects} />}
        {activeTab === 'personal' && <PersonalInfoTab personalInfo={personalInfo} setPersonalInfo={setPersonalInfo} />}
        {activeTab === 'resume' && <ResumeTab resumes={resumes} setResumes={setResumes} />}
      </div>
    </div>
  );
};

// Dashboard Tab Component
const DashboardTab = ({ stats }) => (
  <div className="dashboard-tab">
    <div className="stats-grid">
      <div className="stat-card">
        <h3>Total Projects</h3>
        <p className="stat-number">{stats.total_projects || 0}</p>
      </div>
      <div className="stat-card">
        <h3>Total Chats</h3>
        <p className="stat-number">{stats.total_chats || 0}</p>
      </div>
      <div className="stat-card">
        <h3>Active Resume</h3>
        <p className="stat-status">{stats.active_resume ? 'Yes' : 'No'}</p>
      </div>
    </div>
    
    <div className="recent-messages">
      <h3>Recent AI Chat Messages</h3>
      {stats.recent_messages && stats.recent_messages.length > 0 ? (
        <ul>
          {stats.recent_messages.map((msg, index) => (
            <li key={index}>
              <span className="message-text">{msg.user_message}</span>
              <span className="message-time">{new Date(msg.timestamp).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recent messages</p>
      )}
    </div>
  </div>
);

// Projects Tab Component
const ProjectsTab = ({ projects, setProjects }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', technologies: '', category: '',
    github_url: '', live_url: '', image: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== '') {
        form.append(key, formData[key]);
      }
    });

    try {
      const url = editingProject 
        ? `http://localhost:8000/api/manage/projects/${editingProject.id}/`
        : 'http://localhost:8000/api/manage/projects/';
      
      const method = editingProject ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        credentials: 'include',
        body: form
      });

      if (response.ok) {
        const updatedProject = await response.json();
        if (editingProject) {
          setProjects(projects.map(p => p.id === editingProject.id ? updatedProject : p));
        } else {
          setProjects([updatedProject, ...projects]);
        }
        resetForm();
      }
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', description: '', technologies: '', category: '',
      github_url: '', live_url: '', image: null
    });
    setShowForm(false);
    setEditingProject(null);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      technologies: project.technologies,
      category: project.category,
      github_url: project.github_url || '',
      live_url: project.live_url || '',
      image: null
    });
    setShowForm(true);
  };

  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await fetch(`http://localhost:8000/api/manage/projects/${projectId}/`, {
          method: 'DELETE',
          credentials: 'include'
        });
        setProjects(projects.filter(p => p.id !== projectId));
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  return (
    <div className="projects-tab">
      <div className="tab-header">
        <h2>Manage Projects</h2>
        <button onClick={() => setShowForm(true)} className="add-btn">Add Project</button>
      </div>

      {showForm && (
        <div className="project-form">
          <h3>{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                type="text"
                placeholder="Project Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Category"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
              />
            </div>
            <textarea
              placeholder="Project Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Technologies (comma separated)"
              value={formData.technologies}
              onChange={(e) => setFormData({...formData, technologies: e.target.value})}
              required
            />
            <div className="form-row">
              <input
                type="url"
                placeholder="GitHub URL"
                value={formData.github_url}
                onChange={(e) => setFormData({...formData, github_url: e.target.value})}
              />
              <input
                type="url"
                placeholder="Live Demo URL"
                value={formData.live_url}
                onChange={(e) => setFormData({...formData, live_url: e.target.value})}
              />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
            />
            <div className="form-actions">
              <button type="submit">{editingProject ? 'Update' : 'Add'} Project</button>
              <button type="button" onClick={resetForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="projects-list">
        {projects && projects.length > 0 ? projects.map(project => (
          <div key={project.id} className="project-item">
            <div className="project-info">
              <h4>{project.name}</h4>
              <p>{project.description}</p>
              <span className="project-tech">{project.technologies}</span>
            </div>
            <div className="project-actions">
              <button onClick={() => handleEdit(project)}>Edit</button>
              <button onClick={() => handleDelete(project.id)} className="delete-btn">Delete</button>
            </div>
          </div>
        )) : (
          <div className="no-projects">
            <p>No projects found. Add your first project!</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Personal Info Tab Component
const PersonalInfoTab = ({ personalInfo, setPersonalInfo }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingInfo, setEditingInfo] = useState(null);
  const [formData, setFormData] = useState({ key: '', value: '', category: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingInfo 
        ? `http://localhost:8000/api/manage/personal-info/${editingInfo.id}/`
        : 'http://localhost:8000/api/manage/personal-info/';
      
      const method = editingInfo ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedInfo = await response.json();
        if (editingInfo) {
          setPersonalInfo(personalInfo.map(p => p.id === editingInfo.id ? updatedInfo : p));
        } else {
          setPersonalInfo([...personalInfo, updatedInfo]);
        }
        resetForm();
      }
    } catch (error) {
      console.error('Failed to save personal info:', error);
    }
  };

  const resetForm = () => {
    setFormData({ key: '', value: '', category: '' });
    setShowForm(false);
    setEditingInfo(null);
  };

  const handleEdit = (info) => {
    setEditingInfo(info);
    setFormData({ key: info.key, value: info.value, category: info.category });
    setShowForm(true);
  };

  const handleDelete = async (infoId) => {
    if (window.confirm('Are you sure you want to delete this information?')) {
      try {
        await fetch(`http://localhost:8000/api/manage/personal-info/${infoId}/`, {
          method: 'DELETE',
          credentials: 'include'
        });
        setPersonalInfo(personalInfo.filter(p => p.id !== infoId));
      } catch (error) {
        console.error('Failed to delete personal info:', error);
      }
    }
  };

  return (
    <div className="personal-info-tab">
      <div className="tab-header">
        <h2>Manage Personal Information</h2>
        <button onClick={() => setShowForm(true)} className="add-btn">Add Info</button>
      </div>

      {showForm && (
        <div className="info-form">
          <h3>{editingInfo ? 'Edit Information' : 'Add New Information'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                type="text"
                placeholder="Key (e.g., name, email, skills)"
                value={formData.key}
                onChange={(e) => setFormData({...formData, key: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Category (e.g., basic, contact, skills)"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
              />
            </div>
            <textarea
              placeholder="Value"
              value={formData.value}
              onChange={(e) => setFormData({...formData, value: e.target.value})}
              required
            />
            <div className="form-actions">
              <button type="submit">{editingInfo ? 'Update' : 'Add'} Information</button>
              <button type="button" onClick={resetForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="info-list">
        {personalInfo && personalInfo.length > 0 ? personalInfo.map(info => (
          <div key={info.id} className="info-item">
            <div className="info-content">
              <h4>{info.key}</h4>
              <p>{info.value}</p>
              <span className="info-category">{info.category}</span>
            </div>
            <div className="info-actions">
              <button onClick={() => handleEdit(info)}>Edit</button>
              <button onClick={() => handleDelete(info.id)} className="delete-btn">Delete</button>
            </div>
          </div>
        )) : (
          <div className="no-info">
            <p>No personal information found. Add your details!</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Resume Tab Component
const ResumeTab = ({ resumes, setResumes }) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name.split('.')[0]);
    formData.append('is_active', 'true');

    try {
      const response = await fetch('http://localhost:8000/api/manage/resume/', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (response.ok) {
        const newResume = await response.json();
        setResumes([newResume, ...(resumes || []).map(r => ({...r, is_active: false}))]);
      }
    } catch (error) {
      console.error('Failed to upload resume:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (resumeId) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await fetch(`http://localhost:8000/api/manage/resume/${resumeId}/`, {
          method: 'DELETE',
          credentials: 'include'
        });
        setResumes(resumes.filter(r => r.id !== resumeId));
      } catch (error) {
        console.error('Failed to delete resume:', error);
      }
    }
  };

  return (
    <div className="resume-tab">
      <div className="tab-header">
        <h2>Manage Resume</h2>
        <div className="upload-section">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleUpload}
            disabled={uploading}
            id="resume-upload"
            style={{ display: 'none' }}
          />
          <label htmlFor="resume-upload" className="upload-btn">
            {uploading ? 'Uploading...' : 'Upload New Resume'}
          </label>
        </div>
      </div>

      <div className="resume-list">
        {resumes && resumes.length > 0 ? resumes.map(resume => (
          <div key={resume.id} className={`resume-item ${resume.is_active ? 'active' : ''}`}>
            <div className="resume-info">
              <h4>{resume.title}</h4>
              <p>Uploaded: {new Date(resume.uploaded_at).toLocaleDateString()}</p>
              {resume.is_active && <span className="active-badge">Active</span>}
            </div>
            <div className="resume-actions">
              <a 
                href={`http://localhost:8000/api/resume/download/`}
                target="_blank"
                rel="noopener noreferrer"
                className="download-btn"
              >
                Download
              </a>
              <button onClick={() => handleDelete(resume.id)} className="delete-btn">Delete</button>
            </div>
          </div>
        )) : (
          <div className="no-resumes">
            <p>No resumes uploaded. Upload your first resume!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioManagement;