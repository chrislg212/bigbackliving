import { getPageHeader } from "@/lib/staticData";

export function usePageHeader(pageSlug: string) {
  const header = getPageHeader(pageSlug);

  return {
    customImage: header?.image || undefined,
    customTitle: header?.title || undefined,
    customSubtitle: header?.subtitle || undefined,
    isLoading: false,
  };
}
