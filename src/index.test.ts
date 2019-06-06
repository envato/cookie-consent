import mockCookie from 'js-cookie'

import {
  Consent,
  consented,
  deferRun,
  checkCookieConsent,
  userHasOptedOutOfCookiesForCategory
} from './index'

const castedMockCookie = mockCookie as any

jest.mock('js-cookie', () => ({
  get: jest.fn(),
  set: jest.fn()
}))

describe('consented()', () => {
  describe('default', () => {
    it('to false', () => {
      expect(consented(Consent.statistics)).toBe(false)
    })
  })
  describe('with consent', () => {
    beforeAll(() => {
      ;(window as any).Cookiebot = {
        consent: {
          statistics: true,
          marketing: false
        }
      }
    })
    it('return true for consented', () => {
      expect(consented(Consent.statistics)).toBe(true)
    })
    it('return false for disallowed category', () => {
      expect(consented(Consent.marketing)).toBe(false)
    })
  })
})

describe('parseCookieConsent()', () => {
  let CookieString: string | undefined
  describe('when CookieConsent is undefined', () => {
    it('returns false', () => {
      expect(checkCookieConsent(CookieString, Consent.statistics)).toBe(false)
    })
  })
  describe('when CookieConsent is found', () => {
    beforeEach(() => {
      CookieString = undefined
    })

    it('returns true for user outside of targeted area', () => {
      CookieString = '-1'
      expect(checkCookieConsent(CookieString, Consent.statistics)).toBe(true)
    })

    it('returns false if issue parsing cookie', () => {
      CookieString = '{bad: "json}'
      expect(checkCookieConsent(CookieString, Consent.statistics)).toBe(false)
    })

    it('returns true if user has consented', () => {
      CookieString =
        "{stamp:'X',necessary:true,preferences:false,statistics:true,marketing:true,ver:1}"
      expect(checkCookieConsent(CookieString, Consent.statistics)).toBe(true)
    })

    it('returns false if user has not consented', () => {
      CookieString =
        "{stamp:'X',necessary:true,preferences:false,statistics:false,marketing:true,ver:1}"
      expect(checkCookieConsent(CookieString, Consent.statistics)).toBe(false)
    })
  })
})

describe('deferRun()', () => {
  describe('cookiebot has no response', () => {
    let intercomMock: any
    beforeAll(() => {
      intercomMock = jest.fn()
      ;(window as any).Cookiebot = {
        hasResponse: false,
        consent: {
          statistics: false
        }
      }
    })
    const bootIntercom = () => intercomMock
    it('queues job and run later', () => {
      deferRun(bootIntercom(), Consent.statistics)
      expect(intercomMock).not.toBeCalled()
      ;(window as any).Cookiebot.consent.statistics = true
      window.dispatchEvent(new CustomEvent('CookiebotOnAccept'))
      expect(intercomMock).toBeCalled()
    })

    it('runs them in the right order', () => {
      jest.clearAllMocks()
      deferRun(() => intercomMock(1), Consent.statistics)
      deferRun(() => intercomMock(2), Consent.statistics)
      ;(window as any).Cookiebot.consent.statistics = true
      window.dispatchEvent(new CustomEvent('CookiebotOnAccept'))
      expect(intercomMock.mock.calls[0][0]).toEqual(1)
      expect(intercomMock.mock.calls[1][0]).toEqual(2)
    })
  })

  describe('cookiebot has response and consent', () => {
    let intercomMock: any
    beforeAll(() => {
      intercomMock = jest.fn()
      ;(window as any).Cookiebot = {
        hasResponse: true,
        consent: {
          statistics: true
        }
      }
    })
    const bootIntercom = () => intercomMock
    it('runs job right away', () => {
      deferRun(bootIntercom(), Consent.statistics)
      expect(intercomMock).toBeCalled()
    })
  })

  describe('cookiebot has response but no consent', () => {
    let intercomMock: any
    beforeAll(() => {
      intercomMock = jest.fn()
      ;(window as any).Cookiebot = {
        hasResponse: true,
        consent: {
          statistics: false
        }
      }
    })
    const bootIntercom = () => intercomMock
    it('runs job right away', () => {
      deferRun(bootIntercom(), Consent.statistics)
      expect(intercomMock).not.toBeCalled()
      window.dispatchEvent(new CustomEvent('CookiebotOnAccept'))
      expect(intercomMock).not.toBeCalled()
    })
  })

  describe('when cookiebot is not loaded', () => {
    beforeEach(() => {
      castedMockCookie.get.mockReset()
      castedMockCookie.set.mockReset()
      ;(window as any).Cookiebot = null
    })

    it('return false when no cookieconsent cookie', () => {
      castedMockCookie.get.mockImplementation(() => undefined)
      expect(consented(Consent.statistics)).toBe(false)
    })

    it('return true for user outside of targeted area', () => {
      castedMockCookie.get.mockImplementation(() => '-1')
      expect(consented(Consent.statistics)).toBe(true)
    })

    it('return false if having issue parse cookie', () => {
      castedMockCookie.get.mockImplementation(() => '{bad: "json}')
      expect(consented(Consent.statistics)).toBe(false)
    })

    it('return true when user has consent', () => {
      castedMockCookie.get.mockImplementation(
        () =>
          "{stamp:'xJB03YkuI2LicNIfQSnHClMF+YsNEHjsCyQgEKSFPW5UbP8sXHXM1g==',necessary:true,preferences:true,statistics:true,marketing:true,ver:1}"
      )
      expect(consented(Consent.statistics)).toBe(true)
    })

    it('return false when user has consent', () => {
      castedMockCookie.get.mockImplementation(
        () =>
          "{stamp:'xJB03YkuI2LicNIfQSnHClMF+YsNEHjsCyQgEKSFPW5UbP8sXHXM1g==',necessary:true,preferences:true,statistics:false,marketing:true,ver:1}"
      )
      expect(consented(Consent.statistics)).toBe(false)
    })
  })
})

