import type { ResultatAnalyse } from '../demarches/detectionRisque'

type RisqueDetecte = Extract<ResultatAnalyse, { risque: true }>

const STYLE_ALERTE = `
  :host { all: initial; }
  dialog { box-sizing: border-box; width: min(32rem, calc(100vw - 2rem)); max-height: calc(100vh - 2rem); overflow: auto;
    padding: 1.25rem; border: 1px solid #6b6b6b; border-radius: 0.5rem; background: #ffffff; color: #1e1e1e;
    font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; line-height: 1.5; }
  dialog::backdrop { background: rgba(0, 0, 0, 0.5); }
  h2 { margin: 0 0 0.75rem; font-size: 1.25rem; line-height: 1.3; }
  p { margin: 0 0 0.75rem; font-size: 1rem; }
  .adresse { display: block; margin: 0 0 1.25rem; padding: 0.5rem 0.75rem; border-left: 4px solid #1d4ed8; background: #eef2ff;
    font-size: 1.5rem; font-weight: bold; overflow-wrap: anywhere; color: #1e1e1e; }
  .actions { display: flex; flex-wrap: wrap; gap: 0.75rem; }
  a, button { font: inherit; padding: 0.5rem 1rem; border: 2px solid #1d4ed8; border-radius: 0.25rem; cursor: pointer; }
  a { background: #1d4ed8; color: #ffffff; text-decoration: none; }
  button { background: #ffffff; color: #1d4ed8; }
  :focus-visible { outline: 3px solid #1e1e1e; outline-offset: 3px; }
  @media (prefers-color-scheme: dark) {
    dialog { background: #1b1b1b; color: #f2f2f2; border-color: #a0a0a0; }
    .adresse { background: #26304d; border-left-color: #93b4ff; color: #f2f2f2; }
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
    creerElement(page, 'p', `Ce site est privé, même s’il se dit « agréé » ou « habilité ». Il peut ajouter des frais de dossier à la démarche « ${risque.demarche} ».`),
    creerElement(page, 'p', 'Le site officiel de cette démarche est :'),
    creerElement(page, 'strong', risque.siteOfficiel, 'adresse'),
  ]
}

/**
 * Affiche une grande fenêtre d'alerte par-dessus la page, avec la bonne adresse.
 * Texte seulement (jamais de HTML venu de la page), dans un Shadow DOM : les styles de la page n'y entrent pas.
 */
export function afficherAlerte(page: Document, risque: RisqueDetecte, ignorerCeSite?: () => void): void {
  const hote = page.createElement('div')
  const racine = hote.attachShadow({ mode: 'open' })
  const style = page.createElement('style')
  style.textContent = STYLE_ALERTE

  const fenetre = page.createElement('dialog')
  fenetre.setAttribute('aria-labelledby', 'irene-titre')
  fenetre.setAttribute('role', 'alertdialog')
  const titre = creerElement(page, 'h2', 'Ce site n’est pas le site officiel')
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
  if (ignorerCeSite) {
    const ignorer = creerElement(page, 'button', 'Ne plus m’alerter sur ce site')
    ignorer.setAttribute('type', 'button')
    ignorer.addEventListener('click', () => {
      ignorerCeSite()
      hote.remove()
    })
    actions.append(ignorer)
  }

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
