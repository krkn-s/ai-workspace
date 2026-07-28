# Market Sizing & Modèle Haut Levier — Étapes C & D

Comment calculer une taille de marché **défendable et reproductible**, valider le seuil ≥ 1 Md$, puis vérifier le modèle à fort levier.

## Table des matières
1. Méthode TAM/SAM/SOM
2. Trois scénarios (Prudent / Base / Ambitieux)
3. Règle du seuil ≥ 1 Md$
4. Sources pour #clients et prix
5. Modèle haut levier : 4 contrôles
6. Pricing, packaging, sensibilité

---

## 1. Méthode TAM/SAM/SOM

- **TAM** (Total Addressable Market) — tout le chiffre d'affaires *théorique* si 100% du marché éligible achetait. `TAM = #clients potentiels × prix annuel`.
- **SAM** (Serviceable Addressable Market) — la part du TAM que tu peux *réalistiquement* servir (géo, segment, langue, capacité de vente).
- **SOM** (Serviceable Obtainable Market) — ce que tu peux *réellement* capturer en 3–5 ans (ta part de marché gagnable, 1–10% du SAM typiquement pour un nouvel entrant).

**Toujours bottom-up, jamais top-down seul.** « Le marché X fait 10 Md$ donc 1% = 100 M$ » n'est pas un calcul, c'est un vœu. Construis :

```
#clients potentiels = population_de_référence × % éligibles (segment, taille, géo)
prix annuel = prix mensuel × 12   (ou prix transactionnel × fréquence)
TAM = #clients potentiels × prix annuel
```

Chaque terme doit avoir une source ou un raisonnement explicite.

---

## 2. Trois scénarios (Prudent / Base / Ambitieux)

Varie **un seul** levier à la fois (le #clients ou le prix, pas les deux simultanément, sauf si justifié) et donne 3 fourchettes :

| Scénario | Hypothèse | #clients | Prix/an | TAM |
|---|---|---|---|---|
| Prudent | segment strict, prix bas | … | … | … |
| Base | segment raisonnable, prix cible | … | … | … |
| Ambitieux | segment élargi, prix premium | … | … | … |

**Le seuil ≥ 1 Md$ doit être tenu au moins en scénario Base.** S'il ne l'est qu'en Ambitieux, c'est un signal faible — repositionne (élargis la géo, monte en prix, ajoute un segment).

---

## 3. Règle du seuil ≥ 1 Md$

- TAM **Base ≥ 1 Md$** → ok, continue.
- TAM **Base < 1 Md$ mais Ambitieux ≥ 1 Md$** → repositionne ou verticalise-plus avant d'investir.
- TAM **< 1 Md$ dans tous les scénarios** → **élimine** ou pivote vers un segment adjacent plus grand.

Le seuil existe parce qu'un petit marché ne paie pas le risque, l'équipe et le temps — même avec une exécution parfaite.

---

## 4. Sources pour #clients et prix

- **#clients** : registres d'entreprises (INSEE, Sirene, US Census, Eurostat), bases sectorielles (fédérations professionnelles), rapports de cabinets (segmentation par taille/secteur).
- **Prix** : pricing public des concurrents, études de willingness-to-pay, benchmarks SaaS (OpenView, SaaS Capital), LOI / entretiens CAB (le *vrai* signal de prix).
- **Proxy autorisé** : si pas de source directe, encadre (ex. « entre 50 et 200 €/mois selon les concurrents ») et marque la confiance.

---

## 5. Modèle haut levier : 4 contrôles

Pour chaque opportunité, note Oui/Non + justification :

| Critère | Question | Seuil |
|---|---|---|
| **Récurrence** | Le revenu se renouvelle-t-il sans revente coûteuse ? | Abonnement / usage récurrent |
| **Marge brute ≥ 70%** | Le coût variable par client est-il faible ? | ≥ 70% aux volumes initiaux |
| **Scalabilité techno** | Le produit est-il logiciel (code/data/IA) ? | Coût marginal ≈ 0 |
| **Propriété du produit** | Contrôles-tu roadmap, marque, données ? | Pas de dépendance fatale |

Un « Non » sur la récurrence ou la marge est rédhibitoire pour un modèle « haut levier ». Un « Non » sur scalabilité ou propriété est un sujet de repositionnement.

---

## 6. Pricing, packaging, sensibilité

### Pricing
- Ancrage sur la **valeur créée** (€ gagnés ou économisés pour le client), pas sur le coût.
- Bande cible par défaut : **99–499 $/mois** (SaaS B2B mid-market) — ajustable selon les paramètres.
- Vérifier la cohérence avec le **WTP** révélé par les LOI/CAB.

### Packaging
- 2–3 offres (Solo / Team / Enterprise), une **version gratuite ou essai** pour réduire la friction d'entrée, un point d'ancrage premium.
- Métrique de facturation alignée sur la valeur (sièges, volume, résultats).

### Table de sensibilité (à produire)

```markdown
| Volume clients | 100 | 500 | 2 000 |
|---|---|---|---|
| Revenu annuel | … | … | … |
| Coût variable total | … | … | … |
| Marge brute % | … | … | … |
```

Valide que la **marge brute ≥ 70%** tient dès 100 clients. Si elle ne passe 70% qu'à 2 000 clients, le modèle est fragile.

### Unit economics à modéliser
- **CAC** expérimental (par canal).
- **LTV** = (ARPU × marge brute) / churn mensuel.
- **Ratio LTV/CAC ≥ 3**, **payback ≤ 12 mois** (cibles saines pour du bootstrapped/SaaS early-stage).
