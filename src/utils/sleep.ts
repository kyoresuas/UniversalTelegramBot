/**
 * Подождать в миллисекундах
 */
export const sleep = (time: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, time));
};
