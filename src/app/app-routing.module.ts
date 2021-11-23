import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePage } from './pages/home/home.page';
import { AccountsPage } from './pages/accounts/accounts.page';

const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'accounts', component: AccountsPage }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
