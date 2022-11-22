/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2021-present initappz.
*/
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  baseUrl: 'https://appagro.online/public/api/', // ex https://yourapi.com/public/api/ don't forgot to add public/api/ at the end
  imageUrl: 'https://appagro.online/public/storage/images/', // ex https://yourapi.com/public/storage/images/ don't forgot to add public/storage/images at the end
  firebase: {
    apiKey: "AIzaSyBbfFalcBk9_Xz1mQl26oIsqQIEMR3KVC8",
  authDomain: "antonio-1b52f.firebaseapp.com",
  projectId: "antonio-1b52f",
  storageBucket: "antonio-1b52f.appspot.com",
  messagingSenderId: "770004798772",
  appId: "1:770004798772:web:da5fe3e7551c8545f9e961",
  measurementId: "G-W235YXENXL"
  }
};
