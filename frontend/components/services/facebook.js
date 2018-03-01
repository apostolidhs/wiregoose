import { FACEBOOK_APP_ID } from '../../../config-public.js';
import {loginViaFacebook} from '../authorization/auth';

let FBSDKPromise;

export function initialize() {
  if (!FBSDKPromise) {
    FBSDKPromise = new Promise(resolve => {
      window.fbAsyncInit = function() {
        FB.init({
          appId: FACEBOOK_APP_ID,
          autoLogAppEvents: true,
          xfbml: true,
          version: 'v2.12'
        });
        resolve();
      };

      (function(d, s, id){
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement(s); js.id = id;
         js.src = "https://connect.facebook.net/en_US/sdk.js";
         fjs.parentNode.insertBefore(js, fjs);
       }(document, 'script', 'facebook-jssdk'));
    });
  }

  return FBSDKPromise;
}

export function loginIfHasPermissions() {
  return initialize()
    .then(() => new Promise((resolve, reject) =>
      FB.getLoginStatus(resp => isAuthorized(resp) ? resolve(resp.authResponse) : reject())
    ))
    .then(profile => loginViaFacebook(profile.accessToken));
}

export function login() {
  return initialize()
    .then(() => new Promise((resolve, reject) =>
      FB.login(
        resp => isAuthorized(resp) ? resolve(resp.authResponse) : reject(),
        {scope: 'email'}
      )
    ))
    .then(profile => loginViaFacebook(profile.accessToken));
}

function isAuthorized(resp) {
  return resp.status === 'connected' && resp.authResponse;
}
