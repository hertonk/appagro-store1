/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2021-present initappz.
*/
import { UtilService } from './../../services/util.service';
import { Component } from '@angular/core';

import * as moment from 'moment';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { INavData } from '@coreui/angular';
@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
  public sidebarMinimized = false;
  public currentYear: any;
  public navData: INavData[] = [];
  constructor(
    public api: ApiService,
    public util: UtilService,
    private router: Router
  ) {
    this.currentYear = moment().format('YYYY');
    setTimeout(() => {
      this.util.navItems.filter(x => x.name = this.util.translate(x.name));
      console.log('navparam', this.util.navItems);;
      this.navData = this.util.navItems;
    }, 2000);
  }
  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  logout() {
    this.util.show();
    this.api.post_private('v1/auth/logout', {}).then((data) => {
      this.util.hide();
      console.log(data);
      localStorage.removeItem('uid');
      localStorage.removeItem('token');
      this.router.navigateByUrl('login');
    }, error => {
      this.util.hide();
      console.log(error);
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.util.hide();
      console.log(error);
      this.util.apiErrorHandler(error);
    });
  }

  openSettings() {
    this.router.navigate(['app-settings']);
  }

  openBuy() {
    window.open('https://codecanyon.net/user/initappz/portfolio', '_blank');
  }
}
