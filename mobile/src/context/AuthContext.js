import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInAnonymously as fbSignInAnonymously,
  sendPasswordResetEmail,
  updateProfile,
} from '../services/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({});

const GUEST_STORAGE_KEY = 'naon_guest_user_session';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = () => {};
    if (auth) {
      unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
        } else {
          // Checa se há sessão anônima salva localmente
          try {
            const guestData = await AsyncStorage.getItem(GUEST_STORAGE_KEY);
            if (guestData) {
              setUser(JSON.parse(guestData));
            } else {
              setUser(null);
            }
          } catch (e) {
            setUser(null);
          }
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email, password) => {
    if (!auth) throw new Error('Firebase Auth não configurado');
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await AsyncStorage.removeItem(GUEST_STORAGE_KEY);
    return cred.user;
  };

  const registerWithEmail = async (email, password, displayName) => {
    if (!auth) throw new Error('Firebase Auth não configurado');
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    await AsyncStorage.removeItem(GUEST_STORAGE_KEY);
    return cred.user;
  };

  const loginAnonymously = async () => {
    if (auth) {
      try {
        const cred = await fbSignInAnonymously(auth);
        await updateProfile(cred.user, { displayName: 'Membro Anônimo' });
        await AsyncStorage.removeItem(GUEST_STORAGE_KEY);
        return cred.user;
      } catch (e) {
        console.warn('Fallback para convidado offline:', e.message);
      }
    }
    // Fallback Convidado Offline
    const localGuest = {
      uid: `anon_${Date.now()}`,
      isAnonymous: true,
      displayName: 'Membro Anônimo',
      email: null,
    };
    await AsyncStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(localGuest));
    setUser(localGuest);
    return localGuest;
  };

  const resetPassword = async (email) => {
    if (!auth) throw new Error('Firebase Auth não configurado');
    return await sendPasswordResetEmail(auth, email);
  };

  const logout = async () => {
    await AsyncStorage.removeItem(GUEST_STORAGE_KEY);
    if (auth && auth.currentUser) {
      await signOut(auth);
    }
    setUser(null);
  };

  const updateUserProfileData = async (data) => {
    if (auth && auth.currentUser) {
      await updateProfile(auth.currentUser, data);
      setUser({ ...auth.currentUser, ...data });
    } else if (user) {
      const updated = { ...user, ...data };
      await AsyncStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(updated));
      setUser(updated);
    }
  };

  const mapAuthError = (code) => {
    switch (code) {
      case 'auth/invalid-email':
        return 'E-mail inválido.';
      case 'auth/user-disabled':
        return 'Esta conta foi desativada.';
      case 'auth/user-not-found':
      case 'auth/invalid-credential':
        return 'E-mail ou senha incorretos.';
      case 'auth/wrong-password':
        return 'Senha incorreta.';
      case 'auth/email-already-in-use':
        return 'Este e-mail já está cadastrado.';
      case 'auth/weak-password':
        return 'A senha deve ter no mínimo 6 caracteres.';
      case 'auth/too-many-requests':
        return 'Muitas tentativas. Tente novamente mais tarde.';
      case 'auth/network-request-failed':
        return 'Erro de conexão. Verifique sua internet.';
      default:
        return 'Ocorreu um erro. Tente novamente.';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithEmail,
        registerWithEmail,
        loginAnonymously,
        resetPassword,
        logout,
        updateUserProfileData,
        mapAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
