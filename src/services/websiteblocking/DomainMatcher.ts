export class DomainMatcher {
  /**
   * Normalizes a URL into a clean domain.
   * Removes protocol, path, query strings, and 'www.'.
   */
  static normalizeDomain(url: string): string {
    if (!url) return '';
    let domain = url.toLowerCase().trim();
    
    // Remove protocol (http://, https://, etc.)
    if (domain.includes('://')) {
      domain = domain.split('://')[1];
    }
    
    // Remove path, query, fragment
    domain = domain.split('/')[0];
    domain = domain.split('?')[0];
    domain = domain.split('#')[0];
    
    // Remove 'www.' prefix
    if (domain.startsWith('www.')) {
      domain = domain.substring(4);
    }
    
    return domain;
  }

  /**
   * Checks if a target domain matches a rule domain.
   * Supports exact matches and subdomain matching.
   */
  static matches(ruleDomain: string, targetDomain: string): boolean {
    const normalizedRule = this.normalizeDomain(ruleDomain);
    const normalizedTarget = this.normalizeDomain(targetDomain);

    if (!normalizedRule || !normalizedTarget) return false;

    // Exact match
    if (normalizedRule === normalizedTarget) return true;
    
    // Subdomain match (e.g., rule: example.com, target: m.example.com)
    if (normalizedTarget.endsWith('.' + normalizedRule)) return true;

    return false;
  }
}
