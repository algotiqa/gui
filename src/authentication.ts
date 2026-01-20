//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {LogLevel, PassedInitialConfig} from "angular-auth-oidc-client";

//=============================================================================

export const authConfig : PassedInitialConfig = {
  config: {
    authority: 'https://algotiqa-server:8443/auth/realms/algotiqa',
    redirectUrl: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
    clientId: 'algotiqa-frontend',
    scope: 'openid profile email offline_access',
    responseType: 'code',
    silentRenew: true,
    useRefreshToken: true,
    ignoreNonceAfterRefresh: true,
    triggerRefreshWhenIdTokenExpired: false,
    logLevel: LogLevel.Debug,
    secureRoutes: [ 'https://algotiqa-server:8443/' ],
  },
}

//=============================================================================
