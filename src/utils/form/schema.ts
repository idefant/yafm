import * as yup from 'yup';

/* eslint-disable no-unused-vars */
declare module 'yup' {
  interface StringSchema {
    repeatPassword(key?: string): this;
  }
}
/* eslint-enable no-unused-vars */

// @ts-ignore
yup.addMethod<yup.StringSchema>(
  yup.string,
  'repeatPassword',
  function repeatPassword(key = 'password') {
    return this.oneOf([yup.ref(key)], 'Пароли не совпадают');
  },
);

export default yup;
