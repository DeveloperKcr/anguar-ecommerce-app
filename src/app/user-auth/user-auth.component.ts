import { Component, OnInit } from '@angular/core';
import { Cart, Login, SignUp, product } from '../data-type';
import { UserService } from '../services/user.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css']
})
export class UserAuthComponent implements OnInit {
  showLogin:boolean=true;
  authError:string="";
  constructor(private userService:UserService, private product:ProductService) { }
  ngOnInit(): void {
    this.userService.userAuthReload();
  }

  signUp(data: SignUp) {
    return this.userService.userSignUp(data);
  }
  openLogin(){
    this.showLogin = true;
  }
  openSignUp(){
    this.showLogin = false;
  }
  login(data:Login){
    this.userService.userLogin(data);
    this.userService.invalidUserAuth.subscribe((result)=>{
      if(result){
        this.authError = "Please enter valid details";
      }else{
        this.localCartToRemoveCart()
      }
    })
  }

  localCartToRemoveCart(){
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user).id;
    let data = localStorage.getItem('localCart');
    if(data){
      let cartDataList:product[] = JSON.parse(data);
      

      cartDataList.forEach((product:product, index)=>{
        let cartData:Cart={
          ...product,
          productId:product.id,
          userId
        };
        delete cartData.id;
        setTimeout(() => {
          this.product.addToCart(cartData).subscribe((result)=>{
            if(result){
              console.warn("Item stored in DB");
            }
          })
          if(cartDataList.length === index+1){
            localStorage.removeItem('localCart');
          }
        }, 500);
      });
    }
    setTimeout(() => {
      this.product.getCartList(userId);
    }, 2000);
  }
}
