export const generateRandomRef = (): string =>
  Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
