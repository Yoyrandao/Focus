const pattern = new RegExp(
  '^(https?:\\/\\/)?' + // protocol
    '(?<full_domain>(([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$',
  'i', // fragment locator
);

function isValidUrl(url: string): boolean {
  return !!pattern.test(url);
}

const extractDomainAndName = (url: string): string[] => {
  const match = url.match(pattern);

  if (!match || !match.groups) {
    return [];
  }

  const domain = match.groups['full_domain'];

  return [
    match.groups['full_domain'],
    domain.substring(0, domain.lastIndexOf('.')).replace('.', ' '),
  ];
};

const extendUrl = (url: string): string | undefined => {
  if (!isValidUrl) {
    return;
  }

  const [domain] = extractDomainAndName(url);
  return `*://*.${domain}/*`;
};

export { isValidUrl, extractDomainAndName, extendUrl };
