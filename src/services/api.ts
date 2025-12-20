import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('auth_token');
            localStorage.removeItem('current_tenant');
            window.location.href = '/#/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    signup: async (data: { businessName: string; email: string; password: string }) => {
        const response = await api.post('/auth/signup', data);
        return response.data;
    },

    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    }
};

// Prizes API
export const prizesAPI = {
    getAll: async (projectId?: string) => {
        const response = await api.get('/prizes', { params: { projectId } });
        return response.data;
    },

    create: async (data: { name: string; type: string; description: string; status?: string; projectId?: string }) => {
        const response = await api.post('/prizes', data);
        return response.data;
    },

    update: async (id: string, data: { name?: string; type?: string; description?: string; status?: string }) => {
        const response = await api.put(`/prizes/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/prizes/${id}`);
        return response.data;
    }
};

// Users API
export const usersAPI = {
    getAll: async () => {
        const response = await api.get('/users');
        return response.data;
    },

    create: async (data: { name: string; email: string; avatar?: string; plan?: string; status?: string }) => {
        const response = await api.post('/users', data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    }
};

// Spin API
export const spinAPI = {
    getConfig: async (tenantId: string) => {
        const response = await api.get(`/spin/config/${tenantId}`);
        return response.data;
    },

    updateConfig: async (data: {
        wheelColors?: string[];
        spinDuration?: number;
        soundEnabled?: boolean;
        showConfetti?: boolean;
        customMessage?: string;
        projectId?: string;
    }) => {
        const response = await api.put('/spin/config', data);
        return response.data;
    },

    recordSpin: async (data: { tenantId: string; projectId?: string; userName?: string; userEmail?: string; prizeWon: string }) => {
        const response = await api.post('/spin/record', data);
        return response.data;
    },

    getHistory: async () => {
        const response = await api.get('/spin/history');
        return response.data;
    }
};

// Contact Requests API
export const contactAPI = {
    create: async (data: {
        name: string;
        email: string;
        phone?: string;
        message: string;
        requestType: string;
    }) => {
        const response = await api.post('/contact', data);
        return response.data;
    },

    getAll: async () => {
        const response = await api.get('/contact');
        return response.data;
    },

    update: async (id: string, data: {
        status?: string;
        estimatedCost?: number;
        estimatedTimeframe?: string;
        adminNotes?: string;
    }) => {
        const response = await api.patch(`/contact/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/contact/${id}`);
        return response.data;
    }
};

// Tenant API
export const tenantAPI = {
    get: async () => {
        const response = await api.get('/tenant');
        return response.data;
    },

    update: async (data: {
        name?: string;
        ownerName?: string;
        logo?: string;
        primaryColor?: string;
        secondaryColor?: string;
        backgroundColor?: string;
        textColor?: string;
    }) => {
        const response = await api.put('/tenant', data);
        return response.data;
    }
};

// Projects API
export const projectsAPI = {
    getAll: async () => {
        const response = await api.get('/projects');
        return response.data;
    },

    get: async (id: string) => {
        const response = await api.get(`/projects/${id}`);
        return response.data;
    },

    create: async (data: {
        name: string;
        startDate?: string;
        endDate?: string;
        spinLimit?: number;
        price?: number;
    }) => {
        const response = await api.post('/projects', data);
        return response.data;
    },

    update: async (id: string, data: {
        name?: string;
        startDate?: string;
        endDate?: string;
        spinLimit?: number;
        price?: number;
        status?: string;
        isPaid?: boolean;
    }) => {
        const response = await api.put(`/projects/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/projects/${id}`);
        return response.data;
    }
};

// Stats API
export const statsAPI = {
    getOverview: async () => {
        const response = await api.get('/stats/overview');
        return response.data;
    },

    getProjectStats: async (projectId: string) => {
        const response = await api.get(`/stats/project/${projectId}`);
        return response.data;
    }
};

// Owner API (Platform owner only)
export const ownerAPI = {
    getTenants: async () => {
        const response = await api.get('/owner/tenants');
        return response.data;
    },

    getStats: async () => {
        const response = await api.get('/owner/stats');
        return response.data;
    },

    getTenantDetails: async (id: string) => {
        const response = await api.get(`/owner/tenant/${id}`);
        return response.data;
    }
};

export default api;

