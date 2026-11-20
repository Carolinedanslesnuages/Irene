/// <reference types="vite/client" />
/// <reference types="chrome" />

/**
 * Import « autonome » : le script de contenu ne peut pas charger de fichier partagé (il n'est pas un module).
 * Le suffixe ?autonome fait copier le fichier dans le script au lieu de le partager avec la fenêtre.
 */
declare module '*/sitesIgnores?autonome' {
  export const CLE_SITES_IGNORES: string
  export function estSiteIgnore(sitesIgnores: readonly string[], nomDeSite: string): boolean
  export function ajouterSiteIgnore(sitesIgnores: readonly string[], nomDeSite: string): string[]
}
