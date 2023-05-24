import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import { UserServiceService } from 'src/app/services/user-service.service';
import { ArtistService } from 'src/app/services/artist.service';
import { AlbumService } from 'src/app/services/album.service';
import { Artist } from 'src/app/models/artist';
import { Album } from 'src/app/models/album';

@Component({
  selector: 'app-album-add',
  templateUrl: './album-add.component.html',
  styleUrls: ['./album-add.component.scss']
})
export class AlbumAddComponent {
  public titulo: String;
  public artist: Artist;
  public album: Album;
  public identity: any;
  public token: any;
  public filesToUpload: Array<File> = [];
  public url: String = 'http://localhost:3977/api/';

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserServiceService, private _artistService: ArtistService, private _albumService: AlbumService){
        this.titulo = 'New Album';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.artist = new Artist('', '', '', '');
        this.album = new Album('', '', 0, '', '');
}

  ngOnInit(){
    this.getArtist();
  }

  getArtist(){
    this._route.params.forEach((params: Params) => {
      let id = params['id'];
      this._artistService.getArtist(this.token, id).subscribe((data: any)=>{
        this.artist = data.artist;
        console.log(this.artist);
      })
    })
  }

  onSubmit(){
    this._route.params.forEach((params: Params)=>{
      let artistId = params['artist'];
      this.album.artist = artistId;
    })
    console.log(this.album);
    this._albumService.addAlbum(this.token, this.album).subscribe((data: any)=>{
      //this._router.navigate(['edit-artist/'+data.status._id]);
    });
  }

  fileChangeEvent(fileInput: any){
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  makeFileRequest(url: string, params: Array<String>, files: Array<File>, token: string, name: string){
    return new Promise(function(resolve, reject){
      var formData: any = new FormData();
      var xhr = new XMLHttpRequest();
      for(var i = 0; i < files.length; i++){
        formData.append(name, files[i], files[i].name);
      }

      xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
          if(xhr.status == 200){
            resolve(JSON.parse(xhr.response))
          }else{
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
