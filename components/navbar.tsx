"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { MessageCircleIcon, PlusCircle } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ui/theme-toggle";

type NavUser =
  | { id: string; name: string; email: string; image?: string | null }
  | undefined;

export default function NavBar({ user }: { user: NavUser }) {
  const userId = (user as any)?.id as string | undefined;
  if (!userId) return null;

  const name = user?.name ?? "";
  const email = user?.email ?? "";
  const image = user?.image ?? "";
  const initials =
    name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ||
    email?.[0]?.toUpperCase() ||
    "U";

  if (!userId) return null;

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="flex items-center px-3 py-2 sm:px-4">
        <nav className="flex items-center gap-2">
          <Link href="/" className="text-sm font-semibold hover:bg-gray-300/30 px-3 py-2 rounded-lg">
            Home
          </Link>
          <Link href={`/user/${userId}`} className="text-sm font-semibold hover:bg-gray-300/30 px-3 py-2 rounded-lg">
            Profile
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button asChild>
            <Link href="/post" className="inline-flex items-center gap-2 py-2">
              <PlusCircle className="h-4 w-4" />
              Create Post
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-9 w-9 rounded-full p-0"
                aria-label="Open user menu"
              >
                <Avatar className="h-9 w-9">
                  {image ? (
                    <AvatarImage src={image} alt={name || email || "User"} />
                  ) : null}
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col">
                  <span className="truncate text-sm font-medium">
                    {name || "User"}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {email || "—"}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/user/${userId}`}>View profile</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-destructive"
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
