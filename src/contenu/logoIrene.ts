const ESPACE_SVG = 'http://www.w3.org/2000/svg'

const FORMES_DU_LOGO: ReadonlyArray<readonly [string, Record<string, string>]> = [
  ['path', { d: 'M64 8 L113 26 V62 C113 92 92 112 64 122 C36 112 15 92 15 62 V26 Z', fill: '#1d4ed8', stroke: '#ffffff', 'stroke-width': '6', 'stroke-linejoin': 'round' }],
  ['path', { d: 'M26 64 C38 44 52 38 64 38 C76 38 90 44 102 64 C90 84 76 90 64 90 C52 90 38 84 26 64 Z', fill: '#ffffff' }],
  ['circle', { cx: '64', cy: '64', r: '15', fill: '#1d4ed8' }],
  ['circle', { cx: '69', cy: '59', r: '5', fill: '#ffffff' }],
]

/**
 * Logo d'Irène (même dessin que public/icones/logo.svg), construit en SVG direct :
 * aucune image à charger, donc rien que la page visitée puisse bloquer.
 */
export function creerLogoIrene(page: Document): SVGSVGElement {
  const logo = page.createElementNS(ESPACE_SVG, 'svg')
  logo.setAttribute('viewBox', '0 0 128 128')
  logo.setAttribute('width', '40')
  logo.setAttribute('height', '40')
  logo.setAttribute('role', 'img')
  logo.setAttribute('aria-label', 'Logo d’Irène : un bouclier orné d’un œil attentif')
  logo.setAttribute('class', 'logo')
  for (const [balise, attributs] of FORMES_DU_LOGO) {
    const forme = page.createElementNS(ESPACE_SVG, balise)
    for (const [nom, valeur] of Object.entries(attributs)) forme.setAttribute(nom, valeur)
    logo.append(forme)
  }
  return logo
}
