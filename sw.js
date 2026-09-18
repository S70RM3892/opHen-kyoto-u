/* 電車でも自習室でも開けるようにするためのオフラインキャッシュ。
   ページ本体はネットワーク優先（更新をすぐ拾う）、フォントなどはキャッシュ優先。 */
var CACHE = "kyodai-sim-v1";
var PRECACHE = ["./", "./index.html", "./manifest.webmanifest", "./icon.svg", "./icon-maskable.svg"];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(PRECACHE); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) { return k === CACHE ? null : caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;

  // ページ本体：新しい版があればそれを使い、オフラインならキャッシュに落ちる。
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put("./index.html", copy); });
        return res;
      }).catch(function () {
        return caches.match("./index.html").then(function (r) { return r || Response.error(); });
      })
    );
    return;
  }

  // それ以外（自前の静的ファイル、Google Fonts）：キャッシュ優先。
  var sameOrigin = new URL(req.url).origin === self.location.origin;
  var isFont = /^https:\/\/fonts\.(googleapis|gstatic)\.com\//.test(req.url);
  if (!sameOrigin && !isFont) return;

  e.respondWith(
    caches.match(req).then(function (hit) {
      return hit || fetch(req).then(function (res) {
        if (res && (res.ok || res.type === "opaque")) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () { return hit; });
    })
  );
});
