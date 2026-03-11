# Skeleton Component - Guide d'Utilisation

## Vue d'ensemble
Le composant `SkeletonComponent` fournit des animations de chargement élégantes avec effet shimmer pour améliorer l'expérience utilisateur pendant les chargements de données.

## Import
```typescript
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';

@Component({
  // ...
  imports: [CommonModule, SkeletonComponent],
})
```

## Types de Skeletons

### 1. Card Skeleton
Pour les cartes de produits ou contenus avec image + texte.
```html
<app-skeleton type="card"></app-skeleton>
```

### 2. List Skeleton
Pour les items de liste avec avatar.
```html
<app-skeleton type="list"></app-skeleton>
```

### 3. Text Skeleton
Pour les lignes de texte simples.
```html
<app-skeleton type="text" width="80%"></app-skeleton>
```

### 4. Circle Skeleton
Pour les avatars ou icônes circulaires.
```html
<app-skeleton type="circle" [size]="48"></app-skeleton>
```

### 5. Rectangle Skeleton
Pour les blocs personnalisés.
```html
<app-skeleton type="rectangle" width="100%" height="200px"></app-skeleton>
```

## Paramètres (Input)

| Propriété | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `type` | `'card' \| 'list' \| 'text' \| 'circle' \| 'rectangle'` | `'card'` | Type de skeleton |
| `width` | `string` | `'100%'` | Largeur (CSS) |
| `height` | `string` | `'100px'` | Hauteur (CSS) |
| `size` | `number` | `48` | Taille pour type circle (px) |

## Exemples d'Utilisation

### Marketplace (Grid de produits)
```html
<div *ngIf="loading" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <app-skeleton *ngFor="let i of [1,2,3,4,5,6]" type="card"></app-skeleton>
</div>
```

### Messages (Liste de conversations)
```html
<div *ngIf="loading" class="space-y-2">
  <app-skeleton *ngFor="let i of [1,2,3,4,5]" type="list"></app-skeleton>
</div>
```

### Commandes (Blocs rectangulaires)
```html
<div *ngIf="loading" class="space-y-4">
  <app-skeleton *ngFor="let i of [1,2,3]" type="rectangle" width="100%" height="200px"></app-skeleton>
</div>
```

### Profil (Texte personnalisé)
```html
<div *ngIf="loading">
  <app-skeleton type="circle" [size]="80"></app-skeleton>
  <app-skeleton type="text" width="60%"></app-skeleton>
  <app-skeleton type="text" width="80%"></app-skeleton>
</div>
```

## Animation
Le composant utilise une animation **shimmer** avec un dégradé linéaire qui se déplace de gauche à droite:
- Durée: 1.5s
- Type: infinite linear
- Couleurs: #e0e0e0 → #f0f0f0 → #e0e0e0

## Intégrations Actuelles

✅ **MarketplaceComponent** - 6 card skeletons  
✅ **MessagesComponent** - 5 list skeletons  
✅ **OrderTrackingComponent** - 3 rectangle skeletons  
✅ **FarmerDashboardComponent** - 6 card skeletons

## Bonnes Pratiques

1. **Nombre d'éléments**: Affichez le même nombre de skeletons que le nombre d'items attendus
2. **Dimensions**: Utilisez les mêmes dimensions que les éléments réels
3. **Layout**: Conservez la même disposition (grid, flex, etc.)
4. **Transition**: Remplacez `loading` par les données réelles dès réception

## Style
Les skeletons sont conçus pour:
- S'adapter automatiquement au conteneur parent
- Avoir un aspect moderne avec bordures arrondies
- Fournir un feedback visuel fluide pendant le chargement
