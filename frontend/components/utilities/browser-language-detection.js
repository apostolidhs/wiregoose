import _ from 'lodash';
import * as Auth from '../authorization/auth.js';

export default function detect() {
  const sessionLang = Auth.getSessionLang();
  return sessionLang || 'gr';
  // const navLang = navigator.languages
  //   ? navigator.languages[0]
  //   : (navigator.language || navigator.userLanguage);

  // if (_.includes(navLang, 'el')
  //   || _.includes(navLang, 'gr')) {
  //     return 'gr';
  // }
  // return 'en';
}
