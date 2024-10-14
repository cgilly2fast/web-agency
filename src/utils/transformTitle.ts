export function transformTitle(labels: { singular: string; plural: string }) {
  if (labels.singular === 'User') {
    return 'Profile Settings'
  } else if (
    labels.singular === 'Calendar Setting' ||
    labels.singular === 'Firm Setting' ||
    labels.singular === 'Chat'
  ) {
    return labels.plural
  }
  return labels.singular
}
