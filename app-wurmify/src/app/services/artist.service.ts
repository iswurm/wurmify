import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, lastValueFrom } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../models/user';
import { Artist } from '../models/artist';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {


  private apiProdUrl = 'https://wurmify.onrender.com/api/';
  private apiRestUrl = 'http://localhost:3977/api/';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'})
  };

  public identity: any;
  public token: any;

  constructor(private http: HttpClient) { 
  }

  getArtists(token: any, page: number){
    let headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*',
      'authorization': token })
    }
    return this.http.get(this.apiProdUrl+'artists/'+page, headers);
  }

  getArtist(token: any, id: string){
    let headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*',
      'authorization': token })
    }
    return this.http.get(this.apiProdUrl+'artist/'+id, headers);
  }

  editArtist(token: any, id: string, artist: Artist){
    let params = JSON.stringify(artist);
    let headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*',
      'authorization': token })
    }
    return this.http.put(this.apiProdUrl+'update-artist/'+id, params, headers);
  }

  addArtist(token: any, artist: Artist){
    let params = JSON.stringify(artist);
    let headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*',
      'authorization': token })
    }
    return this.http.post(this.apiProdUrl+'artist', params, headers);
  }

  deleteArtist(token: any, id: string){
    let headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*',
      'authorization': token })
    }
    return this.http.delete(this.apiProdUrl+'artist/'+id, headers);
  }

}
