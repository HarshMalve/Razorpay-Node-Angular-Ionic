import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  API = {
    domain: 'http://localhost:3000/',
    url: {
      createOrder: 'api/razorpay/payment/create_order',
      verifySignature: 'api/razorpay/payment/verifyPaymentSignature'
    }
  }

  constructor() { }
}
