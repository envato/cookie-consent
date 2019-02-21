# cookie-consent

## Overview

The npm package for cookie consent helpers.

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

// Check for consent inline
if (consented(Consent.statistics)) {
  // Do something..
}

// Run function after consent
deferRun(() => {
  doSomething()
}, Consent.marketing)
```

### To publish

Run

```sh
npm version (patch/minor/major)
npm publish
```
