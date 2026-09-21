/**
 * Web & Wikipedia Search & Content Retrieval Service
 * Enables live retrieval of authentic encyclopedic and engineering material
 * directly from Wikipedia and web portals without requiring manual copy-pasting.
 */

export interface WebSearchResult {
  title: string;
  snippet: string;
  url: string;
  source: string;
}

export interface FetchedWebContent {
  title: string;
  url: string;
  content: string;
  snippet: string;
  charCount: number;
  relatedMatches?: WebSearchResult[];
}

const WIKI_HEADERS: HeadersInit = {
  'Api-User-Agent': 'ExamPilot/1.0 (https://exampilot.app; admin@exampilot.app)'
};

/**
 * Searches Wikipedia full-text search API for relevant articles matching a query.
 * Uses `list=search` which supports natural search phrases (e.g. "Soil Mechanics of Civil Engineering").
 */
export async function searchWikipediaArticles(query: string): Promise<WebSearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  try {
    // 1. Primary: Full-text search with list=search (handles natural language & multi-word queries)
    const searchEndpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      trimmed
    )}&srlimit=8&format=json&origin=*`;

    const res = await fetch(searchEndpoint, { headers: WIKI_HEADERS });
    if (res.ok) {
      const data = await res.json();
      const searchItems = data?.query?.search;
      if (Array.isArray(searchItems) && searchItems.length > 0) {
        return searchItems.map((item: any) => ({
          title: item.title,
          snippet: (item.snippet || '').replace(/<[^>]*>/g, ''),
          url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/ /g, '_'))}`,
          source: 'Wikipedia'
        }));
      }
    }

    // 2. Secondary fallback: OpenSearch prefix lookup
    const opensearchEndpoint = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(
      trimmed
    )}&limit=6&namespace=0&format=json&origin=*`;

    const openRes = await fetch(opensearchEndpoint, { headers: WIKI_HEADERS });
    if (openRes.ok) {
      const openData = await openRes.json();
      const titles: string[] = openData[1] || [];
      const snippets: string[] = openData[2] || [];
      const urls: string[] = openData[3] || [];

      if (titles.length > 0) {
        return titles.map((t, idx) => ({
          title: t,
          snippet: snippets[idx] || `Wikipedia article on ${t}`,
          url: urls[idx] || `https://en.wikipedia.org/wiki/${encodeURIComponent(t.replace(/ /g, '_'))}`,
          source: 'Wikipedia'
        }));
      }
    }
  } catch (err) {
    console.warn('[WebSearchIngest] Wikipedia search error:', err);
  }

  // 3. Fallback: Strip filler prepositions and try core words
  const simplified = trimmed
    .replace(/\b(of|in|the|and|for|on|with|to|at|by|from|about)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (simplified && simplified !== trimmed) {
    try {
      const retryEndpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
        simplified
      )}&srlimit=6&format=json&origin=*`;
      const retryRes = await fetch(retryEndpoint, { headers: WIKI_HEADERS });
      if (retryRes.ok) {
        const retryData = await retryRes.json();
        const retryItems = retryData?.query?.search;
        if (Array.isArray(retryItems) && retryItems.length > 0) {
          return retryItems.map((item: any) => ({
            title: item.title,
            snippet: (item.snippet || '').replace(/<[^>]*>/g, ''),
            url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/ /g, '_'))}`,
            source: 'Wikipedia'
          }));
        }
      }
    } catch {}
  }

  return [];
}

/**
 * Extracts plain-text content of a Wikipedia page given its title or URL.
 * Includes `&redirects=1` to automatically resolve page redirects (e.g. "Soil Mechanics" -> "Soil mechanics").
 */
export async function fetchWikipediaContentByTitle(title: string): Promise<FetchedWebContent | null> {
  const cleanTitle = title.trim().replace(/_/g, ' ');
  if (!cleanTitle) return null;

  try {
    const endpoint = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=true&redirects=1&titles=${encodeURIComponent(
      cleanTitle
    )}&format=json&origin=*`;

    const res = await fetch(endpoint, { headers: WIKI_HEADERS });
    if (!res.ok) throw new Error(`Wikipedia extract failed (${res.status})`);

    const data = await res.json();
    const pages = data?.query?.pages;
    if (!pages) return null;

    const pageObj: any = Object.values(pages)[0];
    if (!pageObj || pageObj.missing !== undefined) return null;

    const fullText: string = pageObj.extract || '';
    if (!fullText.trim()) return null;

    // Cap at 18,000 characters to preserve comprehensive sections while fitting prompt limits
    const cappedText = fullText.slice(0, 18000);

    return {
      title: pageObj.title || cleanTitle,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent((pageObj.title || cleanTitle).replace(/ /g, '_'))}`,
      content: cappedText,
      snippet: cappedText.slice(0, 280) + '...',
      charCount: cappedText.length
    };
  } catch (err) {
    console.warn('[WebSearchIngest] Error fetching Wikipedia extract:', err);
    return null;
  }
}

/**
 * Extracts content from an arbitrary web URL using Jina AI Reader (clean markdown / plain text, CORS-enabled).
 */
export async function fetchGenericWebContent(url: string): Promise<FetchedWebContent | null> {
  const trimmedUrl = url.trim();
  if (!trimmedUrl.startsWith('http')) return null;

  try {
    const jinaEndpoint = `https://r.jina.ai/${trimmedUrl}`;
    const res = await fetch(jinaEndpoint, {
      headers: {
        Accept: 'text/plain'
      }
    });

    if (res.ok) {
      const text = await res.text();
      if (text && text.trim().length > 100) {
        const titleMatch = text.match(/Title:\s*(.+)/i);
        const title = titleMatch ? titleMatch[1].trim() : trimmedUrl;
        const cleanContent = text.slice(0, 18000);

        return {
          title,
          url: trimmedUrl,
          content: cleanContent,
          snippet: cleanContent.slice(0, 280) + '...',
          charCount: cleanContent.length
        };
      }
    }
  } catch (err) {
    console.warn('[WebSearchIngest] Jina fetch error:', err);
  }

  return null;
}

/**
 * Unified smart fetcher: Accepts either a topic query or a full URL.
 * Automatically resolves Wikipedia articles or general websites.
 */
export async function searchAndFetchWebContent(
  queryOrUrl: string
): Promise<FetchedWebContent | null> {
  const input = queryOrUrl.trim();
  if (!input) return null;

  // Case 1: Direct URL provided
  if (input.startsWith('http://') || input.startsWith('https://')) {
    if (input.includes('wikipedia.org/wiki/')) {
      const slug = input.split('/wiki/')[1]?.split('#')[0]?.split('?')[0];
      if (slug) {
        const decoded = decodeURIComponent(slug);
        const wikiResult = await fetchWikipediaContentByTitle(decoded);
        if (wikiResult) return wikiResult;
      }
    }

    const genericResult = await fetchGenericWebContent(input);
    if (genericResult) return genericResult;
  }

  // Case 2: Full text search across Wikipedia
  const searchResults = await searchWikipediaArticles(input);
  if (searchResults.length > 0) {
    // Iterate top candidates until one returns valid content
    for (const candidate of searchResults.slice(0, 4)) {
      const fetched = await fetchWikipediaContentByTitle(candidate.title);
      if (fetched && fetched.content.length > 200) {
        fetched.relatedMatches = searchResults.filter((r) => r.title !== fetched.title).slice(0, 3);
        return fetched;
      }
    }
  }

  // Case 3: Direct title lookup attempt
  const directFetch = await fetchWikipediaContentByTitle(input);
  if (directFetch && directFetch.content.length > 200) return directFetch;

  return null;
}
