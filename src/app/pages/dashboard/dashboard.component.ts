/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2021-present initappz.
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import * as moment from 'moment';
import { ApiService } from '../../services/api.service';
import { UtilService } from '../../services/util.service';
@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  newOrders: any[] = [];
  onGoingOrders: any[] = [];
  oldOrders: any[] = [];
  dummy = Array(5);
  olders: any[] = [];
  constructor(
    public api: ApiService,
    public util: UtilService,
    private router: Router
  ) {
    this.getOrders();
  }

  getOrders() {
    const param = {
      id: localStorage.getItem('uid'),
      limit: 5000000
    };

    this.api.post_private('v1/orders/getByStoreForApps', param).then((data: any) => {
      console.log('by store id', data);
      this.dummy = [];
      this.newOrders = [];
      this.onGoingOrders = [];
      this.oldOrders = [];
      this.olders = [];
      if (data && data.status && data.status == 200 && data.data.length > 0) {
        data.data.forEach(async (element, index) => {
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.orders)) {
            element.orders = JSON.parse(element.orders);
            element.date_time = moment(element.date_time).format('dddd, MMMM Do YYYY');
            element.orders = await element.orders.filter(x => x.store_id == localStorage.getItem('uid'));
            if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.status)) {
              const info = JSON.parse(element.status);
              const selected = info.filter(x => x.id == localStorage.getItem('uid'));
              if (selected && selected.length) {
                element.orders.forEach(order => {
                  if (order.variations && order.variations !== '' && typeof order.variations == 'string') {
                    console.log('strings', element.id);
                    order.variations = JSON.parse(order.variations);
                    console.log(order['variant']);
                    if (order["variant"] == undefined) {
                      order['variant'] = 0;
                    }
                  }
                });

                const status = selected[0].status;
                element['storeStatus'] = status;
                if (status == 'created') {
                  this.newOrders.push(element);
                } else if (status == 'accepted' || status == 'picked' || status == 'ongoing') {
                  this.onGoingOrders.push(element);
                } else if (status == 'rejected' || status == 'cancelled' || status == 'delivered' || status == 'refund') {
                  this.olders.push(element);
                }
              }
            }
          }
        });
        console.log('older', this.olders);
        console.log('new ', this.newOrders);
        console.log('ongo ', this.onGoingOrders);

      }
    }, error => {
      console.log(error);
      this.dummy = [];
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.dummy = [];
      this.util.apiErrorHandler(error);
    });
  }

  ngOnInit() {

  }

  goToOrder(item) {
    console.log(item);
    const navData: NavigationExtras = {
      queryParams: {
        id: item.id
      }
    };
    this.router.navigate(['/order-detail'], navData);
  }
}
