import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class WebAPIServiceService {
  url:any;
  constructor(public http:HttpClient, public ENUM: ApiService) {
    this.url = ENUM.API.url;
  }

  sendPostRequest(url:string, data:any) {
      return new Promise(resolve => {
        this.http.post(url, data)
        .map(res => 
          res
        )
        .subscribe(data => {
            resolve(data);
        },
        err => {
            resolve(err);
            if(err){
                    console.error('Please check server connection','Server Error!');
            }
        });
    });
  }
}
