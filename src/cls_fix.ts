interface CookieBotTarget {
  CookieConsentDialog: any
}

interface CookieBotEvent extends Event {
  target: CookieBotTarget
}

window.addEventListener('CookiebotOnDialogDisplay', (event) => {
  const cookieDialog = (event.target as CookieBotEvent)?.CookieConsentDialog
    ?.DOM

  const observer = new MutationObserver((mutations) => {
    mutations.forEach(() => {
      if (!cookieDialog.style.transform.match(cookieDialog.style.top)) {
        cookieDialog.style.setProperty(
          'transform',
          `translateY(\${cookieDialog.style.top})`
        )
        cookieDialog.style.setProperty('opacity', '1', 'important')
      }
    })
  })
  observer.observe(cookieDialog, {
    attributes: true,
    attributeFilter: ['style'],
  })
})
