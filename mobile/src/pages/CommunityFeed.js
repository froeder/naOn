import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, SafeAreaView, RefreshControl } from 'react-native';
import { MessageSquare, Heart, Send, Sparkles } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { storeService } from '../services/storeService';

const TAGS = ['Todos', 'Vitória', 'Superação', 'Desabafo', 'Dica', 'Apoio', 'Início de Jornada'];

const formatPostTime = (post) => {
  if (post.timeAgo) return post.timeAgo;
  if (!post.createdAt || post.createdAt === 'Agora mesmo') return 'Agora mesmo';
  try {
    const d = new Date(post.createdAt);
    if (isNaN(d.getTime())) return post.createdAt;
    const diffMin = Math.floor((Date.now() - d.getTime()) / (1000 * 60));
    if (diffMin < 1) return 'Agora mesmo';
    if (diffMin < 60) return `há ${diffMin}m`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `há ${diffH}h`;
    const diffDays = Math.floor(diffH / 24);
    return `há ${diffDays}d`;
  } catch {
    return 'Recentemente';
  }
};

export default function CommunityFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [selectedTag, setSelectedTag] = useState('Todos');
  const [newContent, setNewContent] = useState('');
  const [postTag, setPostTag] = useState('Vitória');
  const [refreshing, setRefreshing] = useState(false);

  const loadPosts = async () => {
    try {
      const data = await storeService.getCommunityPosts();
      setPosts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.warn('Erro ao carregar posts:', e);
    }
  };

  useEffect(() => {
    loadPosts();
    return storeService.subscribe((e) => {
      if (e === 'community_updated' || e === 'posts') {
        loadPosts();
      }
    });
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  };

  const handleCreatePost = async () => {
    if (!newContent.trim()) {
      Alert.alert('Atenção', 'Escreva uma mensagem para compartilhar.');
      return;
    }

    const authorDisplayName = user?.displayName || 'Guerreiro(a) Anônimo(a)';
    const post = {
      id: `post_${Date.now()}`,
      author: authorDisplayName,
      authorName: authorDisplayName,
      authorStreak: 'Em recuperação',
      avatar: authorDisplayName.charAt(0).toUpperCase(),
      content: newContent.trim(),
      tag: postTag,
      likes: 0,
      likesCount: 0,
      comments: 0,
      commentsCount: 0,
      createdAt: new Date().toISOString(),
      timeAgo: 'Agora mesmo',
      isLiked: false,
      likedByMe: false,
    };

    await storeService.addCommunityPost(post);
    setNewContent('');
  };

  const handleToggleLike = async (postId) => {
    // Atualização otimista
    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id === postId) {
          const currentlyLiked = Boolean(p.likedByMe ?? p.isLiked);
          const newLiked = !currentlyLiked;
          const currentLikes = p.likesCount ?? p.likes ?? 0;
          const newCount = newLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1);
          return {
            ...p,
            likedByMe: newLiked,
            isLiked: newLiked,
            likesCount: newCount,
            likes: newCount,
          };
        }
        return p;
      })
    );
    await storeService.toggleLikePost(postId);
  };

  const filteredPosts = selectedTag === 'Todos'
    ? posts
    : posts.filter((p) => p.tag === selectedTag);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#27AE60']} />}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Comunidade de Apoio</Text>
          <Text style={styles.subtitle}>Espaço seguro e anônimo para compartilhar vitórias e pedir apoio.</Text>
        </View>

        {/* Create Post Box */}
        <View style={styles.createCard}>
          <TextInput
            style={styles.createInput}
            placeholder="Compartilhe seu marco, desabafo ou uma palavra amiga..."
            placeholderTextColor="#94A3B8"
            value={newContent}
            onChangeText={setNewContent}
            multiline
          />

          <View style={styles.createFooter}>
            <View style={styles.tagSelector}>
              {['Vitória', 'Superação', 'Desabafo', 'Dica'].map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.smallTag, postTag === t && styles.smallTagActive]}
                  onPress={() => setPostTag(t)}
                >
                  <Text style={[styles.smallTagText, postTag === t && styles.smallTagTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.sendBtn} onPress={handleCreatePost} activeOpacity={0.8}>
              <Send size={14} color="#FFFFFF" />
              <Text style={styles.sendBtnText}>Publicar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Filter tags bar */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
          {TAGS.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.filterChip, selectedTag === t && styles.filterChipActive]}
              onPress={() => setSelectedTag(t)}
            >
              <Text style={[styles.filterChipText, selectedTag === t && styles.filterChipTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Post cards */}
        <View style={styles.postList}>
          {filteredPosts.length === 0 ? (
            <View style={styles.emptyCard}>
              <MessageSquare size={32} color="#94A3B8" />
              <Text style={styles.emptyTitle}>Nenhuma publicação com essa tag</Text>
              <Text style={styles.emptySubtitle}>Seja o primeiro a compartilhar uma palavra de força e superação!</Text>
            </View>
          ) : (
            filteredPosts.map((post) => {
              const authorName = post.authorName || post.author || 'Membro do naOn';
              const avatar = post.avatar || authorName.charAt(0).toUpperCase() || 'M';
              const authorStreak = post.authorStreak || 'Em recuperação';
              const isLiked = Boolean(post.likedByMe ?? post.isLiked);
              const likes = post.likesCount ?? post.likes ?? 0;
              const tag = post.tag || 'Geral';

              return (
                <View key={post.id} style={styles.postCard}>
                  <View style={styles.postHeader}>
                    <View style={styles.avatarCircle}>
                      <Text style={styles.avatarText}>{avatar}</Text>
                    </View>
                    <View style={styles.authorInfo}>
                      <Text style={styles.authorName}>{authorName}</Text>
                      <Text style={styles.authorStreak}>{authorStreak} • {formatPostTime(post)}</Text>
                    </View>
                    <View style={styles.postTagBadge}>
                      <Text style={styles.postTagText}>{tag}</Text>
                    </View>
                  </View>

                  <Text style={styles.postBody}>{post.content}</Text>

                  <View style={styles.postActions}>
                    <TouchableOpacity
                      style={[styles.likeBtn, isLiked && styles.likeBtnActive]}
                      onPress={() => handleToggleLike(post.id)}
                      activeOpacity={0.7}
                    >
                      <Heart
                        size={15}
                        color={isLiked ? '#EF4444' : '#64748B'}
                        fill={isLiked ? '#EF4444' : 'transparent'}
                      />
                      <Text style={[styles.likeCount, isLiked && styles.likeCountActive]}>
                        {likes} {likes === 1 ? 'Apoio' : 'Apoios'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 90,
  },
  header: {
    marginBottom: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  createCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  createInput: {
    minHeight: 70,
    textAlignVertical: 'top',
    fontSize: 14,
    color: '#1E293B',
  },
  createFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
    marginTop: 8,
  },
  tagSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
    marginRight: 8,
  },
  smallTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  smallTagActive: {
    backgroundColor: '#E8F8F0',
  },
  smallTagText: {
    fontSize: 11,
    color: '#64748B',
  },
  smallTagTextActive: {
    color: '#27AE60',
    fontWeight: '700',
  },
  sendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#27AE60',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  sendBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  filterBar: {
    marginBottom: 14,
  },
  filterChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#27AE60',
    borderColor: '#27AE60',
  },
  filterChipText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  postList: {
    gap: 12,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#27AE60',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  authorStreak: {
    fontSize: 11,
    color: '#94A3B8',
  },
  postTagBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  postTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  postBody: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
    paddingTop: 8,
  },
  likeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  likeBtnActive: {
    backgroundColor: '#FEF2F2',
  },
  likeCount: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  likeCountActive: {
    color: '#EF4444',
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 10,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 4,
  },
});
