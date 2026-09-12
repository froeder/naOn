import React, { useState, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Plus,
  Send,
  UserCheck,
  EyeOff,
  Sparkles,
  X,
  Smile,
  Shield,
} from 'lucide-react';
import { fetchPosts, createPost, togglePostLike, subscribeToStoreChanges } from '../services/storeService';
import { useAuth } from '../context/AuthContext';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/pt-br';

dayjs.extend(relativeTime);
dayjs.locale('pt-br');

export default function CommunityFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);

  // Form states
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true); // Default anonymous for safety
  const [selectedTag, setSelectedTag] = useState('Superação');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Comentários expandidos por post
  const [activeCommentsPostId, setActiveCommentsPostId] = useState(null);
  const [commentInput, setCommentInput] = useState('');
  const [postCommentsMap, setPostCommentsMap] = useState({
    'post-1': [
      { id: 'c1', author: 'Guerreiro(a) Anônimo(a)', text: 'Muito orgulho de você! O fim de semana é desafiador mesmo, parabéns!' },
      { id: 'c2', author: 'Lucas R.', text: 'Água com gás e limão me salvou também nos primeiros 30 dias!' }
    ]
  });

  const loadFeed = async () => {
    try {
      const data = await fetchPosts();
      setPosts(data);
    } catch (e) {
      console.error('Erro ao carregar feed:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
    const unsubscribe = subscribeToStoreChanges((type, payload) => {
      if (type === 'posts') {
        setPosts(payload);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await createPost({
        content: content.trim(),
        isAnonymous,
        authorName: isAnonymous ? 'Guerreiro(a) Anônimo(a)' : (user?.displayName || 'Membro do naOn'),
        authorAvatar: isAnonymous ? null : user?.photoURL,
        authorId: user?.uid || 'user-me',
        tags: [selectedTag],
      });

      setContent('');
      setIsNewPostOpen(false);
      loadFeed();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (postId) => {
    await togglePostLike(postId, user?.uid || 'user-me');
  };

  const handleAddComment = (postId) => {
    if (!commentInput.trim()) return;
    const newComment = {
      id: `c-${Date.now()}`,
      author: isAnonymous ? 'Guerreiro(a) Anônimo(a)' : (user?.displayName || 'Guerreiro(a) naOn'),
      text: commentInput.trim(),
    };

    setPostCommentsMap(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment],
    }));

    // Incrementa contador do post localmente
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, commentsCount: (p.commentsCount || 0) + 1 } : p));
    setCommentInput('');
  };

  return (
    <div className="space-y-6 pb-20 pt-2 animate-in fade-in duration-300">
      
      {/* Header do Feed da Comunidade */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-[#2C3E50] tracking-tight flex items-center gap-2">
            Comunidade naOn
          </h1>
          <p className="text-xs text-slate-500">
            Espaço seguro de acolhimento mútuo, desabafo e celebração da sobriedade.
          </p>
        </div>

        <button
          onClick={() => setIsNewPostOpen(true)}
          className="flex items-center gap-2 py-2.5 px-4 bg-[#27AE60] hover:bg-[#219653] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md shadow-[#27AE60]/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          Nova Postagem
        </button>
      </div>

      {/* Regras do Espaço Seguro */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200/70 flex items-center gap-3 text-xs text-slate-600">
        <Shield className="w-5 h-5 text-[#27AE60] shrink-0" />
        <span>
          <strong>Lembrete de Respeito:</strong> Aqui nos apoiamos sem julgamentos. Você pode postar com seu perfil ou totalmente anônimo(a).
        </span>
      </div>

      {/* Lista de Postagens */}
      {loading ? (
        <div className="py-12 text-center text-slate-400">Carregando mensagens da comunidade...</div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-slate-200 text-slate-500">
          Nenhuma postagem ainda. Seja a primeira pessoa a compartilhar sua vitória ou pedir apoio!
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const isLiked = post.likedBy?.includes(user?.uid || 'user-me');
            const comments = postCommentsMap[post.id] || [];
            const isCommentsOpen = activeCommentsPostId === post.id;

            return (
              <article
                key={post.id}
                className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all border border-slate-100"
              >
                {/* Topo do Post */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center space-x-3">
                    {/* Avatar do Autor */}
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shadow-xs ${
                        post.isAnonymous
                          ? 'bg-slate-100 text-slate-600 border border-slate-200'
                          : 'bg-gradient-to-br from-[#2C3E50] to-[#34495E] text-white'
                      }`}
                    >
                      {post.isAnonymous ? (
                        <EyeOff className="w-5 h-5 text-slate-500" />
                      ) : (
                        post.authorName?.charAt(0).toUpperCase() || 'G'
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#2C3E50]">
                          {post.authorName}
                        </span>
                        {post.isAnonymous && (
                          <span className="text-[10px] font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                            Anônimo
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {dayjs(post.createdAt).fromNow()}
                      </span>
                    </div>
                  </div>

                  {/* Tag */}
                  {post.tags?.[0] && (
                    <span className="text-[11px] font-medium bg-emerald-50 text-[#27AE60] border border-emerald-100 px-2.5 py-0.5 rounded-full">
                      #{post.tags[0]}
                    </span>
                  )}
                </div>

                {/* Conteúdo da Mensagem */}
                <p className="text-sm sm:text-base text-slate-800 leading-relaxed whitespace-pre-line my-3">
                  {post.content}
                </p>

                {/* Ações (Dar Força, Comentários) */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center space-x-3">
                    {/* Botão Dar Força (Like) */}
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                        isLiked
                          ? 'bg-rose-50 text-rose-600 border border-rose-200'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60'
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 transition-transform ${
                          isLiked ? 'fill-rose-500 text-rose-500 scale-110' : ''
                        }`}
                      />
                      <span>{isLiked ? 'Força dada!' : 'Dar Força'}</span>
                      <span className="text-[11px] opacity-80">({post.likesCount || 0})</span>
                    </button>

                    {/* Botão Comentários */}
                    <button
                      onClick={() =>
                        setActiveCommentsPostId(isCommentsOpen ? null : post.id)
                      }
                      className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Apoiar</span>
                      <span className="text-[11px] opacity-80">({post.commentsCount || comments.length})</span>
                    </button>
                  </div>

                  <span className="text-[11px] text-slate-400 font-medium">
                    naOn Comunidade
                  </span>
                </div>

                {/* Seção de Comentários / Mensagens de Apoio */}
                {isCommentsOpen && (
                  <div className="mt-4 pt-3 border-t border-dashed border-slate-200 space-y-3 animate-in fade-in">
                    {comments.map((c) => (
                      <div key={c.id} className="p-2.5 bg-slate-50 rounded-xl text-xs space-y-1">
                        <span className="font-bold text-slate-700 block">{c.author}</span>
                        <p className="text-slate-600">{c.text}</p>
                      </div>
                    ))}

                    <div className="flex gap-2 items-center pt-1">
                      <input
                        type="text"
                        placeholder="Deixe uma palavra de apoio..."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                        className="flex-1 text-xs p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#27AE60]"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="p-2.5 bg-[#27AE60] text-white rounded-xl hover:bg-[#219653] transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* Modal de Nova Postagem com Toggle Anônimo */}
      {isNewPostOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
            
            <div className="bg-gradient-to-r from-[#2C3E50] to-[#1A252F] text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-[#27AE60]/20 rounded-2xl text-[#2ECC71]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Compartilhar com a Comunidade</h3>
                  <p className="text-xs text-slate-300">Sua história pode ser a força de alguém hoje.</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewPostOpen(false)}
                className="p-2 text-slate-300 hover:text-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="p-6 space-y-4 overflow-y-auto">
              {/* Toggle de Postagem Anônima */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-xl ${isAnonymous ? 'bg-slate-200 text-slate-700' : 'bg-emerald-100 text-[#27AE60]'}`}>
                    {isAnonymous ? <EyeOff className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">
                      Postar Anonimamente
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {isAnonymous
                        ? 'Você aparecerá como "Guerreiro(a) Anônimo(a)"'
                        : `Você aparecerá como "${user?.displayName || 'Guerreiro(a)'}"`}
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#27AE60]"></div>
                </label>
              </div>

              {/* Seletor de Categoria/Tag */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Tema da Mensagem:
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Superação', 'Desabafo', 'Dúvida', 'Gratidão', 'Dica Terapêutica'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedTag(tag)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        selectedTag === tag
                          ? 'bg-[#2C3E50] text-white border-[#2C3E50] font-bold'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Campo de Texto */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Sua Mensagem:
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Escreva como você está se sentindo, uma vitória ou um conselho..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full text-sm p-3.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#27AE60] resize-none"
                />
              </div>

              {/* Ações */}
              <div className="pt-2 border-t border-slate-100 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewPostOpen(false)}
                  className="flex-1 py-3 px-4 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold text-sm transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !content.trim()}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#27AE60] hover:bg-[#219653] active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-[#27AE60]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Publicando...' : 'Publicar'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
