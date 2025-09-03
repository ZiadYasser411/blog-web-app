import UserForm from "@/components/UserForm";
import { getAllUsers } from "@/lib/users";

export default async function Home() {
  const users = await getAllUsers();
  return (
    <div className="flex flex-col md:flex-row gap-8 p-6">
      <div className="flex-1">
        <UserForm />
      </div>
      <div className="flex-2">
        <h1 className="text-2xl font-bold mb-6">Users</h1>
        <ul className="space-y-4 rounded-lg border p-6 shadow-sm">
          {users.map((user) => (
            <li key={user.id}>
              <h3 className="font-bold">{user.name}</h3>
              <p>{user.username}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
