const urlRegex: RegExp = new RegExp(/^(ftp|http|https):\/\/[^ "]+$/);
import { v4 as uuidv4 } from 'uuid';

export const URL_KEY_LENGTH: 8 = 8;
export const isValidUrl = (url: string): boolean => urlRegex.test(url);

export const generateUrlKey = (): string => uuidv4().slice(0, URL_KEY_LENGTH);
