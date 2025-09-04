import PostForm from '@/components/PostForm';
import { getPosts } from '@/lib/posts';
import React from 'react'

export default async function PostsPage() {
    const posts = await getPosts();
  return (
    <div className='flex flex-col items-center justify-center pt-12'>
      <PostForm />
    </div>
  )
}
