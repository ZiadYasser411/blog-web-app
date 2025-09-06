import PostForm from "./PostForm";
import React from "react";

export default async function PostingPage() {
  return (
    <div className="flex flex-col items-center justify-center pt-10">
      <PostForm />
    </div>
  );
}
