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
  MOTIVATIONAL_QUOTES,
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
  listeners.forEach((fn) => {
    try {
      fn(type, payload);
    } catch (e) {
      console.warn('Erro ao notificar listener:', e);
    }
  });
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
      try {
        await AsyncStorage.setItem(key, JSON.stringify(defaultData));
      } catch {}
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
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      }
    } catch (e) {
      console.warn('Firestore indisponível, usando armazenamento local:', e.message);
    }
  }

  const key = userId ? `${STORAGE_KEYS.SUBSTANCES}_${userId}` : STORAGE_KEYS.SUBSTANCES;
  return await getLocalData(key, INITIAL_SUBSTANCES);
};

export const saveSubstance = async (userId, substance) => {
  // Trata caso onde userId não é passado ou substance é o primeiro parâmetro
  let actualSubstance = substance;
  let actualUserId = userId;
  if (typeof userId === 'object' && !substance) {
    actualSubstance = userId;
    actualUserId = null;
  }

  const isNew = !actualSubstance.id;
  const newSubstance = {
    ...actualSubstance,
    id: actualSubstance.id || `sub_${Date.now()}`,
    createdAt: actualSubstance.createdAt || new Date().toISOString(),
    history: actualSubstance.history || [],
  };

  const key = actualUserId ? `${STORAGE_KEYS.SUBSTANCES}_${actualUserId}` : STORAGE_KEYS.SUBSTANCES;
  const current = await getLocalData(key, INITIAL_SUBSTANCES);
  let updated;
  if (isNew) {
    updated = [newSubstance, ...current];
  } else {
    updated = current.map((s) => (s.id === newSubstance.id ? newSubstance : s));
  }
  await setLocalData(key, updated);
  notifyListeners('substances', updated);
  notifyListeners('substance_added', newSubstance);

  if (isFirebaseConfigured && db && actualUserId) {
    try {
      const docRef = doc(db, 'users', actualUserId, 'substances', newSubstance.id);
      await setDoc(docRef, newSubstance, { merge: true });
    } catch (e) {
      console.warn('Erro ao sincronizar substância no Firestore:', e.message);
    }
  }

  return newSubstance;
};

export const resetSubstanceStreak = async (substanceId, reason, notes, userId) => {
  let actualUserId = userId;
  let actualSubId = substanceId;
  let actualReason = reason;
  let actualNotes = notes;

  // Suporte a assinatura alternativa legada (userId, substanceId, reason, notes)
  if (typeof substanceId === 'string' && typeof reason === 'string' && (substanceId.startsWith('u_') || substanceId.length > 25)) {
    actualUserId = substanceId;
    actualSubId = reason;
    actualReason = notes;
    actualNotes = userId;
  }

  const key = actualUserId ? `${STORAGE_KEYS.SUBSTANCES}_${actualUserId}` : STORAGE_KEYS.SUBSTANCES;
  const current = await getLocalData(key, INITIAL_SUBSTANCES);

  const resetRecord = {
    resetAt: new Date().toISOString(),
    reason: actualReason || 'Não especificado',
    notes: actualNotes || '',
  };

  const updated = current.map((sub) => {
    if (sub.id === actualSubId) {
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
  notifyListeners('substance_reset', updated);

  if (isFirebaseConfigured && db && actualUserId) {
    try {
      const target = updated.find((s) => s.id === actualSubId);
      if (target) {
        const docRef = doc(db, 'users', actualUserId, 'substances', actualSubId);
        await setDoc(docRef, target, { merge: true });
      }
    } catch (e) {
      console.warn('Erro ao atualizar reinício no Firestore:', e.message);
    }
  }

  return updated;
};

export const deleteSubstance = async (substanceId, userId) => {
  let actualSubId = substanceId;
  let actualUserId = userId;
  if (userId && !substanceId) {
    actualSubId = userId;
    actualUserId = null;
  }

  const key = actualUserId ? `${STORAGE_KEYS.SUBSTANCES}_${actualUserId}` : STORAGE_KEYS.SUBSTANCES;
  const current = await getLocalData(key, INITIAL_SUBSTANCES);
  const updated = current.filter((s) => s.id !== actualSubId);

  await setLocalData(key, updated);
  notifyListeners('substances', updated);
  notifyListeners('substance_deleted', updated);

  if (isFirebaseConfigured && db && actualUserId) {
    try {
      const docRef = doc(db, 'users', actualUserId, 'substances', actualSubId);
      await deleteDoc(docRef);
    } catch (e) {
      console.warn('Erro ao deletar no Firestore:', e.message);
    }
  }

  return updated;
};

// ==========================================
// 2. COMUNIDADE (POSTS & FEED)
// ==========================================

export const fetchPosts = async () => {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      }
    } catch (e) {
      console.warn('Firestore posts indisponível, usando armazenamento local:', e.message);
    }
  }
  return await getLocalData(STORAGE_KEYS.POSTS, INITIAL_POSTS);
};

