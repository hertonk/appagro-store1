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
  baseUrl: 'https://YOUR_API_URL/public/api/', // ex https://yourapi.com/public/api/ don't forgot to add public/api/ at the end
  imageUrl: 'https://YOUR_API_URL/public/storage/images/', // ex https://yourapi.com/public/storage/images/ don't forgot to add public/storage/images at the end
  firebase: {
    apiKey: "YOURKEY",
    authDomain: "YOURKEY",
    projectId: "YOURKEY",
    storageBucket: "YOURKEY",
    messagingSenderId: "YOURKEY",
    appId: "YOURKEY"
  }
};
