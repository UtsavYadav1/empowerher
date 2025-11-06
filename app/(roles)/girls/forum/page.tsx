'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProtectedRoute from '@/components/ProtectedRoute'
import { CardSkeleton } from '@/components/LoadingSkeleton'
import { getCurrentUser } from '@/utils/auth'
import { FaComments, FaPaperPlane, FaUserCircle, FaThumbsUp, FaReply, FaSearch, FaFilter } from 'react-icons/fa'

interface ForumPost {
  id: number
  title: string
  author: string
  content: string
  replies: Array<{
    id: number
    author: string
    content: string
    createdAt: string
  }>
  createdAt: string
  likes?: number
}

export default function ForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newPost, setNewPost] = useState({ title: '', content: '' })
  const [selectedPost, setSelectedPost] = useState<number | null>(null)
  const [comment, setComment] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent')
  const user = getCurrentUser()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/mock/forum')
      const data = await response.json()
      if (data.success) {
        const postsWithLikes = data.data.map((p: ForumPost) => ({ ...p, likes: Math.floor(Math.random() * 50) }))
        setPosts(postsWithLikes)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/mock/forum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newPost,
          author: user?.name || 'Anonymous',
        }),
      })
      const data = await response.json()
      if (data.success) {
        setPosts([{ ...data.data, likes: 0 }, ...posts])
        setNewPost({ title: '', content: '' })
        setShowForm(false)
      }
    } catch (error) {
      console.error('Error creating post:', error)
    }
  }

  const handleAddComment = async (postId: number) => {
    if (!comment.trim()) return
    try {
      const response = await fetch('/api/mock/forum', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          author: user?.name || 'Anonymous',
          content: comment,
        }),
      })
      const data = await response.json()
      if (data.success) {
        setPosts(posts.map(p => p.id === postId ? data.data : p))
        setComment('')
        setSelectedPost(null)
      }
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  const handleLike = (postId: number) => {
    setPosts(posts.map(p => 
      p.id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p
    ))
  }

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'popular') {
      return (b.likes || 0) - (a.likes || 0)
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  if (loading) {
    return (
      <ProtectedRoute requireRole={true}>
        <div className="min-h-screen py-20 container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requireRole={true}>
      <div className="min-h-screen py-20 container mx-auto px-4 bg-gradient-to-br from-primary-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 text-gray-900 dark:text-white flex items-center gap-3">
                <FaComments className="text-primary-600" /> Community Forum
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">Connect, share, and learn together</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary flex items-center gap-2 text-lg px-6 py-3"
            >
              <FaPaperPlane /> {showForm ? 'Cancel' : 'New Post'}
            </button>
          </div>

          {/* Search and Filter */}
          <div className="card mb-6 bg-white dark:bg-gray-800">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-primary-500/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <FaFilter className="text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'recent' | 'popular')}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-primary-500/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>
          </div>

          {/* New Post Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="card mb-6 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 border-2 border-primary-200 dark:border-primary-800"
              >
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Create New Post</h2>
                <form onSubmit={handleCreatePost} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Post Title"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-primary-500/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                  <textarea
                    placeholder="Share your thoughts, ask questions, or help others..."
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-primary-500/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    required
                  />
                  <button type="submit" className="btn-primary w-full text-lg py-3">
                    <FaPaperPlane className="inline mr-2" /> Post to Community
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Posts List */}
          <div className="space-y-6">
            {sortedPosts.length === 0 ? (
              <div className="card text-center py-12 bg-white dark:bg-gray-800">
                <FaComments className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300 text-lg">No posts found. Be the first to post!</p>
              </div>
            ) : (
              sortedPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01 }}
                  className="card bg-white dark:bg-gray-800 hover:shadow-2xl transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-blue-500 rounded-full flex items-center justify-center">
                        <FaUserCircle className="text-white text-2xl" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{post.title}</h3>
                          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold text-primary-600 dark:text-primary-400">{post.author}</span>
                            <span>•</span>
                            <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed text-lg">{post.content}</p>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-4 mb-4">
                        <button
                          onClick={() => handleLike(post.id)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <FaThumbsUp className="text-primary-600" />
                          <span className="font-semibold text-gray-700 dark:text-gray-300">{post.likes || 0}</span>
                        </button>
                        <button
                          onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <FaReply className="text-blue-600" />
                          <span className="font-semibold text-gray-700 dark:text-gray-300">{post.replies.length} Replies</span>
                        </button>
                      </div>

                      {/* Comments Section */}
                      <AnimatePresence>
                        {selectedPost === post.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4"
                          >
                            {post.replies.length > 0 && (
                              <div className="space-y-3 mb-4">
                                {post.replies.map((reply) => (
                                  <motion.div
                                    key={reply.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="pl-4 border-l-4 border-primary-200 dark:border-primary-800 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-r-lg"
                                  >
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-semibold text-primary-600 dark:text-primary-400">{reply.author}</span>
                                      <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {new Date(reply.createdAt).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300">{reply.content}</p>
                                  </motion.div>
                                ))}
                              </div>
                            )}
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Add a comment..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleAddComment(post.id)
                                  }
                                }}
                              />
                              <button
                                onClick={() => handleAddComment(post.id)}
                                className="btn-primary px-6"
                              >
                                <FaPaperPlane />
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </ProtectedRoute>
  )
}
