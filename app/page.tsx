import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserForm from "@/components/UserForm";
import { getAllUsers } from "@/lib/users";

export default async function Home() {
  const users = await getAllUsers();
  return (
    <div className="flex flex-col md:flex-row gap-8 p-12">
      <div className="flex-1">
        <UserForm />
      </div>
      <div className="flex-2">
        <h1 className="text-2xl font-bold mb-6">Users</h1>
        <ul className="space-y-4 rounded-lg border p-6 shadow-sm">
          {users.map((user) => (
            <li key={user.id} className="flex items-center-safe">
              <div className="pr-4">
                <Avatar>
                  <AvatarImage src=""/>
                  <AvatarFallback> {user.name.substring(0, 1).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
              <div className="">
                <h2 className="text-lg font-bold">{user.name}</h2>
                <p className="text-xs text-gray-400">{user.email}</p>
                <div className="flex">
                  <p className="text-xs text-gray-400 pr-2">posts: {user._count.posts}</p>
                  <p className="text-xs text-gray-400">comments: {user._count.comments}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
