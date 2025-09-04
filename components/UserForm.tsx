import { createUser } from "@/lib/users";
import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
function UserForm() {
  async function CreateUserAction(formdata: FormData) {
    "use server";
    const email = formdata.get("email") as string;
    const name = formdata.get("name") as string;
    const username = formdata.get("username") as string;
    if (email && name && username) {
      await createUser(email, name, username);
    }
  }

  return (
    <div className="w-md">
      <h1 className="text-2xl font-bold mb-6">Create User</h1>
      <form
        action={CreateUserAction}
        className="space-y-4 rounded-lg border p-6 shadow-sm"
      >
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Name"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="name">Username</Label>
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="Username"
            required
          />
        </div>
        <Button className="w-full" type="submit">
          Create User
        </Button>
      </form>
    </div>
  );
}

export default UserForm;
