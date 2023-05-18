import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import { UserServiceService } from '../services/user-service.service';
import { Artist } from '../models/artist';


@Component({
    selector: 'app-artist-list',
    templateUrl: './artist-list.component.html',
    styleUrls: ['./artist-list.component.scss']
  })
  export class ArtistListComponent {

    public titulo: String;
    public artists: Artist[];
    public identity: any;
    public token: any;
    public url: String = 'http://localhost:3977/api/';

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserServiceService){
            this.titulo = 'Artists';
            this.identity = this._userService.getIdentity();
            this.token = this._userService.getToken();
    }
  }