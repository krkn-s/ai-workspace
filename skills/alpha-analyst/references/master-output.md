# master_output — Schéma JSON & glossaire

Le JSON `master_output` est le **dépôt structuré** de toutes les tables et calculs d'un run complet. Il permet de réutiliser les résultats dans un tableur, un outil, ou de comparer plusieurs pistes d'une itération à l'autre.

## Règles
- Clés **normalisées** (snake_case, noms stables d'une exécution à l'autre).
- Chaque valeur chiffrée s'accompagne, quand c'est pertinent, de sa **source** (`_source`) et de sa **confiance** (`_confidence`: A/B/C).
- Produis `master_output` à la fin d'un **run guidé complet**, et sur demande en **mode menu** (alors ne remplis que la slice concernée).
- Pour les chiffres : **valeur + formule + source**. Ex. : `"tam": 430000000, "tam_formule": "120000 * 3588", "tam_source": "url"`.

## Schéma complet

```json
{
  "meta": {
    "marche_cible": "",
    "zone_geo": "",
    "type_produit": "SaaS",
    "prix_mensuel_cible": "99-499",
    "date_run": ""
  },
  "trend_radar": [
    {
      "theme": "",
      "signal": "",
      "valeur": "",
      "periode": "",
      "source": "",
      "pourquoi_maintenant": "",
      "marches_impactes": [],
      "maturite_0_3": 0,
      "confidence": "A|B|C",
      "commentaire": ""
    }
  ],
  "shortlist_top5": [
    {
      "opportunite": "",
      "score_total": 0,
      "score_changement": 0,
      "score_gap": 0,
      "score_tam": 0,
      "note": ""
    }
  ],
  "memo_investissement": {
    "probleme": "",
    "pourquoi_maintenant": "",
    "persona": "",
    "solution_mvp": "",
    "tam": {
      "hypotheses": "",
      "formule": "",
      "scenarios": { "prudent": 0, "base": 0, "ambitieux": 0 },
      "source": ""
    },
    "sam": { "formule": "", "valeur": 0 },
    "som": { "formule": "", "valeur": 0 },
    "unit_economics": {
      "arpu": 0,
      "marge_brute_pct": 0,
      "cac_experimental": 0,
      "ltv": 0,
      "ltv_sur_cac": 0,
      "payback_mois": 0
    },
    "risques": [],
    "mitigations": [],
    "feuille_de_route_90j": []
  },
  "modele_haut_levier": {
    "recurrence": true,
    "marge_brute_pct": 0.70,
    "scalabilite_techno": true,
    "propriete_produit": true,
    "pricing": { "mensuel": 299, "packaging": [] },
    "couts": { "variable_unitaire": 20 },
    "sensibilite": []
  },
  "what_how_who": {
    "what": "",
    "how": [],
    "who": { "pourquoi_nous": "", "preuves": [] }
  },
  "cab_plan": {
    "icp": "",
    "liste_type_comptes": [],
    "cadence_jours": 14,
    "scripts": { "outreach": "", "invitation": "", "loi": "" },
    "objectif_loi": 10,
    "loi_signees": 0,
    "wtp_median": 0
  },
  "mvp_black_car": {
    "promesse": "",
    "feature_centrale": "",
    "build_semaines": 0,
    "stories": [],
    "criteres_acceptation": [],
    "non_objectifs": [],
    "integrations_minimales": []
  },
  "lean_loop": {
    "hypotheses": [],
    "tests": [],
    "seuils": {},
    "decisions_go_kill_iterate": []
  },
  "pizza_squad": [
    { "role": "", "responsabilites": "", "okr_90j": [] }
  ],
  "roadmap_12m": [
    { "phase": "", "mois": "1-3", "jalons": [], "kpi": [] }
  ],
  "decision_go_no_go": {
    "decision": "Go|No-Go|Repositionner",
    "critères": {
      "tam_ge_1md": true,
      "dix_loi_avec_wtp": false,
      "marge_ge_70": true,
      "acquisition_2_canaux": false,
      "risque_reglementaire_maitrise": true
    },
    "raison": ""
  },
  "annexes": {
    "bibliographie": [],
    "glossaire": {},
    "tableur_calculs": {}
  }
}
```

## Glossaire

- **TAM** — Total Addressable Market : marché total théorique (#clients potentiels × prix annuel).
- **SAM** — Serviceable Addressable Market : part du TAM réalistement servable.
- **SOM** — Serviceable Obtainable Market : part capturable en 3–5 ans.
- **ICP** — Ideal Customer Profile : description du client idéal (secteur, taille, rôle, déclencheur).
- **CAB** — Customer Advisory Board : panel de design partners qui co-construit le produit.
- **LOI** — Letter of Intent : lettre d'intention non engageante (ici, remise contre usage/feedback/référence).
- **WTP** — Willingness to Pay : consentement à payer réel (validé par LOI/pré-vente, pas par sondage).
- **MVP Black Car** — produit minimal ultra-focalisé sur une promesse unique.
- **CAC** — Customer Acquisition Cost : coût d'acquisition d'un client.
- **LTV** — Lifetime Value : valeur nette d'un client sur sa durée de vie.
- **ARR** — Annual Recurring Revenue : revenu récurrent annuel.
- **ARPU** — Average Revenue Per User : revenu moyen par utilisateur.
- **Pizza Squad** — équipe ≤ 8 personnes jusqu'à 1 M$ ARR.
- **Triade d'influence** — pairs / mentors / héros (réseau de validation).
