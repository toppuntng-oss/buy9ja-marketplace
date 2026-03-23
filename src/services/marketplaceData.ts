

/**
 * Buy9ja Marketplace Data
 * Comprehensive marketplace with multiple categories and subcategories
 */

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  description: string;
  categoryId: string;
}

export interface Vendor {
  id: string;
  name: string;
  subcategoryId: string;
  categoryId: string;
  rating: number;
  deliveryTime: string;
  image: string;
  description: string;
  isOpen?: boolean;
}

export interface Product {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  inStock?: boolean;
  unit?: string;
}

// Main Categories
export const categories: Category[] = [
  {
    id: "food-beverage",
    name: "Food & Beverage",
    icon: "🍽️",
    description: "Restaurants, bakeries, and specialty food",
    subcategories: [
      {
        id: "local-restaurants",
        name: "Local Restaurants & Takeaways",
        description: "Standard meal delivery from local restaurants",
        categoryId: "food-beverage",
      },
      {
        id: "cloud-kitchens",
        name: "Cloud/Dark Kitchens",
        description: "Delivery-only brands from shared kitchen spaces",
        categoryId: "food-beverage",
      },
      {
        id: "bakeries-cafes",
        name: "Bakeries & Cafes",
        description: "Fresh pastries, bread, and coffee",
        categoryId: "food-beverage",
      },
      {
        id: "alcohol-liquor",
        name: "Alcohol & Liquor Stores",
        description: "Beer, wine, and spirits",
        categoryId: "food-beverage",
      },
      {
        id: "gourmet-specialty",
        name: "Gourmet & Specialty Food",
        description: "High-end and artisan foods",
        categoryId: "food-beverage",
      },
    ],
  },
  {
    id: "groceries-essentials",
    name: "Groceries & Essentials",
    icon: "🛒",
    description: "Supermarkets, convenience stores, and fresh produce",
    subcategories: [
      {
        id: "supermarkets",
        name: "Supermarkets & Grocery Giants",
        description: "Large chain grocery shopping",
        categoryId: "groceries-essentials",
      },
      {
        id: "convenience-stores",
        name: "Convenience Stores",
        description: "Essential, fast-turnover items",
        categoryId: "groceries-essentials",
      },
      {
        id: "farm-shops",
        name: "Farm Shops & Local Producers",
        description: "Fresh, local, and organic produce",
        categoryId: "groceries-essentials",
      },
      {
        id: "specialty-markets",
        name: "Specialty Markets",
        description: "Cheese shops, butchers, fishmongers",
        categoryId: "groceries-essentials",
      },
    ],
  },
  {
    id: "retail-lifestyle",
    name: "Retail & Lifestyle",
    icon: "🛍️",
    description: "Pharmacy, flowers, pets, and electronics",
    subcategories: [
      {
        id: "pharmacy-health",
        name: "Pharmacy & Health",
        description: "Medications and health products",
        categoryId: "retail-lifestyle",
      },
      {
        id: "flower-shops",
        name: "Flower Shops",
        description: "Bouquets and gifts",
        categoryId: "retail-lifestyle",
      },
      {
        id: "pet-stores",
        name: "Pet Stores",
        description: "Pet food, toys, and supplies",
        categoryId: "retail-lifestyle",
      },
      {
        id: "convenience-retail",
        name: "Convenience Retail/Gifts",
        description: "Gift shops and small boutiques",
        categoryId: "retail-lifestyle",
      },
      {
        id: "electronics",
        name: "Electronics & Mobile Accessories",
        description: "Gadgets and electronics",
        categoryId: "retail-lifestyle",
      },
    ],
  },
  {
    id: "hyperlocal-services",
    name: "Specialized Services",
    icon: "🔧",
    description: "Laundry, home essentials, and courier",
    subcategories: [
      {
        id: "laundry-cleaning",
        name: "Laundry & Dry Cleaning",
        description: "Pick-up and delivery of clothes",
        categoryId: "hyperlocal-services",
      },
      {
        id: "home-essentials",
        name: "Home Essentials/Hardware",
        description: "Tools, cleaning supplies, household items",
        categoryId: "hyperlocal-services",
      },
      {
        id: "courier-services",
        name: "Document/Courier Services",
        description: "Same-day delivery of documents",
        categoryId: "hyperlocal-services",
      },
    ],
  },
  {
    id: "sustainable-economy",
    name: "Sustainable & Local",
    icon: "♻️",
    description: "Eco-friendly and waste reduction options",
    subcategories: [
      {
        id: "too-good-to-go",
        name: "Too Good To Go",
        description: "Discounted unsold food near closing time",
        categoryId: "sustainable-economy",
      },
      {
        id: "local-organic",
        name: "Local Produce/Organic Markets",
        description: "Sustainable and eco-friendly shopping",
        categoryId: "sustainable-economy",
      },
    ],
  },
];

