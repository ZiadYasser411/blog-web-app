"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogTrigger, // (not used in controlled mode, can remove if you want)
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { handleDeleteUser, handleEditUser } from "@/app/user/actions";
import { Label } from "./label";
import { Input } from "./input";

export function DropdownMenuUser({
  userId,
  sessionId,
  firstName,
  lastName,
  username,
}: {
  userId: string;
  sessionId: string;
  firstName: string;
  lastName: string;
  username: string;
}) {
  // control both dialogs here
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-4 h-8">•••</Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault(); // prevent Radix from "selecting" item
              setEditOpen(true);  // open dialog
            }}
          >
            Edit User
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-destructive"
            onSelect={(e) => {
              e.preventDefault();
              setDeleteOpen(true);
            }}
          >
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit your profile.</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. You can change your name and username.
            </DialogDescription>
          </DialogHeader>
          <form action={handleEditUser}>
            <div className="grid gap-1">
              <Label className="mt-2 text-muted-foreground" htmlFor="firstName">First name</Label>
              <Input id="firstName" name="firstName" defaultValue={firstName} />
            </div>
            <div className="grid gap-1">
              <Label className="mt-2 text-muted-foreground" htmlFor="lastName">Last name</Label>
              <Input id="lastName" name="lastName" defaultValue={lastName} />
            </div>
            <div className="grid gap-1">
              <Label className="mt-2 text-muted-foreground" htmlFor="username">Username</Label>
              <Input id="username" name="username" defaultValue={username} />
            </div>
            <DialogFooter className="mt-2">
              <Button type="submit" onClick={() => setEditOpen(false)}>
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Are you sure you want to permanently delete your account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                handleDeleteUser(userId, sessionId);
                setDeleteOpen(false);
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}