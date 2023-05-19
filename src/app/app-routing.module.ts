import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';

import { HomeComponent } from './_core/components/home/home.component';
import { LoginComponent } from './_core/components/login/login.component';
import { PreloadStrategyService } from './preload-strategy.service';
import { SignupComponent } from './_core/components/signup/signup.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      { path: 'login', component: LoginComponent, title: 'Login' },
      { path: 'signup', component: SignupComponent, title: 'Signup' },
      { path: '', loadChildren: () => import('./results/results.module').then(m => m.ResultsModule) },
      { path: 'leaderboard', loadChildren: () => import('./leaderboard/leaderboard.module').then(m => m.LeaderboardModule) },
      { path: 'teams', loadChildren: () => import('./teams/teams.module').then(m => m.TeamsModule)  },
      { path: 'players', loadChildren: () => import('./players/players.module').then(m => m.PlayersModule)  },
      { path: 'calcutta', loadChildren: () => import('./calcutta/calcutta.module').then(m => m.CalcuttaModule)  },
      { path: 'rules', loadChildren: () => import('./rules/rules.module').then(m => m.RulesModule)  },
      { path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule), },
      { path: 'winners-circle', loadChildren: () => import('./winners-circle/winners-circle.module').then(m => m.WinnersCircleModule), },

      /*data: { checkMinRole: Role.ADMIN}, canLoad: [AuthGuard] },*/
    ]
  },
  { path: '**', redirectTo: '' }
];



const routeConfig = {
    preloadingStrategy: PreloadStrategyService,
    enableTracing: false
} as ExtraOptions;

@NgModule({
  imports: [RouterModule.forRoot(routes, routeConfig)],
  exports: [RouterModule]
})
export class AppRoutingModule {


}
