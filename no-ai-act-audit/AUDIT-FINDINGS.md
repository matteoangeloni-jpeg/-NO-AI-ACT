# SEO Audit Report: no-ai-act.eu
**Audit Date:** 2026-07-08  
**URL:** https://www.no-ai-act.eu/  
**Status:** Partial Audit (Access Restricted)

---

## Executive Summary

**SEO Health Score:** Unable to determine (access restricted)

**Business Type:** Policy/Advocacy Campaign — NO AI Act (European digital rights initiative)

**Critical Issue Identified:** The website implements comprehensive blocking of AI crawlers via robots.txt, which creates a paradoxical SEO challenge: blocking search engine crawlers to protect against AI training data scraping simultaneously restricts legitimate search indexing and traffic acquisition.

---

## Key Findings

### 1. **CRITICAL: AI Crawler Blocking via robots.txt**

**Severity:** 🔴 CRITICAL  
**Impact:** Direct conflict with SEO visibility goals

The site's robots.txt file explicitly disallows multiple AI crawlers:
- ✗ ClaudeBot (Anthropic)
- ✗ GPTBot (OpenAI)
- ✗ CCBot (Common Crawl)
- ✗ Bytespider (ByteDance)
- ✗ Other AI training crawlers

**Content Access Signals Defined:**
- `search=yes` — Search indexing is permitted
- `ai-train=no` — Model training prohibited (copyright protection)
- `use=reference` — AI consumption limited to reference-only access

**Issue:** While the blocking is intentional (based on EU Directive 2019/790 copyright protections), it does NOT prevent Google/Bing bots from crawling. However, the site currently returns **403 Forbidden** to all access attempts, including standard search engine crawlers.

---

### 2. **CRITICAL: 403 Forbidden on Homepage**

**Severity:** 🔴 CRITICAL  
**Status:** Both `https://www.no-ai-act.eu/` and `https://no-ai-act.eu/` return HTTP 403

**Impact:** 
- Homepage is not accessible to any crawlers
- Sitemap URLs also return 403
- Search engines cannot index the site
- No organic search traffic possible

**Recommendation:** Verify server configuration. This appears to be a blanket block, not selective robot filtering. The site may be:
- In maintenance mode
- Incorrectly configured with firewall rules
- Using IP-based blocking that affects all traffic
- Behind a WAF (Web Application Firewall) blocking all requests

---

### 3. **Accessible Content: robots.txt Analysis**

**Positive Signal:** robots.txt is properly configured and accessible at `/robots.txt`

**Language Sitemaps Declared:**
- Italian sitemap: `/sitemap-it.xml`
- English sitemap: `/sitemap-en.xml`
- Sitemap index: `/sitemap.xml`

**Issue:** Sitemap URLs return 403 (cannot verify structure or page count)

**Legal Notice:** The file includes explicit copyright protection language referencing:
> "express reservations of rights under Article 4 of EU Directive 2019/790 (Digital Copyright Directive)"

---

### 4. **Crawlability Issues**

| Aspect | Status | Finding |
|--------|--------|---------|
| Homepage Accessibility | ✗ Blocked | 403 Forbidden |
| robots.txt | ✓ Accessible | Properly configured |
| Sitemaps | ✗ Blocked | 403 Forbidden |
| Search Engine Bots | ✗ Blocked | Cannot crawl homepage |
| AI Crawlers | ✗ Blocked | robots.txt disallow + 403 |
| SSL/HTTPS | ✓ Assumed | HTTPS protocol in use |

---

## Audit Limitations

**Why This Audit Is Incomplete:**

1. **Access Restriction:** The server returns 403 Forbidden to all fetch attempts
2. **Partial robots.txt Analysis:** Only the robots.txt file was accessible; sitemap content could not be verified
3. **No On-Page Analysis:** Cannot assess title tags, meta descriptions, heading structure, schema markup, or content quality
4. **No Technical SEO Assessment:** Cannot check Core Web Vitals, security headers, mobile optimization, or canonicals
5. **No Content Analysis:** Cannot evaluate E-E-A-T, readability, internal linking, or thin content
6. **No Visual/Performance Data:** Cannot capture screenshots or measure performance metrics

---

## Root Cause Analysis

The 403 Forbidden errors suggest one of two scenarios:

### Scenario A: Intentional Blocking (Likely)
The site owner is deliberately blocking all automated access (including search engines) as part of the anti-AI campaign philosophy. This would be self-defeating for SEO but aligned with the site's mission.

### Scenario B: Server Misconfiguration (Possible)
Firewall rules, WAF policies, or authentication redirects are incorrectly applied, blocking legitimate search crawlers alongside AI crawlers.

---

## Immediate Actions Required

### 🔴 Priority 1: Resolve Access Issue
1. **Verify Intent:** Confirm whether blocking all crawlers (including Google) is intentional
2. **Check Server Logs:** Review access logs for 403 error patterns
3. **Test Access:** Verify the site is accessible through a standard browser
4. **Audit Firewall Rules:** Check for overly broad IP blocks or WAF rules
5. **Review robots.txt:** Confirm robots.txt matches intended crawler policies

### 🟠 Priority 2: Enable Search Visibility (If Desired)
If SEO visibility is a goal:
- Allow Googlebot and Bingbot in robots.txt or firewall
- Keep AI crawler blocking (ClaudeBot, GPTBot) via robots.txt
- Maintain `ai-train=no` signal for copyright protection
- Verify sitemaps are accessible to search engines

### 🟡 Priority 3: Complete Full Audit
Once access is restored, conduct a comprehensive audit covering:
- Technical SEO (crawlability, indexability, security, Core Web Vitals)
- On-page optimization (titles, descriptions, headings, schema)
- Content quality (E-E-A-T, readability, thin content)
- Performance metrics (LCP, INP, CLS)
- AI search readiness assessment

---

## Recommendation

**Next Step:** The site owner should clarify the intended audience and traffic goals:

| Goal | Recommendation |
|------|-----------------|
| **Mission-first** (protect against AI scraping only) | Keep AI bots blocked; allow search engines |
| **Anti-digital-engagement** (reject all crawling) | Current configuration is correct; accept lower search visibility |
| **Server misconfiguration** | Immediately audit and fix firewall rules to allow Google/Bing |

---

**Report Generated By:** SEO Audit Skill  
**Audit Status:** ⚠️ **INCOMPLETE** — Full audit requires homepage accessibility
