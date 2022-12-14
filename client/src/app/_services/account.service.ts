import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map}from 'rxjs/operators';
import { User } from '../_models/user';
import { ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl=environment.apiUrl;
  private currentUserSource=new ReplaySubject<User>(1);
  currentUser$=this.currentUserSource.asObservable();
  constructor(private http:HttpClient,private presenceService:PresenceService) { }
  login(model:any){
    return this.http.post<User>(this.baseUrl+'account/login',model).pipe(
      map((response:User)=>{
        const user=response;
        if(user){
          this.setCurrentUser(user);
          this.presenceService.createHubConnection(user);
        }
      })
    )
  }
  register(model:any){
    return this.http.post<any>(this.baseUrl+'account/register',model).pipe(
    map((user:User)=>{
      if(user){
        this.setCurrentUser(user);
        this.presenceService.createHubConnection(user);
      }
    })
    )
  }
  setCurrentUser(user:User){
    user.roles=[];
    const roles=this.getDecodedToken(user.token).role;//role is part of token that decoded in JWT.io that defines the role of user
    Array.isArray(roles)?user.roles=roles:user.roles.push(roles);//check if roles is an array (multi roles(admin & moderator etc))or not
    localStorage.setItem('user',JSON.stringify(user));
    this.currentUserSource.next(user);
  }
  logout(){
    localStorage.removeItem('user');
    this.currentUserSource.next(null!);
    this.presenceService.stopHubConnection();
  }
  getDecodedToken(token){
    return JSON.parse(atob(token.split('.')[1]));
  }
}
