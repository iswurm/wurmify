import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import { UserServiceService } from 'src/app/services/user-service.service';
import { ArtistService } from 'src/app/services/artist.service';
import { AlbumService } from 'src/app/services/album.service';
import { Artist } from 'src/app/models/artist';
import { Album } from 'src/app/models/album';
@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.scss']
})
export class AlbumDetailComponent {
  public artist: Artist;
  public album: Album;
  public identity: any;
  public token: any;
  public albums: Album[];
  public filesToUpload: Array<File> = [];
  public url: String = 'http://localhost:3977/api/';
  public confirmado: string;

  constructor(
      private _route: ActivatedRoute,
      private _router: Router,
      private _userService: UserServiceService, private _artistService: ArtistService, private _albumService: AlbumService){
          this.identity = this._userService.getIdentity();
          this.token = this._userService.getToken();
          this.artist = new Artist('', '', '', '');
          this.album = new Album('', '', '', 0, '', '');
          this.albums = [];
          this.confirmado = "";
  }

  ngOnInit(){
    this.getAlbum();
  }

  getAlbum(){
    this._route.params.forEach((params: Params) => {
      let id = params['id'];
      this._albumService.getAlbum(this.token, id).subscribe((data: any)=>{
        this.album = data;
      })
    })
  }

  onDeleteConfirm(id: string){
    this.confirmado = id;
  }
  onCancelAlbum(id: string){
    this.confirmado = "";
  }

  onDeleteAlbum(id: string){
    alert("BU");
    this._albumService.deleteAlbum(this.token, id).subscribe();
  }
}
