import axios from "axios"

const API_URL = 'http://localhost:8080'; // URL của backend

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    transformRequest: [(data, headers) => {
        // Remove charset from Content-Type if present
        if (headers['Content-Type'] && headers['Content-Type'].includes('charset')) {
            headers['Content-Type'] = 'application/json';
        }
        return JSON.stringify(data);
    }]
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log('Making API request:', {
            url: config.url,
            method: config.method,
            hasToken: !!token
        });
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (err) => {
        console.error('Request interceptor error:', err);
        return Promise.reject(err);
    }
);

// add response interceptor
api.interceptors.response.use(
    (response) => {
        console.log('API response:', {
            url: response.config.url,
            status: response.status,
            data: response.data
        });
        return response;
    },
    async (err) => {
        console.error('API error:', {
            url: err.config?.url,
            status: err.response?.status,
            data: err.response?.data
        });
        const originalRequest = err.config;
        
        // Only handle 401 errors for non-auth endpoints
        if(err.response?.status === 401 && 
           !originalRequest._retry && 
           !originalRequest.url.includes('/auth/')) {
            
            originalRequest._retry = true;
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }

                const response = await api.post('/auth/refresh', {
                    token: token
                });

                if (response.data.data.token) {
                    const newToken = response.data.data.token;
                    localStorage.setItem('token', newToken);
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                }
            } catch(refreshError) {
                // Don't redirect automatically, let the component handle it
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(err);
    }
);

export default api;