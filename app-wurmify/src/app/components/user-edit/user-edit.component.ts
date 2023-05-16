import { Component, OnInit } from '@angular/core';

import { UserServiceService } from 'src/app/services/user-service.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent {

  public user: User;
  public identity: any;
  public token: any;
  public filesToUpload: Array<File> = [];
  public url: String = 'http://localhost:3977/api/';

  constructor(private _userService:UserServiceService){
    //LocalStorage
    this.token = this._userService.getToken();
    this.identity = this._userService.getIdentity();
    this.user = this.identity;
  }
  
  ngOnInit(){
    this.token = this._userService.getToken();
    this.identity = this._userService.getIdentity();
  }

  onSubmit(){
    this._userService.updateUser(this.user).subscribe((data) =>{
      if(!this.filesToUpload){
        alert("no hay imagen");
      }else{
        this.makeFileRequest(this.url+'upload-image-user/'+this.user._id, [], this.filesToUpload).then(
          (result: any) =>{
            this.user.image = result.image;
            console.log(this.user.image);
            localStorage.setItem('identity', JSON.stringify(this.user));
          }
        );
      }
    });
  }

  fileChangeEvent(fileInput: any){
    this.filesToUpload = <Array<File>>fileInput.target.files;

  }

  makeFileRequest(url: string, params: Array<String>, files: Array<File>){
    var token = this.token;
    return new Promise(function(resolve, reject){
      var formData: any = new FormData();
      var xhr = new XMLHttpRequest();
      for(var i = 0; i < files.length; i++){
        formData.append('image', files[i], files[i].name);
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
