import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import { UserServiceService } from 'src/app/services/user-service.service';
import { ArtistService } from 'src/app/services/artist.service';
import { Artist } from 'src/app/models/artist';
@Component({
  selector: 'app-artist-add',
  templateUrl: './artist-add.component.html',
  styleUrls: ['./artist-add.component.scss']
})
export class ArtistAddComponent {
  public titulo: String;
  public artist: Artist;
  public identity: any;
  public token: any;
  public url: String = 'http://localhost:3977/api/';

  constructor(
      private _route: ActivatedRoute,
      private _router: Router,
      private _userService: UserServiceService, private _artistService: ArtistService){
          this.titulo = 'Artists';
          this.identity = this._userService.getIdentity();
          this.token = this._userService.getToken();
          this.artist = new Artist('', '', '', '');
  }

  onSubmit(){
    this._artistService.addArtist(this.token, this.artist).subscribe((data: any)=>{
      this._router.navigate(['edit-artist/'+data.status._id]);
    });
  }
}
