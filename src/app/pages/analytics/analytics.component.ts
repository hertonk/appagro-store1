/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2021-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ApiService } from '../../services/api.service';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  public barChartOptions: any = {
    responsive: true,
  };
  public barChartType = 'bar';
  public doughnutChartType = 'doughnut';
  todayStates = {
    total: 0,
    totalSold: 0,
    label: ''
  }

  weeekStates = {
    label: '',
    total: 0,
    totalSold: 0
  }

  monthStats = {
    label: '',
    total: 0,
    totalSold: 0
  }

  todayStatesRejected = {
    total: 0,
    totalSold: 0,
  }

  weeekStatesRejected = {
    total: 0,
    totalSold: 0
  }

  monthStatsRejected = {
    total: 0,
    totalSold: 0
  }

  topProducts: any[] = [];
  monthsChartData: any[] = [];
  weeksChartData: any[] = [];
  todayChartData: any[] = [];
  complaints: any[] = [];
  reasons: any[] = [
    'The product arrived too late',
    'The product did not match the description',
    'The purchase was fraudulent',
    'The product was damaged or defective',
    'The merchant shipped the wrong item',
    'Wrong Item Size or Wrong Product Shipped',
    'Driver arrived too late',
    'Driver behavior',
    'Store Vendors behavior',
    'Issue with Payment Amout',
    'Others',
  ];

  issue_With: any[] = [
    '',
    'Order',
    'Store',
    'Driver',
    'Product'
  ];

  public barChartLabelsMonths: string[] = [];
  public barChartLabelsWeeks: string[] = [];
  public barChartLabelsToday: string[] = [];
  // public barChartType: ChartType = 'bar';
  public barChartLegend = false;
  public barChartPlugins = [];

  public barChartDataMonths: any[] = [
    { data: [], label: 'Monthly' }
  ];
  public barChartDataWeeks: any[] = [
    { data: [], label: 'Weekly' }
  ];
  public barChartDataToday: any[] = [
    { data: [], label: 'Today' }
  ];
  public doughnutChartLabels: string[] = [];
  public doughnutChartData: any[] = [
    { data: [] }
  ];

  // public doughnutChartType: ChartType = 'doughnut';

  public topProductsChartData: any[] = [];
  monthLabel: any = '';

  constructor(
    public util: UtilService,
    public api: ApiService
  ) {
    this.getStasData();
  }

  ngOnInit(): void {
  }

  getStasData() {
    this.api.post_private('v1/orders/getStoreStatsData', { id: localStorage.getItem('uid') }).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200 && data.data) {
        const week = data.data.week.data;
        const month = data.data.month.data;
        const today = data.data.today.data;
        this.complaints = data.data.complaints;
        this.weeekStates.label = data.data.week.label;
        this.todayStates.label = data.data.today.label;
        this.monthStats.label = data.data.month.label;
        console.log(week);
        let weekDeliveredOrder: any[] = [];
        let weekDeliveredTotal: any = 0;
        let weekRejectedOrder: any[] = [];
        let weekRejectedTotal: any = 0;

        let monthDeliveredOrder: any[] = [];
        let monthDeliveredTotal: any = 0;
        let monthRejectOrder: any[] = [];
        let monthRejectedTotal: any = 0;

        let todayDeliveredOrder: any[] = [];
        let todayDeliveredTotal: any = 0;
        let todayRejectOrder: any[] = [];
        let todayRejectedTotal: any = 0;

        let allOrders: any[] = [];

        today.forEach(async (element) => {
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.orders)) {
            element.orders = JSON.parse(element.orders);
            element.orders = element.orders.filter(x => x.store_id == localStorage.getItem('uid'));
            if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.status)) {
              const info = JSON.parse(element.status);
              const selected = info.filter(x => x.id == localStorage.getItem('uid'));
              if (selected && selected.length) {
                element.orders.forEach(element => {
                  allOrders.push(element);
                });
                const status = selected[0].status;

                if (status == 'delivered') {
                  element.orders.forEach(order => {
                    let price = 0;
                    if (order.variations && order.variations !== '' && typeof order.variations == 'string') {
                      console.log('strings', element.id);
                      order.variations = JSON.parse(order.variations);
                      console.log(order['variant']);
                      if (order["variant"] == undefined) {
                        order['variant'] = 0;
                      }
                    }
                    if (order && order.discount == 0) {
                      if (order.size == 1) {
                        if (order.variations[0].items[order.variant].discount && order.variations[0].items[order.variant].discount !== 0) {
                          price = price + (parseFloat(order.variations[0].items[order.variant].discount) * order.quantiy);
                        } else {
                          price = price + (parseFloat(order.variations[0].items[order.variant].price) * order.quantiy);
                        }
                      } else {
                        price = price + (parseFloat(order.original_price) * order.quantiy);
                      }
                    } else {
                      if (order.size == 1) {
                        if (order.variations[0].items[order.variant].discount && order.variations[0].items[order.variant].discount !== 0) {
                          price = price + (parseFloat(order.variations[0].items[order.variant].discount) * order.quantiy);
                        } else {
                          price = price + (parseFloat(order.variations[0].items[order.variant].price) * order.quantiy);
                        }
                      } else {
                        price = price + (parseFloat(order.sell_price) * order.quantiy);
                      }
                    }
                    todayDeliveredTotal = todayDeliveredTotal + price;
                    todayDeliveredOrder.push(order);
                  });
                }
                if (status == 'rejected' || status == 'cancelled') {
                  element.orders.forEach(order => {
                    let price = 0;
                    if (order.variations && order.variations !== '' && typeof order.variations == 'string') {
                      console.log('strings', element.id);
                      order.variations = JSON.parse(order.variations);
                      console.log(order['variant']);
                      if (order["variant"] == undefined) {
                        order['variant'] = 0;
                      }
                    }
                    if (order && order.discount == 0) {
                      if (order.size == 1) {
                        if (order.variations[0].items[order.variant].discount && order.variations[0].items[order.variant].discount !== 0) {
                          price = price + (parseFloat(order.variations[0].items[order.variant].discount) * order.quantiy);
                        } else {
                          price = price + (parseFloat(order.variations[0].items[order.variant].price) * order.quantiy);
                        }
                      } else {
                        price = price + (parseFloat(order.original_price) * order.quantiy);
                      }
                    } else {
                      if (order.size == 1) {
                        if (order.variations[0].items[order.variant].discount && order.variations[0].items[order.variant].discount !== 0) {
                          price = price + (parseFloat(order.variations[0].items[order.variant].discount) * order.quantiy);
                        } else {
                          price = price + (parseFloat(order.variations[0].items[order.variant].price) * order.quantiy);
                        }
                      } else {
                        price = price + (parseFloat(order.sell_price) * order.quantiy);
                      }
                    }
                    todayRejectedTotal = todayRejectedTotal + price;
                    todayRejectOrder.push(order);
                  });
                }
              }
            }
          }
        });

        const todaysDateChart = [...new Set(today.map(item => moment(item.date_time).format('DD-MMM hh: a')))];
        let todaysDataChart: any[] = [];
        todaysDateChart.forEach(dt => {
          const item = {
            date: dt,
            sells: today.filter(x => moment(x.date_time).format('DD-MMM hh: a') == dt),
            totalSell: 0
          }
          todaysDataChart.push(item)
        });
        todaysDataChart.forEach(data => {
          let orderTotal = 0;
          data.sells.forEach(element => {
            element.orders.forEach(order => {
              let price = 0;
              if (order.variations && order.variations !== '' && typeof order.variations == 'string') {
                console.log('strings', element.id);
                order.variations = JSON.parse(order.variations);
                console.log(order['variant']);
                if (order["variant"] == undefined) {
                  order['variant'] = 0;
                }
              }
              if (order && order.discount == 0) {
                if (order.size == 1) {
                  if (order.variations[0].items[order.variant].discount && order.variations[0].items[order.variant].discount !== 0) {
                    price = price + (parseFloat(order.variations[0].items[order.variant].discount) * order.quantiy);
                  } else {
                    price = price + (parseFloat(order.variations[0].items[order.variant].price) * order.quantiy);
                  }
                } else {
                  price = price + (parseFloat(order.original_price) * order.quantiy);
                }
              } else {
                if (order.size == 1) {
                  if (order.variations[0].items[order.variant].discount && order.variations[0].items[order.variant].discount !== 0) {
                    price = price + (parseFloat(order.variations[0].items[order.variant].discount) * order.quantiy);
                  } else {
                    price = price + (parseFloat(order.variations[0].items[order.variant].price) * order.quantiy);
                  }
                } else {
                  price = price + (parseFloat(order.sell_price) * order.quantiy);
                }
              }
              orderTotal = orderTotal + price;
            });
          });
          data.totalSell = orderTotal;
          console.log('order total ->', orderTotal);
        });
        this.todayChartData = todaysDataChart;
        console.log('todayChartData data chart', todaysDataChart);

        week.forEach(async (element) => {
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.orders)) {
            element.orders = JSON.parse(element.orders);
            element.orders = element.orders.filter(x => x.store_id == localStorage.getItem('uid'));
            if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.status)) {
              const info = JSON.parse(element.status);
              const selected = info.filter(x => x.id == localStorage.getItem('uid'));
              if (selected && selected.length) {
                element.orders.forEach(element => {
                  allOrders.push(element);
                });
                const status = selected[0].status;

                if (status == 'delivered') {
                  element.orders.forEach(order => {
                    let price = 0;
                    if (order.variations && order.variations !== '' && typeof order.variations == 'string') {
                      console.log('strings', element.id);
                      order.variations = JSON.parse(order.variations);
                      console.log(order['variant']);
                      if (order["variant"] == undefined) {
                        order['variant'] = 0;
                      }
                    }
                    if (order && order.discount == 0) {
                      if (order.size == 1) {
                        if (order.variations[0].items[order.variant].discount && order.variations[0].items[order.variant].discount !== 0) {
                          price = price + (parseFloat(order.variations[0].items[order.variant].discount) * order.quantiy);
                        } else {
                          price = price + (parseFloat(order.variations[0].items[order.variant].price) * order.quantiy);
                        }
                      } else {
                        price = price + (parseFloat(order.original_price) * order.quantiy);
                      }
                    } else {
                      if (order.size == 1) {
                        if (order.variations[0].items[order.variant].discount && order.variations[0].items[order.variant].discount !== 0) {
                          price = price + (parseFloat(order.variations[0].items[order.variant].discount) * order.quantiy);
                        } else {
                          price = price + (parseFloat(order.variations[0].items[order.variant].price) * order.quantiy);
                        }
                      } else {
                        price = price + (parseFloat(order.sell_price) * order.quantiy);
                      }
                    }
                    weekDeliveredTotal = weekDeliveredTotal + price;
                    weekDeliveredOrder.push(order);
                  });
                }
                if (status == 'rejected' || status == 'cancelled') {
                  element.orders.forEach(order => {
                    let price = 0;
                    if (order.variations && order.variations !== '' && typeof order.variations == 'string') {
                      console.log('strings', element.id);
                      order.variations = JSON.parse(order.variations);
                      console.log(order['variant']);
                      if (order["variant"] == undefined) {
                        order['variant'] = 0;
                      }
                    }
                    if (order && order.discount == 0) {
                      if (order.size == 1) {
                        if (order.variations[0].items[order.variant].discount && order.variations[0].items[order.variant].discount !== 0) {
                          price = price + (parseFloat(order.variations[0].items[order.variant].discount) * order.quantiy);
                        } else {
                          price = price + (parseFloat(order.variations[0].items[order.variant].price) * order.quantiy);
                        }
                      } else {
                        price = price + (parseFloat(order.original_price) * order.quantiy);
                      }
                    } else {
                      if (order.size == 1) {
                        if (order.variations[0].items[order.variant].discount && order.variations[0].items[order.variant].discount !== 0) {
                          price = price + (parseFloat(order.variations[0].items[order.variant].discount) * order.quantiy);
                        } else {
                          price = price + (parseFloat(order.variations[0].items[order.variant].price) * order.quantiy);
                        }
                      } else {
                        price = price + (parseFloat(order.sell_price) * order.quantiy);
                      }
                    }
                    weekRejectedTotal = weekRejectedTotal + price;
                    weekRejectedOrder.push(order);
                  });
                }
              }
            }
          }
        });
        const weeksDateChart = [...new Set(week.map(item => moment(item.date_time).format('DD MMM')))];
        let weeksDataChart: any[] = [];
        weeksDateChart.forEach(dt => {
          const item = {
            date: dt,
            sells: week.filter(x => moment(x.date_time).format('DD MMM') == dt),
            totalSell: 0
          }
          weeksDataChart.push(item)
        });
        weeksDataChart.forEach(data => {
          let orderTotal = 0;
          data.sells.forEach(element => {
            element.orders.forEach(order => {
              let price = 0;
              if (order.variations && order.variations !== '' && typeof order.variations == 'string') {
                console.log('strings', element.id);
                order.variations = JSON.parse(order.variations);
                console.log(order['variant']);
                if (order["variant"] == undefined) {
                  order['variant'] = 0;
                }
              }
              if (order && order.discount == 0) {
                if (order.size == 1) {
                  if (order.variations[0].items[order.variant].discount && order.variations[0].items[order.variant].discount !== 0) {
                    price = price + (parseFloat(order.variations[0].items[order.variant].discount) * order.quantiy);
                  } else {
                    price = price + (parseFloat(order.variations[0].items[order.variant].price) * order.quantiy);
                  }
                } else {
                  price = price + (parseFloat(order.original_price) * order.quantiy);
                }
              } else {
                if (order.size == 1) {
                  if (order.variations[0].items[order.variant].discount && order.variations[0].items[order.variant].discount !== 0) {
                    price = price + (parseFloat(order.variations[0].items[order.variant].discount) * order.quantiy);
                  } else {
                    price = price + (parseFloat(order.variations[0].items[order.variant].price) * order.quantiy);
                  }
                } else {
                  price = price + (parseFloat(order.sell_price) * order.quantiy);
                }
              }
              orderTotal = orderTotal + price;
            });
          });
          data.totalSell = orderTotal;
          console.log('order total ->', orderTotal);
        });

        this.weeksChartData = weeksDataChart;
        console.log('weeks data chart', weeksDataChart);
        month.forEach(async (element) => {
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.orders)) {
            element.orders = JSON.parse(element.orders);

            element.orders = element.orders.filter(x => x.store_id == localStorage.getItem('uid'));

            if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.status)) {
              const info = JSON.parse(element.status);
              const selected = info.filter(x => x.id == localStorage.getItem('uid'));
              if (selected && selected.length) {
                element.orders.forEach(element => {
                  allOrders.push(element);
                });
                const status = selected[0].status;

                if (status == 'delivered') {
                  element.orders.forEach(order => {
                    let price = 0;
                    if (order.variations && order.variations !== '' && typeof order.variations == 'string') {
                      console.log('strings', element.id);
                      order.variations = JSON.parse(order.variations);
                      console.log(order['variant']);
                      if (order["variant"] == undefined) {
                        order['variant'] = 0;
                      }
                    }
                    if (order && order.discount == 0) {
                      if (order.size == 1) {
                        if (order.variations[0].items[order.variant].discount && order.variations[0].items[order.variant].discount !== 0) {
                          price = price + (parseFloat(order.variations[0].items[order.variant].discount) * order.quantiy);
                        } else {
                          price = price + (parseFloat(order.variations[0].items[order.variant].price) * order.quantiy);
                        }
                      } else {
                        price = price + (parseFloat(order.original_price) * order.quantiy);
                      }
                    } else {
                      if (order.size == 1) {
                        if (order.variations[0].items[order.variant].discount && order.variations[0].items[order.variant].discount !== 0) {
                          price = price + (parseFloat(order.variations[0].items[order.variant].discount) * order.quantiy);
                        } else {
                          price = price + (parseFloat(order.variations[0].items[order.variant].price) * order.quantiy);
                        }
                      } else {
                        price = price + (parseFloat(order.sell_price) * order.quantiy);
                      }
                    }
                    monthDeliveredTotal = monthDeliveredTotal + price;
                    monthDeliveredOrder.push(order);
                  });
                }
                if (status == 'rejected' || status == 'cancelled') {
                  element.orders.forEach(order => {
                    let price = 0;
                    if (order.variations && order.variations !== '' && typeof order.variations == 'string') {
                      console.log('strings', element.id);
                      order.variations = JSON.parse(order.variations);
                      console.log(order['variant']);
                      if (order["variant"] == undefined) {
                        order['variant'] = 0;
                      }
                    }
                    if (order && order.discount == 0) {
                      if (order.size == 1) {
                        if (order.variations[0].items[order.variant].discount && order.variations[0].items[order.variant].discount !== 0) {
                          price = price + (parseFloat(order.variations[0].items[order.variant].discount) * order.quantiy);
                        } else {
                          price = price + (parseFloat(order.variations[0].items[order.variant].price) * order.quantiy);
                        }
                      } else {
                        price = price + (parseFloat(order.original_price) * order.quantiy);
                      }
                    } else {
                      if (order.size == 1) {
                        if (order.variations[0].items[order.variant].discount && order.variations[0].items[order.variant].discount !== 0) {
                          price = price + (parseFloat(order.variations[0].items[order.variant].discount) * order.quantiy);
                        } else {
                          price = price + (parseFloat(order.variations[0].items[order.variant].price) * order.quantiy);
                        }
                      } else {
                        price = price + (parseFloat(order.sell_price) * order.quantiy);
                      }
                    }
                    monthRejectedTotal = monthRejectedTotal + price;
                    monthRejectOrder.push(order);
                  });
                }
              }
            }
          }
        });
        const monthsDateChart = [...new Set(month.map(item => moment(item.date_time).format('DD MMM')))];
        let monthsDataChart: any[] = [];
        monthsDateChart.forEach(dt => {
          const item = {
            date: dt,
            sells: month.filter(x => moment(x.date_time).format('DD MMM') == dt),
            totalSell: 0
          }
          monthsDataChart.push(item)
        });
        monthsDataChart.forEach(data => {
          let orderTotal = 0;
          data.sells.forEach(element => {
            element.orders.forEach(order => {
              let price = 0;
              if (order.variations && order.variations !== '' && typeof order.variations == 'string') {
                console.log('strings', element.id);
                order.variations = JSON.parse(order.variations);
                console.log(order['variant']);
                if (order["variant"] == undefined) {
                  order['variant'] = 0;
                }
              }
              if (order && order.discount == 0) {
                if (order.size == 1) {
                  if (order.variations[0].items[order.variant].discount && order.variations[0].items[order.variant].discount !== 0) {
                    price = price + (parseFloat(order.variations[0].items[order.variant].discount) * order.quantiy);
                  } else {
                    price = price + (parseFloat(order.variations[0].items[order.variant].price) * order.quantiy);
                  }
                } else {
                  price = price + (parseFloat(order.original_price) * order.quantiy);
                }
              } else {
                if (order.size == 1) {
                  if (order.variations[0].items[order.variant].discount && order.variations[0].items[order.variant].discount !== 0) {
                    price = price + (parseFloat(order.variations[0].items[order.variant].discount) * order.quantiy);
                  } else {
                    price = price + (parseFloat(order.variations[0].items[order.variant].price) * order.quantiy);
                  }
                } else {
                  price = price + (parseFloat(order.sell_price) * order.quantiy);
                }
              }
              orderTotal = orderTotal + price;
            });
          });
          data.totalSell = orderTotal;
          console.log('order total ->', orderTotal);
        });
        this.monthsChartData = monthsDataChart;
        console.log('months data chart', monthsDataChart);

        this.todayStates.total = todayDeliveredTotal;
        this.todayStates.totalSold = todayDeliveredOrder.length;

        this.todayStatesRejected.total = todayRejectedTotal;
        this.todayStatesRejected.totalSold = todayRejectOrder.length;

        this.weeekStates.total = weekDeliveredTotal;
        this.weeekStates.totalSold = weekDeliveredOrder.length;

        this.weeekStatesRejected.total = weekRejectedTotal;
        this.weeekStatesRejected.totalSold = weekRejectedOrder.length;

        this.monthStats.total = monthDeliveredTotal;
        this.monthStats.totalSold = monthDeliveredOrder.length;

        this.monthStatsRejected.total = monthRejectedTotal;
        this.monthStatsRejected.totalSold = monthRejectOrder.length;

        console.log('today delivered', todayDeliveredOrder, todayDeliveredTotal);
        console.log('today rejected', todayRejectOrder, todayRejectedTotal);

        console.log('week delivered', weekDeliveredOrder, weekDeliveredTotal);
        console.log('week rejected', weekRejectedOrder, weekRejectedTotal);

        console.log('month delivered', monthDeliveredOrder, monthDeliveredTotal);
        console.log('month rejected', monthRejectOrder, monthRejectedTotal);



        console.log('all Order', allOrders);
        const uniqueId = [...new Set(allOrders.map(item => item.id))];
        console.log(uniqueId);
        let topProducts: any[] = [];
        uniqueId.forEach(element => {
          const info = allOrders.filter(x => x.id == element);
          if (info && info.length > 0) {
            if (topProducts.length < 10) {
              const item = {
                id: element,
                items: info[0],
                counts: info.length
              };
              topProducts.push(item);
            }
          }
        });
        this.topProducts = topProducts.sort(({ counts: a }, { counts: b }) => b - a);
        console.log(topProducts);
        console.log(this.topProducts);
        this.openChart();
      }
    }, error => {
      console.log(error);
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.util.apiErrorHandler(error);
    });
  }

  async openChart() {
    console.log('parse chart');
    this.topProducts.forEach(element => {
      this.doughnutChartLabels.push(element.items.name);
      this.doughnutChartData[0].data.push(element.counts);
    });

    this.monthsChartData.forEach(element => {
      this.barChartLabelsMonths.push(element.date);
      this.barChartDataMonths[0].data.push(element.totalSell);
    });

    this.weeksChartData.forEach(element => {
      this.barChartLabelsWeeks.push(element.date);
      this.barChartDataWeeks[0].data.push(element.totalSell);
    });

    this.todayChartData.forEach(element => {
      this.barChartLabelsToday.push(element.date);
      this.barChartDataToday[0].data.push(element.totalSell);
    });

    this.monthLabel = this.monthStats.label;

    console.log(this);
  }
}
