import {SITE_LANGUAGES} from './route-inventory.mjs';
export const LANGUAGE_NAMES={it:'Italiano',en:'English',fr:'Français',de:'Deutsch',es:'Español',pt:'Português',nl:'Nederlands'};
export const SITE_LANGUAGE_NAMES=Object.fromEntries(SITE_LANGUAGES.map(code=>[code,LANGUAGE_NAMES[code]]));
export const SOCIAL_LOCALES={it:'it_IT',en:'en_GB',fr:'fr_FR',de:'de_DE',es:'es_ES',pt:'pt_PT',nl:'nl_NL'};
