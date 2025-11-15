import { Routes } from '@angular/router';
import {LayoutComponent} from '@Global/layout/component';

export const routes: Routes = [
  { path: '', component: LayoutComponent, children: [
      { path: 'main',
        loadComponent: () => import('./main/main.component').then(value => value.MainComponent),
      },
      {
        path: 'about',
        loadComponent: () => import('./global/foundation/component')
          .then(value => value.AboutProjectComponent),
      },
      { path: 'settings',
        loadComponent: () => import('./settings/local/component')
          .then(value => value.LocalSettingsComponent),
      },
      {path: '', redirectTo: 'main', pathMatch: 'full'},
    ]
  },
  {path: '', redirectTo: 'main', pathMatch: 'full'},
  {path: '**', redirectTo: 'main'},
];
