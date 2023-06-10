import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, lastValueFrom } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../models/user';
import { Artist } from '../models/artist';
import { Album } from '../models/album';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {


  private apiRestUrl = 'http://localhost:3977/api/';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'})
  };

  public identity: any;
  public token: any;

  constructor(private http: HttpClient) { 
  }


  addAlbum(token: any, album: Album){
    let params = JSON.stringify(album);
    let headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*',
      'authorization': token })
    }
    return this.http.post(this.apiRestUrl+'album', params, headers);
  }

  getAlbum(token: any, id: string){
    let headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*',
      'authorization': token })
    }
    return this.http.get(this.apiRestUrl+'album/'+id, headers);
  }

  getAlbums(token: any, artistId: string){
    let headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*',
      'authorization': token })
    }
    if(artistId == ""){
      return this.http.get(this.apiRestUrl+'albums/', headers);
    }else{
      return this.http.get(this.apiRestUrl+'albums/'+artistId, headers);
    }
  }


  deleteAlbum(token: any, id: string){
    let headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*',
      'authorization': token })
    }
    return this.http.delete(this.apiRestUrl+'album/'+id, headers);
  }

  editAlbum(token: any, id: string, album: Album){
    let params = JSON.stringify(album);
    let headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*',
      'authorization': token })
    }
    return this.http.put(this.apiRestUrl+'update-album/'+id, params, headers);
  }
}
