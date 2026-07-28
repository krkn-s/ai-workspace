# Execution Kits — Étapes E à J + templates

Ce fichier contient les **méthodes** (E à J) et les **gabarits prêts à copier-coller** (emails, LOI, landing, deck, MVP, lean, pizza squad, roadmap). Adapte toujours au contexte de l'utilisateur ; ces gabarits sont des points de départ, pas du texte sacré.

## Table des matières
- E. What–How–Who
- F. Pré-vente CAB (scripts + LOI)
- G. MVP « Black Car »
- H. Lean Learning Loop
- I. Pizza Squad & OKR
- J. Roadmap 0→1M ARR & risques
- Kit GTM (landing, deck, séquence email)

---

## E. What–How–Who

Produis ce triplet *avant* tout matériel de vente. Il alimente la landing, le deck, le cold email.

- **What** (résultat, 1 phrase) : « {Persona} obtiennent {résultat désiré} sans {douleur actuelle}. »
- **How** (mécanique + 3 preuves) : la méthode, puis : ① démo/visuel, ② donnée/étude, ③ pilote/témoignage.
- **Who** (pourquoi nous) : crédits équipe, traction, tarifs, SLA, témoignages attendus.

**Anti-pattern** : un What qui décrit une fonctionnalité (« une plateforme qui… ») au lieu d'un résultat. Reformule en bénéfice mesurable.

---

## F. Pré-vente CAB (objectif : 10 LOI)

### F.1 ICP & liste type
- **ICP** : secteur(s), taille d'entreprise, géo, rôles acheteurs (titre exact), déclencheur d'achat (event qui crée le besoin).
- **Liste type** : 30–50 comptes, avec pour chacun le bon contact et un angle d'entrée.

