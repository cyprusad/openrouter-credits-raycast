/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Management API Key - Create a key with the Get Management API Key menu action, then paste it here. A regular inference API key cannot read credit data. */
  "apiKey"?: string,
  /** Low-Balance Alerts - Show a Raycast notification when your balance reaches the alert amount. */
  "lowBalanceNotifications": boolean,
  /** Low-Balance Alert Amount - Send an alert when the remaining balance is at or below this USD amount. */
  "lowBalanceThreshold": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `openrouter-credits` command */
  export type OpenrouterCredits = ExtensionPreferences & {}
  /** Preferences accessible in the `openrouter-credit-dashboard` command */
  export type OpenrouterCreditDashboard = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `openrouter-credits` command */
  export type OpenrouterCredits = {}
  /** Arguments passed to the `openrouter-credit-dashboard` command */
  export type OpenrouterCreditDashboard = {}
}

