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

### To publish

Run

```sh
npm version (patch/minor/major)
npm publish
```
