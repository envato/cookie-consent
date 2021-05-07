interface CookiebotEventTarget extends EventTarget {
  CookieConsentDialog: any
}

window.addEventListener('CookiebotOnDialogDisplay', (event) => {
  const cookieDialog = (<CookiebotEventTarget>event.target)?.CookieConsentDialog
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
