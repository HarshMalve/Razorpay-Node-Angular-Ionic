import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse,
  HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
declare var RazorpayCheckout: any;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  userDetails = {
    recipientName: '',
    recipientEmail: '',
    recipientPhone: '',
    amount: null
  };
  options: any;
  data: { razorpay_payment_id: any; razorpay_order_id: any; razorpay_signature: any; };
  constructor(private http: HttpClient) {}

  pay() {
    let url = 'http://localhost:3000/api/razorpay/payment/create_order'
    var headers = new HttpHeaders();
    headers.set("Accept", 'application/json');
    headers.set('Content-Type', 'application/json');

    this.options = {
      headers: headers
    }
    this.http.post(url, this.userDetails, this.options)
    .toPromise().then(response =>{
      let res: any = response;
      console.log('response from create order: ' + JSON.stringify(response));
      if(res.status === 'created') {
        this.payWithRazor(res);
      }
    }).catch(error => {
      console.error('error from create order: ' + error);
    });
  }

  payWithRazor(res) {
    var options = {
      description: 'Test Transaction Ionic',
      image: 'https://harshmalve.com/static/images/letter-h-icon.png',
      currency: 'INR', // your 3 letter currency code
      key: 'key_generated_from_razorpay', // your Key Id from Razorpay dashboard
      order_id: res.id,
      amount: res.amount, // Payment amount in smallest denomiation e.g. cents for USD
      name: 'Harshavardhan Malve',
      prefill: {
        email: this.userDetails.recipientEmail,
        contact: this.userDetails.recipientPhone,
        name: this.userDetails.recipientName
      },
      theme: {
        color: '#F37254'
      },
      modal: {
        ondismiss: function () {
          alert('dismissed')
        }
      }
    };

    var successCallback = (response) => {
      console.log('response.razorpay_payment_id :', response.razorpay_payment_id);
      console.log('response.razorpay_order_id :', response.razorpay_order_id);
      console.log('response.razorpay_signature :', response.razorpay_signature);
      if(response !== null) {
        this.data = {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature
        }          
        this.verifySignature(this.data)
      }
    };

    var cancelCallback = function (error) {
      alert(error.description + ' (Error ' + error.code + ')');
    };

    RazorpayCheckout.on('payment.success', successCallback)
    RazorpayCheckout.on('payment.cancel', cancelCallback)
    RazorpayCheckout.open(options)

  }

  public verifySignature(data) {
    let params = {
      razorpay_order_id: data.razorpay_order_id,
      razorpay_payment_id: data.razorpay_payment_id,
      razorpay_signature: data.razorpay_signature
    };

    let url = 'http://localhost:3000/api/razorpay/payment/verifyPaymentSignature';
    var headers = new HttpHeaders();
    headers.set("Accept", 'application/json');
    headers.set('Content-Type', 'application/json');

    this.options = {
      headers: headers
    };

    this.http.post(url, params, this.options)
    .toPromise().then(response =>{
      let res: any = response;
      console.log('response from signature verification: ' + response);
    }).catch(error => {
      console.error('error from signature verification: ' + error);
    });
  }
}