export const createPost = async (postData) => {
  const authorName = postData.authorName || postData.author || 'Guerreiro(a) Anônimo(a)';
  const newPost = {
    ...postData,
    id: postData.id || `post_${Date.now()}`,
    author: authorName,
    authorName: authorName,
    authorStreak: postData.authorStreak || 'Em recuperação',
    avatar: postData.avatar || authorName.charAt(0).toUpperCase(),
    avatarSeed: postData.avatarSeed || authorName,
    createdAt: postData.createdAt || new Date().toISOString(),
    timeAgo: postData.timeAgo || 'agora mesmo',
    likesCount: 0,
    likes: 0,
    likedByMe: false,
    isLiked: false,
    commentsCount: 0,
    comments: [],
  };

  const current = await getLocalData(STORAGE_KEYS.POSTS, INITIAL_POSTS);
  const updated = [newPost, ...current];
  await setLocalData(STORAGE_KEYS.POSTS, updated);
  notifyListeners('posts', updated);
  notifyListeners('community_updated', updated);

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
  const updated = current.map((post) => {
    if (post.id === postId) {
      const currentlyLiked = Boolean(post.likedByMe ?? post.isLiked);
      const newLiked = !currentlyLiked;
      const currentLikes = post.likesCount ?? post.likes ?? 0;
      const newCount = newLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1);
      return {
        ...post,
        likedByMe: newLiked,
        isLiked: newLiked,
        likesCount: newCount,
        likes: newCount,
      };
    }
    return post;
  });

  await setLocalData(STORAGE_KEYS.POSTS, updated);
  notifyListeners('posts', updated);
  notifyListeners('community_updated', updated);
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

  const updated = current.map((post) => {
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
  notifyListeners('community_updated', updated);
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
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      }
    } catch (e) {
      console.warn('Firestore moods indisponível, usando armazenamento local:', e.message);
    }
  }

  const key = userId ? `${STORAGE_KEYS.MOODS}_${userId}` : STORAGE_KEYS.MOODS;
  return await getLocalData(key, INITIAL_MOODS);
};

export const saveMoodEntry = async (userIdOrEntry, maybeEntry) => {
  let userId, moodEntry;
  if (maybeEntry) {
    userId = userIdOrEntry;
    moodEntry = maybeEntry;
  } else {
    moodEntry = userIdOrEntry;
    userId = null;
  }

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
  notifyListeners('journal_updated', updated);

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

// ==========================================
// 5. OBJETO CONSOLIDADO STORESERVICE
// ==========================================

export const storeService = {
  // Substâncias
  getSubstances: (userId) => fetchSubstances(userId),
  addSubstance: (substance, userId) => saveSubstance(userId, substance),
  resetSubstance: (substanceId, reason, notes, userId) => resetSubstanceStreak(substanceId, reason, notes, userId),
  deleteSubstance: (substanceId, userId) => deleteSubstance(substanceId, userId),

  // Sabedoria / Frase do Dia
  getDailyQuote: async () => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const quotes = Array.isArray(MOTIVATIONAL_QUOTES) && MOTIVATIONAL_QUOTES.length > 0
      ? MOTIVATIONAL_QUOTES
      : [{ text: 'Só por hoje, um dia de cada vez.', author: 'naOn' }];
    return quotes[Math.abs(dayOfYear) % quotes.length];
  },

  // Diário
  getJournalEntries: (userId) => fetchMoods(userId),
  addJournalEntry: (entry, userId) => saveMoodEntry(userId, entry),

  // Comunidade
  getCommunityPosts: () => fetchPosts(),
  addCommunityPost: (post) => createPost(post),
  toggleLikePost: (postId) => toggleLikePost(postId),

  // Reset geral
  clearAllData: async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.SUBSTANCES);
    await AsyncStorage.removeItem(STORAGE_KEYS.POSTS);
    await AsyncStorage.removeItem(STORAGE_KEYS.MOODS);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    notifyListeners('substances', INITIAL_SUBSTANCES);
    notifyListeners('substance_deleted', INITIAL_SUBSTANCES);
    notifyListeners('journal_updated', INITIAL_MOODS);
    notifyListeners('community_updated', INITIAL_POSTS);
    return true;
  },

  // Inscrição reativa
  subscribe: (callback) => subscribeToStoreChanges(callback),
};
