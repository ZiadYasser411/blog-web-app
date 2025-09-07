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
import { Textarea } from "./textarea";
import {
  handleEditComment,
  handleDeleteComment,
} from "@/app/post/actions";

export function DropdownMenuComment({
  commentId,
  commenterId,
  slug,
  initialContent = "",
}: {
  commentId: string;
  commenterId: string;
  slug?: string;        
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
            Edit Comment
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive"
            onSelect={openDelete as any}
          >
            Delete Comment
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit comment</DialogTitle>
            <DialogDescription>Update your comment and save.</DialogDescription>
          </DialogHeader>

          <form
            action={async (fd: FormData) => {
              setErr(null);
              startTransition(async () => {
                try {
                  fd.set("commenterId", commenterId);
                  await handleEditComment(commentId, fd);
                  setEditOpen(false);
                } catch (e: any) {
                  setErr(e?.message ?? "Failed to edit comment");
                }
              });
            }}
            className="space-y-3"
          >
            <input type="hidden" name="commenterId" value={commenterId} />
            <input type="hidden" name="slug" value={slug ?? ""} />

            <div className="grid gap-1">
              <Label htmlFor={`content-${commentId}`}>Content</Label>
              <Textarea
                id={`content-${commentId}`}
                name="content"
                defaultValue={initialContent}
                required
              />
            </div>

            {err ? <p className="text-sm text-destructive">{err}</p> : null}

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
            <DialogTitle>Delete comment?</DialogTitle>
            <DialogDescription>
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {err ? <p className="text-sm text-destructive">{err}</p> : null}

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
                    await handleDeleteComment(commentId, commenterId, slug);
                    setDeleteOpen(false);
                  } catch (e: any) {
                    setErr(e?.message ?? "Failed to delete comment");
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
