import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, lastValueFrom } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../models/user';
import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { Song } from '../models/song';

@Injectable({
  providedIn: 'root'
})
export class SongService {

  private apiProdUrl = 'https://wurmify.onrender.com/api/';
  private apiRestUrl = 'http://localhost:3977/api/';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'})
  };

  public identity: any;
  public token: any;

  constructor(private http: HttpClient) { 
  }

  
  addSong(token: any, song: Song){
    let params = JSON.stringify(song);
    let headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*',
      'authorization': token })
    }
    return this.http.post(this.apiProdUrl+'song', params, headers);
  }

  getSong(token: any, id: string){
    let headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*',
      'authorization': token })
    }
    return this.http.get(this.apiProdUrl+'song/'+id, headers);
  }

  getSongs(token: any, albumId: string){
    let headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*',
      'authorization': token })
    }
    if(albumId == ""){
      return this.http.get(this.apiProdUrl+'songs/', headers);
    }else{
      return this.http.get(this.apiProdUrl+'songs/'+albumId, headers);
    }
  }


  deleteSong(token: any, id: string){
    let headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*',
      'authorization': token })
    }
    return this.http.delete(this.apiProdUrl+'song/'+id, headers);
  }

  editSong(token: any, id: string, song: Song){
    let params = JSON.stringify(song);
    let headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*',
      'authorization': token })
    }
    return this.http.put(this.apiProdUrl+'update-song/'+id, params, headers);
  }
}
