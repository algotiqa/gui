//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

export interface HelpSubtopic {
  code : string;
  label: string;
}

//=============================================================================

export interface HelpTopic {
  code      : string;
  label     : string;
  subtopics : HelpSubtopic[];
}

//=============================================================================

export interface HelpTocGroup {
  title : string;
  topics: HelpTopic[];
}

//=============================================================================

export interface HelpToc {
  toc: HelpTocGroup[];
}

//=============================================================================

export interface HelpSelection {
  topic    : string;
  subtopic : string;
}

//=============================================================================
