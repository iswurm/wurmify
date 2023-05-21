import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
  })
  export class HomeComponent {

    public titulo: String = "WURMIFY";
    public url: String = 'http://localhost:3977/api/';

    constructor(){

    }
  }