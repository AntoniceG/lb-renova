import { V2_QUOTE_HREF } from "@/lib/v2/nav";
import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { articleJsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/v2/article-body";
import { v2Button } from "@/components/v2/button-styles";
import { HomeCta } from "@/components/v2/home-cta";
import { HomeFaq } from "@/components/v2/home-faq";
import { V2PageShell } from "@/components/v2/v2-page-shell";
import { siteConfig } from "@/config/site.config";
import { formatDate, getArticle, publishedArticles, readingMinutes } from "@/lib/v2/articles";
import { getPilier } from "@/lib/v2/piliers";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

// Seuls les articles publiés existent ; tout autre segment → 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return publishedArticles().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return pageMetadata({
    title: article.title,
    description: article.description,
    path: `/articles/${article.slug}`,
    type: "article",
    publishedTime: article.date,
    modifiedTime: article.updated,
  });
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const pilier = article.pilier ? getPilier(article.pilier) : undefined;
  const autres = publishedArticles().filter((other) => other.slug !== article.slug);
  const { nav } = siteConfig;

  return (
    <V2PageShell>
      <JsonLd
        data={[
          articleJsonLd({
            headline: article.title,
            description: article.description,
            path: `/articles/${article.slug}`,
            datePublished: article.date,
            dateModified: article.updated,
            image: article.cover?.src,
          }),
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "Articles", path: "/articles" },
            { name: article.title, path: `/articles/${article.slug}` },
          ]),
        ]}
      />
      <article>
        <header className="v2-relief bg-(--cream) pt-32 pb-12 md:pt-44 md:pb-16">
          <div className="container-page">
            <div className="mx-auto max-w-3xl">
              <nav
                aria-label="Fil d'Ariane"
                className="text-xs tracking-[0.14em] text-muted uppercase"
              >
                <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <li>
                    <Link href="/" className="hover:text-navy">
                      Accueil
                    </Link>
                  </li>
                  <li aria-hidden>/</li>
                  <li>
                    <Link href="/articles" className="hover:text-navy">
                      Articles
                    </Link>
                  </li>
                </ol>
              </nav>

              <p className="mt-8 text-xs font-semibold tracking-[0.2em] text-blue uppercase">
                {article.category}
                {article.draft && " · brouillon"}
              </p>
              <h1 className="mt-4 font-v2-display text-4xl leading-[1.1] text-balance text-navy md:text-6xl">
                {article.title}
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-ink/80 md:text-xl">
                {article.description}
              </p>
              <p className="mt-6 text-sm text-muted">
                {formatDate(article.date)}
                {article.updated && ` · mis à jour le ${formatDate(article.updated)}`} ·{" "}
                {readingMinutes(article)} min de lecture
              </p>
            </div>
          </div>
        </header>

        {article.cover && (
          <div className="container-page -mt-2 md:-mt-4">
            <div className="relative mx-auto aspect-[16/9] max-w-5xl overflow-hidden bg-navy">
              <Image
                src={article.cover.src}
                alt={article.cover.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
                loading="eager"
              />
            </div>
          </div>
        )}

        <div className="bg-white py-14 md:py-20">
          <div className="container-page">
            <div className="mx-auto max-w-3xl">
              <ArticleBody blocks={article.blocks} />

              <aside className="mt-16 border border-navy/12 bg-(--cream) p-8 md:p-10">
                <h2 className="font-v2-display text-3xl text-navy">Un projet en tête ?</h2>
                <p className="mt-3 text-lg leading-relaxed text-ink/80">
                  Décrivez-le en quelques étapes : le devis est gratuit et nous vous rappelons{" "}
                  {siteConfig.promise.callbackDelay}.
                </p>
                <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                  <Link href={V2_QUOTE_HREF} className={v2Button({ tone: "navy" })}>
                    {nav.quoteLabel}
                  </Link>
                  {pilier && (
                    <Link
                      href={`/${pilier.slug}`}
                      className="text-xs font-semibold tracking-[0.18em] text-navy uppercase underline underline-offset-4 focus-visible:outline-blue"
                    >
                      Notre page {pilier.title.toLowerCase()}
                    </Link>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </div>
      </article>

      {article.faq && article.faq.length > 0 && (
        <HomeFaq
          eyebrow="Questions fréquentes"
          title={
            <>
              Sur ce <em className="text-blue">sujet</em>
            </>
          }
          items={article.faq}
        />
      )}

      {autres.length > 0 && (
        <section aria-labelledby="lire-aussi" className="v2-relief bg-(--cream) py-14 md:py-20">
          <div className="container-page">
            <h2 id="lire-aussi" className="font-v2-display text-3xl text-navy md:text-4xl">
              À lire aussi
            </h2>
            <ul className="mt-8 grid gap-6 md:grid-cols-2">
              {autres.map((other) => (
                <li key={other.slug}>
                  <Link
                    href={`/articles/${other.slug}`}
                    className="block border border-navy/12 bg-white p-7 transition-colors hover:border-navy/40 focus-visible:outline-blue"
                  >
                    <span className="text-xs font-semibold tracking-[0.2em] text-blue uppercase">
                      {other.category}
                    </span>
                    <span className="mt-3 block font-v2-display text-2xl leading-snug text-navy">
                      {other.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <HomeCta />
    </V2PageShell>
  );
}
