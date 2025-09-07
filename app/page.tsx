import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";
import { getAllPosts } from "@/lib/service/postService";
import SignOutButton from "@/components/auth/SignOut";
import PostList from "@/components/posts/PostList";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect(`login?callbackUrl=${encodeURIComponent("/")}`);

  const posts = await getAllPosts();
  return (
    <div className="p-6 md:p-10">
      <SignOutButton />
      <PostList posts={posts} currentUserId={session.user.id} />
    </div>
  );
}
