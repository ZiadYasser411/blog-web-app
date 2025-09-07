"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { handleDeletePost } from "@/app/post/actions";

export function DropdownMenuPost({postId, authorId, sessionId}: {postId: string, authorId: string, sessionId: string}) {
  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-4 h-8">
            •••
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuItem>Edit Post</DropdownMenuItem>
          <DialogTrigger asChild>
            <DropdownMenuItem className="text-destructive">
              Delete Post
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Are you sure you want to permanently
            delete this post?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter >
          <Button type="submit" onClick={() => handleDeletePost(postId, authorId, sessionId)} variant={"destructive"}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
