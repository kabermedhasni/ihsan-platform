import { Utensils, Stethoscope, Home, Heart } from "lucide-react";

export type NeedCategory = "meals" | "medical" | "housing" | "other";

const CategoryIcon = ({
  category,
  className = "",
}: {
  category: string;
  className?: string;
}) => {
  const categoryKey = (category || "").toLowerCase().trim();

  if (categoryKey.includes("meals") || categoryKey.includes("وجبات")) {
    return <Utensils className={className} />;
  }
  if (categoryKey.includes("medical") || categoryKey.includes("طبي")) {
    return <Stethoscope className={className} />;
  }
  if (categoryKey.includes("housing") || categoryKey.includes("إيواء")) {
    return <Home className={className} />;
  }

  return <Heart className={className} />;
};

export default CategoryIcon;
