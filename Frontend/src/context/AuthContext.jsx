import { createContext, useState, useRef, useEffect } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    tokens: { accessToken: null, refreshToken: null },
    isLoading: true,
  });
  
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const storedUser = localStorage.getItem('currentUser');
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');

    // Initialize auth state from localStorage - this is a valid initialization pattern
    if (storedUser && storedAccessToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setAuthState({
          user: parsedUser,
          tokens: {
            accessToken: storedAccessToken,
            refreshToken: storedRefreshToken,
          },
          isLoading: false,
        });
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
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
