export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  rating: number;
  reviews: number;
  time?: string;
  discount?: number;
  stock?: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: "pending" | "preparing" | "ready" | "completed";
  createdAt: Date;
  estimatedTime?: number;
  orderType: "pre-order" | "walk-in";
  qrCode?: string;
  studentId?: string;
  studentName?: string;
  studentEmail?: string;
  fulfillmentTime?: Date;
  paymentMethod?: "online" | "cash" | "card" | "upi";
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

// Mock Data
export const MOCK_CATEGORIES: Category[] = [
  { id: "1", name: "Drinks", icon: "🧃" },
  { id: "2", name: "Snacks", icon: "🍪" },
  { id: "3", name: "Desserts", icon: "🍰" },
  { id: "4", name: "Cakes", icon: "🎂" },
];

export const MOCK_MENU_ITEMS: MenuItem[] = [
  {
    id: "1",
    name: "Tea",
    description: "Refreshing hot tea with aromatic flavors",
    price: 15,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop",
    rating: 4.5,
    reviews: 200,
    time: "2 min",
    discount: 0,
  },
  {
    id: "2",
    name: "Coffee",
    description: "Rich and bold brewed coffee",
    price: 20,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 350,
    time: "3 min",
    discount: 0,
  },
  {
    id: "3",
    name: "Milk",
    description: "Fresh cold milk, pure and wholesome",
    price: 20,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop",
    rating: 4.3,
    reviews: 150,
    time: "1 min",
    discount: 0,
  },
  {
    id: "4",
    name: "Paneer Puffs",
    description: "Crispy puffs filled with spiced paneer",
    price: 25,
    category: "Snacks",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 280,
    time: "3 min",
    discount: 0,
  },
  {
    id: "5",
    name: "Samosa",
    description: "Golden fried pastry with potato filling",
    price: 13,
    category: "Snacks",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 400,
    time: "2 min",
    discount: 0,
  },
  {
    id: "6",
    name: "Cutlet",
    description: "Spicy vegetable cutlet, crispy and delicious",
    price: 25,
    category: "Snacks",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop",
    rating: 4.5,
    reviews: 220,
    time: "3 min",
    discount: 0,
  },
  {
    id: "7",
    name: "Mushroom Puffs",
    description: "Flaky puffs stuffed with mushroom and herbs",
    price: 25,
    category: "Snacks",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop",
    rating: 4.4,
    reviews: 180,
    time: "3 min",
    discount: 0,
  },
  {
    id: "8",
    name: "Mushroom Roll",
    description: "Rolled pastry with mushroom filling",
    price: 25,
    category: "Snacks",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 250,
    time: "3 min",
    discount: 0,
  },
  {
    id: "9",
    name: "Paneer Roll",
    description: "Spicy paneer wrapped in crispy roll",
    price: 25,
    category: "Snacks",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 300,
    time: "3 min",
    discount: 0,
  },
  {
    id: "10",
    name: "Donut",
    description: "Sweet glazed donut, soft and fluffy",
    price: 35,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=400&fit=crop",
    rating: 4.5,
    reviews: 320,
    time: "1 min",
    discount: 0,
  },
  {
    id: "11",
    name: "Brownie",
    description: "Rich chocolate brownie, fudgy and decadent",
    price: 40,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1607478900766-efe13248b125?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 450,
    time: "1 min",
    discount: 0,
  },
  {
    id: "12",
    name: "Chocolate Mousse",
    description: "Light and airy chocolate mousse dessert",
    price: 90,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 280,
    time: "2 min",
    discount: 0,
  },
  {
    id: "13",
    name: "Chocolate Cake",
    description: "Moist chocolate cake with rich frosting",
    price: 150,
    category: "Cakes",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 500,
    time: "5 min",
    discount: 0,
  },
  {
    id: "14",
    name: "White Forest Cake",
    description: "Classic white forest cake with cherries",
    price: 180,
    category: "Cakes",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 380,
    time: "5 min",
    discount: 0,
  },
  {
    id: "15",
    name: "Plain Cake",
    description: "Simple and delicious plain cake",
    price: 120,
    category: "Cakes",
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=400&fit=crop",
    rating: 4.4,
    reviews: 200,
    time: "4 min",
    discount: 0,
  },
];

export const MOCK_USER: User = {
  id: "user_1",
  name: "Ajmal",
  email: "ajmal@college.edu",
  phone: "+91 98765 43210",
};

export const MOCK_ORDERS: Order[] = [
  {
    id: "order_1",
    items: [
      { ...MOCK_MENU_ITEMS[0], quantity: 2 },
      { ...MOCK_MENU_ITEMS[3], quantity: 1 },
    ],
    total: 380,
    status: "ready",
    createdAt: new Date(Date.now() - 15 * 60000),
    estimatedTime: 5,
  },
  {
    id: "order_2",
    items: [{ ...MOCK_MENU_ITEMS[1], quantity: 1 }],
    total: 162,
    status: "completed",
    createdAt: new Date(Date.now() - 2 * 60 * 60000),
  },
];
