export function setScoreClass(score: number, par: number): string {
  if (score == null) return '';
  switch (score - par) {
    case -1:
    case -.5:
      return 'birdie';
    case 0:
      return 'par';
    case -2:
    case -1.5:
      return 'eagle';
    case 1:
    case 1.5:
      return 'bogie';
    case 2:
    case 3:
    case 4:
    case 2.5:
    case 3.5:
    case 4.5:
      return 'double-bogie';
    case -3:
    case -4:
    case -2.5:
    case -3.5:
    case -4.5:
      return 'double-eagle';
    default:
      return 'unknown';
  }
}
