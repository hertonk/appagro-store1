/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2021-present initappz.
*/
import { ApiService } from './services/api.service';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { IconSetService } from '@coreui/icons-angular';
import { freeSet } from '@coreui/icons';
import { UtilService } from './services/util.service';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>',
  providers: [IconSetService],

})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    public iconSet: IconSetService,
    public api: ApiService,
    public util: UtilService
  ) {
    // iconSet singleton
    iconSet.icons = { ...freeSet };
    const language = localStorage.getItem('translateKey');
    if (language && language != null && language != 'null') {
      this.getByLanguagesID(language);
    } else {
      this.getDefaultSettings();
    }
    if (localStorage.getItem('uid') != null && localStorage.getItem('uid') && localStorage.getItem('uid') !== '' && localStorage.getItem('uid') !== 'null') {
      this.getUserByID();
    }
  }


  getUserByID() {
    const body = {
      id: localStorage.getItem('uid')
    }
    this.api.post_private('v1/profile/getStoreFromId', body).then((data: any) => {
      console.log(">>>>><<<<<", data);
      if (data && data.success && data.status === 200) {
        this.util.userInfo = data.data;
        this.util.store = data.store;

      } else {
        localStorage.removeItem('uid');
        localStorage.removeItem('token');
      }
    }, err => {
      localStorage.removeItem('uid');
      localStorage.removeItem('token');
      this.util.userInfo = null;
      console.log(err);
    }).catch((err) => {
      localStorage.removeItem('uid');
      localStorage.removeItem('token');
      this.util.userInfo = null;
      console.log(err);
    });
  }

  saveSettings(data) {
    const lang = data && data.data && data.data.language ? data.data.language : null;
    if (lang && lang !== null) {
      this.util.translations = JSON.parse(lang.content);
      localStorage.setItem('translateKey', lang.id);
    }
    const settings = data && data.data && data.data.settings ? data.data.settings : null;
    if (settings) {
      this.util.appLogo = settings.logo;
      this.util.direction = settings.appDirection;
      this.util.app_status = settings.app_status === 1 ? true : false;
      this.util.app_color = settings.app_color;
      this.util.findType = settings.findType;
      this.util.login_style = settings.login_style;
      this.util.register_style = settings.register_style;
      this.util.currecny = settings.currencySymbol;
      this.util.cside = settings.currencySide;
      this.util.makeOrders = settings.makeOrders;
      this.util.smsGateway = settings.sms_name;
      this.util.user_login_with = settings.store_login;
      this.util.user_verification = settings.user_verify_with;
      this.util.reset_pwd = settings.reset_pwd;
      this.util.driver_assign = settings.driver_assign;
      // this.theme.setTheme({
      //   primary: this.util.app_color,
      //   secondary: '#0000FF',
      // });
      localStorage.setItem('theme', 'primary');
      if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(settings.country_modal)) {
        this.util.countrys = JSON.parse(settings.country_modal);
      }
      this.util.default_country_code = settings && settings.default_country_code ? settings.default_country_code : '91';
      document.documentElement.dir = this.util.direction;
    }

    const general = data && data.data && data.data.general ? data.data.general : null;
    if (general) {
      this.util.appName = general.name;
      this.util.general = general;
    }

    const served = data && data.data && data.data.we_served ? data.data.we_served : null;
    if (served) {
      this.util.servingCities = served;
    }

    const adminInfo = data && data.data && data.data.support ? data.data.support : null;
    if (adminInfo) {
      this.util.adminInfo = adminInfo;
    }
    console.log(this.util);
    // this.util.navigateRoot('');
  }
  getByLanguagesID(languageId) {
    this.api.post_public('v1/settings/getByLanguageId', { id: languageId }).then((data: any) => {
      console.log('settings by id', data);
      if (data && data.status && data.status == 200) {
        this.saveSettings(data);
      } else {
        this.router.navigate(['login']);
      }
    }, error => {
      console.log(error);
      this.util.apiErrorHandler(error);
      this.router.navigate(['login']);
    }).catch(error => {
      console.log(error);
      this.util.apiErrorHandler(error);
      this.router.navigate(['login']);
    });
  }

  getDefaultSettings() {
    this.api.get_public('v1/settings/getDefault').then((data: any) => {
      console.log('default settings', data);
      if (data && data.status && data.status == 200) {
        this.saveSettings(data);
      } else {
        this.router.navigate(['login']);
      }
    }, error => {
      console.log(error);
      this.util.apiErrorHandler(error);
      this.router.navigate(['login']);
    }).catch(error => {
      console.log(error);
      this.util.apiErrorHandler(error);
      this.router.navigate(['login']);
    });
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
