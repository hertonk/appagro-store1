/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2021-present initappz.
*/
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { UtilService } from '../../services/util.service';
import Swal from 'sweetalert2';
import * as firebase from 'firebase';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {
  div: any = 1;
  otp_id: any = '';
  email: any = '';
  otpSent: boolean = false;
  otp: any = '';

  password: any = '';
  confirm: any = '';
  temp: any = '';

  country_code: any = '';
  mobile: any = '';
  recaptchaVerifier: firebase.default.auth.RecaptchaVerifier;
  constructor(
    public api: ApiService,
    public util: UtilService,
    private location: Location
  ) {
    setTimeout(() => {
      this.country_code = this.util.default_country_code;
    }, 1000);
  }

  ngOnInit() {
    setTimeout(() => {
      // if (!firebase.default.app.length) {
      //   firebase.default.initializeApp(environment.firebase);
      // } else {
      //   firebase.default.app();
      // }

      this.recaptchaVerifier = new firebase.default.auth.RecaptchaVerifier('sign-in-button', {
        size: 'invisible',
        callback: (response) => {

        },
        'expired-callback': () => {
        }
      });
    }, 5000);

  }
  onOtpChange(event) {
    console.log(event);
    this.otp = event;
  }

  goToTabs() {

    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailfilter.test(this.email)) {
      this.util.error(this.util.translate('Please enter valid email'));
      return false;
    }
    console.log('login');

    this.util.show();
    this.api.post_public('v1/auth/verifyEmailForReset', { email: this.email }).then((data: any) => {
      console.log(data);
      this.util.hide();
      if (data && data.status && data.status === 200 && data.data === true && data.otp_id) {
        // send otp from api
        // this.openVerificationModal(data.otp_id, this.login.email, this.login);
        this.otpSent = true;
        this.otp_id = data.otp_id;
      } else if (data && data.status && data.status === 500 && data.data === false) {
        this.util.error(data.message);
      }
    }, error => {
      this.util.hide();
      this.util.apiErrorHandler(error);
    }).catch((error) => {
      this.util.hide();
      console.log(error);
      this.util.apiErrorHandler(error);
    });
  }

  goToBack() {
    this.location.back();
  }

  sendPhoneOTP() {
    if (this.util.smsGateway == '2') {
      const param = {
        country_code: '+' + this.country_code,
        mobile: this.mobile
      }
      this.util.show();
      this.api.post_public('v1/auth/verifyPhoneForFirebase', param).then((data: any) => {
        console.log(data);
        this.util.hide();
        if (data && data.status && data.status == 200 && data.data) {
          console.log('open firebase web version');
          this.util.show();
          this.api.signInWithPhoneNumber(this.recaptchaVerifier, param.country_code + param.mobile).then(
            success => {
              this.util.hide();
              this.otpSent = true;
            }
          ).catch(error => {
            this.util.hide();
            console.log(error);
            this.util.error(error);
          });

        }
      }, error => {
        this.util.hide();
        this.util.apiErrorHandler(error);
      }).catch((error) => {
        this.util.hide();
        console.log(error);
        this.util.apiErrorHandler(error);
      });
    } else {
      this.util.show();
      const param = {
        country_code: '+' + this.country_code,
        mobile: this.mobile
      }
      this.api.post_public('v1/otp/verifyPhone', param).then((data: any) => {
        console.log(data);
        this.util.hide();
        if (data && data.status && data.status == 200 && data.data == true && data.otp_id) {
          this.otp_id = data.otp_id;
          this.otpSent = true;
        } else if (data && data.status && data.status == 500 && data.data == false) {
          this.util.error(this.util.translate('Something went wrong'));
        }
      }, error => {
        this.util.hide();
        this.util.apiErrorHandler(error);
      }).catch((error) => {
        this.util.hide();
        console.log(error);
        this.util.apiErrorHandler(error);
      });
    }
  }

  verifyOTP() {
    if (this.otp == '' || this.otp == null || !this.otp) {
      this.util.error('OTP is required');
      return false;
    }
    console.log(this.otp_id, this.otp, this.util.reset_pwd);
    // this.div = 2;
    if (this.util.reset_pwd == 0) {
      this.verifyEmailOTP();
    } else if (this.util.smsGateway == '2' && this.util.reset_pwd == 1) {
      this.verifyFirebaseOTP();
    } else if (this.util.reset_pwd == 1 && this.util.smsGateway != '2') {
      this.verifyPhoneOTP();
    }
  }

  verifyEmailOTP() {
    const param = {
      id: this.otp_id,
      otp: this.otp,
      type: 'email',
      email: this.email,
      country_code: 'NA',
      mobile: 'NA'
    };
    this.util.show();
    this.api.post_public('v1/otp/verifyOTPReset', param).then((data: any) => {
      console.log(data);
      this.util.hide();
      if (data && data.status && data.status === 200 && data.data) {
        this.div = 2;
        this.temp = data.temp;
        console.log('temp token', this.temp);
      }
    }, error => {
      this.util.hide();
      console.log(error);
      if (error && error.status === 401 && error.error.error) {
        this.util.error(error.error.error);
        return false;
      }
      if (error && error.status === 500 && error.error.error) {
        this.util.error(error.error.error);
        return false;
      }
      this.util.hide();
      this.util.error(this.util.translate('Wrong OTP'));
    }).catch((error) => {
      this.util.hide();
      console.log(error);
      if (error && error.status === 401 && error.error.error) {
        this.util.error(error.error.error);
        return false;
      }
      if (error && error.status === 500 && error.error.error) {
        this.util.error(error.error.error);
        return false;
      }
      this.util.hide();
      this.util.error(this.util.translate('Wrong OTP'));
    });
  }

  verifyFirebaseOTP() {
    this.util.show();
    this.api.enterVerificationCode(this.otp).then(
      userData => {
        this.util.hide();
        this.generateTokenFromCreds();
        console.log(userData);
      }
    ).catch(error => {
      console.log(error);
      this.util.hide();
      this.util.error(error);
    });
  }

  generateTokenFromCreds() {
    this.util.show();
    const param = {
      country_code: '+' + this.country_code,
      mobile: this.mobile
    }
    this.api.post_public('v1/otp/generateTempToken', param).then((data: any) => {
      console.log(data);
      this.util.hide();
      if (data && data.status && data.status == 200) {
        this.div = 2;
        this.temp = data.temp;
        console.log('temp token', this.temp);
      }
    }, error => {
      this.util.hide();
      this.util.apiErrorHandler(error);
    }).catch((error) => {
      this.util.hide();
      console.log(error);
      this.util.apiErrorHandler(error);
    });
  }
  verifyPhoneOTP() {
    const param = {
      id: this.otp_id,
      otp: this.otp,
      type: 'phone',
      email: 'NA',
      country_code: '+' + this.country_code,
      mobile: this.mobile
    };
    this.util.show();
    this.api.post_public('v1/otp/verifyOTPReset', param).then((data: any) => {
      console.log(data);
      this.util.hide();
      if (data && data.status && data.status === 200 && data.data) {
        this.div = 2;
        this.temp = data.temp;
        console.log('temp token', this.temp);
      }
    }, error => {
      this.util.hide();
      console.log(error);
      if (error && error.status === 401 && error.error.error) {
        this.util.error(error.error.error);
        return false;
      }
      if (error && error.status === 500 && error.error.error) {
        this.util.error(error.error.error);
        return false;
      }
      this.util.hide();
      this.util.error(this.util.translate('Wrong OTP'));
    }).catch((error) => {
      this.util.hide();
      console.log(error);
      if (error && error.status === 401 && error.error.error) {
        this.util.error(error.error.error);
        return false;
      }
      if (error && error.status === 500 && error.error.error) {
        this.util.error(error.error.error);
        return false;
      }
      this.util.hide();
      this.util.error(this.util.translate('Wrong OTP'));
    });
  }

  updatePassword() {
    if (this.password == '' || this.password == null || !this.password || this.confirm == '' || this.confirm == null || !this.confirm) {
      this.util.error('Password is required');
      return false;
    }

    if (this.password != this.confirm) {
      this.util.error(this.util.translate('Password does not match'));
      return false;
    }

    console.log('update');
    if (this.util.reset_pwd == 0) {
      this.updatePasswordWithEmail();
    } else if (this.util.smsGateway == '2' && this.util.reset_pwd == 1) {
      this.updatePasswordFromFirebase();
    } else if (this.util.reset_pwd == 1 && this.util.smsGateway != '2') {
      this.updatePasswordWithPhone();
    }
  }

  updatePasswordWithEmail() {
    const param = {
      id: this.otp_id,
      email: this.email,
      password: this.password
    };
    this.util.show();
    this.api.post_temp('v1/password/updateUserPasswordWithEmail', param, this.temp).then((data: any) => {
      console.log(data);
      this.util.hide();
      if (data && data.status && data.status === 200 && data.data) {

        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: this.util.translate('Password Updated'),
          showConfirmButton: false,
          timer: 1500
        })
        this.location.back();
      }
    }, error => {
      this.util.hide();
      console.log(error);
      if (error && error.status === 401 && error.error.error) {
        this.util.error(error.error.error);
        return false;
      }
      if (error && error.status === 500 && error.error.error) {
        this.util.error(error.error.error);
        return false;
      }
      this.util.hide();
      this.util.error(this.util.translate('Wrong OTP'));
    }).catch((error) => {
      this.util.hide();
      console.log(error);
      if (error && error.status === 401 && error.error.error) {
        this.util.error(error.error.error);
        return false;
      }
      if (error && error.status === 500 && error.error.error) {
        this.util.error(error.error.error);
        return false;
      }
      this.util.hide();
      this.util.error(this.util.translate('Wrong OTP'));
    });
  }

  updatePasswordFromFirebase() {
    const param = {
      country_code: '+' + this.country_code,
      mobile: this.mobile,
      password: this.password,
    };
    this.api.post_temp('v1/password/updatePasswordFromFirebase', param, this.temp).then((data: any) => {
      console.log(data);
      this.util.hide();
      if (data && data.status && data.status === 200 && data.data) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: this.util.translate('Password Updated'),
          showConfirmButton: false,
          timer: 1500
        })
        this.location.back();
      }
    }, error => {
      this.util.hide();
      console.log(error);
      if (error && error.status === 401 && error.error.error) {
        this.util.error(error.error.error);
        return false;
      }
      if (error && error.status === 500 && error.error.error) {
        this.util.error(error.error.error);
        return false;
      }
      this.util.hide();
      this.util.error(this.util.translate('Wrong OTP'));
    }).catch((error) => {
      this.util.hide();
      console.log(error);
      if (error && error.status === 401 && error.error.error) {
        this.util.error(error.error.error);
        return false;
      }
      if (error && error.status === 500 && error.error.error) {
        this.util.error(error.error.error);
        return false;
      }
      this.util.hide();
      this.util.error(this.util.translate('Wrong OTP'));
    });
  }

  updatePasswordWithPhone() {

    const param = {
      id: this.otp_id,
      country_code: '+' + this.country_code,
      mobile: this.mobile,
      password: this.password,
      key: '+' + this.country_code + this.mobile
    };
    this.api.post_temp('v1/password/updateUserPasswordWithPhone', param, this.temp).then((data: any) => {
      console.log(data);
      this.util.hide();
      if (data && data.status && data.status === 200 && data.data) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: this.util.translate('Password Updated'),
          showConfirmButton: false,
          timer: 1500
        })
        this.location.back();
      }
    }, error => {
      this.util.hide();
      console.log(error);
      if (error && error.status === 401 && error.error.error) {
        this.util.error(error.error.error);
        return false;
      }
      if (error && error.status === 500 && error.error.error) {
        this.util.error(error.error.error);
        return false;
      }
      this.util.hide();
      this.util.error(this.util.translate('Wrong OTP'));
    }).catch((error) => {
      this.util.hide();
      console.log(error);
      if (error && error.status === 401 && error.error.error) {
        this.util.error(error.error.error);
        return false;
      }
      if (error && error.status === 500 && error.error.error) {
        this.util.error(error.error.error);
        return false;
      }
      this.util.hide();
      this.util.error(this.util.translate('Wrong OTP'));
    });
  }
}
