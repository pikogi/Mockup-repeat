// Fast short-URL redirect — resolves before React bundles load
;(function () {
  var m = window.location.pathname.match(/^\/s\/([A-Za-z0-9_-]{8})$/)
  if (!m) return
  var meta = document.querySelector('meta[name="api-url"]')
  var raw = meta ? meta.getAttribute('content') : ''
  var base = raw && raw.indexOf('%') === -1 ? raw : '/api'
  fetch(base + '/short-urls/' + m[1])
    .then(function (r) {
      return r.json()
    })
    .then(function (d) {
      var url = d && d.data && d.data.original_url
      if (url) window.location.replace(url)
    })
    .catch(function () {})
})()
