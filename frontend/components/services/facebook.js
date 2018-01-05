import { FACEBOOK_APP_ID } from '../../../config-public.js';
import {loginViaFacebook} from '../authorization/auth';

let FBSDKPromise;

export function isReady() {
  if (!FBSDKPromise) {
    FBSDKPromise = new Promise(resolve => {
      FB.init({
        appId: FACEBOOK_APP_ID,
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v2.5'
      });
      resolve();
    });
  }

  return FBSDKPromise;
}

export function loginIfHasPermissions() {
  return isReady()
    .then(() => new Promise((resolve, reject) =>
      FB.getLoginStatus(resp => isAuthorized(resp) ? resolve(resp.authResponse) : reject())
    ))
    .then(profile => loginViaFacebook(profile.accessToken));
}

export function login() {
  return isReady()
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
