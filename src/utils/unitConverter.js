export function kbToGB(kb) {
  return +(kb / 1024 / 1024).toFixed(2);
}

export function calculatePercent(part, total) {
  return +((part / total) * 100).toFixed(1)
}