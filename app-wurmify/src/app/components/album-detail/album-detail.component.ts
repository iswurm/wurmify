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
  public songs: Song[];
  public filesToUpload: Array<File> = [];
  public url: String = 'http://localhost:3977/api/';
  public urlAWS: String = 'https://wurmify.s3.eu-west-3.amazonaws.com/'; 
  public confirmado: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserServiceService, private _artistService: ArtistService, private _albumService: AlbumService, private _songService: SongService) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.artist = new Artist('', '', '', '');
    this.album = new Album('', '', '', 0, '', '');
    this.albums = [];
    this.songs = [];
    this.confirmado = "";
  }

  ngOnInit() {
    this.getAlbum();
  }

  getAlbum() {
    this._route.params.forEach((params: Params) => {
      let id = params['id'];
      this._albumService.getAlbum(this.token, id).subscribe((data: any) => {
        this.album = data;
        this.artist = JSON.parse(JSON.stringify(this.album.artist));
        this._songService.getSongs(this.token, this.album._id).subscribe((data: any) => {
          this.songs = data;
        })
      })
    })
  }

  onDeleteConfirm(id: string) {
    this.confirmado = id;
  }
  onCancelAlbum(id: string) {
    this.confirmado = "";
  }

  onDeleteAlbum(id: string) {
    this._albumService.deleteAlbum(this.token, id).subscribe();
    this._router.navigate(['/']);
  }

  onCancelSong(id: string) {
    this.confirmado = "";
  }

  onDeleteSong(id: string) {
    this._songService.deleteSong(this.token, id).subscribe();
    this._router.navigate(['/']);
  }

  startPlayer(song: Song) {
    let songPlayer = JSON.stringify(song);
    let filePath = this.urlAWS + song.file;
    localStorage.setItem("sound", songPlayer);
    document.getElementById('mp3-source')?.setAttribute("src", filePath);
    (document.getElementById('player') as any).load();
    (document.getElementById('player') as any).play();
    (document.getElementById('player-song-name') as any).innerHTML = song.name;
    this._albumService.getAlbum(this.token, song.album).subscribe((data: any) => {
      document.getElementById('imagen-reproductor')?.setAttribute("src", this.urlAWS+data.image);
      let artista = JSON.parse(JSON.stringify(data.artist));
      (document.getElementById('player-artist-name') as any).innerHTML = artista.name;
    });
  }
}
