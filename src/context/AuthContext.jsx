import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  isFirebaseConfigured,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  signInAnonymously,
  sendPasswordResetEmail,
  updateProfile,
} from '../services/firebase';

const AuthContext = createContext(null);

export const mapAuthError = (code) => {
  switch (code) {
    case 'auth/invalid-email':
      return 'Formato de e-mail inválido.';
    case 'auth/user-disabled':
      return 'Conta de usuário desativada.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'E-mail ou senha incorretos.';
    case 'auth/email-already-in-use':
      return 'Este e-mail já está em uso.';
    case 'auth/weak-password':
      return 'A senha deve ter no mínimo 6 caracteres.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Aguarde um instante.';
    case 'auth/network-request-failed':
      return 'Sem conexão com a internet.';
    default:
      return code || 'Erro na autenticação. Tente novamente.';
  }
};

const formatUserData = (fbUser, name = null) => ({
  uid: fbUser.uid,
  displayName: name || fbUser.displayName || (fbUser.isAnonymous ? 'Visitante Anônimo' : fbUser.email?.split('@')[0]) || 'Guerreiro(a)',
  email: fbUser.email || (fbUser.isAnonymous ? 'anonimo@naon.app' : ''),
  photoURL: fbUser.photoURL || null,
  isAnonymous: Boolean(fbUser.isAnonymous),
  joinedAt: fbUser.metadata?.creationTime || new Date().toISOString(),
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsub = onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
          const u = formatUserData(fbUser);
          setUser(u);
          localStorage.setItem('naon_user_auth', JSON.stringify(u));
        } else {
          setUser(null);
          localStorage.removeItem('naon_user_auth');
        }
        setLoading(false);
      });
      return () => unsub();
    }
    const saved = localStorage.getItem('naon_user_auth');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch { setUser(null); }
    }
    setLoading(false);
  }, []);

  const loginWithEmail = async (email, password) => {
    if (isFirebaseConfigured && auth) {
      const res = await signInWithEmailAndPassword(auth, email.trim(), password);
      const u = formatUserData(res.user);
      setUser(u);
      localStorage.setItem('naon_user_auth', JSON.stringify(u));
      return u;
    }
    const mock = { uid: 'u-' + Date.now(), displayName: email.split('@')[0], email: email.trim(), photoURL: null, isAnonymous: false, joinedAt: new Date().toISOString() };
    setUser(mock);
    localStorage.setItem('naon_user_auth', JSON.stringify(mock));
    return mock;
  };

  const registerWithEmail = async (name, email, password) => {
    if (isFirebaseConfigured && auth) {
      const res = await createUserWithEmailAndPassword(auth, email.trim(), password);
      if (name?.trim()) {
        try { await updateProfile(res.user, { displayName: name.trim() }); } catch {}
      }
      const u = formatUserData(res.user, name?.trim());
      setUser(u);
      localStorage.setItem('naon_user_auth', JSON.stringify(u));
      return u;
    }
    const mock = { uid: 'u-' + Date.now(), displayName: name?.trim() || email.split('@')[0], email: email.trim(), photoURL: null, isAnonymous: false, joinedAt: new Date().toISOString() };
    setUser(mock);
    localStorage.setItem('naon_user_auth', JSON.stringify(mock));
    return mock;
  };

  const loginAnonymously = async () => {
    if (isFirebaseConfigured && auth) {
      const res = await signInAnonymously(auth);
      const u = formatUserData(res.user);
      setUser(u);
      localStorage.setItem('naon_user_auth', JSON.stringify(u));
      return u;
    }
    const mock = { uid: 'anon-' + Date.now(), displayName: 'Visitante Anônimo', email: 'anonimo@naon.app', photoURL: null, isAnonymous: true, joinedAt: new Date().toISOString() };
    setUser(mock);
    localStorage.setItem('naon_user_auth', JSON.stringify(mock));
    return mock;
  };

  const resetPassword = async (email) => {
    if (isFirebaseConfigured && auth) {
      await sendPasswordResetEmail(auth, email.trim());
    }
  };

  const logout = async () => {
    try {
      if (isFirebaseConfigured && auth) await fbSignOut(auth);
    } catch (e) {
      console.error(e);
    } finally {
      setUser(null);
      localStorage.removeItem('naon_user_auth');
    }
  };

  const updateUserProfile = async (updates) => {
    if (isFirebaseConfigured && auth?.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: updates.displayName || user?.displayName,
        photoURL: updates.photoURL || user?.photoURL,
      });
    }
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('naon_user_auth', JSON.stringify(updated));
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isFirebaseConfigured,
        loginWithEmail,
        registerWithEmail,
        loginAnonymously,
        loginAsGuest: loginAnonymously,
        resetPassword,
        logout,
        updateUserProfile,
        updateUserName: (name) => updateUserProfile({ displayName: name }),
        mapAuthError,
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
