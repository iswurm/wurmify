import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { ArtistListComponent } from './components/artist-list/artist-list.component';
import { HomeComponent } from './components/home/home.component';
import { ArtistAddComponent } from './components/artist-add/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail/artist-detail.component';
import { AlbumAddComponent } from './components/album-add/album-add.component';
import { AlbumEditComponent } from './components/album-edit/album-edit.component';
import { AlbumDetailComponent } from './components/album-detail/album-detail.component';
import { SongAddComponent } from './components/song-add/song-add.component';
import { SongEditComponent } from './components/song-edit/song-edit.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'mis-datos', component: UserEditComponent},
  {path: 'artists/:page', component: ArtistListComponent},
  {path: 'artist/:id', component: ArtistDetailComponent},
  {path: 'add-artist', component: ArtistAddComponent},
  {path: 'edit-artist/:id', component: ArtistEditComponent},
  {path: 'add-album/:artist', component: AlbumAddComponent},
  {path: 'edit-album/:id', component: AlbumEditComponent},
  {path: 'album/:id', component: AlbumDetailComponent},
  {path: 'add-song/:album', component: SongAddComponent},
  {path: 'edit-song/:id', component: SongEditComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
