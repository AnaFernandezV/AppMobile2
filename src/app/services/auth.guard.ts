import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  
  constructor(private storage: StorageService, private router: Router,private fireService: FirebaseService){

  }
  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //AQUI VA NUESTRA LOGICA: si funciona entregame un TRUE, sino funciona mandame a login:

    var isAuth: any = this.fireService.getAuth();
    if (!isAuth) {
      this.router.navigate(['/login']);
    }else{
      return true;
    }
  }  
  }
  

