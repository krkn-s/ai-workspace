# Frameworks Alpha-Analyst

Les 8 cadres qui filtrent et structurent tout le travail. Chacun explique **pourquoi** il compte et **comment** l'appliquer concrètement.

## Table des matières
1. Changement → Gap → Taille de marché
2. Modèle haut levier
3. What–How–Who
4. Lean Learning Loop
5. Pré-vente par Customer Advisory Board (CAB)
6. MVP « Black Car »
7. Pizza Squad
8. Triade d'influence

---

## 1. Changement → Gap → Taille de marché (≥ 1 Md$)

**Pourquoi.** Les meilleures opportunités naissent d'un *changement récent* (techno, régulation, démographie, comportement) qui ouvre un *écart* entre ce que les gens veulent et ce qui existe. Un changement sans écart ne crée pas d'entreprise ; un écart sur un petit marché ne paie pas l'effort.

**Comment.** Chaîne les trois filtres, dans l'ordre :

1. **Changement** — un fait daté et mesurable (≤ 36 mois). Ex. « part de l'IA générative dans les process back-office × 4 en 18 mois ». Source obligatoire.
2. **Gap** — qu'est-ce qui manque *maintenant* ? Cartographie les solutions existantes (top 5) et leurs limites. Le gap doit être **récurrent et douloureux**, pas anecdotique.
3. **Taille de marché** — TAM ≥ 1 Md$ (voir `market-sizing.md`). Sinon, élimine ou repositionne (verticaliser, monter en prix, élargir la géo).

**Score composite pour la shortlist (Top 5)** : `score_total = 0,30 × Changement + 0,30 × Gap + 0,40 × TAM`, chacun noté /10. Le TAM pèse le plus lourd car un grand marché pardonne beaucoup d'erreurs d'exécution.

---

## 2. Modèle haut levier

**Pourquoi.** Un modèle à fort levier transforme un effort constant en valeur qui scale sans proportionnalité. C'est ce qui sépare une « bonne idée » d'un *business* défendable et financièrement attractif.

**Comment.** Les 4 critères à vérifier (idéalement les 4 présents) :

- **Récurrence** : revenus récurrents (SaaS, abonnement, usage). Un chiffre d'affaires qui se renouvelle chaque mois sans revente coûteuse.
- **Marge brute ≥ 70%** : le coût variable de servir un client supplémentaire doit être faible. Si la marge est < 70% aux petits volumes, ça ne s'améliorera pas magiquement.
- **Scalabilité par la techno** : un produit logiciel (code, data, IA) dont le coût marginal tend vers 0. Les services humains ne scalent pas.
- **Propriété du produit** : tu contrôles la roadmap, la marque, les données. Pas de dépendance fatale à une marketplace ou un intermédiaire.

**Sortie attendue** : tableau de sensibilité marge vs volume, pricing, packaging, coûts variables unitaires.

---

## 3. What–How–Who

**Pourquoi.** Tout message (pitch, landing, deck, cold email) s'effondre si l'un des trois manque. Ce cadre force une clarté radicale avant d'écrire la moindre accroche.

**Comment.**

- **What** — le *résultat désiré* en une seule phrase, du point de vue du client (« Vos factures fournisseurs saisies et lettrées sans saisie manuelle »). Pas une *fonctionnalité*, un *résultat*.
- **How** — la *mécanique crédible* qui rend la promesse plausible, appuyée sur **3 preuves** : une démo/visuel, une étude ou donnée, un pilote ou témoignage. Sans preuve, le What est une affirmation en l'air.
- **Who** — *pourquoi toi, maintenant* : crédits (équipe, expérience, traction), tarifs, SLA, témoignages attendus. Répond à « pourquoi vous plutôt que l'incumbent ou le statu quo ? ».

Le deck 6 slides et la landing hero sont des applications directes de ce cadre (voir `execution-kits.md`).

---

## 4. Lean Learning Loop

**Pourquoi.** La plupart des startups meurent en construisant quelque chose que personne ne veut. La boucle lean remplace l'opinion par des **données** recueillies au coût le plus bas possible, et accélère la décision.

**Comment.** Boucle courte, répétée :

