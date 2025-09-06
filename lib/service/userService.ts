import bcrypt from "bcrypt";
import { usersRepository } from "../repo/userRepository";

type updatableUserFields = "firstName" | "lastName" | "username" | "image";

export async function getAllUsers() {
  return usersRepository.listAllUsers();
}

export async function getUser(id: string) {
  if (id.length === 0)
    throw Object.assign(new Error("User id is required"), { status: 400 });
  return usersRepository.getUserById(id);
}

export async function createUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  username: string
) {
  if (!email || !password || !firstName || !lastName || !username)
    throw Object.assign(
      new Error(
        "Email, first name, last name, username and password are required"
      ),
      { status: 400 }
    );
  const existingEmail = await usersRepository.getUserByEmail(email);
  const existingUsername = await usersRepository.getUserByUsername(username);
  if (existingEmail)
    throw Object.assign(new Error("Email already exists"), { status: 409 });
  if (existingUsername)
    throw Object.assign(new Error("Username already exists"), { status: 409 });
  const hashedPassword = await bcrypt.hash(password, 12);
  return usersRepository.createUser({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    username,
  });
}

export async function updateUser(
  id: string,
  patch: Partial<Record<updatableUserFields, string>>,
  sessionId: string
) {
  if (id.length === 0)
    throw Object.assign(new Error("User id is required"), { status: 400 });
  if (sessionId !== id)
    throw Object.assign(new Error("Unauthorized"), { status: 403 });
  const data: Partial<Record<updatableUserFields, string>> = {};
  if (patch.firstName) data.firstName = patch.firstName;
  if (patch.lastName) data.lastName = patch.lastName;
  if (patch.username) data.username = patch.username;
  if (patch.image) data.image = patch.image;

  if (Object.keys(data).length === 0)
    throw Object.assign(new Error("No data to update"), { status: 400 });

  if (data.username) {
    const existingUsername = await usersRepository.getUserByUsername(
      data.username
    );
    if (existingUsername && existingUsername.id !== id)
      throw Object.assign(new Error("Username already exists"), {
        status: 409,
      });
  }

  return usersRepository.editUser(id, data);
}

export async function deleteUser(id: string, sessionId: string) {
  if (!id)
    throw Object.assign(new Error("User id is required"), { status: 400 });
  if (sessionId !== id)
    throw Object.assign(new Error("Unauthorized"), { status: 403 });
  usersRepository.deleteUser(id);
  return { deleted: true };
}
