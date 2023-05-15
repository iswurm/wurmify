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
      console.log(data)
    });
  }
}
