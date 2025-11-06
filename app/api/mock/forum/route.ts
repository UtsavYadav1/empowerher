import { NextRequest, NextResponse } from 'next/server'

// Mock forum data
let forumPosts = [
  {
    id: 1,
    title: 'How to prepare for scholarship exams?',
    author: 'Priya S.',
    content: 'I am preparing for scholarship exams and need some guidance...',
    replies: [
      { id: 1, author: 'Anjali P.', content: 'Focus on practicing previous year papers...', createdAt: new Date().toISOString() },
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    title: 'Best courses for career guidance',
    author: 'Kavita S.',
    content: 'Can anyone suggest good online courses for career guidance?',
    replies: [],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// GET - List all forum posts
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: forumPosts,
      count: forumPosts.length,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch forum posts' },
      { status: 500 }
    )
  }
}

// POST - Create a new forum post (title optional for compatibility with existing UI)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, author } = body

    if (!content || !author) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const newPost = {
      id: forumPosts.length + 1,
      title: title || 'Community Post',
      author,
      content,
      replies: [],
      createdAt: new Date().toISOString(),
    }

    forumPosts.push(newPost)

    return NextResponse.json({
      success: true,
      data: newPost,
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 500 }
    )
  }
}

// PATCH - Add comment to a post
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { postId, author, content } = body

    if (!postId || !author || !content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const post = forumPosts.find(p => p.id === parseInt(postId))
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      )
    }

    const newReply = {
      id: post.replies.length + 1,
      author,
      content,
      createdAt: new Date().toISOString(),
    }

    post.replies.push(newReply)

    return NextResponse.json({
      success: true,
      data: post,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to add comment' },
      { status: 500 }
    )
  }
}

