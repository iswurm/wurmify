import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { ArtistListComponent } from './components/artist-list/artist-list.component';

const routes: Routes = [
  {path: '', component: UserEditComponent},
  {path: 'mis-datos', component: UserEditComponent},
  {path: '**', component: ArtistListComponent}
  {path: 'artists/:page', component: ArtistListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
