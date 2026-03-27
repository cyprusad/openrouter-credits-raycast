/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Management API Key - Go to https://openrouter.ai/settings/management-keys to create a management API key (not your regular API key). This key is used to read your credit balance. */
  "apiKey": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `openrouter-credits` command */
  export type OpenrouterCredits = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `openrouter-credits` command */
  export type OpenrouterCredits = {}
}

