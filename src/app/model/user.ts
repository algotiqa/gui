//=============================================================================
//===
//=== Copyright (C) 2022-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

export enum Roles {
  ADMIN,
  EDITOR,
}

//=============================================================================

export class UserInfo {
  uuid        : string = ""
  username    : string = ""
  name        : string = ""
  surname     : string = ""
  email       : string = ""
  displayName : string = ""
}

//=============================================================================
