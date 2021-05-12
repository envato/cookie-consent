// line 6 only applies for Rails/Turbo applications, it won't have any effect in non-Turbo apps

export default `
  window.addEventListener("CookiebotOnDialogDisplay", (event) => {
    const cookieDialog = event.srcElement.CookieConsentDialog.DOM
    cookieDialog.dataset.turbo = false

    const observer = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        if (!cookieDialog.style.transform.match(cookieDialog.style.top)) {
          cookieDialog.style.setProperty("transform", \`translateY(\${cookieDialog.style.top})\`)
          cookieDialog.style.setProperty("opacity", "1", "important")
        }
      })
    })

    observer.observe(cookieDialog, { attributes: true, attributeFilter: ["style"] })
  })
`