// Vendors across all categories
export const vendors: Vendor[] = [
  // Food & Beverage - Local Restaurants
  {
    id: "v1",
    name: "Mama's Kitchen",
    subcategoryId: "local-restaurants",
    categoryId: "food-beverage",
    rating: 4.8,
    deliveryTime: "25-35 min",
    image: "https://images.unsplash.com/photo-1665556899022-9761f95769e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqb2xsb2YlMjByaWNlJTIwbmlnZXJpYW4lMjBmb29kfGVufDF8fHx8MTc3Mjk3OTQ4NXww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Authentic Nigerian home cooking",
    isOpen: true,
  },
  {
    id: "v2",
    name: "Suya World",
    subcategoryId: "local-restaurants",
    categoryId: "food-beverage",
    rating: 4.7,
    deliveryTime: "20-30 min",
    image: "https://images.unsplash.com/photo-1747406394855-1b7e6674a017?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwc3V5YSUyMGdyaWxsZWQlMjBtZWF0fGVufDF8fHx8MTc3MjkzMzI4NXww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Best suya and grilled meats in town",
    isOpen: true,
  },
  
  // Food & Beverage - Bakeries & Cafes
  {
    id: "v3",
    name: "Golden Crust Bakery",
    subcategoryId: "bakeries-cafes",
    categoryId: "food-beverage",
    rating: 4.9,
    deliveryTime: "15-25 min",
    image: "https://images.unsplash.com/photo-1555932450-31a8aec2adf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlcnklMjBmcmVzaCUyMGJyZWFkfGVufDF8fHx8MTc3MzU1OTYxNHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Fresh bread, pastries, and cakes daily",
    isOpen: true,
  },
  {
    id: "v4",
    name: "Cafe Mocha",
    subcategoryId: "bakeries-cafes",
    categoryId: "food-beverage",
    rating: 4.6,
    deliveryTime: "10-20 min",
    image: "https://images.unsplash.com/photo-1555932450-31a8aec2adf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlcnklMjBmcmVzaCUyMGJyZWFkfGVufDF8fHx8MTc3MzU1OTYxNHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Premium coffee and light bites",
    isOpen: true,
  },

  // Groceries - Supermarkets
  {
    id: "v5",
    name: "ShopRite Express",
    subcategoryId: "supermarkets",
    categoryId: "groceries-essentials",
    rating: 4.5,
    deliveryTime: "30-45 min",
    image: "https://images.unsplash.com/photo-1545186182-9faaf78480b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm9jZXJ5JTIwc3RvcmUlMjBzaG9wcGluZ3xlbnwxfHx8fDE3NzM2MzcxNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Your one-stop grocery shop",
    isOpen: true,
  },
  {
    id: "v6",
    name: "Spar Supermarket",
    subcategoryId: "supermarkets",
    categoryId: "groceries-essentials",
    rating: 4.4,
    deliveryTime: "35-50 min",
    image: "https://images.unsplash.com/photo-1545186182-9faaf78480b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm9jZXJ5JTIwc3RvcmUlMjBzaG9wcGluZ3xlbnwxfHx8fDE3NzM2MzcxNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Quality groceries at great prices",
    isOpen: true,
  },

  // Groceries - Farm Shops
  {
    id: "v7",
    name: "Green Valley Farms",
    subcategoryId: "farm-shops",
    categoryId: "groceries-essentials",
    rating: 4.9,
    deliveryTime: "40-60 min",
    image: "https://images.unsplash.com/photo-1657288089316-c0350003ca49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwdmVnZXRhYmxlcyUyMGZhcm0lMjBtYXJrZXR8ZW58MXx8fHwxNzczNjcyMzc1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Fresh organic produce from local farms",
    isOpen: true,
  },

  // Retail - Pharmacy
  {
    id: "v8",
    name: "HealthPlus Pharmacy",
    subcategoryId: "pharmacy-health",
    categoryId: "retail-lifestyle",
    rating: 4.7,
    deliveryTime: "20-30 min",
    image: "https://images.unsplash.com/photo-1729949129758-0b668478dce5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaGFybWFjeSUyMG1lZGljaW5lJTIwaGVhbHRofGVufDF8fHx8MTc3MzY3MjM3NHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Your trusted healthcare partner",
    isOpen: true,
  },
  {
    id: "v9",
    name: "MedExpress",
    subcategoryId: "pharmacy-health",
    categoryId: "retail-lifestyle",
    rating: 4.6,
    deliveryTime: "15-25 min",
    image: "https://images.unsplash.com/photo-1729949129758-0b668478dce5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaGFybWFjeSUyMG1lZGljaW5lJTIwaGVhbHRofGVufDF8fHx8MTc3MzY3MjM3NHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Fast medication delivery",
    isOpen: true,
  },

  // Retail - Flowers
  {
    id: "v10",
    name: "Bloom & Petal",
    subcategoryId: "flower-shops",
    categoryId: "retail-lifestyle",
    rating: 4.8,
    deliveryTime: "25-40 min",
    image: "https://images.unsplash.com/photo-1701119897887-c98a85a54afe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG93ZXIlMjBzaG9wJTIwYm91cXVldHxlbnwxfHx8fDE3NzM2NzIzNzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Beautiful flowers for every occasion",
    isOpen: true,
  },

  // Services - Laundry
  {
    id: "v11",
    name: "CleanPress Laundry",
    subcategoryId: "laundry-cleaning",
    categoryId: "hyperlocal-services",
    rating: 4.5,
    deliveryTime: "Pick-up today, delivery tomorrow",
    image: "https://images.unsplash.com/photo-1673085518459-c60e0615c099?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXVuZHJ5JTIwZHJ5JTIwY2xlYW5pbmclMjBzZXJ2aWNlfGVufDF8fHx8MTc3MzY3MjM3NXww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Professional laundry and dry cleaning",
    isOpen: true,
  },

  // Sustainable - Too Good To Go
  {
    id: "v12",
    name: "Too Good To Go - Cafe Mocha",
    subcategoryId: "too-good-to-go",
    categoryId: "sustainable-economy",
    rating: 4.7,
    deliveryTime: "Pick-up only",
    image: "https://images.unsplash.com/photo-1555932450-31a8aec2adf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlcnklMjBmcmVzaCUyMGJyZWFkfGVufDF8fHx8MTc3MzU1OTYxNHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Surprise bag of unsold pastries - 50% off!",
    isOpen: false,
  },
];