1. **Hypothèse** — une croyance risquée et falsifiable, formulée ainsi : « Si [action], alors [résultat mesurable], parce que [raison]. » Priorise par risque × impact.
2. **Test le plus lean possible** — par ordre de coût croissant : *faux bouton* / *smoke test* → landing + waitlist → maquette cliquable → offre concierge → offre payante remboursée. Choisis toujours le plus cheap qui répond à la question.
3. **Données** — métriques seuils définies *avant* le test (CTR, RSVP, taux de réponse, % LOI, CAC expérimental, willingness-to-pay).
4. **Décision** — **Go** (le signal valide, on investit), **Kill** (le signal infirme, on abandonne cette piste), **Iterate** (signal partiel, on ajuste l'hypothèse ou le test).

**Règle d'or** : si un test plus lean existe pour répondre à la même question, tu ne fais pas le test plus cher.

---

## 5. Pré-vente par Customer Advisory Board (CAB)

**Pourquoi.** Vendre *avant* de construire est le meilleur signal qui existe — bien meilleur qu'un sondage ou un « ça m'intéresse ». Le CAB transforme des prospects en design partners, et la LOI cristallise un engagement réel (remise contre usage/feedback/référence).

**Comment.**

- **ICP** (Ideal Customer Profile) : secteur, taille, géo, rôles acheteurs, déclencheurs d'achat.
- **Liste type** : 30–50 comptes correspondant à l'ICP, avec les bons rôles identifiés.
- **Cadence 14 jours** : outreach (demande d'entretien humble) → entretien (problème d'abord, solution jamais) → invitation CAB → LOI. Voir les scripts dans `execution-kits.md`.
- **LOI non engageante** : remise à vie **50–70%**, contre usage régulier, feedback structuré, et référence/cas client. Ce n'est pas un contrat payant, c'est un *engagement d'intention*.
- **Objectif** : **10 LOI signées** avant d'écrire la première ligne de code de production.

Les LOI ne valent rien sans un **WTP** (willingness-to-pay) cohérent avec le pricing cible : une LOI à -90% sur un produit que personne ne payerait plein tarif est un faux signal.

---

## 6. MVP « Black Car »

**Pourquoi.** Nommé d'après le principe « une seule chose, exécutée à fond ». Un MVP qui tente de tout faire rate tout ; un MVP ultra-focalisé démontre une promesse et génère un vrai signal.

**Comment.**

- **Une seule promesse** — le résultat unique que l'utilisateur obtient.
- **Une seule fonctionnalité centrale** — tout le reste est exclu (explicitement listé en non-objectifs).
- **3–5 user stories** au format « En tant que X, je veux Y, afin de Z ».
- **Critères d'acceptation** mesurables par story.
- **Plan build 2–6 semaines**, intégrations minimales (pas de « on verra plus tard », mais pas de forteresse non plus).

Le périmètre du Black Car se déduit de la promesse What du cadre 3.

---

## 7. Pizza Squad (≤ 8 jusqu'à 1 M$ ARR)

**Pourquoi.** Une petite équipe ultra-alignée avance plus vite qu'une grande équipe coordonnée. La règle « deux pizzas » (équipe qu'on nourrit avec deux pizzas) force la concentration et évite l'embauche prématurée, principal tueur de trésorerie.

**Comment.**

- **Rôles initiaux** typiques : Founder/PM, Engineering, Design, Sales, Customer Success, Ops/RevOps — un humain peut porter plusieurs rôles.
- **OKR 90 jours** : 3–4 Objectifs, 3–4 Key Results mesurables chacun. Pas plus.
- **Rituels** : hebdo build (avancement produit), hebdo pipeline (CAB/ventes), rétro courte.
- **Plafond** : **ne pas dépasser 8 personnes avant 1 M$ ARR**. Au-delà, on embauche de la coordination, pas de la création.

---

## 8. Triade d'influence

**Pourquoi.** Construire seul est fragile. Trois types de relations accélèrent la crédibilité, l'apprentissage et la distribution.

**Comment.** Identifie et entretiens, pour le domaine visé :

- **Pairs** — fondateurs au même stade, avec qui échanger franchement (traction, erreurs, pricing).
- **Mentors** — opérateurs 2–5 ans d'avance, qui ont déjà résolu ton problème actuel.
- **Héros** — figures de référence dont la crédibilité peut, à terme, parrainer/préfacier/ouvrir des doors.

La triade nourrit le « Who » (cadre 3) et le réseau d'outreach du CAB (cadre 5).
