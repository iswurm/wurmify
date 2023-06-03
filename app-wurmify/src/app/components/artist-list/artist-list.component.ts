import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import { UserServiceService } from 'src/app/services/user-service.service';
import { ArtistService } from 'src/app/services/artist.service';
import { Artist } from 'src/app/models/artist';
import { Observable } from 'rxjs';


@Component({
    selector: 'app-artist-list',
    templateUrl: './artist-list.component.html',
    styleUrls: ['./artist-list.component.scss']
  })
  export class ArtistListComponent {

    public titulo: String;
    public artists: Artist[] = [];
    public identity: any;
    public token: any;
    public url: String = 'http://localhost:3977/api/';
    public urlAWS: String = 'https://wurmify.s3.eu-west-3.amazonaws.com/';
    public next_page: any;
    public prev_page: any;
    public confirmado: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserServiceService,
        private _artistService: ArtistService){
            this.titulo = 'Artists';
            this.identity = this._userService.getIdentity();
            this.token = this._userService.getToken();
            this.next_page = 1;
            this.prev_page = 1;
            this.confirmado = "";
    }

    ngOnInit(){
      this.getArtists();
    }

    getArtists(){
      this._route.params.forEach((params: Params)=>{
        let page = +params['page'];
        if(!page){
          page = 1;
        }else{
          this.next_page = page+1;
          this.prev_page = page-1;

          if(this.prev_page == 0){
            this.prev_page = 1;
          }
        }

        this._artistService.getArtists(this.token, page).subscribe((response: any)=>{
          if(!response){
            this._router.navigate(['/']);
          }else{
            this.artists = response.artists;
            console.log(this.artists);
          }
        })
      })
    }
    
    onDeleteConfirm(id: string){
      this.confirmado = id;
    }
    onCancelArtist(id: string){
      this.confirmado = "";
    }


    onDeleteArtist(id: string){
      alert("BU");
      this._artistService.deleteArtist(this.token, id).subscribe();
    }
  }