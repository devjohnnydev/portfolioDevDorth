const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('admin_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `HTTP ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

// Auth
export const authApi = {
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};

// Profile
export const profileApi = {
  get: () => request('/profile'),
  update: (data) =>
    request('/profile', { method: 'PUT', body: JSON.stringify(data) }),
};

// Projects
export const projectsApi = {
  getAll: () => request('/projects'),
  get: (id) => request(`/projects/${id}`),
  create: (data) =>
    request('/projects', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) =>
    request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/projects/${id}`, { method: 'DELETE' }),
};

// Skills
export const skillsApi = {
  getAll: () => request('/skills'),
  create: (data) =>
    request('/skills', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) =>
    request(`/skills/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/skills/${id}`, { method: 'DELETE' }),
};

// Certifications
export const certificationsApi = {
  getAll: () => request('/certifications'),
  create: (data) =>
    request('/certifications', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) =>
    request(`/certifications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) => request(`/certifications/${id}`, { method: 'DELETE' }),
};

// Experiences
export const experiencesApi = {
  getAll: () => request('/experiences'),
  create: (data) =>
    request('/experiences', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) =>
    request(`/experiences/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) => request(`/experiences/${id}`, { method: 'DELETE' }),
};

// Resume
export const resumeApi = {
  generate: () =>
    fetch(`${API_BASE}/resume/generate`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('admin_token') || ''}`,
      },
    }).then((res) => {
      if (!res.ok) throw new Error('Failed to generate resume');
      return res.blob();
    }),
};

// Stats
export const statsApi = {
  get: () => request('/stats'),
};

// Upload
export const uploadApi = {
  image: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('admin_token');
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      body: formData,
    });
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  },
};
