import { EventEmitter, Injectable } from '@angular/core';
import { Login, SignUp } from '../data-type';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  invalidUserAuth = new EventEmitter<boolean>(false);
  constructor(private http:HttpClient, private router:Router) { }
  
  userSignUp(user:SignUp) {
    return this.http.post('http://localhost:3000/users', user, {observe:'response'})
    .subscribe((result)=>{
      if(result){
        localStorage.setItem('user',JSON.stringify(result.body));
        this.router.navigate(['/']);
        this.invalidUserAuth.emit(false);
      }else{
        this.invalidUserAuth.emit(true);
      }
    });
  }

  userAuthReload(){
    if(localStorage.getItem('user')){
      this.router.navigate(['/']);
    }
  }

  userLogin(data:Login){
    this.http.get<SignUp[]>(`http://localhost:3000/users?email=${data.email}&password=${data.password}`, {observe:'response'})
    .subscribe((result:any) => {
      console.warn(result.body);
      if(result && result.body?.length){
        console.warn(result.body);
        localStorage.setItem('user',JSON.stringify(result.body[0]));
        this.router.navigate(['/']);
        this.invalidUserAuth.emit(false);
      }else{
        console.warn('login failed');
        this.invalidUserAuth.emit(true);
      }
    })
  }
}