import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, SafeAreaView, RefreshControl } from 'react-native';
import { MessageSquare, Heart, Send, Sparkles, User, ShieldCheck, Flame } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { storeService } from '../services/storeService';

const TAGS = ['Todos', 'Vitória', 'Desabafo', 'Dica', 'Apoio'];

export default function CommunityFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [selectedTag, setSelectedTag] = useState('Todos');
  const [newContent, setNewContent] = useState('');
  const [postTag, setPostTag] = useState('Vitória');
  const [refreshing, setRefreshing] = useState(false);

  const loadPosts = async () => {
    setPosts(await storeService.getCommunityPosts());
  };

  useEffect(() => {
    loadPosts();
    return storeService.subscribe((e) => e === 'community_updated' && loadPosts());
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

    const post = {
      id: `post_${Date.now()}`,
      author: user?.displayName || 'Guerreiro Anônimo',
      authorStreak: 'Em recuperação',
      avatar: user?.displayName?.charAt(0).toUpperCase() || 'G',
      content: newContent.trim(),
      tag: postTag,
      likes: 0,
      comments: 0,
      createdAt: 'Agora mesmo',
      isLiked: false,
    };

    await storeService.addCommunityPost(post);
    setNewContent('');
  };

  const handleToggleLike = async (postId) => {
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
              {['Vitória', 'Desabafo', 'Dica'].map((t) => (
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
    gap: 6,
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
});

          {filteredPosts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              <View style={styles.postHeader}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>{post.avatar || 'A'}</Text>
                </View>
                <View style={styles.authorInfo}>
                  <Text style={styles.authorName}>{post.author}</Text>
                  <Text style={styles.authorStreak}>{post.authorStreak} • {post.createdAt}</Text>
                </View>
                <View style={styles.postTagBadge}>
                  <Text style={styles.postTagText}>{post.tag}</Text>
                </View>
              </View>

              <Text style={styles.postBody}>{post.content}</Text>

              <View style={styles.postActions}>
                <TouchableOpacity
                  style={[styles.likeBtn, post.isLiked && styles.likeBtnActive]}
                  onPress={() => handleToggleLike(post.id)}
                  activeOpacity={0.7}
                >
                  <Heart size={15} color={post.isLiked ? '#EF4444' : '#64748B'} fill={post.isLiked ? '#EF4444' : 'none'} />
                  <Text style={[styles.likeCount, post.isLiked && styles.likeCountActive]}>
                    {post.likes} Apoios
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
