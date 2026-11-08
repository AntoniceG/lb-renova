import Image from "next/image";
import type { ArticleBlock } from "@/lib/v2/articles";

/** Affiche les blocs d'un article : titres, paragraphes, listes, citations, images. */
export function ArticleBody({ blocks }: { blocks: readonly ArticleBlock[] }) {
  return (
    <div className="space-y-6 text-lg leading-relaxed text-ink/85">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "h2":
            return (
              <h2
                key={index}
                className="pt-6 font-v2-display text-3xl leading-[1.15] text-navy md:text-4xl"
              >
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={index} className="pt-2 font-v2-display text-2xl text-navy">
                {block.text}
              </h3>
            );
          case "p":
            return <p key={index}>{block.text}</p>;
          case "quote":
            return (
              <blockquote
                key={index}
                className="border-l-2 border-(--gold) pl-6 font-v2-display text-2xl text-navy italic"
              >
                {block.text}
              </blockquote>
            );
          case "ul":
            return (
              <ul key={index} className="space-y-3 border-l-2 border-(--gold) pl-6">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={index} className="space-y-3 pl-6">
                {block.items.map((item, itemIndex) => (
                  <li key={item} className="flex gap-4">
                    <span
                      aria-hidden
                      className="w-8 shrink-0 font-v2-display text-2xl text-(--gold-ink) italic"
                    >
                      {itemIndex + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            );
          case "image":
            return (
              <figure key={index} className="py-2">
                <Image
                  src={block.src}
                  alt={block.alt}
                  width={block.width}
                  height={block.height}
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="h-auto w-full"
                />
                {block.caption && (
                  <figcaption className="mt-3 text-sm text-muted">{block.caption}</figcaption>
                )}
              </figure>
            );
        }
      })}
    </div>
  );
}
