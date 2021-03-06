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
import i18next from "i18next";
import i18nextBrowserLanguageDetector from "i18next-browser-languagedetector";

i18next.use(i18nextBrowserLanguageDetector).init({
  fallbackLng: ['en', 'fr'],
  load: 'languageOnly',
  detection: {
    order: ['localStorage', 'querystring', 'navigator', 'htmlTag'],
    lookupQuerystring: 'lng',
    lookupLocalStorage: 'i18nextLng',
    caches: ['localStorage'],
  },
});
