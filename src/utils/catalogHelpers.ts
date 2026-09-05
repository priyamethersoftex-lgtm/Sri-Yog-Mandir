import type { PublicCategory } from "../services/api/publicApiTypes";

export interface FlattenedGroupItem {
  groupId: number;
  categoryId: number;
  categoryName: string;
  subCatId: number;
  subCatName: string;
  details: string;
  models: string[];
  brands: string[];
  sortOrder: number;
  isActive: boolean;
}

/**
 * Extracts the brand name from a model string (e.g. "Samsung A10" -> "Samsung", "Poco C3" -> "Poco").
 */
export function extractBrandFromModel(modelName: string): string {
  const trimmed = modelName.trim();
  if (!trimmed) return "Other";
  const firstWord = trimmed.split(" ")[0];
  return firstWord || "Other";
}

/**
 * Flattens the hierarchical PublicCompatibilityCatalog into flat items for fast searching and UI rendering.
 */
export function flattenCatalogData(categories: PublicCategory[] | undefined): FlattenedGroupItem[] {
  if (!categories || !Array.isArray(categories)) return [];

  const flattened: FlattenedGroupItem[] = [];

  for (const cat of categories) {
    if (!cat.SubCategories || !Array.isArray(cat.SubCategories)) continue;

    for (const sub of cat.SubCategories) {
      if (!sub.CompatibilityGroups || !Array.isArray(sub.CompatibilityGroups)) continue;

      for (const group of sub.CompatibilityGroups) {
        if (!group.IsActive && group.IsActive !== undefined) continue;

        // Parse details string: e.g. "Vivo Y91 = Samsung A10 = ..."
        const models = group.Details
          ? group.Details.split("=")
            .map((m) => m.trim())
            .filter(Boolean)
          : [];

        const brandSet = new Set<string>();
        models.forEach((m) => {
          brandSet.add(extractBrandFromModel(m));
        });

        flattened.push({
          groupId: group.GroupId,
          categoryId: cat.CategoryId,
          categoryName: cat.CategoryName,
          subCatId: sub.SubCatId,
          subCatName: sub.SubCatName,
          details: group.Details || "",
          models,
          brands: Array.from(brandSet),
          sortOrder: group.SortOrder ?? 0,
          isActive: group.IsActive ?? true,
        });
      }
    }
  }

  return flattened;
}

export function getUniqueBrands(items: FlattenedGroupItem[]): string[] {
  const set = new Set<string>();
  items.forEach((item) => {
    item.brands.forEach((b) => set.add(b));
  });
  return Array.from(set).sort();
}
