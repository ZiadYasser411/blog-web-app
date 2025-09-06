import { Prisma } from "@prisma/client";
import prisma from "../prisma";

const baseUserSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  username: true,
  image: true,
  createdAt: true,
  updatedAt: true,
};

export const usersRepository = {
  listAllUsers: () => {
    return prisma.user.findMany({
      select: {
        ...baseUserSelect,
        _count: { select: { posts: true, comments: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },
  getUserById: (id: string) => {
    return prisma.user.findUnique({
      where: { id },
      select: {
        ...baseUserSelect,
        _count: { select: { posts: true, comments: true } },
        posts: { orderBy: { createdAt: "desc" } },
      },
    });
  },

  getUserByEmail: (email: string) => {
    return prisma.user.findUnique({ where: { email } });
  },

  getUserByUsername: (username: string) => {
    return prisma.user.findUnique({ where: { username } });
  },

  createUser: (data: {
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
  }) => {
    return prisma.user.create({
      data: data,
      select: { ...baseUserSelect },
    });
  },

  editUser: (id: string, data: Prisma.UserUpdateInput) => {
    return prisma.user.update({
      where: { id },
      data: data,
      select: { ...baseUserSelect },
    });
  },

  deleteUser: (id: string) => {
    prisma.$transaction([
      prisma.comment.deleteMany({ where: { commenterId: id } }),
      prisma.post.deleteMany({ where: { authorId: id } }),
      prisma.user.delete({ where: { id } }),
    ]);
  },
};
