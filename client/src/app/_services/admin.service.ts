import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../_models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl=environment.apiUrl;

  constructor(private http:HttpClient) { }

  getUsersWithRoles(){
    return this.http.get<Partial<User[]>>(this.baseUrl+'admin/users-with-roles');
  }
  updateUserRoles(username:string,roles:string[]){
    return this.http.post(this.baseUrl+'admin/edit-roles/'+username+'?roles='+roles,{});
  }
}
