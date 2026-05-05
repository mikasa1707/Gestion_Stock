import { Routes } from '@angular/router';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login').then((m) => m.Login),
  },
  {
    path: '',
    component: AdminLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'articles',
        loadComponent: () => import('./pages/articles/articles/articles').then((m) => m.Articles),
      },
      {
        path: 'fiches-techniques',
        loadComponent: () =>
          import('./pages/fiches-techniques/fiches-techniques/fiches-techniques').then(
            (m) => m.FichesTechniques,
          ),
      },
      {
        path: 'fournisseurs',
        loadComponent: () =>
          import('./pages/fournisseurs/fournisseurs').then(
            (m) => m.Fournisseurs,
          ),
      },
      {
        path: 'stock',
        loadComponent: () => import('./pages/stock/stock/stock').then((m) => m.Stock),
      },
      {
        path: 'achats',
        loadComponent: () => import('./pages/achats/achats/achats').then((m) => m.Achats),
      },
      {
        path: 'ventes',
        loadComponent: () => import('./pages/ventes/ventes').then((m) => m.Ventes),
      },
      {
        path: 'inventaires',
        loadComponent: () =>
          import('./pages/inventaires/inventaires').then((m) => m.Inventaires),
      },
      {
        path: 'transferts',
        loadComponent: () =>
          import('./pages/transferts/transferts').then((m) => m.Transferts),
      },
      {
        path: 'stockage',
        loadComponent: () => import('./pages/stockage/stockage').then((m) => m.Stockage),
      },
      {
        path: 'unites',
        loadComponent: () => import('./pages/unites/unites').then((m) => m.Unites),
      },
      {
        path: 'familles',
        loadComponent: () => import('./pages/familles/familles').then((m) => m.Familles),
      },
      {
        path: 'allergenes',
        loadComponent: () => import('./pages/allergenes/allergenes').then((m) => m.Allergenes),
      },
      {
        path: 'parametres',
        loadComponent: () =>
          import('./pages/parametres/parametres').then((m) => m.Parametres),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
