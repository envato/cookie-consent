# cookie-consent

## Overview

The npm package for cookie consent helpers. These functions are tighly coupled to using the cookiebot api at the moment.

## Usage

### Installation

```sh
npm install @envato/cookie-consent --save
# or using `yarn`
yarn add @envato/cookie-consent
```

### Examples

```js
import { Consent, consented, deferRun } from '@envato/cookie-consent'

// Check for consent inline (note that on the initial page load this function may return false)
if (consented(Consent.statistics)) {
  // Do something..
}

// Manually parse and check the consent type in the CookieConsent cookie
checkCookieConsent(Cookies.get('CookieConsent'), Consent.statistics)

// Run function after consent
deferRun(() => {
  doSomething()
}, Consent.marketing)

// Types of consent we support:
Consent.marketing
Consent.statistics
Consent.preferences
Consent.necessary
```

### Override CSS

There is a `cookiebot.css` in the module, you can include it to partially override the default Cookiebot style.

### The CLS issue fix

In the 2.0.0 release, two CSS rules and a JS snippet were added to fix a [CLS](https://web.dev/cls/) issue caused by the cookiebot dialog.

If using a version >= 2.0.0, **you need to load the JS snippet on your application, otherwise the Cookiebot dialog won't be displayed**.

The file `clsFixSnippet.ts` contains the snippet. It's being exported as a string. When including the code in your app, make sure it runs _before_ the main cookiebot code.

### To publish

Run

```sh
npm version (patch/minor/major)
npm publish
```
