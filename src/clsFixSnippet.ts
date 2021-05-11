export default `
  window.addEventListener("CookiebotOnDialogDisplay", (event) => {
    const cookieDialog = event.srcElement.CookieConsentDialog.DOM

    // the line below is just for Rails/Turbo applications, but it won't have any effect in non-Turbo apps
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
