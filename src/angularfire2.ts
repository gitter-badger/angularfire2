import {APP_INITIALIZER, Inject, Injectable, OpaqueToken, provide, Provider} from 'angular2/core';
import {FirebaseAuth, firebaseAuthConfig} from './providers/auth';
import * as Firebase from 'firebase';
import {FirebaseListObservable} from './utils/firebase_list_observable';
import {FirebaseObjectObservable} from './utils/firebase_object_observable';
import {FirebaseListFactory, FirebaseListFactoryOpts} from './utils/firebase_list_factory';
import {
  FirebaseObjectFactoryOpts,
  FirebaseObjectFactory
} from './utils/firebase_object_factory';
import {FirebaseUrl, FirebaseRef} from './tokens';
import {
  AuthBackend,
  AuthMethods,
  AuthProviders,
  FirebaseAuthState
} from './providers/auth_backend';
import {FirebaseSdkAuthBackend} from './providers/firebase_sdk_auth_backend';

@Injectable()
export class AngularFire {
  constructor(
    @Inject(FirebaseUrl) private fbUrl:string,
    public auth:FirebaseAuth) {
  }
  list (url:string, opts?:FirebaseListFactoryOpts):FirebaseListObservable<any[]> {
    return FirebaseListFactory(getAbsUrl(this.fbUrl, url), opts);
  }
  object(url: string, opts?:FirebaseObjectFactoryOpts):FirebaseObjectObservable<any> {
    return FirebaseObjectFactory(getAbsUrl(this.fbUrl, url), opts);
  }
}

function getAbsUrl (root:string, url:string) {
  if (!(/^[a-z]+:\/\/.*/.test(url))) {
    // Provided url is relative.
    url = root + url;
  }
  return url;
}

export const COMMON_PROVIDERS: any[] = [
  provide(FirebaseRef, {
    useFactory: (url:string) => new Firebase(url),
    deps: [FirebaseUrl]}),
  FirebaseAuth,
  AngularFire
];

export const FIREBASE_PROVIDERS:any[] = [
  COMMON_PROVIDERS,
  provide(AuthBackend, {
    useFactory: (ref: Firebase) => new FirebaseSdkAuthBackend(ref, false),
    deps: [FirebaseRef]
  })
];

/**
 * Used to define the default Firebase root location to be
 * used throughout an application.
 */
export const defaultFirebase = (url: string): Provider => {
  return provide(FirebaseUrl, {
    useValue: url
  });
};

export {
  FirebaseAuth,
  FirebaseListObservable,
  FirebaseObjectObservable,
  firebaseAuthConfig,
  FirebaseAuthState,
  AuthMethods,
  AuthProviders
}

export {FirebaseUrl, FirebaseRef, FirebaseAuthConfig} from './tokens';

// Helps Angular-CLI automatically add providers
export default {
  providers: FIREBASE_PROVIDERS
}

