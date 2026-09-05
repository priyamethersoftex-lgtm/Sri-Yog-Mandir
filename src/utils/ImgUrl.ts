const imageBaseUrl = "https://imagedelivery.net/Ud25niyQxx-TAH-Uqr9bjQ/";

export const imageThumb = (photoUrl: string): string => {
  return `${imageBaseUrl}${photoUrl}/thumb`;
};

export const imageOriginal = (photoUrl: string): string => {
  return `${imageBaseUrl}${photoUrl}/original`;
};

export const imageL = (photoUrl: string): string => {
  return `${imageBaseUrl}${photoUrl}/l`;
};

export const imageM = (photoUrl: string): string => {
  return `${imageBaseUrl}${photoUrl}/m`;
};

export const imageXL = (photoUrl: string): string => {
  return `${imageBaseUrl}${photoUrl}/xl`;
};