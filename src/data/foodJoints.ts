export interface MenuItem {
  id: string;
  name: string;
  description: string;
  priceGHS: number;
  isPopular?: boolean;
}

export interface FoodJointItem {
  id: string;
  name: string;
  jointName: string;
  featuredDish: string;
  location: string;
  image: string;
  priceGHS: number;
  rating: number;
  prepTime: string;
  description: string;
  category: 'Local Dishes' | 'Rice & Bowls' | 'Grills';
  isPopular: boolean;
  isMostOrdered: boolean;
  orderCount: number;
  menu: MenuItem[];
}

export const FOOD_ITEMS: FoodJointItem[] = [
  {
    id: 'joint-daavis',
    name: "Daavi's Kitchen",
    jointName: "Daavi's Kitchen",
    featuredDish: "Daavi's Special Gob3",
    location: 'Haatso Station, Atomic Junction Rd',
    image: '/src/assets/images/shaq_gob3_dish_1793811275165.jpg',
    priceGHS: 35.0,
    rating: 4.9,
    prepTime: '15-20 min',
    description:
      'Famous at Haatso Station for slow-cooked spiced black-eyed beans stew, sweet fried ripe plantain, boiled egg, and crispy gari.',
    category: 'Local Dishes',
    isPopular: true,
    isMostOrdered: true,
    orderCount: 148,
    menu: [
      {
        id: 'daavi-m1',
        name: "Daavi's Special Gob3",
        description: 'Beans stew, fried ripe plantain, boiled egg & gari sprinkle',
        priceGHS: 35,
        isPopular: true,
      },
      {
        id: 'daavi-m2',
        name: 'Double Plantain & Fried Fish Gob3',
        description: 'Generous beans stew with golden kelewele & seasoned tilapia fillet',
        priceGHS: 45,
      },
      {
        id: 'daavi-m3',
        name: 'Beans Stew & Boiled Yam Pack',
        description: 'Hot palm oil beans stew paired with soft boiled puna yam',
        priceGHS: 40,
      },
      {
        id: 'daavi-m4',
        name: 'Kelewele & Roasted Groundnuts',
        description: 'Ginger-spiced fried ripe plantain cubes with roasted peanuts',
        priceGHS: 25,
      },
    ],
  },
  {
    id: 'joint-mamagee',
    name: 'Mama Gee Kitchen',
    jointName: 'Mama Gee Kitchen',
    featuredDish: "Mama Gee's Smoky Jollof",
    location: 'Haatso Station, Market Lane',
    image: '/src/assets/images/shaq_jollof_dish_1793811274974.jpg',
    priceGHS: 55.0,
    rating: 4.8,
    prepTime: '20-25 min',
    description:
      'Authentic Ghanaian firewood-smoked jollof rice, waakye specials, and tender spiced grilled chicken with homemade shito.',
    category: 'Rice & Bowls',
    isPopular: true,
    isMostOrdered: true,
    orderCount: 132,
    menu: [
      {
        id: 'mg-m1',
        name: "Mama Gee's Smoky Jollof & Chicken",
        description: 'Firewood-smoked jollof rice, grilled chicken thigh, coleslaw & plantain',
        priceGHS: 55,
        isPopular: true,
      },
      {
        id: 'mg-m2',
        name: 'Assorted Beef & Sausage Jollof',
        description: 'Party-style jollof loaded with tender beef chunks and grilled sausage',
        priceGHS: 60,
      },
      {
        id: 'mg-m3',
        name: 'Mama Gee Special Waakye Leaf Pack',
        description: 'Waakye with wele, boiled egg, talia, gari, and black shito',
        priceGHS: 45,
      },
      {
        id: 'mg-m4',
        name: 'Fried Chicken Wings (4 pcs) & Rice',
        description: 'Crispy spiced wings over fragrant tomato jollof',
        priceGHS: 50,
      },
    ],
  },
  {
    id: 'joint-seaside',
    name: 'Seaside Grill & Pot',
    jointName: 'Seaside Grill & Pot',
    featuredDish: "Chef Kofi's Seafood Rice",
    location: 'Haatso Yam Market Rd, Block C',
    image: '/src/assets/images/shaq_didi_food_table_1793810511571.jpg',
    priceGHS: 75.0,
    rating: 4.7,
    prepTime: '25-30 min',
    description:
      'Coastal-inspired rice pots, seasoned prawns, grilled catch of the day, and savory herb bowls prepared fresh per order.',
    category: 'Rice & Bowls',
    isPopular: true,
    isMostOrdered: false,
    orderCount: 84,
    menu: [
      {
        id: 'sea-m1',
        name: "Chef Kofi's Seafood Rice Pot",
        description: 'Golden seasoned rice with grilled prawns, calamari & herb garnish',
        priceGHS: 75,
        isPopular: true,
      },
      {
        id: 'sea-m2',
        name: 'Grilled Red Snapper & Banku',
        description: 'Whole seasoned red snapper with smooth banku & hot okro/pepper',
        priceGHS: 70,
      },
      {
        id: 'sea-m3',
        name: 'Herb Butter Chicken Rice Bowl',
        description: 'Steamed jasmine rice with seared herb chicken & sautéed greens',
        priceGHS: 55,
      },
    ],
  },
  {
    id: 'joint-akua',
    name: 'Akua Special Kitchen',
    jointName: 'Akua Special Kitchen',
    featuredDish: "Auntie Akua's Fried Rice",
    location: 'Haatso Station, Behind Shell Fuel',
    image: '/src/assets/images/shaq_didi_food_table_1793810511571.jpg',
    priceGHS: 50.0,
    rating: 4.6,
    prepTime: '15-20 min',
    description:
      'Quick lunchtime favorites including stir-fry fried rice, noodles, spicy chicken wings, and fresh crisp vegetable salads.',
    category: 'Rice & Bowls',
    isPopular: false,
    isMostOrdered: true,
    orderCount: 119,
    menu: [
      {
        id: 'ak-m1',
        name: "Auntie Akua's Special Fried Rice",
        description: 'Vegetable egg fried rice with grilled chicken & sweet chili sauce',
        priceGHS: 50,
        isPopular: true,
      },
      {
        id: 'ak-m2',
        name: 'Check-Check Pork & Fried Rice',
        description: 'Street-style smoky fried rice with tender glazed pork cuts',
        priceGHS: 55,
      },
      {
        id: 'ak-m3',
        name: 'Loaded Indomie Stir-Fry',
        description: 'Wok-tossed noodles with egg, sausage, veggies & green pepper',
        priceGHS: 35,
      },
    ],
  },
  {
    id: 'joint-bigben',
    name: 'Big Ben Grills',
    jointName: 'Big Ben Grills',
    featuredDish: 'Haatso Charcoal Tilapia',
    location: 'Haatso West, Agbogba Link',
    image: '/src/assets/images/shaq_jollof_dish_1793811274974.jpg',
    priceGHS: 65.0,
    rating: 4.8,
    prepTime: '25-35 min',
    description:
      'Open-flame charcoal grill station specializing in ginger-garlic marinated river tilapia, suya skewers, and hot banku.',
    category: 'Grills',
    isPopular: true,
    isMostOrdered: false,
    orderCount: 91,
    menu: [
      {
        id: 'bb-m1',
        name: 'Charcoal Grilled Tilapia & Banku',
        description: 'Whole spiced river tilapia with 2 balls of banku, green & red pepper',
        priceGHS: 65,
        isPopular: true,
      },
      {
        id: 'bb-m2',
        name: 'Spicy Beef Suya & Yam Chips',
        description: 'Peanut-spiced grilled beef skewers with crispy yam fries',
        priceGHS: 55,
      },
      {
        id: 'bb-m3',
        name: 'Charcoal Guinea Fowl & Jollof',
        description: 'Smoky grilled guinea fowl quarter paired with tomato jollof',
        priceGHS: 70,
      },
    ],
  },
  {
    id: 'joint-auntiemuni',
    name: 'Auntie Muni Waakye Spot',
    jointName: 'Auntie Muni Waakye Spot',
    featuredDish: 'Royal Waakye Leaf Bowl',
    location: 'Haatso Station, Main Lorry Park',
    image: '/src/assets/images/shaq_gob3_dish_1793811275165.jpg',
    priceGHS: 40.0,
    rating: 4.9,
    prepTime: '10-15 min',
    description:
      'Morning and lunch staple loved by office staff — rich sorghum-leaf waakye served with fish, beef, gari, and signature shito.',
    category: 'Local Dishes',
    isPopular: false,
    isMostOrdered: true,
    orderCount: 164,
    menu: [
      {
        id: 'am-m1',
        name: 'Royal Waakye Full Combo',
        description: 'Waakye with beef, fried fish, boiled egg, wele, plantain & gari',
        priceGHS: 45,
        isPopular: true,
      },
      {
        id: 'am-m2',
        name: 'Standard Waakye & Egg',
        description: 'Classic leaf-wrapped waakye with stew, shito, spaghetti & egg',
        priceGHS: 30,
      },
      {
        id: 'am-m3',
        name: 'Fufu & Goat Light Soup (Lunch Pack)',
        description: 'Freshly pounded fufu in aromatic spiced goat meat light soup',
        priceGHS: 60,
      },
    ],
  },
];
