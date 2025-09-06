import { getPostBySlug } from "@/lib/service/postService";
import { requireSession } from "@/lib/auth/require-session";
import { notFound } from "next/navigation";

export default async function PostPage({ params,}: { params: { slug: string };}) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}
