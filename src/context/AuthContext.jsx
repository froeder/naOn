import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  isFirebaseConfigured,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  updateProfile,
} from '../services/firebase';

const AuthContext = createContext(null);

const DEFAULT_GUEST_USER = {
  uid: 'user-warrior-local',
  displayName: 'Guerreiro(a) naOn',
  email: 'guerreiro@naon.app',
  photoURL: null,
  isAnonymous: false,
  joinedAt: new Date().toISOString(),
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('naon_user_auth');
      return saved ? JSON.parse(saved) : DEFAULT_GUEST_USER;
    } catch {
      return DEFAULT_GUEST_USER;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
          const formatted = {
            uid: fbUser.uid,
            displayName: fbUser.displayName || 'Guerreiro(a) naOn',
            email: fbUser.email || 'anonimo@naon.app',
            photoURL: fbUser.photoURL,
            isAnonymous: fbUser.isAnonymous,
            joinedAt: fbUser.metadata?.creationTime || new Date().toISOString(),
          };
          setUser(formatted);
          localStorage.setItem('naon_user_auth', JSON.stringify(formatted));
        } else {
          // Mantém o usuário convidado/local
          const saved = localStorage.getItem('naon_user_auth');
          setUser(saved ? JSON.parse(saved) : DEFAULT_GUEST_USER);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const loginWithEmail = async (email, password) => {
    if (isFirebaseConfigured && auth) {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      return cred.user;
    } else {
      // Mock login local
      const name = email.split('@')[0];
      const mockUser = {
        uid: `user-${Date.now()}`,
        displayName: name.charAt(0).toUpperCase() + name.slice(1),
        email,
        photoURL: null,
        isAnonymous: false,
        joinedAt: new Date().toISOString(),
      };
      setUser(mockUser);
      localStorage.setItem('naon_user_auth', JSON.stringify(mockUser));
      return mockUser;
    }
  };

  const registerWithEmail = async (name, email, password) => {
    if (isFirebaseConfigured && auth) {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      return cred.user;
    } else {
      const mockUser = {
        uid: `user-${Date.now()}`,
        displayName: name || 'Guerreiro(a)',
        email,
        photoURL: null,
        isAnonymous: false,
        joinedAt: new Date().toISOString(),
      };
      setUser(mockUser);
      localStorage.setItem('naon_user_auth', JSON.stringify(mockUser));
      return mockUser;
    }
  };

  const loginAsGuest = () => {
    const guest = {
      uid: `guest-${Math.random().toString(36).substring(2, 8)}`,
      displayName: 'Visitante em Recuperação',
      email: 'visitante@naon.app',
      photoURL: null,
      isAnonymous: true,
      joinedAt: new Date().toISOString(),
    };
    setUser(guest);
    localStorage.setItem('naon_user_auth', JSON.stringify(guest));
    return guest;
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await fbSignOut(auth);
    }
    const defaultUser = {
      ...DEFAULT_GUEST_USER,
      uid: `user-${Date.now()}`,
    };
    setUser(defaultUser);
    localStorage.setItem('naon_user_auth', JSON.stringify(defaultUser));
  };

  const updateUserName = (newName) => {
    if (!newName) return;
    const updated = { ...user, displayName: newName };
    setUser(updated);
    localStorage.setItem('naon_user_auth', JSON.stringify(updated));
    if (isFirebaseConfigured && auth?.currentUser) {
      updateProfile(auth.currentUser, { displayName: newName }).catch(console.warn);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isFirebaseConfigured,
        loginWithEmail,
        registerWithEmail,
        loginAsGuest,
        logout,
        updateUserName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}
