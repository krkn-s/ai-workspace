# skills

Collection personnelle de skills pour Codex et autres agents compatibles avec le format `SKILL.md`.

Le repo est organise pour accueillir plusieurs skills :

```text
skills/
  seo-aeo-content/
    SKILL.md
    agents/openai.yaml
    references/
```

## Skills disponibles

### `seo-aeo-content`

Workflow SEO/AEO pour creer et ameliorer des contenus visibles dans les moteurs de recherche et les moteurs de reponse.

Cas d'usage :

- brief SEO/AEO ;
- audit de page ou d'article ;
- structure de landing page ;
- plan editorial ;
- optimisation d'article ;
- checklist de publication ;
- strategie AEO, citations et mentions de marque.

## Installation

### Avec `skills`

Installation globale pour Codex :

```bash
npx skills add https://github.com/<owner>/skills --skill seo-aeo-content -a codex -g
```

Installation depuis le dossier direct du skill :

```bash
npx skills add https://github.com/<owner>/skills/tree/main/skills/seo-aeo-content -a codex -g
```

Remplacer `<owner>` par le compte ou l'organisation GitHub qui hebergera ce repo.

### Avec Codex

Dans Codex, demander :

```text
Use $skill-installer to install https://github.com/<owner>/skills/tree/main/skills/seo-aeo-content
```

## Exemple d'utilisation

```text
Use $seo-aeo-content to create a SEO/AEO content brief for "answer engine optimization for B2B SaaS".
```

```text
Use $seo-aeo-content to audit this article for SEO, AEO, intent match, and citation-worthiness.
```

## Publication GitHub avec `gh`

Ce repo est destine a etre publie sous le nom `skills`.

Avant publication publique, ne pas pousser les transcriptions brutes du dossier local `Sources/`. Elles sont ignorees par Git dans la version publique, mais si elles existent dans l'historique local, il faut publier depuis un historique propre.

### Option recommandee : creer un repo public propre depuis un export

Depuis ce dossier :

```bash
mkdir -p /tmp/skills-public
rsync -av --exclude='.git' --exclude='.DS_Store' --exclude='Sources' ./ /tmp/skills-public/
cd /tmp/skills-public
git init
git add .
git commit -m "Initial public skills repository"
gh repo create skills --public --source=. --remote=origin
git push -u origin main
```

Cette option evite de publier l'historique local contenant les sources brutes.

### Option si le repo GitHub existe deja

```bash
cd /tmp/skills-public
git remote add origin git@github.com:<owner>/skills.git
git push -u origin main
```

## Soumission a skills.sh / agentskill.sh

Une fois le repo GitHub public :

1. Aller sur la page de soumission de `skills.sh` ou `agentskill.sh`.
2. Coller l'URL du repo ou du skill :

   ```text
   https://github.com/<owner>/skills/tree/main/skills/seo-aeo-content
   ```

3. Connecter GitHub pour verifier la propriete du repo si demande.
4. Ajouter le webhook GitHub si la plateforme le propose pour synchroniser les mises a jour plus vite.

## Licence

Ce repo utilise la licence MIT.

Pourquoi MIT :

- simple et largement comprise ;
- compatible avec un usage personnel, commercial et open source ;
- facile a reutiliser, forker, modifier et redistribuer ;
- adaptee a une collection de skills que d'autres personnes peuvent installer et adapter.

MIT est volontairement peu contraignante. Si un futur skill contient du code plus sensible, des dependances complexes ou des enjeux de brevets, Apache-2.0 pourra etre reevaluee pour ce skill ou pour un repo dedie.
