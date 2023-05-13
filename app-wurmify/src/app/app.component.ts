import { Component } from '@angular/core';
import { User } from './models/user';
import { UserServiceService } from './services/user-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [UserServiceService]
})
export class AppComponent{
  title = 'Wurmify';

  public user: User;
  public identity: any;
  public token: any;

  constructor(private _userService:UserServiceService){
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');
  }
  
  ngOnInit(){
  }

  onSumbit(){
    console.log(this.user);
    this._userService.login(this.user).subscribe((data) => {
      console.log(data);
    });
  }

}
