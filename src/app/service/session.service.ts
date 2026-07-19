//=============================================================================
//===
//=== Copyright (C) 2022-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {Injectable} from '@angular/core';

import {AppEvent}           from "../model/event";
import {AbstractSubscriber} from "./abstract-subscriber";
import {EventBusService}    from "./eventbus.service";
import {HttpService}        from "./http.service";
import {
  LoginResponse,
  OidcSecurityService,
  PublicEventsService,
  UserDataResult
} from "angular-auth-oidc-client";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {UserInfo} from "../model/user";

//=============================================================================

@Injectable()
export class SessionService extends AbstractSubscriber {

	//-------------------------------------------------------------------------
	//---
	//--- Variables
	//---
	//-------------------------------------------------------------------------

	// public permissions : Map<string, boolean>;

  accessToken     : string|null = null;

  user? : UserInfo

	//-------------------------------------------------------------------------
	//---
	//--- Constructor
	//---
	//-------------------------------------------------------------------------

	constructor(eventBusService: EventBusService,
              private oidcSecurityService: OidcSecurityService,
              private publicEventService : PublicEventsService) {
		super(eventBusService);

    //--- isAuthenticated$ emits on both initial auth and silent-renew success
    //--- (NewAuthenticationResult only fires on failure/error paths in v20)

    oidcSecurityService.isAuthenticated$.subscribe(() => {
      oidcSecurityService.getAccessToken().subscribe((token) => {
        this.accessToken = token
      })
    });
    console.log("Building session service......")
	}

	//-------------------------------------------------------------------------
	//---
	//--- API methods
	//---
	//-------------------------------------------------------------------------

  public checkAuthentication() {
    console.log("Checking authentication...")

    this.oidcSecurityService.checkAuth().subscribe((res : LoginResponse) => {
      if (res.isAuthenticated && res.userData) {
        console.log('User is authenticated');

        let u = new UserInfo()
        u.uuid       = res.userData.sub
        u.username   = res.userData.preferred_username;
        u.name       = res.userData.given_name;
        u.surname    = res.userData.family_name;
        u.email      = res.userData.email;
        u.displayName= res.userData.name;

        this.user        = u
        this.accessToken = res.accessToken
      }
      else {
        console.log("User not authenticated. Redirecting to login page...");
        this.login();
      }
    });
  }

  //-------------------------------------------------------------------------

  login() {
    this.accessToken = null
    this.user        = undefined

    console.log('Calling login...');
    this.oidcSecurityService.authorize();
  }

  //-------------------------------------------------------------------------

  logout() {
    console.log('Calling logout...');
    this.oidcSecurityService.logoffAndRevokeTokens().subscribe((result) => {
      console.log(result)
      this.accessToken = null;
      this.user        = undefined
    });
  }

	//-------------------------------------------------------------------------

	// public hasPermission(name : string) : boolean | undefined {
	// 	return this.permissions.get(name);
	// }

	//-------------------------------------------------------------------------
	//---
	//--- Private methods
	//---
	//-------------------------------------------------------------------------

	// private loginSuccess(session: Session): void {
  //
	// 	this.session     = session;
	// 	this.user        = session.user;
	// 	this.profile     = session.profile;
	// 	this.permissions = this.setupPermissionMap(this.profile.permissions);
  //
	// 	super.emitToApp(new AppEvent(AppEvent.LOGIN_SUCCESS, session));
  //
	// 	console.log("Login successful for user="+ this.user.username);
	// }

	//-------------------------------------------------------------------------

	// private logoutSuccess(): void {
  //
	// 	let username = this.user.username;
  //
	// 	this.clearSession();
	// 	super.emitToApp(new AppEvent(AppEvent.LOGOUT_SUCCESS, username));
  //
	// 	console.log("Logout successful for user="+ username);
	// }

	//-------------------------------------------------------------------------

	// private logoutError(response: any): void {
  //
	// 	this.clearSession();
	// 	super.emitToApp(new AppEvent(AppEvent.LOGOUT_FAILED));
	// }

	//-------------------------------------------------------------------------

	private setupPermissionMap(permissions : string[]) : Map<string, boolean> {

		let map = new Map<string, boolean>();

		permissions.forEach((p : string) => map.set(p, true));

		return map;
	}

	//-------------------------------------------------------------------------
	//---
	//--- Events
	//---
	//-------------------------------------------------------------------------

	// private onInvalidToken(event : AppEvent) {
	// 	this.clearSession();
	// }
}

//=============================================================================
