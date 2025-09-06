"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { TAG_OPTIONS, type TagOption } from "@/lib/constants/tags";

function TagItem({ tag }: { tag: TagOption }) {
  const [checked, setChecked] = useState(false);
  return (
    <label className="flex items-center gap-2 rounded-md border p-2">
      <Checkbox
        checked={checked}
        onCheckedChange={(v) => setChecked(Boolean(v))}
        aria-label={tag}
      />
      <span className="text-sm">{tag}</span>
      {/* Native checkbox mirrors state so it submits in FormData */}
      <input
        type="checkbox"
        name="tags"
        value={tag}
        checked={checked}
        readOnly
        className="sr-only"
      />
    </label>
  );
}

export default function TagSelector() {
  return (
    <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
      {TAG_OPTIONS.map((tag) => (
        <TagItem key={tag} tag={tag} />
      ))}
    </div>
  );
}
