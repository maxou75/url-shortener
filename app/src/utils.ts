const urlRegex: RegExp = new RegExp(/^(ftp|http|https):\/\/[^ "]+$/);

export const isValidUrl = (url: string): boolean => urlRegex.test(url);
