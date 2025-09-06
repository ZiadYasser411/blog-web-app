export default function Tag({ tags }: { tags: string[] }) {
  if (!tags?.length) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map((t) => (
        <li key={t} className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
          {t}
        </li>
      ))}
    </ul>
  );
}
