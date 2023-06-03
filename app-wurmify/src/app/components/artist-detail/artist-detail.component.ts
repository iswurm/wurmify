import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import { UserServiceService } from 'src/app/services/user-service.service';
import { ArtistService } from 'src/app/services/artist.service';
import { AlbumService } from 'src/app/services/album.service';
import { Artist } from 'src/app/models/artist';
import { Album } from 'src/app/models/album';
@Component({
  selector: 'app-artist-detail',
  templateUrl: './artist-detail.component.html',
  styleUrls: ['./artist-detail.component.scss']
})
export class ArtistDetailComponent {
  public artist: Artist;
  public identity: any;
  public token: any;
  public albums: Album[];
  public filesToUpload: Array<File> = [];
  public url: String = 'http://localhost:3977/api/';
  public urlAWS: String = 'https://wurmify.s3.eu-west-3.amazonaws.com/';
  public confirmado: string;

  constructor(
      private _route: ActivatedRoute,
      private _router: Router,
      private _userService: UserServiceService, private _artistService: ArtistService, private _albumService: AlbumService){
          this.identity = this._userService.getIdentity();
          this.token = this._userService.getToken();
          this.artist = new Artist('', '', '', '');
          this.albums = [];
          this.confirmado = "";
  }

  ngOnInit(){
    this.getArtist();
  }

  getArtist(){
    this._route.params.forEach((params: Params) => {
      let id = params['id'];
      this._artistService.getArtist(this.token, id).subscribe((data: any)=>{
        this.artist = data.artist;
        this._albumService.getAlbums(this.token, this.artist._id).subscribe((data: any)=>{
          this.albums = data;
          this.albums.forEach((x: any) =>{
            console.log(x.artist.name);
          })
        });
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
