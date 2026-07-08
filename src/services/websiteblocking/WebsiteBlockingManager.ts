import { WebsiteRuleMode, Timetable } from '../../domain/models/Timetable';
import { DomainMatcher } from './DomainMatcher';

export class WebsiteBlockingManager {
  private isEnabled: boolean = true;
  
  // Package names for supported browsers
  private supportedBrowsers: string[] = [
    'com.android.chrome',
    'com.brave.browser',
    'org.mozilla.firefox',
    'com.microsoft.emmx',
    'com.sec.android.app.sbrowser',
    'com.opera.browser'
  ];

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  public isBrowser(packageName: string): boolean {
    return this.supportedBrowsers.includes(packageName);
  }

  /**
   * Evaluates a URL against a timetable's website rules.
   * Returns true if the URL is allowed, false if blocked.
   */
  public evaluateUrl(url: string, timetable: Timetable): boolean {
    if (!this.isEnabled) return true; // Fail gracefully / don't block if disabled

    const { websiteRuleMode, websiteRules } = timetable;
    const targetDomain = DomainMatcher.normalizeDomain(url);
    
    const matchesAnyRule = websiteRules.some(rule => 
      DomainMatcher.matches(rule.domain, targetDomain)
    );

    if (websiteRuleMode === 'allowlist') {
      // In Allow List mode, only rules explicitly listed are allowed. Everything else is blocked.
      return matchesAnyRule;
    } else {
      // In Block List mode, rules explicitly listed are blocked. Everything else is allowed.
      return !matchesAnyRule;
    }
  }
}

export const websiteBlockingManager = new WebsiteBlockingManager();
