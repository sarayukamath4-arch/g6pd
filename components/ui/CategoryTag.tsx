import { Badge } from "@/components/ui/badge";

type Category = "Medication" | "Food" | "Chemical" | "Supplement";

interface CategoryTagProps {
  category: Category;
}

export function CategoryTag({ category }: CategoryTagProps) {
  const styles = {
    Medication: "bg-purple-100 text-purple-900 border-purple-300",
    Food: "bg-green-100 text-green-900 border-green-300",
    Chemical: "bg-orange-100 text-orange-900 border-orange-300",
    Supplement: "bg-blue-100 text-blue-900 border-blue-300",
  };

  return (
    <Badge className={styles[category]} variant="outline">
      {category}
    </Badge>
  );
}