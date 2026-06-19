//=============================================================================
//===
//=== Copyright (C) 2023-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
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
