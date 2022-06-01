import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RazorpayComponentComponent } from './components/razorpay-component/razorpay-component.component';

const routes: Routes = [
  {path: 'razorpay', component: RazorpayComponentComponent},
  {path: '', redirectTo: 'razorpay', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
