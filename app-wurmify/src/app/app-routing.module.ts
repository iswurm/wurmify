import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { ArtistListComponent } from './components/artist-list/artist-list.component';
import { HomeComponent } from './components/home/home.component';
import { ArtistAddComponent } from './components/artist-add/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail/artist-detail.component';
import { AlbumAddComponent } from './components/album-add/album-add.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'mis-datos', component: UserEditComponent},
  {path: 'artists/:page', component: ArtistListComponent},
  {path: 'artist/:id', component: ArtistDetailComponent},
  {path: 'add-artist', component: ArtistAddComponent},
  {path: 'edit-artist/:id', component: ArtistEditComponent},
  {path: 'add-album/:artist', component: AlbumAddComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
