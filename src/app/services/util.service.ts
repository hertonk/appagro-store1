/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2021-present initappz.
*/
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { INavData } from '@coreui/angular';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UtilService {
  public translations: any[] = [];
  public default_country_code: any = '';
  public user_verification: any = 0;
  public themeColor = [
    { name: 'Default', class: 'default' },
    { name: 'Dark', class: 'dark-theme' },
  ];
  public findType: any = 0;
  public userInfo: any;
  public general: any;
  public cside: any = 'left';
  public currecny: any = '$';
  public appName: any;
  public appLogo: any;
  public direction: any;
  public show_booking: boolean = true;
  public app_color: any;
  public app_status: boolean = true;
  public app_closed_message: any = '';
  private offerAdded = new Subject<any>();
  private newAddress = new Subject<any>();
  private typeChanged = new Subject<any>();
  public settingInfo: any;
  public adminInfo: any;
  public isWebOrPWA: boolean = false;
  public diningInformations: any;
  public appClosedMessage: any = '';
  public driver_assign: any = '';
  public store: any;
  orderStatus = [
    'Created',
    'Accepted',
    'Prepared',
    'Ongoing',
    'Delivered',
    'Pending Payments',
    'Cancelled',
    'Refunded',
    'Rejected'
  ];
  paidMethods = [
    'Index',
    'COD',
    'STRIPE',
    'PAYPAL',
    'PAYTM',
    'RAZORPAY',
    'INSTAMOJO',
    'PAYSTACK',
    'FLUTTERWAVE',
    'PAYKUN'
  ];
  private orderChange = new Subject<any>();
  private ejectMessages = new Subject<any>();
  public loggedIN: boolean = false;
  public home_style: any = 1;
  public countrys: any[] = [];
  public smsGateway: any = '0';
  public login_style: any = 3;
  public user_login_with: any = 0;
  public register_style: any = 3;
  public servingCities: any[] = [];
  public cityName: any = '';
  public cityId: any = '';
  public zipcode: any = '';
  public deliveryAddress: any = '';
  public active_store: any[] = [];

  public makeOrders: any = 0;
  public reset_pwd: any = 0;
  public appPage: any[] = [];
  public haveFav: boolean;

  public navItems: INavData[] = [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
    },
    {
      name: 'Analytics',
      url: '/analytics',
      icon: 'cil-bar-chart'
    },
    {
      name: 'Products',
      url: '/products',
      icon: 'cil-layers'
    },
    {
      name: 'Reviews',
      url: '/reviews',
      icon: 'cil-happy'
    },
    {
      name: 'Support',
      url: '/support',
      icon: 'cil-chat-bubble'
    },
    {
      name: 'Stats',
      url: '/stats',
      icon: 'cil-chart-line'
    }
  ];
  constructor(
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

  error(message) {
    Swal.fire({
      icon: 'error',
      title: message,
      toast: true,
      showConfirmButton: false,
      timer: 2000,
      position: 'bottom-right'
    });
  }

  show() {
    this.spinner.show();
  }

  hide() {
    this.spinner.hide();
  }

  translate(str) {
    if (this.translations[str]) {
      return this.translations[str];
    }
    return str;
  }

  success(message) {
    Swal.fire({
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 1500
    });
  }

  apiErrorHandler(err) {
    if (err && err.status === 401 && err.error.error) {
      this.error(err.error.error);
      this.router.navigateByUrl('/login');
      return false;
    }
    if (err && err.status === 500 && err.error.error) {
      this.error(err.error.error);
      return false;
    }
    if (err.status === -1) {
      this.error(this.translate('Failed To Connect With Server'));
    } else if (err.status === 401) {
      this.error(this.translate('Unauthorized Request!'));
      this.router.navigateByUrl('/login');
    } else if (err.status === 500) {
      if (err.status == 500 && err.error && err.error.message) {
        this.error(err.error.message);
        return false;
      }
      this.error(this.translate('Somethimg Went Wrong'));
    } else if (err.status === 422 && err.error.error) {
      this.error(err.error.error);
    } else {
      this.error(this.translate('Something went wrong'));
    }

  }

  ejectMsg() {
    this.ejectMessages.next();
  }

  successEject(): Subject<any> {
    return this.ejectMessages;
  }
}
