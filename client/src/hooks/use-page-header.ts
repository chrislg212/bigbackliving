import { useQuery } from "@tanstack/react-query";
import type { PageHeader } from "@shared/schema";

export function usePageHeader(pageSlug: string) {
  const { data: headers = [], isLoading } = useQuery<PageHeader[]>({
    queryKey: ["/api/page-headers"],
  });

  const header = headers.find(h => h.pageSlug === pageSlug);

  return {
    customImage: header?.image || undefined,
    customTitle: header?.title || undefined,
    customSubtitle: header?.subtitle || undefined,
    isLoading,
  };
}
