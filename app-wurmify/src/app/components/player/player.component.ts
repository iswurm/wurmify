import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserServiceService } from 'src/app/services/user-service.service';
import { ArtistService } from 'src/app/services/artist.service';
import { AlbumService } from 'src/app/services/album.service';
import { SongService } from 'src/app/services/song.service';
import { Artist } from 'src/app/models/artist';
import { Album } from 'src/app/models/album';
import { Song } from 'src/app/models/song';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent {
  public artist: Artist;
  public album: Album;
  public identity: any;
  public token: any;
  public song: Song;
  public artistName: String;
  public filesToUpload: Array<File> = [];
  public url: String = 'http://localhost:3977/api/';
  public urlAWS: String = 'https://wurmify.s3.eu-west-3.amazonaws.com/';

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserServiceService, private _artistService: ArtistService, private _albumService: AlbumService, private _songService: SongService) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.artist = new Artist('', '', '', '');
    this.album = new Album('', '', '', 0, '', '');
    this.song = new Song('', '', '', 0, '', '');
    this.artistName = "";
  }

  ngOnInit() {
    var song = JSON.parse(localStorage.getItem("sound") as string);
    if (song) {
      this.song = song;
      this.getAlbum();
      this.getArtist();
    } else {
      this.song = new Song('', '', '', 0, '', '');
    }
  }

  getAlbum() {
    this._albumService.getAlbum(this.token, this.song.album).subscribe((data: any) => {
      this.album = data;
      this.artist = JSON.parse(JSON.stringify(this.album.artist));
      console.log(this.artist);
    })
  }

  getArtist(){
      this._artistService.getArtist(this.token, this.album.artist).subscribe((data: any)=>{
        console.log(data)
        this.artist = data;
      })
  }
}
