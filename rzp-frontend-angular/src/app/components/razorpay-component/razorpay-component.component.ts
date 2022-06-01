import { Component, OnInit } from '@angular/core';
import { WebAPIServiceService } from '../../service/webAPIService/web-apiservice.service';
import { ApiService } from '../../service/api/api.service';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
declare var Razorpay: any;
@Component({
  selector: 'app-razorpay-component',
  templateUrl: './razorpay-component.component.html',
  styleUrls: ['./razorpay-component.component.scss']
})
export class RazorpayComponentComponent implements OnInit {

  userDetails = {
    recipientName: '',
    recipientEmail: '',
    recipientPhone: '',
    amount: null
  };

  data = {
    razorpay_payment_id: null,
    razorpay_order_id: null,
    razorpay_signature: null
  }
  constructor(public webApi: WebAPIServiceService, public ENUM: ApiService) { }

  ngOnInit(): void {
  }

  pay() {
    let url = this.ENUM.API.domain + this.ENUM.API.url.createOrder;
    this.webApi.sendPostRequest(url, this.userDetails)
      .then(response => {
        console.log('response ==> ', response);
        let res: any = response;
        if (res.status === 'created') {
          this.openRazorPay(res);
        }
      }).catch(error => {
        console.error('error ==> ', error);
      })
    console.log('userDetails => ' + JSON.stringify(this.userDetails));
  }

  openRazorPay(res) {
    let options = {
      key: 'YOUR KEY ID', // Enter the Key ID generated from the Dashboard - This should be same as used at the node server side
      amount: res.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: 'INR', // your 3 letter currency code
      name: 'Harshavardhan Malve',
      description: 'Test Transaction',
      image: 'https://harshmalve.com/static/images/letter-h-icon.png',
      order_id: res.id, //Pass the `id` obtained in the response of Step 1
      handler: (response) => {
        console.log('response.razorpay_payment_id :', response.razorpay_payment_id);
        console.log('response.razorpay_order_id :', response.razorpay_order_id);
        console.log('response.razorpay_signature :', response.razorpay_signature);
        if (response !== null) {
          this.data = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature
          }
          this.verifySignature(this.data)
        }
      },
      prefill: {
        name: this.userDetails.recipientName,
        email: this.userDetails.recipientEmail,
        contact: this.userDetails.recipientPhone
      },
      notes: {
        'address': 'Razorpay Corporate Office'
      },
      theme: {
        'color': '#528FF0'
      },
      modal: {
        backdropclose: false,
        escape: false,
        ondismiss: function () {
          console.log('Checkout form closed');
        }
      }
    };
    let razorpay = new Razorpay(options);
    razorpay.open();

  }
  public fetchOrder() {
    console.log('FetchOrder Function called');
  }

  public verifySignature(data) {
    let params = {
      razorpay_order_id: data.razorpay_order_id,
      razorpay_payment_id: data.razorpay_payment_id,
      razorpay_signature: data.razorpay_signature
    };

    let url = this.ENUM.API.domain + this.ENUM.API.url.verifySignature;
    this.webApi.sendPostRequest(url, params)
      .then((response) => {
        console.log(JSON.stringify(response));
      }).catch((error) => {
        console.error('error => ' + error);
      })
  }
}
