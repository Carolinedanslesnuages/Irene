import type { ResultatAnalyse } from '../demarches/detectionRisque'

type RisqueDetecte = Extract<ResultatAnalyse, { risque: true }>

const STYLE_ALERTE = `
  :host { all: initial; }
  dialog { box-sizing: border-box; width: min(40rem, calc(100vw - 2rem)); max-height: calc(100vh - 2rem); overflow: auto;
    padding: 1.5rem; border: 4px solid #b91c1c; border-radius: 0.5rem; background: #ffffff; color: #1e1e1e;
    font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; line-height: 1.5; }
  dialog::backdrop { background: rgba(0, 0, 0, 0.7); }
  h2 { margin: 0 0 1rem; font-size: 1.75rem; line-height: 1.25; color: #b91c1c; }
  p { margin: 0 0 1rem; font-size: 1.25rem; }
  .adresse { display: block; margin: 0 0 1.5rem; font-size: 2rem; font-weight: bold; overflow-wrap: anywhere; color: #1d4ed8; }
  .actions { display: flex; flex-wrap: wrap; gap: 0.75rem; }
  a, button { font: inherit; font-size: 1.125rem; padding: 0.75rem 1.25rem; border: 2px solid #1d4ed8; border-radius: 0.25rem; cursor: pointer; }
  a { background: #1d4ed8; color: #ffffff; text-decoration: none; font-weight: bold; }
  button { background: #ffffff; color: #1d4ed8; }
  :focus-visible { outline: 3px solid #1e1e1e; outline-offset: 3px; }
  @media (prefers-color-scheme: dark) {
    dialog { background: #1b1b1b; color: #f2f2f2; border-color: #fca5a5; }
    h2 { color: #fca5a5; }
    .adresse { color: #93b4ff; }
    a { background: #93b4ff; border-color: #93b4ff; color: #0b1a3d; }
    button { background: #1b1b1b; color: #93b4ff; border-color: #93b4ff; }
    :focus-visible { outline-color: #f2f2f2; }
  }
`

function creerElement<Balise extends keyof HTMLElementTagNameMap>(
  page: Document,
  balise: Balise,
  texte: string,
  classe?: string,
): HTMLElementTagNameMap[Balise] {
  const element = page.createElement(balise)
  element.textContent = texte
  if (classe) element.className = classe
  return element
}

function ecrireMessage(page: Document, risque: RisqueDetecte): HTMLElement[] {
  if (risque.motif === 'site-arnaque') {
    return [creerElement(page, 'p', 'Ce site figure dans la liste des sites d’arnaque connus. Ne donnez aucune information.')]
  }
  return [
    creerElement(page, 'p', `La démarche « ${risque.demarche} » est gratuite. Ce site est privé, même s’il se dit « agréé » ou « habilité ».`),
    creerElement(page, 'p', 'Le seul site officiel et gratuit est :'),
    creerElement(page, 'strong', risque.siteOfficiel, 'adresse'),
  ]
}

/**
 * Affiche une grande fenêtre d'alerte par-dessus la page, avec la bonne adresse.
 * Texte seulement (jamais de HTML venu de la page), dans un Shadow DOM : les styles de la page n'y entrent pas.
 */
export function afficherAlerte(page: Document, risque: RisqueDetecte): void {
  const hote = page.createElement('div')
  const racine = hote.attachShadow({ mode: 'open' })
  const style = page.createElement('style')
  style.textContent = STYLE_ALERTE

  const fenetre = page.createElement('dialog')
  fenetre.setAttribute('aria-labelledby', 'irene-titre')
  fenetre.setAttribute('role', 'alertdialog')
  const titre = creerElement(page, 'h2', 'Attention : ce site n’est pas le site officiel')
  titre.id = 'irene-titre'

  const actions = page.createElement('div')
  actions.className = 'actions'
  if (risque.motif === 'demarche-payante') {
    const lien = creerElement(page, 'a', `Aller sur le site officiel ${risque.siteOfficiel}`)
    lien.setAttribute('href', `https://${risque.siteOfficiel}`)
    lien.setAttribute('rel', 'noopener noreferrer')
    actions.append(lien)
  }
  const fermer = creerElement(page, 'button', 'Rester sur ce site')
  fermer.setAttribute('type', 'button')
  actions.append(fermer)

  fenetre.append(titre, ...ecrireMessage(page, risque), actions)
  racine.append(style, fenetre)
  page.body.append(hote)

  const retirerAlerte = (): void => hote.remove()
  fermer.addEventListener('click', retirerAlerte)
  fenetre.addEventListener('close', retirerAlerte)
  if (typeof fenetre.showModal === 'function') fenetre.showModal()
  else fenetre.setAttribute('open', '')
  ;(actions.firstElementChild as HTMLElement).focus()
}
