import { getImageProps } from "next/image";
import { avifLoader, webpLoader } from "@/lib/v2/photo-loader";
import type { Photo } from "@/lib/v2/realisations";

interface PhotoImageProps {
  photo: Photo;
  /** Place occupée à l'écran, comme l'attribut `sizes` d'une image (le navigateur en déduit la taille à télécharger). */
  sizes: string;
  /** Texte alternatif ; celui de la photo par défaut. `""` pour une image décorative. */
  alt?: string;
  /** Remplit son parent (qui doit être positionné), comme `fill` de next/image. */
  fill?: boolean;
  className?: string;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
}

/**
 * Photo de chantier : le navigateur prend la version AVIF si elle est gérée, sinon WebP, parmi des
 * fichiers déjà fabriqués à plusieurs largeurs. Pendant le chargement, un aperçu flou occupe la
 * place (aucun saut de mise en page, aucune case vide).
 */
export function PhotoImage({
  photo,
  sizes,
  alt = photo.alt,
  fill = false,
  className,
  loading,
  fetchPriority,
}: PhotoImageProps) {
  const common = {
    src: photo.src,
    alt,
    sizes,
    className,
    loading,
    fetchPriority,
    placeholder: "blur" as const,
    blurDataURL: photo.blur,
  };
  const size = fill ? { fill: true as const } : { width: photo.width, height: photo.height };
  const avif = getImageProps({ ...common, ...size, loader: avifLoader }).props;
  const webp = getImageProps({ ...common, ...size, loader: webpLoader }).props;

  return (
    <picture>
      <source type="image/avif" srcSet={avif.srcSet} sizes={sizes} />
      {/* `getImageProps` prépare tous les attributs : on ne peut pas passer par <Image> avec <picture>. */}
      <img {...webp} alt={alt} />
    </picture>
  );
}