describe.only('userHasOptedOutOfCookiesForCategory()', () => {
  beforeEach(() => {
    castedMockCookie.get.mockReset()
    castedMockCookie.set.mockReset()
    ;(window as any).Cookiebot = null
  })

  describe('default', () => {
    it('to false', () => {
      expect(userHasOptedOutOfCookiesForCategory(Consent.statistics)).toBe(
        false
      )
    })
  })

  describe('with cookiebot loaded but no response', () => {
    beforeAll(() => {
      ;(window as any).Cookiebot = {
        consent: {
          statistics: false,
          marketing: false
        },
        hasResponse: false
      }
    })
    it('return false', () => {
      expect(userHasOptedOutOfCookiesForCategory(Consent.statistics)).toBe(
        false
      )
    })
  })

  describe('with cookiebot loaded and with response', () => {
    beforeEach(() => {
      ;(window as any).Cookiebot = {
        consent: {
          statistics: false,
          marketing: false
        },
        hasResponse: true
      }
    })
    describe('return false', () => {
      it('return false', () => {
        expect(userHasOptedOutOfCookiesForCategory(Consent.statistics)).toBe(
          true
        )
      })
    })
  })

  describe.only('with cookiebot not loaded', () => {
    it('return false when no cookie', () => {
      castedMockCookie.get.mockImplementation(() => undefined)
      expect(userHasOptedOutOfCookiesForCategory(Consent.statistics)).toBe(
        false
      )
    })

    it('return false when outside or region', () => {
      castedMockCookie.get.mockImplementation(() => '-1')
      expect(userHasOptedOutOfCookiesForCategory(Consent.statistics)).toBe(
        false
      )
    })

    it('return false if having issue parse cookie', () => {
      castedMockCookie.get.mockImplementation(() => '{bad: "json}')
      expect(userHasOptedOutOfCookiesForCategory(Consent.statistics)).toBe(
        false
      )
    })

    it('return true when user has consent set to true', () => {
      castedMockCookie.get.mockImplementation(
        () =>
          "{stamp:'xJB03YkuI2LicNIfQSnHClMF+YsNEHjsCyQgEKSFPW5UbP8sXHXM1g==',necessary:true,preferences:true,statistics:true,marketing:true,ver:1}"
      )
      expect(userHasOptedOutOfCookiesForCategory(Consent.statistics)).toBe(
        false
      )
    })

    it('return false when user has consent set to false', () => {
      castedMockCookie.get.mockImplementation(
        () =>
          "{stamp:'xJB03YkuI2LicNIfQSnHClMF+YsNEHjsCyQgEKSFPW5UbP8sXHXM1g==',necessary:true,preferences:true,statistics:false,marketing:true,ver:1}"
      )
      expect(userHasOptedOutOfCookiesForCategory(Consent.statistics)).toBe(true)
    })
  })
})
