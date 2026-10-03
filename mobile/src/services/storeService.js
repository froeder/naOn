import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  db,
  isFirebaseConfigured,
  collection,
  doc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from './firebase';
import {
  INITIAL_SUBSTANCES,
  INITIAL_POSTS,
  INITIAL_MOODS,
} from './mockData';

const STORAGE_KEYS = {
  SUBSTANCES: 'naon_substances_v1',
  POSTS: 'naon_posts_v1',
  MOODS: 'naon_moods_v1',
  USER_PROFILE: 'naon_user_profile_v1',
};

// Event emitter para reatividade local
const listeners = new Set();
const notifyListeners = (type, payload) => {
  listeners.forEach(fn => fn(type, payload));
};

export const subscribeToStoreChanges = (callback) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};

// Helpers de AsyncStorage
const getLocalData = async (key, defaultData) => {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) {
      await AsyncStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`Erro ao ler ${key} do AsyncStorage:`, e);
    return defaultData;
  }
};

const setLocalData = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Erro ao gravar ${key} no AsyncStorage:`, e);
  }
};

// ==========================================
// 1. SUBSTÂNCIAS (DASHBOARD)
// ==========================================

export const fetchSubstances = async (userId) => {
  if (isFirebaseConfigured && db && userId) {
    try {
      const colRef = collection(db, 'users', userId, 'substances');
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (e) {
      console.warn('Firestore indisponível, usando armazenamento local:', e.message);
    }
  }

  const key = userId ? `${STORAGE_KEYS.SUBSTANCES}_${userId}` : STORAGE_KEYS.SUBSTANCES;
  return await getLocalData(key, INITIAL_SUBSTANCES);
};

export const saveSubstance = async (userId, substance) => {
  const isNew = !substance.id;
  const newSubstance = {
    ...substance,
    id: substance.id || `sub_${Date.now()}`,
    createdAt: substance.createdAt || new Date().toISOString(),
    history: substance.history || [],
  };

  const key = userId ? `${STORAGE_KEYS.SUBSTANCES}_${userId}` : STORAGE_KEYS.SUBSTANCES;
  const current = await getLocalData(key, INITIAL_SUBSTANCES);
  let updated;
  if (isNew) {
    updated = [newSubstance, ...current];
  } else {
    updated = current.map(s => (s.id === newSubstance.id ? newSubstance : s));
  }
  await setLocalData(key, updated);
  notifyListeners('substances', updated);

  if (isFirebaseConfigured && db && userId) {
    try {
      const docRef = doc(db, 'users', userId, 'substances', newSubstance.id);
      await setDoc(docRef, newSubstance, { merge: true });
    } catch (e) {
      console.warn('Erro ao sincronizar substância no Firestore:', e.message);
    }
  }

  return newSubstance;
};

export const resetSubstanceStreak = async (userId, substanceId, reason = '', notes = '') => {
  const key = userId ? `${STORAGE_KEYS.SUBSTANCES}_${userId}` : STORAGE_KEYS.SUBSTANCES;
  const current = await getLocalData(key, INITIAL_SUBSTANCES);

  const resetRecord = {
    resetAt: new Date().toISOString(),
    reason: reason || 'Não especificado',
    notes: notes || '',
  };

  const updated = current.map((sub) => {
    if (sub.id === substanceId) {
      return {
        ...sub,
        startDate: new Date().toISOString(),
        history: [resetRecord, ...(sub.history || [])],
      };
    }
    return sub;
  });

  await setLocalData(key, updated);
  notifyListeners('substances', updated);

  if (isFirebaseConfigured && db && userId) {
    try {
      const target = updated.find(s => s.id === substanceId);
      if (target) {
        const docRef = doc(db, 'users', userId, 'substances', substanceId);
        await setDoc(docRef, target, { merge: true });
      }
    } catch (e) {
      console.warn('Erro ao atualizar reinício no Firestore:', e.message);
    }
  }

  return updated;
};

// ==========================================
// 2. COMUNIDADE (POSTS & PARTILHAS)
// ==========================================

export const fetchPosts = async () => {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (e) {
      console.warn('Firestore posts indisponível, usando armazenamento local:', e.message);
    }
  }
  return await getLocalData(STORAGE_KEYS.POSTS, INITIAL_POSTS);
};

export const createPost = async (postData) => {
  const newPost = {
    ...postData,
    id: `post_${Date.now()}`,
    createdAt: new Date().toISOString(),
    timeAgo: 'agora mesmo',
    likesCount: 0,
    likedByMe: false,
    commentsCount: 0,
    comments: [],
  };

  const current = await getLocalData(STORAGE_KEYS.POSTS, INITIAL_POSTS);
  const updated = [newPost, ...current];
  await setLocalData(STORAGE_KEYS.POSTS, updated);
  notifyListeners('posts', updated);

  if (isFirebaseConfigured && db) {
    try {
      await addDoc(collection(db, 'posts'), newPost);
    } catch (e) {
      console.warn('Erro ao postar no Firestore:', e.message);
    }
  }

  return newPost;
};

export const toggleLikePost = async (postId) => {
  const current = await getLocalData(STORAGE_KEYS.POSTS, INITIAL_POSTS);
  const updated = current.map(post => {
    if (post.id === postId) {
      const liked = !post.likedByMe;
      return {
        ...post,
        likedByMe: liked,
        likesCount: liked ? (post.likesCount || 0) + 1 : Math.max(0, (post.likesCount || 1) - 1),
      };
    }
    return post;
  });

  await setLocalData(STORAGE_KEYS.POSTS, updated);
  notifyListeners('posts', updated);
  return updated;
};

export const addCommentToPost = async (postId, comment) => {
  const current = await getLocalData(STORAGE_KEYS.POSTS, INITIAL_POSTS);
  const newComment = {
    id: `comm_${Date.now()}`,
    ...comment,
    createdAt: new Date().toISOString(),
    timeAgo: 'agora mesmo',
  };

  const updated = current.map(post => {
    if (post.id === postId) {
      const comments = [newComment, ...(post.comments || [])];
      return {
        ...post,
        comments,
        commentsCount: comments.length,
      };
    }
    return post;
  });

  await setLocalData(STORAGE_KEYS.POSTS, updated);
  notifyListeners('posts', updated);
  return newComment;
};

// ==========================================
// 3. DIÁRIO DE HUMOR E SENTIMENTOS
// ==========================================

export const fetchMoods = async (userId) => {
  if (isFirebaseConfigured && db && userId) {
    try {
      const colRef = collection(db, 'users', userId, 'moods');
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (e) {
      console.warn('Firestore moods indisponível, usando armazenamento local:', e.message);
    }
  }

  const key = userId ? `${STORAGE_KEYS.MOODS}_${userId}` : STORAGE_KEYS.MOODS;
  return await getLocalData(key, INITIAL_MOODS);
};

export const saveMoodEntry = async (userId, moodEntry) => {
  const newEntry = {
    ...moodEntry,
    id: moodEntry.id || `mood_${Date.now()}`,
    date: moodEntry.date || new Date().toISOString(),
  };

  const key = userId ? `${STORAGE_KEYS.MOODS}_${userId}` : STORAGE_KEYS.MOODS;
  const current = await getLocalData(key, INITIAL_MOODS);
  const updated = [newEntry, ...current];

  await setLocalData(key, updated);
  notifyListeners('moods', updated);

  if (isFirebaseConfigured && db && userId) {
    try {
      const docRef = doc(db, 'users', userId, 'moods', newEntry.id);
      await setDoc(docRef, newEntry, { merge: true });
    } catch (e) {
      console.warn('Erro ao gravar humor no Firestore:', e.message);
    }
  }

  return newEntry;
};

// ==========================================
// 4. PERFIL DO USUÁRIO & PREFERÊNCIAS
// ==========================================

export const fetchUserProfile = async (userId) => {
  const key = userId ? `${STORAGE_KEYS.USER_PROFILE}_${userId}` : STORAGE_KEYS.USER_PROFILE;
  return await getLocalData(key, {
    emergencyContacts: [],
    customPledge: 'Só por hoje serei livre.',
    dailyReminderTime: '08:00',
    notificationsEnabled: true,
  });
};

export const saveUserProfile = async (userId, data) => {
  const key = userId ? `${STORAGE_KEYS.USER_PROFILE}_${userId}` : STORAGE_KEYS.USER_PROFILE;
  const current = await fetchUserProfile(userId);
  const updated = { ...current, ...data };
  await setLocalData(key, updated);
  notifyListeners('profile', updated);
  return updated;
};


export const deleteSubstance = async (userId, substanceId) => {
  const key = userId ? `${STORAGE_KEYS.SUBSTANCES}_${userId}` : STORAGE_KEYS.SUBSTANCES;
  const current = await getLocalData(key, INITIAL_SUBSTANCES);
  const updated = current.filter(s => s.id !== substanceId);

  await setLocalData(key, updated);
  notifyListeners('substances', updated);

  if (isFirebaseConfigured && db && userId) {
    try {
      const docRef = doc(db, 'users', userId, 'substances', substanceId);
      await deleteDoc(docRef);
    } catch (e) {
      console.warn('Erro ao deletar no Firestore:', e.message);
    }
  }

  return updated;
};
