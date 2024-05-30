# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2024-05-30

- Remove CookieBot CSS opacity override to allow new CookieBot Swift banner to display properly.
- Remove CLS fix snippet.

## [2.0.1] - 2021-05-12

### Fixed

- Clean `dist` directory before building, which prevents old build files from being packed
- No longer include test files in the build

## [2.0.0] - 2021-05-12

### Added

- JavaScript snippet and CSS rules that prevent [CLS](https://web.dev/cls/) issue on the Cookiebot dialog.

  These are breaking changes: if using version >= 2.0.0 and the js snippet is not loaded correctly, the dialog will not be displayed. See [README](README.md) for more info.

[3.0.0]:
  https://github.com/envato/cookie-consent/compare/v2.0.1..v3.0.0
