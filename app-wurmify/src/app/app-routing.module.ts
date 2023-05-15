import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserEditComponent } from './components/user-edit/user-edit.component';

const routes: Routes = [
  {path: '', component: UserEditComponent},
  {path: 'mis-datos', component: UserEditComponent},
  {path: '**', component: UserEditComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
