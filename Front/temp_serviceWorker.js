const sCacheName = "practice-pwa";
const aFilesToCache = ["./", "./index.html", "./css/main.css", "./js/main.js"];

self.addEventListener("install", (pEvent) => {
  console.log("서비스워커 설치");
  pEvent.waitUntil(
    caches.open(sCacheName).then((pCache) => {
      return pCache.addAll(aFilesToCache);
    })
  );
});
// 고유번호 할당받은 서비스 워커 동작 시작
self.addEventListener("activate", (pEvent) => {
  console.log("서비스워커 동작!");
});

//데이터 요청시 네트워크 또는 캐시에서 찾아 반환
self.addEventListener("fetch", (pEvent) => {
  pEvent.respondWith(
    caches
      .match(pEvent.request)
      .then((response) => {
        if (!response) {
          console.log("네트워크에서 데이터 요청!", pEvent.request);
          return fetch(pEvent.request);
        }
        console.log("캐시에서 데이터 요청!", pEvent.request);
        return response;
      })
      .catch((err) => console.log(err))
  );
});
