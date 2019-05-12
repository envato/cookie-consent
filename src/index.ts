import * as Cookies from 'js-cookie'

interface ICookiebotJob {
  job: () => any
  consent: Consent
}
const queue: ICookiebotJob[] = []

export enum Consent {
  statistics = 'statistics',
  marketing = 'marketing',
  necessary = 'necessary',
  preferences = 'preferences'
}

const execute = () => {
  while (queue.length) {
    const cookiebotJob = queue.pop()
    if (cookiebotJob) {
      const { job, consent } = cookiebotJob
      // what to do if Cookiebot fail to load or blocked?
      if (consented(consent)) {
        job()
      }
    }
  }
}

export const deferRun = (job: () => any, consent: Consent) => {
  if (typeof window !== 'undefined') {
    queue.push({ job, consent })

    if ((window as any).Cookiebot && (window as any).Cookiebot.hasResponse) {
      execute()
    }
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener(
    'CookiebotOnAccept',
    () => {
      execute()
    },
    false
  )
}

export const checkCookieConsent = (
  CookieString: string | undefined,
  consent: Consent
) => {
  if (!CookieString) {
    return false
  }

  // For user outside of targeted area
  if (CookieString === '-1') {
    return true
  }

  try {
    const parsedCookieConsent = JSON.parse(
      CookieString.replace(/%2c/g, ',')
        .replace(/'/g, '"')
        .replace(/([{\[,])\s*([a-zA-Z0-9_]+?):/g, '$1"$2":')
    )
    return parsedCookieConsent && !!parsedCookieConsent[consent]
  } catch (e) {
    return false
  }
}

export const consented = (consent: Consent) => {
  if (!(typeof window !== 'undefined')) {
    return false
  }

  // when cookiebot is avaiable use it
  if (
    !!(window && (window as any).Cookiebot && (window as any).Cookiebot.consent)
  ) {
    return !!(window as any).Cookiebot.consent[consent]
  }

  // manually parse cookie if Cookiebot is not avaiable
  const CookieConsent = Cookies.get('CookieConsent')
  return checkCookieConsent(CookieConsent, consent)
}
