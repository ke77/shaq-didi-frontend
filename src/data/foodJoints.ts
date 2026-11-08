export interface FoodJointItem {
  id: string;
  name: string;
  jointName: string;
  location: string;
  image: string;
  priceGHS: number;
  rating: number;
  prepTime: string;
  description: string;
  category: 'Popular' | 'Local Dishes' | 'Rice & Bowls' | 'Grills';
}

export const FOOD_ITEMS: FoodJointItem[] = [
  {
    id: 'gob3-1',
    name: "Daavi's Special Gob3",
    jointName: "Daavi's Kitchen",
    location: 'Haatso Station',
    image: '/src/assets/images/shaq_gob3_dish_1793811275165.jpg',
    priceGHS: 35.0,
    rating: 4.9,
    prepTime: '15-20 min',
    description: 'Slow-cooked spiced black-eyed beans stew with sweet fried ripe plantain, boiled egg, and crispy gari sprinkle.',
    category: 'Local Dishes',
  },
  {
    id: 'jollof-1',
    name: "Mama Gee's Smoky Jollof",
    jointName: 'Mama Gee Kitchen',
    location: 'Haatso Station',
    image: '/src/assets/images/shaq_jollof_dish_1793811274974.jpg',
    priceGHS: 55.0,
    rating: 4.8,
    prepTime: '20-25 min',
    description: 'Authentic Ghanaian firewood-smoked jollof rice served with tender spiced grilled chicken and fried plantain.',
    category: 'Rice & Bowls',
  },
  {
    id: 'gob3-2',
    name: "Daavi's Special Gob3",
    jointName: "Daavi's Kitchen",
    location: 'Haatso Station',
    image: '/src/assets/images/shaq_gob3_dish_1793811275165.jpg',
    priceGHS: 40.0,
    rating: 4.9,
    prepTime: '15-20 min',
    description: 'Double plantain special portion with fried fish or boiled egg in rich palm oil gravy.',
    category: 'Local Dishes',
  },
  {
    id: 'paella-1',
    name: "Chef Kofi's Seafood Rice",
    jointName: 'Seaside Grill & Pot',
    location: 'Haatso Station',
    image: '/src/assets/images/shaq_didi_food_table_1793810511571.jpg',
    priceGHS: 75.0,
    rating: 4.7,
    prepTime: '25-30 min',
    description: 'Gourmet yellow seasoned rice pot with fresh prawns, calamari, lemon wedges, and fresh herb garnish.',
    category: 'Popular',
  },
  {
    id: 'gob3-3',
    name: "Daavi's Special Gob3",
    jointName: "Daavi's Kitchen",
    location: 'Haatso Station',
    image: '/src/assets/images/shaq_gob3_dish_1793811275165.jpg',
    priceGHS: 35.0,
    rating: 4.9,
    prepTime: '15-20 min',
    description: 'Fresh morning batch of beans stew with golden kelewele plantain and egg.',
    category: 'Local Dishes',
  },
  {
    id: 'fried-rice-1',
    name: "Auntie Akua's Fried Rice",
    jointName: 'Akua Special Kitchen',
    location: 'Haatso Station',
    image: '/src/assets/images/shaq_didi_food_table_1793810511571.jpg',
    priceGHS: 50.0,
    rating: 4.6,
    prepTime: '15-20 min',
    description: 'Vegetable egg fried rice with seasoned spring onions, carrots, and sweet chili pepper sauce.',
    category: 'Rice & Bowls',
  },
  {
    id: 'grill-1',
    name: 'Haatso Charcoal Tilapia',
    jointName: 'Big Ben Grills',
    location: 'Haatso Station',
    image: '/src/assets/images/shaq_jollof_dish_1793811274974.jpg',
    priceGHS: 65.0,
    rating: 4.8,
    prepTime: '25-35 min',
    description: 'Charcoal grilled fresh river tilapia spiced with ginger, garlic, cloves, served with hot pepper sauce.',
    category: 'Grills',
  },
  {
    id: 'gob3-4',
    name: "Daavi's Special Gob3",
    jointName: "Daavi's Kitchen",
    location: 'Haatso Station',
    image: '/src/assets/images/shaq_gob3_dish_1793811275165.jpg',
    priceGHS: 35.0,
    rating: 4.9,
    prepTime: '15-20 min',
    description: 'Classic Gob3 portion prepared with authentic palm oil and freshly fried plantain.',
    category: 'Local Dishes',
  },
];
