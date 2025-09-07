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
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { handleDeleteComment } from "@/app/post/actions";

export function DropdownMenuComment({commentId, commenterId, sessionId, slug}: {commentId: string, commenterId: string, sessionId: string, slug?: string}) {
  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-4 h-8">
            •••
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuItem>Edit Comment</DropdownMenuItem>
          <DialogTrigger asChild>
            <DropdownMenuItem className="text-destructive">
              Delete Comment
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Are you sure you want to permanently
            delete this comment?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="submit" onClick={() => handleDeleteComment(commentId, commenterId, sessionId)} variant={"destructive"}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
