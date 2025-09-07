import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenuUser } from "@/components/ui/dropdownUser";
import { requireSession } from "@/lib/auth/require-session";
import { getUser } from "@/lib/service/userService";
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
  return (
    <div className="pt-6 md:pt-10">
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
      </div>
    </div>
  );
}
