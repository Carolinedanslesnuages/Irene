import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Les tests tournent à la racine du projet (vitest.config.ts).
const lireFichier = (chemin: string) => readFileSync(resolve(process.cwd(), chemin), 'utf8')
const manifeste = JSON.parse(lireFichier('public/manifest.json'))

describe('manifest.json (Manifest V3, Chrome, Edge, Firefox)', () => {
  it('Manifest V3, fenêtre et arrière-plan au bon endroit', () => {
    expect(manifeste.manifest_version).toBe(3)
    expect(manifeste.action.default_popup).toBe('index.html')
    expect(manifeste.background).toMatchObject({ service_worker: 'background.js', scripts: ['background.js'] })
  })

  it('même version que le projet (tenue à jour par release-please)', () => {
    expect(manifeste.version).toBe(lireFichier('version.txt').trim())
    const config = JSON.parse(lireFichier('release-please-config.json'))
    expect(config.packages['.']['extra-files']).toContainEqual({ type: 'json', path: 'public/manifest.json', jsonpath: '$.version' })
  })

  it('permissions minimales : chacune doit être justifiée dans docs/adr', () => {
    expect(manifeste.permissions).toEqual(['storage'])
    expect(manifeste.host_permissions ?? []).toEqual([])
  })

  it('script de contenu : lit les pages web seulement, sans permission d’accès aux sites (ADR 0002)', () => {
    expect(manifeste.content_scripts).toEqual([
      { matches: ['http://*/*', 'https://*/*'], js: ['analysePage.js'], run_at: 'document_idle' },
    ])
  })

  it('aucun code distant ni politique de sécurité affaiblie', () => {
    // Les motifs « matches » du script de contenu désignent les pages lues, pas du code distant.
    const { content_scripts: _pagesLues, ...manifesteSansMotifs } = manifeste
    const texte = JSON.stringify(manifesteSansMotifs)
    expect(texte).not.toMatch(/unsafe-eval|unsafe-inline|https?:\/\//)
  })

  it('identifiant Firefox présent (obligatoire pour publier)', () => {
    expect(manifeste.browser_specific_settings.gecko.id).toMatch(/@/)
  })
})
