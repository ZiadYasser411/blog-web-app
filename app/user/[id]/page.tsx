import PostList from "@/components/posts/PostList";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenuUser } from "@/components/ui/dropdownUser";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { requireSession } from "@/lib/auth/require-session";
import { getCommentsByCommenterId } from "@/lib/service/commentService";
import { getPostsByAuthorId } from "@/lib/service/postService";
import { getUser } from "@/lib/service/userService";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser(id);
  const session = await requireSession();
  if (!user) notFound();
  const userImage = user.image;
  const username = user.username;
  const email = user.email;
  const authorName = `${user.firstName} ${user.lastName}`;
  const initials = authorName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const [posts, comments] = await Promise.all([
    getPostsByAuthorId(id),
    getCommentsByCommenterId(id),
  ]);
  return (
    <div className="p-6 md:pt-10">
      <div className="bg-background mx-auto max-w-3xl space-y-4 rounded-lg border p-4 md:p-6 shadow-sm">
        <div className="flex">
          <header className="flex items-center flex-1 gap-3">
            <Avatar className="h-20 w-20 mr-2">
              {userImage ? (
                <AvatarImage src={userImage} alt={authorName} />
              ) : null}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-3xl font-bold">{authorName}</h2>
              <p className="text-sm font-regular text-gray-400">
                Email: {email}
              </p>
              <p className="text-sm font-regular text-gray-400">
                Username: {username}
              </p>
            </div>
          </header>
          {user.id === session.user.id ? (
            <DropdownMenuUser userId={user.id} sessionId={session.user.id} />
          ) : null}
        </div>
        <Tabs defaultValue="posts" className="w-full">
          <TabsList>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="changepassword">Change Password</TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
            {posts.length > 0 ? (<PostList posts={posts} currentUserId={user.id} />) : (<p className="text-muted-foreground text-sm">No posts by {authorName} yet.</p>)}
          </TabsContent>
          <TabsContent value="comments">
            {comments.length ? (
              <ul className="space-y-3">
                {comments.map((c) => (
                  <li key={c.id} className="rounded-md border p-3">
                    <div className="mb-1 text-sm text-muted-foreground">
                      on{" "}
                      <Link className="text-emerald-600 font-semibold" href={`/post/${c.post.slug}`}>
                        {c.post.title}
                      </Link>{" "}
                      • {new Date(c.createdAt).toLocaleString()}
                    </div>
                    <div className="text-sm">{c.content}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">No comments by {authorName} yet.</p>
            )}
          </TabsContent>
          <TabsContent value="changepassword">
            Whoops! Not developed yet!
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
