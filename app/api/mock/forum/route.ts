import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

// GET - List all forum posts
export async function GET(request: NextRequest) {
  try {
    const posts = await prisma.forumPost.findMany({
      include: {
        replies: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: posts,
      count: posts.length,
    })
  } catch (error) {
    console.error('Error fetching forum posts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch forum posts' },
      { status: 500 }
    )
  }
}

// POST - Create a new forum post
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

    const newPost = await prisma.forumPost.create({
      data: {
        title: title || 'Community Post',
        content,
        author,
      },
      include: {
        replies: true, // Return empty replies array to match frontend expectation
      }
    })

    return NextResponse.json({
      success: true,
      data: newPost,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
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

    // create reply
    await prisma.forumReply.create({
      data: {
        postId: parseInt(postId),
        author,
        content,
      }
    })

    // Fetch updated post with all replies
    const updatedPost = await prisma.forumPost.findUnique({
      where: { id: parseInt(postId) },
      include: {
        replies: true,
      },
    })

    if (!updatedPost) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedPost,
    })
  } catch (error) {
    console.error('Error adding comment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add comment' },
      { status: 500 }
    )
  }
}