### F.2 Cadence 14 jours
| Jour | Action | Canal |
|---|---|---|
| 1 | Email outreach (demande d'entretien humble) | Email |
| 3 | Relance légère | Email |
| 5 | Vue / interaction LinkedIn | Social |
| 7 | Entretien problème (jamais la solution) | Visio 30 min |
| 9 | Partage synthèse + invitation CAB | Email |
| 11–13 | Négociation LOI (remise contre feedback/référence) | Email |
| 14 | LOI signée | Email |

### F.3 Script — Email d'outreach #1 (≤ 100 mots)
> **Objet** : question rapide sur {sujet métier concret}
>
> Bonjour {Prénom},
>
> Je travaille avec des {rôle} dans le {secteur} et j'essaie de comprendre comment vous gérez {problème} aujourd'hui. Je ne vends rien — je cherche juste à apprendre de gens qui vivent ça au quotidien.
>
> Accepteriez-vous **20–30 min** cette semaine ou la prochaine ? En échange je partagerai ce que j'entends des autres {rôle} (anonymisé).
>
> Merci d'avance,
> {Signature}

### F.4 Script — Invitation CAB
> Bonjour {Prénom},
>
> Merci pour l'échange. Je lance un petit **Customer Advisory Board** (≈ 10 personnes) pour construire {solution} *avec* ses futurs utilisateurs, pas pour eux.
>
> En tant que membre : vous **co-décidez** les priorités, vous bénéficiez d'une **remise à vie de 50–70%**, et votre retour façonne le produit. En contrepartie : usage régulier, feedback structuré (~30 min/mois), et une référence/cas client quand ça roule.
>
> Ça vous dirait ? Je vous envoie la fiche CAB + lettre d'intention si oui.

### F.5 Modèle — LOI non engageante (remise 70%)
> **Lettre d'intention — Customer Advisory Board**
>
> Entre {Entreprise} (« Design Partner ») et {Votre société} (« Éditeur »).
>
> **Objet.** Le Design Partner exprime son intention d'utiliser et de soutenir le développement de {produit}, selon les termes ci-dessous. Le présent document n'est **pas un contrat de vente** et n'oblige aucune partie à un paiement.
>
> 1. **Engagement du Design Partner** : utiliser {produit} en conditions réelles, fournir un feedback structuré (≈ 30 min/mois), et accepter d'être cité comme référence / cas client une fois le résultat atteint.
> 2. **Contrepartie de l'Éditeur** : **remise à vie de 70%** sur le tarif public, appliquée dès la commercialisation ; priorité sur le roadmap et le support.
> 3. **Durée** : 12 mois renouvelable par accord commun.
> 4. **Confidentialité & données** : l'Éditeur protège les données du Design Partner conforme aux régulations applicables (ex. RGPD) ; NDA signé séparément si nécessaire.
> 5. **Non-exclusivité & résiliation** : non-exclusif ; résiliable à tout moment par notification écrite.
>
> Lu et approuvé :
> {Nom, Titre, Date} — {Nom, Titre, Date}

> Rappel garde-fou : **ne pas construire avant 10 LOI** signées, avec un WTP cohérent avec le pricing cible (une LOI à -90% sur un produit impayable plein tarif est un faux signal).

---

## G. MVP « Black Car »

### Gabarit de spécification
```markdown
## MVP Black Car — {produit}

**Promesse** : {un résultat unique, 1 phrase}
**Fonctionnalité centrale** : {la seule chose qu'on construit}
**Build** : {2–6 semaines}

### User stories (3–5)
1. En tant que {rôle}, je veux {action}, afin de {bénéfice}. [Critères d'acceptation : …]
2. …

### Non-objectifs (exclu explicitement)
- …
- …

### Intégrations minimales
- …
```

**Règle de coupe** : si une story ne sert pas *directement* la promesse, elle devient un non-objectif.

---

## H. Lean Learning Loop

### Tableau d'expériences (S1 → S6)
```markdown
| Sem. | Hypothèse (Si… alors…) | Test (le + lean) | Seuil Go/Kill | Coût | Statut |
|---|---|---|---|---|---|
| S1 | Si on promet X, alors ≥5% CTR | Faux bouton + landing | CTR ≥ 5% | 0€ | — |
| S2 | … | Waitlist + RSVP | RSVP ≥ 20 | 0€ | — |
| S3 | … | Maquette cliquable | … | … | — |
| S4 | … | Offre concierge | … | … | — |
| S5 | … | Prévente remboursée | WTP confirmé | … | — |
| S6 | … | LOI | 10 LOI | … | — |
```

### Tests du plus cheap au plus cher
1. **Faux bouton / smoke test** — mesurer l'intérêt avant d'exister.
2. **Landing + waitlist** — capturer l'intention (email).
3. **Maquette cliquable** — valider l'usage présumé.
4. **Offre concierge** — faire le job manuellement, facturer l'outcome.
5. **Pré-vente remboursée / dépôt** — argent réel = signal max.

**Décision** : Go (investir) / Kill (abandonner) / Iterate (ajuster). Toujours noter le seuil *avant* le test.

---

## I. Pizza Squad & OKR

### Rôles initiaux (≤ 8)
```markdown
| Rôle | Responsabilités | OKR 90 j |
|---|---|---|
| Founder / PM | vision, priorisation, CAB | 10 LOI ; 1 mémo validé |
| Engineering | produit (Black Car) | MVP livré ; 0 bug bloquant |
| Design | UX, landing | landing convertit ≥ X% |
| Sales / GTM | pipeline CAB | 50 comptes qualifiés |
| Customer Success | onboarding design partners | NPS pilote ≥ 8 |
| Ops / RevOps | data, process, finance | dashboard KPI live |
```
Un humain = plusieurs rôles au début. **Plafond : 8 personnes avant 1 M$ ARR.**

### OKR 90 jours (max 3–4 objectifs)
- **O1 — Validation** : KR1 = 10 LOI signées ; KR2 = WTP médian ≥ {prix base}.
- **O2 — Produit** : KR1 = MVP Black Car en pilote ; KR2 = ≥ 3 design partners actifs.
- **O3 — Marché** : KR1 = TAM sourcé validé ; KR2 = 2 canaux d'acquisition testés.

### Rituels
- Hebdo build (avancement produit), hebdo pipeline (CAB/ventes), rétro courte mensuelle.

---

## J. Roadmap 0→1M ARR & risques

```markdown
| Phase | Mois | Jalons | KPI |
|---|---|---|---|
| Validation | 1–3 | Veille, gaps, 10 LOI, MVP Black Car | 10 LOI ; TAM ≥ 1 Md$ |
| Premiers revenus | 4–6 | 10 design partners → 20 payants | ARR ≥ 100 k$ ; payback ≤ 12 m |
| Industrialisation | 7–12 | Acquisition + CS systématisés | ARR → 1 M$ ; LTV/CAC ≥ 3 |
```

### Risques & mitigations (à produire)
```markdown
| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| {ex. adoption lente} | … | … | {test lean préalable} |
| {ex. régulation} | … | … | {audit + plan conformité} |
```

---

## Kit GTM (prêt à l'emploi)

### Landing hero
```markdown
**H1** : {What — résultat désiré, 1 phrase}
**Sous-titre** : {Who cible} obtiennent {bénéfice} grâce à {How — mécanique}.
**3 bénéfices** :
- {bénéfice 1, chiffré si possible}
- {bénéfice 2}
- {bénéfice 3}
**Preuve** : {1 stat sourcée ou 1 témoignage attendu}
**CTA** : {Rejoindre le CAB / Essai / Démo}
```

### Séquence email (4 touches)
1. **Outreach** — voir F.3.
2. **Valeur** — partage 1 insight issu des entretiens (anonymisé).
3. **Preuve sociale** — mention d'un autre design partner / résultat.
4. **CTA doux** — invitation CAB ou démo, sans pression.

### Deck 6 slides (mappé What–How–Who)
1. **Titre + promesse** (What).
2. **Problème / pourquoi maintenant** (changement sourcé).
3. **Solution & démo** (How + preuve).
5. **Marché** (TAM/SAM/SOM + scénarios).
6. **Modèle & traction** (pricing, unit economics, LOI).
7. **Équipe & ask** (Who + ce que tu cherches).

> À la fin de tout run guidé complet, produis le JSON `master_output` (voir `master-output.md`).
