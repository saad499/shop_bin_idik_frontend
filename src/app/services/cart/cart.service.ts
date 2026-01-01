import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { CartItemDto } from '../../dto/CartItemDto';
import { AddToCartRequest } from '../../dto/AddToCartRequest';
import { CartSummaryDto } from '../../dto/CartSummaryDto';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = 'http://localhost:8081/api/cart';
  
  // Subject to notify when cart is updated
  private cartUpdated = new Subject<void>();
  
  // Observable that components can subscribe to
  cartUpdated$ = this.cartUpdated.asObservable();

  constructor(private http: HttpClient) {}

  addToCart(userId: number, request: AddToCartRequest): Observable<CartItemDto> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.post<CartItemDto>(`${this.baseUrl}/add`, request, { params });
  }

  getCart(userId: number): Observable<CartSummaryDto> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get<CartSummaryDto>(this.baseUrl, { params });
  }

  removeCartItem(cartItemId: number): Observable<void> {
    const params = new HttpParams().set('cartItemId', cartItemId.toString());
    return this.http.delete<void>(`${this.baseUrl}/remove`, { params });
  }

  // Method to notify that cart has been updated
  notifyCartUpdated(): void {
    this.cartUpdated.next();
  }
}
