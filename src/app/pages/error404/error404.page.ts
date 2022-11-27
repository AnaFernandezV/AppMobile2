import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-error404',
  templateUrl: './error404.page.html',
  styleUrls: ['./error404.page.scss'],
})
export class Error404Page implements OnInit {
  isAuthenticated = new BehaviorSubject(false);
  constructor(private router:Router) { }

  ngOnInit() {
  }

  logout(){
    this.isAuthenticated.next(false);
    this.router.navigate(['/login']);
    }
}
