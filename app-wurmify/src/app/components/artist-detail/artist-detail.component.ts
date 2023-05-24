import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import { UserServiceService } from 'src/app/services/user-service.service';
import { ArtistService } from 'src/app/services/artist.service';
import { Artist } from 'src/app/models/artist';
@Component({
  selector: 'app-artist-detail',
  templateUrl: './artist-detail.component.html',
  styleUrls: ['./artist-detail.component.scss']
})
export class ArtistDetailComponent {
  public artist: Artist;
  public identity: any;
  public token: any;
  public albums: any = "";
  public filesToUpload: Array<File> = [];
  public url: String = 'http://localhost:3977/api/';

  constructor(
      private _route: ActivatedRoute,
      private _router: Router,
      private _userService: UserServiceService, private _artistService: ArtistService){
          this.identity = this._userService.getIdentity();
          this.token = this._userService.getToken();
          this.artist = new Artist('', '', '', '');
  }

  ngOnInit(){
    this.getArtist();
  }

  getArtist(){
    this._route.params.forEach((params: Params) => {
      let id = params['id'];
      this._artistService.getArtist(this.token, id).subscribe((data: any)=>{
        this.artist = data.artist;
      })
    })
  }
}
