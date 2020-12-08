/*
 * Copyright (C) 2019 Eliastik (eliastiksofts.com)
 *
 * This file is part of "Simple Voice Changer".
 *
 * "Simple Voice Changer" is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * "Simple Voice Changer" is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with "Simple Voice Changer".  If not, see <http://www.gnu.org/licenses/>.
 */
const CACHE_BASENAME = 'simple-voice-changer';
const CACHE_VER = '-v1.3.0.1';
const CACHE = CACHE_BASENAME + CACHE_VER;

const CACHE_URLS = [
  "index.html",
  "index.html?launcher=true",
  "./",
  "favicon.ico",
  "README.md",
  "manifest.json",
  "assets/css/bootstrap-slider.min.css",
  "assets/css/bootstrap.min.css",
  "assets/css/font-awesome.min.css",
  "assets/css/main.css",
  "assets/fonts/fontawesome-webfont.eot",
  "assets/fonts/fontawesome-webfont.svg",
  "assets/fonts/fontawesome-webfont.ttf",
  "assets/fonts/fontawesome-webfont.woff",
  "assets/fonts/fontawesome-webfont.woff2",
  "assets/fonts/FontAwesome.otf",
  "assets/fonts/fontawesome-webfont.eot?v=4.7.0",
  "assets/fonts/fontawesome-webfont.svg?v=4.7.0",
  "assets/fonts/fontawesome-webfont.ttf?v=4.7.0",
  "assets/fonts/fontawesome-webfont.woff?v=4.7.0",
  "assets/fonts/fontawesome-webfont.woff2?v=4.7.0",
  "assets/fonts/FontAwesome.otf?v=4.7.0",
  "assets/fonts/SourceSansPro-Bold.ttf",
  "assets/fonts/SourceSansPro-Light.ttf",
  "assets/fonts/SourceSansPro-Regular.ttf",
  "assets/img/icon_192.png",
  "assets/img/icon_512.png",
  "assets/img/favicon.png",
  "src/recorderWorker.js",
  "dist/SimpleVoiceChanger.js",
  "assets/sounds/impulse_response.wav",
  "assets/sounds/modulator.mp3"
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CACHE_URLS)).then(self.skipWaiting()));
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          if(cacheName.startsWith(CACHE_BASENAME)) {
            var cacheVer = cacheName.replace(CACHE_BASENAME, "");

            if(cacheVer != CACHE_VER) {
              return true;
            }
          }

          return false;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(CACHE).then(function(cache) {
      return cache.match(event.request).then(function(response) {
        return response || fetch(event.request);
      });
    })
  );
});
