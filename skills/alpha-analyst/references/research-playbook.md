# Research Playbook — Étapes A & B

Ce playbook décrit **comment** faire la veille (A) et la détection de gaps (B) **avec des sources réelles**, en s'appuyant sur les outils de recherche web disponibles dans pi. L'objectif n'est pas d'écrire vite, mais d'être **vrai, daté et reproductible**.

## Table des matières
1. Sources cibles (gratuites et publiques)
2. Utiliser les outils de recherche
3. Normaliser un signal
4. Grille de confiance A / B / C
5. Construire le Trend Radar
6. Détection de gaps (Étape B)

---

## 1. Sources cibles (gratuites et publiques)

Privilégie les sources **primaires et gratuites**. Les paywalls profonds sont à éviter (pas de reproductibilité pour l'utilisateur).

| Type | Exemples |
|---|---|
| Cabinets de conseil | McKinsey, BCG, Bain, Deloitte, PwC, EY, KPMG, Accenture, Oliver Wyman |
| Analystes | Gartner (résumés publics), Forrester, IDC, Statista (extraits) |
| Banques / VC | a16z, Sequoia, Bessemer (Cloud Index), Stripe, Morgan Stanley, Goldman (notes publiques) |
| Think tanks & instituts | OECD, World Bank, IMF, INSEE, Eurostat, US Census, BLS |
| Régulateurs | textes officiels, consultations publiques, rapports annuels d'autorités |
| Médias tech/business | The Information, Sifted, TechCrunch, Axios Pro — pour les *signaux précoces* |

**Filtre de fraîcheur** : stat des **24–36 derniers mois** maximum. Au-delà, le signal est périmé pour un « pourquoi maintenant ».

---

## 2. Utiliser les outils de recherche

Trois outils complémentaires. Choisis selon le besoin.

### `web_search` — exploration large
- Lance **plusieurs requêtes d'angles différents** plutôt qu'une seule (variété > redondance).
- Pour une veille, alterne : *rapport + thème + année*, *statistique chiffrée + thème*, *« adoption » / « market size » + thème*, *tendances émergentes + thème*.
- Demande les **contenus complets** (`includeContent`) pour les pages pivots.

### `source_check` — vérifier une affirmation chiffrée
- À utiliser **systématiquement** sur les chiffres qui entrent dans le TAM ou le mémo (un seul chiffre faux décrédibilise tout le dossier).
- Renvoie un artefact avec citations passage par passage — parfait pour attacher la *bonne* source à la *bonne* stat.

### `fetch_content` — lire une page précise
- Quand tu as l'URL d'un rapport ou article et que tu veux extraire la stat exacte + sa formulation.

### Discipline de sourcing
- **Une stat = un lien + une date.** Pas de « selon plusieurs études » sans lien.
- Si tu ne trouves pas de source fiable pour un chiffre, **ne l'invente pas** : remplace-le par un encadrement (« entre X et Y, à confirmer ») ou un proxy sourcé, et marque la confiance **C**.
- Garde la **formulation d'origine** quand c'est possible (plus auditables que des reformulations).

---

## 3. Normaliser un signal

Chaque signal du Trend Radar suit ce schéma :

| Champ | Contenu |
|---|---|
| **Thème** | Domaine (ex. « automatisation back-office santé »). |
| **Signal / Stat clé** | L'énoncé chiffré, daté. |
| **Valeur** | Le chiffre brut (ex. « ×4 en 18 mois »). |
| **Période** | Année(s) couverte(s). |
| **Source** | Lien + nom de l'émetteur. |
| **Pourquoi maintenant** | En 1 phrase : qu'est-ce qui a *changé* récemment. |
| **Marchés impactés** | Segments verticaux/horizontaux touchés. |
| **Maturité (0–3)** | 0 = bruit / 3 = changement massif avéré. |
| **Confiance (A/B/C)** | Voir grille ci-dessous. |
| **Commentaire** | Biais, nuances, lien avec d'autres signaux. |

---

## 4. Grille de confiance A / B / C

| Note | Définition | Usage |
|---|---|---|
| **A** | Source primaire, méthodo publique, chiffre récent et vérifié croisé. | Piéce maîtresse du mémo et du TAM. |
| **B** | Source réputée mais estimation/secondaire, ou non recoupée. | Appui, à recouper. |
| **C** | Anecdote, article de presse unique, proxy, ou « à confirmer ». | Signal d'exploration ; jamais seul dans le TAM. |

Un dossier d'investissement crédible s'appuie à 80% sur du **A**. Si la majorité des chiffres pivots sont en **C**, c'est un signal que le travail de recherche n'est pas fini — dis-le à l'utilisateur.

---

## 5. Construire le Trend Radar (Étape A)

1. **Cadrage** : 1 thème large (ex. « outillage data pour PME industrielles ») ou « à découvrir » (alors pars de 2–3 macro-tendances et descends).
2. **Ratisse** : 4–8 requêtes `web_search` d'angles variés ; `fetch_content` sur les 3–5 meilleures pages.
3. **Extrait** : 15–25 stats brutes, normalisées selon le schéma ci-dessus.
4. **Filtre** : garde **10–20** changements (maturité ≥ 1, fraîcheur ≤ 36 mois).
5. **Produis** le tableau Markdown (+ JSON pour `master_output.trend_radar`).
6. **Résume** en 3–5 puces les 3 changements les plus massifs, et pointe les angles de gap à explorer en B.

### Gabarit Markdown du Trend Radar

```markdown
| Thème | Signal / Stat clé | Valeur | Période | Source | Pourquoi maintenant | Marchés impactés | Maturité (0–3) | Confiance |
|---|---|---|---|---|---|---|---|---|
| … | … | … | 2023→2025 | [McKinsey](url) | … | … | 3 | A |
```

---

## 6. Détection de gaps (Étape B)

Pour **chaque** signal retenu, documente :

1. **Solutions existantes (top 5)** — nom, positionnement, pricing public si dispo, limite principale.
2. **Limitations** — ce qu'aucune ne fait bien (le *gap*). Sois spécifique, pas générique (« mauvaise UX » ne suffit pas).
3. **Cadre réglementaire** — contraintes, certifications, données sensibles (RGPD/HIPAA/etc.). Source la régulation.
4. **Frictions d'adoption** — intégrations manquantes, dépendance à une compétence rare, coût de migration, lock-in.
5. **Catégories adjacentes** — solutions de contournement (Excel, prestataire, outil générique) qui révèlent le besoin *mal servi*.
6. **3 angles produit** — trois façons distinctes d'attaquer le gap (verticalisation, segment de prix, angle UX, angle data, etc.).

**Sortie** : un mini-brief par opportunité (½ page), qui alimentera la shortlist et le mémo. Score composite = 0,30 Changement + 0,30 Gap + 0,40 TAM (TAM calculé en Étape C — sinon, note Gap /10 en estimant).

> Conseil : à ce stade, ne tombe pas amoureux d'une piste. Conserve 3–5 opportunités en lice et laisse le scoring (avec le TAM réel) décider.
