import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { HomeCta } from "@/components/v2/home-cta";
import { V2PageShell } from "@/components/v2/v2-page-shell";
import { formatDate, publishedArticles, readingMinutes } from "@/lib/v2/articles";

export const metadata: Metadata = pageMetadata({
  title: "Conseils et articles rénovation à Marseille",
  description:
    "Nos conseils pour réussir vos travaux : rénovation complète, gros œuvre, climatisation. Des articles clairs, écrits par des artisans.",
  path: "/articles",
});

export default function ArticlesPage() {
  const articles = publishedArticles();
  const hasDraft = articles.some((article) => article.draft);

  return (
    <V2PageShell>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Accueil", path: "/" },
          { name: "Articles", path: "/articles" },
        ])}
      />
      <section className="v2-relief bg-(--cream) pt-32 pb-14 md:pt-44 md:pb-20">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold tracking-[0.28em] text-muted uppercase">Articles</p>
            <h1 className="mt-5 font-v2-display text-5xl leading-[1.05] text-balance text-navy md:text-7xl">
              Conseils pour réussir <em className="text-blue">vos travaux</em>
            </h1>
            <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-ink/80 md:text-xl">
              Comprendre un chantier avant de le lancer : des explications claires, métier par
              métier.
            </p>
          </div>
        </div>
      </section>

      <section aria-label="Liste des articles" className="bg-white py-16 md:py-24">
        <div className="container-page">
          {hasDraft && (
            <p className="mx-auto mb-12 max-w-2xl border border-dashed border-red/60 bg-red/5 px-4 py-3 text-center text-sm text-red-ink">
              Articles d&apos;exemple (brouillons) : à relire et valider avant publication. Ils
              n&apos;apparaissent pas sur le site en ligne.
            </p>
          )}

          <ul className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <li key={article.slug}>
                <Link
                  href={`/articles/${article.slug}`}
                  className="group block focus-visible:outline-blue"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-navy">
                    {article.cover && (
                      <Image
                        src={article.cover.src}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 380px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <p className="mt-5 text-xs font-semibold tracking-[0.2em] text-blue uppercase">
                    {article.category}
                    {article.draft && " · brouillon"}
                  </p>
                  <h2 className="mt-3 font-v2-display text-2xl leading-snug text-navy">
                    {article.title}
                  </h2>
                  <p className="mt-3 leading-relaxed text-ink/75">{article.description}</p>
                  <p className="mt-4 text-sm text-muted">
                    {formatDate(article.date)} · {readingMinutes(article)} min de lecture
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <HomeCta />
    </V2PageShell>
  );
}
