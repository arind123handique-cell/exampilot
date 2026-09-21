import { useCallback, useEffect, useState } from 'react';
import { ActiveTab, ALL_NAV_ITEMS } from '../components/layout/navConfig';
import { getAdminDomainUrl } from '../config/domainConfig';

export const TAB_TO_PATH: Record<ActiveTab, string> = {
  creator: '/',
  test: '/test',
  results: '/results',
  history: '/records',
  admin: '/admin',
  pyq: '/pyq',
};

export const PATH_TO_TAB: Record<string, ActiveTab> = Object.fromEntries(
  Object.entries(TAB_TO_PATH).map(([k, v]) => [v, k as ActiveTab])
) as Record<string, ActiveTab>;

function normalize(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1);
  return pathname;
}

export function parseTabFromLocation(): { tab: ActiveTab; params: URLSearchParams } {
  const pathname = normalize(window.location.pathname);
  const params = new URLSearchParams(window.location.search);
  if (pathname === '/admin') {
    window.location.href = getAdminDomainUrl();
    return { tab: 'creator', params };
  }
  if (PATH_TO_TAB[pathname]) return { tab: PATH_TO_TAB[pathname], params };
  return { tab: 'creator', params };
}

export function tabToHref(tab: ActiveTab, params?: Record<string, string>): string {
  if (tab === 'admin') return getAdminDomainUrl();
  const base = TAB_TO_PATH[tab];
  if (!params || Object.keys(params).length === 0) return base;
  const sp = new URLSearchParams(params);
  return `${base}?${sp.toString()}`;
}

export function useAppRouter(
  activeTab: ActiveTab,
  setActiveTab: (tab: ActiveTab) => void
) {
  const [params, setParams] = useState<URLSearchParams>(() => parseTabFromLocation().params);

  const syncToUrl = useCallback(
    (tab: ActiveTab, extraParams?: Record<string, string | undefined>, opts?: { replace?: boolean }) => {
      const url = new URL(window.location.href);
      const base = TAB_TO_PATH[tab];
      const nextParams = new URLSearchParams(url.search);
      if (extraParams) {
        Object.entries(extraParams).forEach(([k, v]) => {
          if (v === undefined || v === '') nextParams.delete(k);
          else nextParams.set(k, v);
        });
      }
      const qs = nextParams.toString();
      const nextHref = qs ? `${base}?${qs}` : base;
      if (opts?.replace) window.history.replaceState(null, '', nextHref);
      else window.history.pushState(null, '', nextHref);
      setParams(new URLSearchParams(nextParams));
    },
    []
  );

  const navigate = useCallback(
    (tab: ActiveTab, extraParams?: Record<string, string | undefined>, opts?: { replace?: boolean }) => {
      setActiveTab(tab);
      syncToUrl(tab, extraParams, opts);
    },
    [setActiveTab, syncToUrl]
  );

  useEffect(() => {
    const { tab } = parseTabFromLocation();
    if (tab !== activeTab) setActiveTab(tab);

    const onPop = () => {
      const { tab: nextTab, params: nextParams } = parseTabFromLocation();
      setActiveTab(nextTab);
      setParams(nextParams);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const pathname = normalize(window.location.pathname);
    const expected = TAB_TO_PATH[activeTab];
    if (pathname !== expected) {
      const url = new URL(window.location.href);
      window.history.replaceState(null, '', `${expected}${url.search}`);
      setParams(new URLSearchParams(url.search));
    }
  }, [activeTab]);

  return { params, navigate, syncToUrl, parseTabFromLocation };
}
