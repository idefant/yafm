import { string } from 'yup';

export const hexSchema = string().matches(/^[0-9a-f]*$/i);
export const base64Schema = string().matches(/^[0-9a-z=+/]*$/i);
