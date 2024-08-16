export const sortByText = (a: string, b: string) => {
  let lowerA = a.toLowerCase();
  let lowerB = b.toLowerCase();

  if (lowerA < lowerB) {
    return -1;
  }
  if (lowerA > lowerB) {
    return 1;
  }
  return 0;
}

export const sortByValue = <T extends number | Date>(a: T, b: T) => {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}
