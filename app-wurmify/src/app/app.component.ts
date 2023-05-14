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
  public userRegister: User;
  public identity: any;
  public token: any;

  constructor(private _userService:UserServiceService){
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');
    this.userRegister = new User('', '', '', '', '', 'ROLE_USER', '');
  }
  
  ngOnInit(){
    this.token = this._userService.getToken();
    this.identity = this._userService.getIdentity();
    console.log("Token " + this.token);
    console.log( this.identity);
  }

  onSumbit(){
    //console.log(this.user);
    this._userService.login(this.user, null).subscribe((data) => {
      console.log(data.usuarioLeido.name);
      console.log(data.user);
      let identity = data.usuarioLeido;
      this.identity = identity;
      localStorage.setItem('identity', JSON.stringify(data.usuarioLeido));
      if(!data.usuarioLeido._id){
        alert("El usuario no está correctamente identificado");
      }else{
        //localsotrage identity

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
      console.log(data);
    });
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('identity');
    localStorage.clear();
    this.token = null;
    this.identity = null;
  }

}
