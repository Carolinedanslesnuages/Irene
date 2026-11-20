export const SITES_OFFICIELS_GRATUITS = ['service-public.fr', 'infogreffe.fr', 'ants.gouv.fr'] as const

export type SiteOfficielGratuit = (typeof SITES_OFFICIELS_GRATUITS)[number]

export interface DemarcheGratuite {
  nom: string
  siteOfficiel: SiteOfficielGratuit
  motsCles: string[]
}

export const DEMARCHES_GRATUITES: DemarcheGratuite[] = [
  {
    nom: 'Carte grise',
    siteOfficiel: 'ants.gouv.fr',
    motsCles: ['carte grise', 'duplicata', 'certificat d’immatriculation'],
  },
  {
    nom: 'Permis de conduire',
    siteOfficiel: 'ants.gouv.fr',
    motsCles: ['permis de conduire', 'permis de conduire perdu'],
  },
  {
    nom: 'Certificat de non-gage',
    siteOfficiel: 'ants.gouv.fr',
    motsCles: ['certificat de non-gage', 'certificat de situation administrative'],
  },
  {
    nom: 'Acte de naissance',
    siteOfficiel: 'service-public.fr',
    motsCles: ['acte de naissance', 'extrait de naissance'],
  },
  {
    nom: 'Passeport',
    siteOfficiel: 'service-public.fr',
    motsCles: ['passeport', 'demande de passeport'],
  },
  {
    nom: 'Carte d’identité',
    siteOfficiel: 'service-public.fr',
    motsCles: ['carte d’identité', 'carte nationale d’identité'],
  },
  {
    nom: 'Inscription sur les listes électorales',
    siteOfficiel: 'service-public.fr',
    motsCles: ['listes électorales', 'inscription électorale'],
  },
  {
    nom: 'Extrait Kbis',
    siteOfficiel: 'infogreffe.fr',
    motsCles: ['extrait kbis', 'kbis'],
  },
  {
    nom: 'Immatriculation d’entreprise',
    siteOfficiel: 'infogreffe.fr',
    motsCles: ['immatriculation d’entreprise', 'immatriculer une entreprise', 'créer une entreprise'],
  },
]
