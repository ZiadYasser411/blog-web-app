"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Label } from "./label";
import { Input } from "./input";
import { Textarea } from "./textarea";
import {
  handleEditPost,
  handleDeletePost,
} from "@/app/post/actions";

export function DropdownMenuPost({
  postId,
  authorId,
  sessionId,
  slug,
  initialTitle = "",
  initialContent = "",
}: {
  postId: string;
  authorId: string;
  sessionId: string;
  slug?: string;
  initialTitle?: string;
  initialContent?: string;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  function openEdit(e: Event) {
    e.preventDefault();
    setErr(null);
    setEditOpen(true);
  }
  function openDelete(e: Event) {
    e.preventDefault();
    setErr(null);
    setDeleteOpen(true);
  }

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-8 w-8 p-0">•••</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuItem onSelect={openEdit as any}>
            Edit Post
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive"
            onSelect={openDelete as any}
          >
            Delete Post
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit post</DialogTitle>
            <DialogDescription>
              Update the title and content, then save.
            </DialogDescription>
          </DialogHeader>

          <form
            action={async (fd: FormData) => {
              setErr(null);
              startTransition(async () => {
                try {
                  fd.set("authorId", authorId);
                  await handleEditPost(postId, fd);
                  setEditOpen(false);
                } catch (e: any) {
                  setErr(e?.message ?? "Failed to edit post");
                }
              });
            }}
            className="space-y-3"
          >
            <input type="hidden" name="authorId" value={authorId} />
            <input type="hidden" name="slug" value={slug ?? ""} />

            <div className="grid gap-1">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={initialTitle} required />
            </div>

            <div className="grid gap-1">
              <Label htmlFor="content">Content</Label>
              <Textarea id="content" name="content" defaultValue={initialContent} />
            </div>

            {err ? (
              <p className="text-sm text-destructive">{err}</p>
            ) : null}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete post?</DialogTitle>
            <DialogDescription>
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {err ? (
            <p className="text-sm text-destructive">{err}</p>
          ) : null}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={pending}
              onClick={() => {
                setErr(null);
                startTransition(async () => {
                  try {
                    await handleDeletePost(postId, authorId, sessionId);
                    setDeleteOpen(false);
                  } catch (e: any) {
                    setErr(e?.message ?? "Failed to delete post");
                  }
                });
              }}
            >
              {pending ? "Deleting..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
