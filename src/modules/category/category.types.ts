export interface CategoryWithChildren {
  id: number;
  parentId: number | null;
  children?: CategoryWithChildren[];
}
