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
  onSnapshot,
} from './firebase';
import {
  INITIAL_SUBSTANCES,
  INITIAL_POSTS,
  INITIAL_MOODS,
} from './mockData';

// Chaves do armazenamento local
const STORAGE_KEYS = {
  SUBSTANCES: 'naon_substances_v1',
  POSTS: 'naon_posts_v1',
  MOODS: 'naon_moods_v1',
  USER_PROFILE: 'naon_user_profile_v1',
};

// Event emitter simples para reatividade no modo offline/local
const listeners = new Set();
const notifyListeners = (type, payload) => {
  listeners.forEach(fn => fn(type, payload));
};

export const subscribeToStoreChanges = (callback) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};

// Helpers de LocalStorage com seeds
const getLocalData = (key, defaultData) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Erro ao ler ${key} do localStorage:`, e);
    return defaultData;
  }
};

const setLocalData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Erro ao gravar ${key} no localStorage:`, e);
  }
};

// ==========================================
// 1. SUBSTÂNCIAS (DASHBOARD)
// ==========================================

export const fetchSubstances = async (userId) => {
  if (isFirebaseConfigured && db && userId) {
    try {
      const q = query(collection(db, `users/${userId}/substances`), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.warn('Firestore fetchSubstances falhou, usando local:', e);
    }
  }
  return getLocalData(STORAGE_KEYS.SUBSTANCES, INITIAL_SUBSTANCES);
};

export const saveSubstance = async (userId, substance) => {
  const item = {
    ...substance,
    id: substance.id || `sub-${Date.now()}`,
    createdAt: substance.createdAt || new Date().toISOString(),
  };

  if (isFirebaseConfigured && db && userId) {
    try {
      await setDoc(doc(db, `users/${userId}/substances`, item.id), item);
    } catch (e) {
      console.warn('Firestore saveSubstance falhou, salvando no local:', e);
    }
  }

  // Persiste no local
  const current = getLocalData(STORAGE_KEYS.SUBSTANCES, INITIAL_SUBSTANCES);
  const index = current.findIndex(s => s.id === item.id);
  const updated = index >= 0
    ? current.map(s => (s.id === item.id ? item : s))
    : [item, ...current];

  setLocalData(STORAGE_KEYS.SUBSTANCES, updated);
  notifyListeners('substances', updated);
  return item;
};

export const resetSubstanceStreak = async (userId, substanceId, relapseData = {}) => {
  const current = getLocalData(STORAGE_KEYS.SUBSTANCES, INITIAL_SUBSTANCES);
  const target = current.find(s => s.id === substanceId);
  if (!target) return null;

  const newHistoryEntry = {
    previousStreakStart: target.startDate,
    resetAt: new Date().toISOString(),
    reflectionNote: relapseData.note || 'Recomeço com coragem e aprendizado.',
    triggers: relapseData.triggers || [],
  };

  const updatedSubstance = {
    ...target,
    startDate: new Date().toISOString(), // Reinicia o cronômetro para agora
    relapsesCount: (target.relapsesCount || 0) + 1,
    history: [newHistoryEntry, ...(target.history || [])],
  };

  return saveSubstance(userId, updatedSubstance);
};

export const deleteSubstance = async (userId, substanceId) => {
  if (isFirebaseConfigured && db && userId) {
    try {
      await deleteDoc(doc(db, `users/${userId}/substances`, substanceId));
    } catch (e) {
      console.warn('Firestore deleteSubstance falhou:', e);
    }
  }

  const current = getLocalData(STORAGE_KEYS.SUBSTANCES, INITIAL_SUBSTANCES);
  const updated = current.filter(s => s.id !== substanceId);
  setLocalData(STORAGE_KEYS.SUBSTANCES, updated);
  notifyListeners('substances', updated);
  return true;
};

// ==========================================
// 2. FEED DA COMUNIDADE (REDE SOCIAL)
// ==========================================

export const fetchPosts = async () => {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
    } catch (e) {
      console.warn('Firestore fetchPosts falhou, usando mock local:', e);
    }
  }
  return getLocalData(STORAGE_KEYS.POSTS, INITIAL_POSTS);
};

export const createPost = async (postData) => {
  const newPost = {
    id: `post-${Date.now()}`,
    content: postData.content,
    isAnonymous: Boolean(postData.isAnonymous),
    authorName: postData.isAnonymous ? 'Guerreiro(a) Anônimo(a)' : (postData.authorName || 'Membro do naOn'),
    authorAvatar: postData.isAnonymous ? null : (postData.authorAvatar || null),
    authorId: postData.authorId || 'anon',
    createdAt: new Date().toISOString(),
    likesCount: 0,
    likedBy: [],
    commentsCount: 0,
    tags: postData.tags || ['Sobriedade'],
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'posts', newPost.id), newPost);
    } catch (e) {
      console.warn('Firestore createPost falhou, usando local:', e);
    }
  }

  const current = getLocalData(STORAGE_KEYS.POSTS, INITIAL_POSTS);
  const updated = [newPost, ...current];
  setLocalData(STORAGE_KEYS.POSTS, updated);
  notifyListeners('posts', updated);
  return newPost;
};

export const togglePostLike = async (postId, currentUserId = 'user-me') => {
  const posts = getLocalData(STORAGE_KEYS.POSTS, INITIAL_POSTS);
  const updated = posts.map(p => {
    if (p.id !== postId) return p;
    const liked = p.likedBy?.includes(currentUserId);
    const likedBy = liked
      ? (p.likedBy || []).filter(id => id !== currentUserId)
      : [...(p.likedBy || []), currentUserId];
    return {
      ...p,
      likedBy,
      likesCount: liked ? Math.max(0, (p.likesCount || 1) - 1) : (p.likesCount || 0) + 1,
    };
  });

  setLocalData(STORAGE_KEYS.POSTS, updated);
  notifyListeners('posts', updated);

  if (isFirebaseConfigured && db) {
    try {
      const target = updated.find(p => p.id === postId);
      if (target) {
        await updateDoc(doc(db, 'posts', postId), {
          likedBy: target.likedBy,
          likesCount: target.likesCount,
        });
      }
    } catch (e) {
      console.warn('Firestore togglePostLike falhou:', e);
    }
  }

  return updated.find(p => p.id === postId);
};

// ==========================================
// 3. DIÁRIO DE HUMOR (MOOD JOURNAL)
// ==========================================

export const fetchMoods = async (userId) => {
  if (isFirebaseConfigured && db && userId) {
    try {
      const q = query(collection(db, `users/${userId}/moods`), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.warn('Firestore fetchMoods falhou:', e);
    }
  }
  return getLocalData(STORAGE_KEYS.MOODS, INITIAL_MOODS);
};

export const saveMoodCheckIn = async (userId, moodData) => {
  const item = {
    id: `mood-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    timestamp: new Date().toISOString(),
    ...moodData,
  };

  if (isFirebaseConfigured && db && userId) {
    try {
      await setDoc(doc(db, `users/${userId}/moods`, item.id), item);
    } catch (e) {
      console.warn('Firestore saveMoodCheckIn falhou:', e);
    }
  }

  const current = getLocalData(STORAGE_KEYS.MOODS, INITIAL_MOODS);
  const updated = [item, ...current];
  setLocalData(STORAGE_KEYS.MOODS, updated);
  notifyListeners('moods', updated);
  return item;
};
