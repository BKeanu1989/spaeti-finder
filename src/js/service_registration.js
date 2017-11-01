if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/serviceworker.js").then(function(registration) {
    console.log("serviceworker registered in scope:", registration.scope);
  }).catch(function(err) {
    console.log("service worker registration failed:", err);
  });
}