// Products for each vendor
export const products: Record<string, Product[]> = {
  v1: [
    {
      id: "p1",
      vendorId: "v1",
      name: "Jollof Rice with Chicken",
      description: "Spicy Nigerian jollof rice with grilled chicken",
      price: 2500,
      image: "https://images.unsplash.com/photo-1665556899022-9761f95769e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqb2xsb2YlMjByaWNlJTIwbmlnZXJpYW4lMjBmb29kfGVufDF8fHx8MTc3Mjk3OTQ4NXww&ixlib=rb-4.1.0&q=80&w=1080",
      inStock: true,
    },
    {
      id: "p2",
      vendorId: "v1",
      name: "Egusi Soup & Pounded Yam",
      description: "Rich melon seed soup with smooth pounded yam",
      price: 3000,
      image: "https://images.unsplash.com/photo-1741026079032-7cb660e44bad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwZm9vZCUyMHBlcHBlciUyMHNvdXB8ZW58MXx8fHwxNzczMDA1MDI1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      inStock: true,
    },
  ],
  v2: [
    {
      id: "p3",
      vendorId: "v2",
      name: "Beef Suya Sticks",
      description: "Spicy grilled beef skewers",
      price: 1500,
      image: "https://images.unsplash.com/photo-1747406394855-1b7e6674a017?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwc3V5YSUyMGdyaWxsZWQlMjBtZWF0fGVufDF8fHx8MTc3MjkzMzI4NXww&ixlib=rb-4.1.0&q=80&w=1080",
      inStock: true,
    },
    {
      id: "p4",
      vendorId: "v2",
      name: "Chicken Suya Platter",
      description: "Grilled chicken with onions and peppers",
      price: 2000,
      image: "https://images.unsplash.com/photo-1747406394855-1b7e6674a017?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwc3V5YSUyMGdyaWxsZWQlMjBtZWF0fGVufDF8fHx8MTc3MjkzMzI4NXww&ixlib=rb-4.1.0&q=80&w=1080",
      inStock: true,
    },
  ],
  v3: [
    {
      id: "p5",
      vendorId: "v3",
      name: "Fresh Baguette",
      description: "Crispy French baguette baked fresh daily",
      price: 500,
      image: "https://images.unsplash.com/photo-1555932450-31a8aec2adf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlcnklMjBmcmVzaCUyMGJyZWFkfGVufDF8fHx8MTc3MzU1OTYxNHww&ixlib=rb-4.1.0&q=80&w=1080",
      inStock: true,
    },
    {
      id: "p6",
      vendorId: "v3",
      name: "Chocolate Croissant",
      description: "Buttery croissant filled with rich chocolate",
      price: 800,
      image: "https://images.unsplash.com/photo-1555932450-31a8aec2adf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlcnklMjBmcmVzaCUyMGJyZWFkfGVufDF8fHx8MTc3MzU1OTYxNHww&ixlib=rb-4.1.0&q=80&w=1080",
      inStock: true,
    },
  ],
  v5: [
    {
      id: "p7",
      vendorId: "v5",
      name: "Fresh Tomatoes",
      description: "Locally sourced ripe tomatoes",
      price: 1200,
      image: "https://images.unsplash.com/photo-1545186182-9faaf78480b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm9jZXJ5JTIwc3RvcmUlMjBzaG9wcGluZ3xlbnwxfHx8fDE3NzM2MzcxNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      inStock: true,
      unit: "per kg",
    },
    {
      id: "p8",
      vendorId: "v5",
      name: "White Rice 5kg",
      description: "Premium quality rice",
      price: 4500,
      image: "https://images.unsplash.com/photo-1545186182-9faaf78480b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm9jZXJ5JTIwc3RvcmUlMjBzaG9wcGluZ3xlbnwxfHx8fDE3NzM2MzcxNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      inStock: true,
    },
  ],
  v7: [
    {
      id: "p9",
      vendorId: "v7",
      name: "Organic Vegetable Box",
      description: "Mixed seasonal organic vegetables",
      price: 3500,
      image: "https://images.unsplash.com/photo-1657288089316-c0350003ca49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwdmVnZXRhYmxlcyUyMGZhcm0lMjBtYXJrZXR8ZW58MXx8fHwxNzczNjcyMzc1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      inStock: true,
    },
  ],
  v8: [
    {
      id: "p10",
      vendorId: "v8",
      name: "Paracetamol 500mg",
      description: "Pain relief medication - Pack of 20",
      price: 800,
      image: "https://images.unsplash.com/photo-1729949129758-0b668478dce5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaGFybWFjeSUyMG1lZGljaW5lJTIwaGVhbHRofGVufDF8fHx8MTc3MzY3MjM3NHww&ixlib=rb-4.1.0&q=80&w=1080",
      inStock: true,
    },
    {
      id: "p11",
      vendorId: "v8",
      name: "Vitamin C Tablets",
      description: "Immune support supplement - 30 tablets",
      price: 1500,
      image: "https://images.unsplash.com/photo-1729949129758-0b668478dce5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaGFybWFjeSUyMG1lZGljaW5lJTIwaGVhbHRofGVufDF8fHx8MTc3MzY3MjM3NHww&ixlib=rb-4.1.0&q=80&w=1080",
      inStock: true,
    },
  ],
  v10: [
    {
      id: "p12",
      vendorId: "v10",
      name: "Red Rose Bouquet",
      description: "12 fresh red roses beautifully arranged",
      price: 5000,
      image: "https://images.unsplash.com/photo-1701119897887-c98a85a54afe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG93ZXIlMjBzaG9wJTIwYm91cXVldHxlbnwxfHx8fDE3NzM2NzIzNzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      inStock: true,
    },
  ],
  v11: [
    {
      id: "p13",
      vendorId: "v11",
      name: "Laundry Service - Basic",
      description: "Wash, dry, and fold up to 10kg",
      price: 2000,
      image: "https://images.unsplash.com/photo-1673085518459-c60e0615c099?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXVuZHJ5JTIwZHJ5JTIwY2xlYW5pbmclMjBzZXJ2aWNlfGVufDF8fHx8MTc3MzY3MjM3NXww&ixlib=rb-4.1.0&q=80&w=1080",
      inStock: true,
    },
  ],
  v12: [
    {
      id: "p14",
      vendorId: "v12",
      name: "Surprise Pastry Bag",
      description: "Unsold pastries and baked goods",
      price: 1000,
      image: "https://images.unsplash.com/photo-1555932450-31a8aec2adf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlcnklMjBmcmVzaCUyMGJyZWFkfGVufDF8fHx8MTc3MzU1OTYxNHww&ixlib=rb-4.1.0&q=80&w=1080",
      inStock: true,
    },
  ],
};

// Helper functions
export function getCategoryById(categoryId: string): Category | undefined {
  return categories.find((cat) => cat.id === categoryId);
}

export function getSubcategoryById(subcategoryId: string): Subcategory | undefined {
  for (const category of categories) {
    const subcategory = category.subcategories.find(
      (sub) => sub.id === subcategoryId
    );
    if (subcategory) return subcategory;
  }
  return undefined;
}

export function getVendorsBySubcategory(subcategoryId: string): Vendor[] {
  return vendors.filter((vendor) => vendor.subcategoryId === subcategoryId);
}

export function getVendorsByCategory(categoryId: string): Vendor[] {
  return vendors.filter((vendor) => vendor.categoryId === categoryId);
}

export function getProductsByVendor(vendorId: string): Product[] {
  return products[vendorId] || [];
}

