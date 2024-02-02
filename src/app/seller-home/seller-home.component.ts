import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-seller-home',
  templateUrl: './seller-home.component.html',
  styleUrls: ['./seller-home.component.css']
})
export class SellerHomeComponent implements OnInit {
  prodList:undefined | product[];
  productMessage:undefined | string;
  faIcon=faTrash;
  faEditIcon=faEdit;
  constructor(private product:ProductService){}
  ngOnInit(): void {
    this.loadProductList();
  }
  loadProductList(){
    this.product.productList().subscribe((result) => {
      if(result){
        this.prodList = result;
      }
    })
  }
  deleteProduct(id:number){
    console.warn(id);
    this.product.deleteProduct(id).subscribe((result)=>{
      if(result){
        this.productMessage = "Product is deleted";
        this.loadProductList();
      }
    })
    setTimeout(() => {
      this.productMessage=undefined;
    }, 3000);
  }
}