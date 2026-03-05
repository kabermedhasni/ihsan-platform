import React from 'react';
import { Heart, Stethoscope, Home } from 'lucide-react';

export type NeedCategory = 'meals' | 'medical' | 'housing' | 'other';

const CategoryIcon = ({ category, className = "" }: { category: string; className?: string }) => {
    switch (category.toLowerCase()) {
        case 'meals':
        case 'وجبات':
            return <Heart className={className} />;
        case 'medical':
        case 'طبي':
            return <Stethoscope className={className} />;
        case 'housing':
        case 'إيواء':
            return <Home className={className} />;
        default:
            return <Heart className={className} />;
    }
};

export const getCategoryLabel = (category: string) => {
    switch (category.toLowerCase()) {
        case 'meals':
        case 'وجبات':
            return 'Meals';
        case 'medical':
        case 'طبي':
            return 'Medical';
        case 'housing':
        case 'إيواء':
            return 'Housing';
        default:
            return category || 'Other';
    }
}

export default CategoryIcon;
