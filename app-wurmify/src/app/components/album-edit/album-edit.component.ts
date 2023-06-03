import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import { UserServiceService } from 'src/app/services/user-service.service';
import { ArtistService } from 'src/app/services/artist.service';
import { AlbumService } from 'src/app/services/album.service';
import { Artist } from 'src/app/models/artist';
import { Album } from 'src/app/models/album';

@Component({
  selector: 'app-album-edit',
  templateUrl: './album-edit.component.html',
  styleUrls: ['./album-edit.component.scss']
})
export class AlbumEditComponent {

  public titulo: String;
  public artist: Artist;
  public album: Album;
  public identity: any;
  public token: any;
  public filesToUpload: Array<File> = [];
  public url: String = 'http://localhost:3977/api/';
  public urlAWS: String = 'https://wurmify.s3.eu-west-3.amazonaws.com/';

  constructor(
      private _route: ActivatedRoute,
      private _router: Router,
      private _userService: UserServiceService, private _artistService: ArtistService, private _albumService: AlbumService){
          this.titulo = 'Artists';
          this.identity = this._userService.getIdentity();
          this.token = this._userService.getToken();
          this.artist = new Artist('', '', '', '');
          this.album = new Album('', '', '', 2023, '', '');
  }

  ngOnInit(){
    this.getAlbum();
  }


  onSubmit(){
    this._route.params.forEach((params: Params) => {
      let id = params['id'];
      this._albumService.editAlbum(this.token, id, this.album).subscribe((data)=>{
        if(!this.filesToUpload){
          alert("no hay imagen");
          this._router.navigate(['/artists', 1]);
        }else{
          if(this.filesToUpload.length < 1){
            this._router.navigate(['/artists', 1]);
          }else{
            this.makeFileRequest(this.url+'upload-image-album/'+id, [], this.filesToUpload, this.token, "image").then(
              (result: any) =>{
                this.album.image = result.image;
                console.log(this.album.title);
                console.log("IMAGEN: " + result.image);
                this._router.navigate(['/artists', 1]);
              }
            );
          }
          
        }
      });
    })
  }

  getAlbum(){
    console.log("aa");
    this._route.params.forEach((params: Params) => {
      let id = params['id'];
      this._albumService.getAlbum(this.token, id).subscribe((data: any)=>{
        this.album = data;
      })
    })
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
