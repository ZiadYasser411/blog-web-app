import React from "react";
import { GalleryVerticalEnd } from "lucide-react"
import { createUser } from "@/lib/users";
import { cn } from "@/lib/utils"
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form action={createUser}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Tutoruu Blog</span>
            </a>
            <h1 className="text-xl font-bold tracking-tight">Register Account</h1>
            <div className="text-center text-sm">
              Create your account and join our blog now!
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="grid gap-2">
              <Label htmlFor="email">Email<a className="text-red-500">*</a></Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="flex gap-2">
              <div className="grid gap-2">
                <Label htmlFor="email">First Name<a className="text-red-500">*</a></Label>
                <Input
                  id="firstName"
                  type="text"
                  name="firstName"
                  placeholder="John"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Last Name<a className="text-red-500">*</a></Label>
                <Input
                  id="lastName"
                  type="text"
                  name="lastName"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                  <Label htmlFor="password">Username<a className="text-red-500">*</a></Label>
                </div>
              <Input
                id="username"
                type="text"
                name="username"
                placeholder="JohnDoe2025"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                  <Label htmlFor="password">Password<a className="text-red-500">*</a></Label>
                  
                </div>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Password"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </div>
        </div>
      </form>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
