// import includes from 'lodash/includes';
import * as Auth from '../authorization/auth.js';

export default function detect() {
  const sessionLang = Auth.getSessionLang();
  return sessionLang || 'gr';
  // const navLang = navigator.languages
  //   ? navigator.languages[0]
  //   : (navigator.language || navigator.userLanguage);

  // if (includes(navLang, 'el')
  //   || includes(navLang, 'gr')) {
  //     return 'gr';
  // }
  // return 'en';
}
