import { createContext, useState, useRef, useEffect } from 'react';

// Create context separately to support fast refresh
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    tokens: { accessToken: null, refreshToken: null },
    isLoading: true,
  });
  
  const hasInitialized = useRef(false);

  // Initialize auth state from localStorage on mount using callback
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const storedUser = localStorage.getItem('currentUser');
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');

    // Schedule state update in next microtask to avoid direct setState in effect
    setTimeout(() => {
      let newState = {
        user: null,
        tokens: { accessToken: null, refreshToken: null },
        isLoading: false,
      };

      if (storedUser && storedAccessToken) {
        try {
          const parsedUser = JSON.parse(storedUser);
          newState = {
            user: parsedUser,
            tokens: {
              accessToken: storedAccessToken,
              refreshToken: storedRefreshToken,
            },
            isLoading: false,
          };
        } catch (error) {
          console.error('Failed to parse stored user:', error);
        }
      }
      
      setAuthState(newState);
    }, 0);
  }, []);

  const login = (userData, accessToken, refreshToken) => {
    setAuthState({
      user: userData,
      tokens: { accessToken, refreshToken },
      isLoading: false,
    });
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  };

  const logout = () => {
    setAuthState({
      user: null,
      tokens: { accessToken: null, refreshToken: null },
      isLoading: false,
    });
    localStorage.removeItem('currentUser');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
