import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

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
  public urlAWS: String = 'https://wurmify.s3.eu-west-3.amazonaws.com/';

  constructor(private _userService: UserServiceService,
    private _route: ActivatedRoute,
    private _router: Router,) {
    //LocalStorage
    this.token = this._userService.getToken();
    this.identity = this._userService.getIdentity();
    this.user = this.identity;
  }

  ngOnInit() {
    this.token = this._userService.getToken();
    this.identity = this._userService.getIdentity();
  }

  onSubmit() {
    this._userService.updateUser(this.user).subscribe((data: any) => {
      if (this.filesToUpload.length == 0) {
        this.token = this._userService.getToken();
        localStorage.setItem("identity", JSON.stringify(this.user));
        this._router.navigate(['/artists', 1]);

      } else {
        if (this.filesToUpload.length < 1) {
          this._router.navigate(['/artists', 1]);
        } else {
          this.makeFileRequest(this.url + 'upload-image-user/' + this.user._id, [], this.filesToUpload).then(
            (result: any) => {
              this.user.image = result;
              this._router.navigate(['/artists', 1]);
            }
          );
        }
      }
    });
  }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;

  }

  makeFileRequest(url: string, params: Array<String>, files: Array<File>) {
    var token = this.token;
    return new Promise(function (resolve, reject) {
      var formData: any = new FormData();
      var xhr = new XMLHttpRequest();
      for (var i = 0; i < files.length; i++) {
        formData.append('image', files[i], files[i].name);
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
