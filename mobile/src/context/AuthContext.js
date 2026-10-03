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

const formatUserData = (fbUser, defaultName = null) => {
  if (!fbUser) return null;
  return {
    uid: fbUser.uid,
    displayName: defaultName || fbUser.displayName || (fbUser.isAnonymous ? 'Visitante Anônimo' : fbUser.email?.split('@')[0]) || 'Guerreiro(a)',
    email: fbUser.email || (fbUser.isAnonymous ? null : ''),
    photoURL: fbUser.photoURL || null,
    isAnonymous: Boolean(fbUser.isAnonymous),
  };
};

export const mapAuthError = (codeOrMessage) => {
  if (!codeOrMessage) return 'Ocorreu um erro. Tente novamente.';
  const text = String(codeOrMessage);
  if (text.includes('auth/invalid-credential') || text.includes('auth/user-not-found') || text.includes('auth/wrong-password')) {
    return 'E-mail ou senha incorretos.';
  }
  if (text.includes('auth/invalid-email')) {
    return 'E-mail inválido.';
  }
  if (text.includes('auth/email-already-in-use')) {
    return 'Este e-mail já está cadastrado.';
  }
  if (text.includes('auth/weak-password')) {
    return 'A senha deve ter no mínimo 6 caracteres.';
  }
  if (text.includes('auth/user-disabled')) {
    return 'Esta conta foi desativada.';
  }
  if (text.includes('auth/too-many-requests')) {
    return 'Muitas tentativas. Aguarde um instante e tente novamente.';
  }
  if (text.includes('auth/network-request-failed')) {
    return 'Sem conexão com a internet. Verifique sua rede.';
  }
  if (text.includes('auth/operation-not-allowed')) {
    return 'Método de login não ativado no Firebase Console.';
  }
  return 'Ocorreu um erro na autenticação. Verifique os dados.';
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = () => {};
    if (auth) {
      unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          setUser(formatUserData(currentUser));
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
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    await AsyncStorage.removeItem(GUEST_STORAGE_KEY);
    const u = formatUserData(cred.user);
    setUser(u);
    return u;
  };

  const registerWithEmail = async (param1, param2, param3) => {
    if (!auth) throw new Error('Firebase Auth não configurado');
    let name, email, password;
    if (typeof param1 === 'string' && param1.includes('@')) {
      email = param1;
      password = param2;
      name = param3;
    } else {
      name = param1;
      email = param2;
      password = param3;
    }

    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    if (name?.trim()) {
      try {
        await updateProfile(cred.user, { displayName: name.trim() });
      } catch (e) {
        console.warn('Erro ao salvar nome:', e);
      }
    }
    await AsyncStorage.removeItem(GUEST_STORAGE_KEY);
    const u = formatUserData(cred.user, name?.trim());
    setUser(u);
    return u;
  };

  const loginAnonymously = async () => {
    if (auth) {
      try {
        const cred = await fbSignInAnonymously(auth);
        try {
          await updateProfile(cred.user, { displayName: 'Visitante Anônimo' });
        } catch {}
        await AsyncStorage.removeItem(GUEST_STORAGE_KEY);
        const u = formatUserData(cred.user, 'Visitante Anônimo');
        setUser(u);
        return u;
      } catch (e) {
        console.warn('Fallback para convidado offline:', e.message);
      }
    }
    // Fallback Convidado Offline
    const localGuest = {
      uid: `anon_${Date.now()}`,
      isAnonymous: true,
      displayName: 'Visitante Anônimo',
      email: null,
    };
    await AsyncStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(localGuest));
    setUser(localGuest);
    return localGuest;
  };

  const resetPassword = async (email) => {
    if (!auth) throw new Error('Firebase Auth não configurado');
    return await sendPasswordResetEmail(auth, email.trim());
  };

  const logout = async () => {
    await AsyncStorage.removeItem(GUEST_STORAGE_KEY);
    if (auth && auth.currentUser) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn('Erro ao deslogar Firebase:', e);
      }
    }
    setUser(null);
  };

  const updateUserProfileData = async (data) => {
    if (auth && auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, data);
      } catch (e) {
        console.warn('Erro ao atualizar perfil no Firebase:', e);
      }
      setUser((prev) => ({ ...prev, ...data }));
    } else if (user) {
      const updated = { ...user, ...data };
      await AsyncStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(updated));
      setUser(updated);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: loginWithEmail,
        loginWithEmail,
        register: registerWithEmail,
        registerWithEmail,
        loginGuest: loginAnonymously,
        loginAnonymously,
        resetPassword,
        logout,
        updateProfile: updateUserProfileData,
        updateUserProfileData,
        isGuest: Boolean(user?.isAnonymous || !user?.email),
        mapAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
