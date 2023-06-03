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
  selector: 'app-song-add',
  templateUrl: './song-add.component.html',
  styleUrls: ['./song-add.component.scss']
})
export class SongAddComponent {
  public titulo: String;
  public artist: Artist;
  public album: Album;
  public song: Song;
  public identity: any;
  public token: any;
  public filesToUpload: Array<File> = [];
  public url: String = 'http://localhost:3977/api/';
  public urlAWS: String = 'https://wurmify.s3.eu-west-3.amazonaws.com/';

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserServiceService, private _artistService: ArtistService, private _albumService: AlbumService, private _songService: SongService) {
    this.titulo = 'New Album';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.artist = new Artist('', '', '', '');
    this.album = new Album('', '', '', 0, '', '');
    this.song = new Song('', '', '', 0, '', '');
  }

  ngOnInit() {
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

  onSubmit() {
    this._route.params.forEach((params: Params) => {
      let albumId = params['album'];
      this.song.album = albumId;
      this._songService.addSong(this.token, this.song).subscribe((data: any) => {
        console.log(data);
      });
    })
  }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  makeFileRequest(url: string, params: Array<String>, files: Array<File>, token: string, name: string) {
    return new Promise(function (resolve, reject) {
      var formData: any = new FormData();
      var xhr = new XMLHttpRequest();
      for (var i = 0; i < files.length; i++) {
        formData.append(name, files[i], files[i].name);
      }

      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            resolve(JSON.parse(xhr.response))
          } else {
            reject(xhr.response);
          }

        }
      }
      xhr.open('POST', url, true);
      xhr.setRequestHeader('authorization', token);
      xhr.send(formData);
    })
  }
}
