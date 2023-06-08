import { Component } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
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
  public userRegister: User;
  public identity: any;
  public token: any;
  public url: String = 'http://localhost:3977/api/';
  public urlAWS: String = 'https://wurmify.s3.eu-west-3.amazonaws.com/';
  

  constructor(private _userService:UserServiceService, private _route: ActivatedRoute, private _router: Router){
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');
    this.userRegister = new User('', '', '', '', '', 'ROLE_USER', '');
  }
  
  ngOnInit(){
    this.token = this._userService.getToken();
    this.identity = this._userService.getIdentity();
  }

  onSumbit(){
    this._userService.login(this.user, null).subscribe((data) => {
      let identity = data.usuarioLeido;
      this.identity = identity;
      localStorage.setItem('identity', JSON.stringify(data.usuarioLeido));
      if(!data.usuarioLeido._id){
        alert("El usuario no está correctamente identificado");
      }else{
        this._userService.login(this.user, true).subscribe((data)=>{
          let token = data.token;
          this.token = token;
          localStorage.setItem('token', JSON.stringify(data.token));

          if(this.token.length <= 0){
            alert("El token no es correcto");
          }else{
            //localstorage
          }
        })
      }
      let token = data;
      localStorage.setItem('token', data.token);
      console.log(token);
    });
  }

  onSubmitRegister(){
    console.log(this.userRegister);
    this._userService.register(this.userRegister).subscribe((data)=>{
      this._router.navigate(['']);
    });
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('identity');
    localStorage.clear();
    this.token = null;
    this.identity = null;
    this._router.navigate(['/']);
  }

}
