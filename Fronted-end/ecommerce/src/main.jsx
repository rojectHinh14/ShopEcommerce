import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import { loginSuccess } from './store/slices/userSlice.js'; // Import loginSuccess action
import { AuthProvider } from './contexts/AuthContext.jsx'

// Check localStorage and restore user state on initial load
const storedUser = localStorage.getItem('user');
if (storedUser) {
  try {
    const user = JSON.parse(storedUser);
    // Dispatch action to restore user state in Redux store
    store.dispatch(loginSuccess(user));
  } catch (error) {
    console.error('Failed to parse user from localStorage:', error);
    localStorage.removeItem('user'); // Clear invalid data
    localStorage.removeItem('token'); // Clear invalid data
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Provider>
  </StrictMode>,
)
