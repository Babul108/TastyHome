require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');

const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Coupon = require('../models/Coupon');
const Payment = require('../models/Payment');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tastyhome';

const seed = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Restaurant.deleteMany({}),
      MenuItem.deleteMany({}),
      Order.deleteMany({}),
      Review.deleteMany({}),
      Coupon.deleteMany({}),
      Payment.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    // ─── Users ──────────────────────────────────────────────────────────────────
    const [adminUser, regularUser, deliveryUser] = await User.create([
      {
        name: 'Admin User',
        email: 'admin@tastyhome.com',
        phone: '9900000001',
        password: 'admin123',
        role: 'admin',
      },
      {
        name: 'John Doe',
        email: 'user@tastyhome.com',
        phone: '9900000002',
        password: 'user123',
        role: 'user',
        addresses: [
          {
            street: '123 MG Road',
            city: 'Bangalore',
            state: 'Karnataka',
            zipCode: '560001',
            isDefault: true,
          },
        ],
      },
      {
        name: 'Delivery One',
        email: 'delivery1@tastyhome.com',
        phone: '9900000003',
        password: 'delivery123',
        role: 'delivery',
        vehicleType: 'Bike',
        vehicleNumber: 'KA-01-AB-1234',
        isAvailable: true,
      },
    ]);
    console.log('Users created');

    // ─── Restaurants ────────────────────────────────────────────────────────────
    const restaurantData = [
      {
        name: 'Spice Garden',
        description: 'Authentic North Indian cuisine with rich gravies and tandoori specialties.',
        cuisine: ['North Indian', 'Punjabi'],
        address: { street: '45 Brigade Road', city: 'Bangalore', state: 'Karnataka', zipCode: '560001' },
        location: { type: 'Point', coordinates: [77.5945, 12.9716] },
        rating: 4.5,
        totalReviews: 120,
        images: [],
        priceRange: '$$',
        deliveryTime: '30-45 min',
        owner: adminUser._id,
      },
      {
        name: 'Dosa Palace',
        description: 'Classic South Indian breakfast and meals served fresh all day.',
        cuisine: ['South Indian'],
        address: { street: '12 Residency Road', city: 'Bangalore', state: 'Karnataka', zipCode: '560025' },
        location: { type: 'Point', coordinates: [77.6074, 12.9791] },
        rating: 4.3,
        totalReviews: 95,
        images: [],
        priceRange: '$',
        deliveryTime: '20-35 min',
        owner: adminUser._id,
      },
      {
        name: 'Pizza Italiano',
        description: 'Wood-fired pizzas and Italian pastas made with authentic ingredients.',
        cuisine: ['Pizza', 'Italian'],
        address: { street: '88 Indiranagar', city: 'Bangalore', state: 'Karnataka', zipCode: '560038' },
        location: { type: 'Point', coordinates: [77.6408, 12.9784] },
        rating: 4.7,
        totalReviews: 200,
        images: [],
        priceRange: '$$$',
        deliveryTime: '35-50 min',
        owner: adminUser._id,
      },
      {
        name: 'Dragon Wok',
        description: 'Pan-Asian Chinese cuisine with authentic flavors and aromatic sauces.',
        cuisine: ['Chinese'],
        address: { street: '67 Koramangala', city: 'Bangalore', state: 'Karnataka', zipCode: '560034' },
        location: { type: 'Point', coordinates: [77.6219, 12.9352] },
        rating: 4.2,
        totalReviews: 78,
        images: [],
        priceRange: '$$',
        deliveryTime: '25-40 min',
        owner: adminUser._id,
      },
      {
        name: 'Burger Barn',
        description: 'Juicy burgers, crispy fries, and refreshing shakes for every mood.',
        cuisine: ['Burger', 'American'],
        address: { street: '23 JP Nagar', city: 'Bangalore', state: 'Karnataka', zipCode: '560078' },
        location: { type: 'Point', coordinates: [77.5855, 12.9081] },
        rating: 4.4,
        totalReviews: 155,
        images: [],
        priceRange: '$$',
        deliveryTime: '20-30 min',
        owner: adminUser._id,
      },
      {
        name: 'Biryani House',
        description: 'Slow-cooked dum biryani with secret spice blends passed down generations.',
        cuisine: ['Biryani', 'Mughlai'],
        address: { street: '11 Shivajinagar', city: 'Bangalore', state: 'Karnataka', zipCode: '560051' },
        location: { type: 'Point', coordinates: [77.5995, 12.9862] },
        rating: 4.6,
        totalReviews: 310,
        images: [],
        priceRange: '$$',
        deliveryTime: '40-55 min',
        owner: adminUser._id,
      },
    ];

    const restaurants = await Restaurant.create(restaurantData);
    const [spiceGarden, dosaPalace, pizzaItaliano, dragonWok, burgerBarn, biryaniHouse] = restaurants;
    console.log('Restaurants created');

    // ─── Menu Items (50+) ───────────────────────────────────────────────────────
    const menuItems = [
      // Spice Garden - North Indian
      { name: 'Butter Chicken', description: 'Creamy tomato-based chicken curry', price: 280, category: 'North Indian', restaurant: spiceGarden._id, isVeg: false },
      { name: 'Palak Paneer', description: 'Cottage cheese in spiced spinach gravy', price: 220, category: 'North Indian', restaurant: spiceGarden._id, isVeg: true },
      { name: 'Dal Makhani', description: 'Slow-cooked black lentils in butter', price: 180, category: 'North Indian', restaurant: spiceGarden._id, isVeg: true },
      { name: 'Tandoori Roti', description: 'Whole wheat bread from clay oven', price: 30, category: 'North Indian', restaurant: spiceGarden._id, isVeg: true },
      { name: 'Chicken Biryani (Spice Garden)', description: 'Fragrant rice with tender chicken', price: 320, category: 'Biryani', restaurant: spiceGarden._id, isVeg: false },
      { name: 'Mango Lassi', description: 'Chilled mango yogurt drink', price: 80, category: 'Beverages', restaurant: spiceGarden._id, isVeg: true },
      { name: 'Gulab Jamun', description: 'Soft milk-solid dumplings in rose syrup', price: 90, category: 'Desserts', restaurant: spiceGarden._id, isVeg: true },
      { name: 'Onion Bhaji', description: 'Crispy onion fritters', price: 120, category: 'Snacks', restaurant: spiceGarden._id, isVeg: true },

      // Dosa Palace - South Indian
      { name: 'Masala Dosa', description: 'Crispy rice crepe with potato filling', price: 120, category: 'South Indian', restaurant: dosaPalace._id, isVeg: true },
      { name: 'Idli Sambar', description: 'Steamed rice cakes with lentil soup', price: 80, category: 'Breakfast', restaurant: dosaPalace._id, isVeg: true },
      { name: 'Vada', description: 'Crispy lentil doughnuts', price: 70, category: 'Snacks', restaurant: dosaPalace._id, isVeg: true },
      { name: 'Rava Dosa', description: 'Crispy semolina crepe with coconut chutney', price: 130, category: 'South Indian', restaurant: dosaPalace._id, isVeg: true },
      { name: 'Filter Coffee', description: 'Traditional South Indian coffee', price: 50, category: 'Beverages', restaurant: dosaPalace._id, isVeg: true },
      { name: 'Pongal', description: 'Rice and lentil porridge with ghee', price: 90, category: 'Breakfast', restaurant: dosaPalace._id, isVeg: true },
      { name: 'Payasam', description: 'Sweet rice and milk dessert', price: 80, category: 'Desserts', restaurant: dosaPalace._id, isVeg: true },
      { name: 'Uttapam', description: 'Thick rice pancake with vegetables', price: 110, category: 'South Indian', restaurant: dosaPalace._id, isVeg: true },

      // Pizza Italiano
      { name: 'Margherita Pizza', description: 'Classic tomato, mozzarella and basil', price: 349, category: 'Pizza', restaurant: pizzaItaliano._id, isVeg: true },
      { name: 'Pepperoni Pizza', description: 'Pepperoni slices on tomato base', price: 449, category: 'Pizza', restaurant: pizzaItaliano._id, isVeg: false },
      { name: 'BBQ Chicken Pizza', description: 'Smoky BBQ sauce with grilled chicken', price: 499, category: 'Pizza', restaurant: pizzaItaliano._id, isVeg: false },
      { name: 'Garlic Bread', description: 'Toasted bread with herb garlic butter', price: 149, category: 'Snacks', restaurant: pizzaItaliano._id, isVeg: true },
      { name: 'Tiramisu', description: 'Classic Italian coffee dessert', price: 199, category: 'Desserts', restaurant: pizzaItaliano._id, isVeg: true },
      { name: 'Fresh Lemonade', description: 'Sparkling lemon drink', price: 99, category: 'Beverages', restaurant: pizzaItaliano._id, isVeg: true },
      { name: 'Veggie Supreme Pizza', description: 'Loaded with fresh garden vegetables', price: 399, category: 'Pizza', restaurant: pizzaItaliano._id, isVeg: true },

      // Dragon Wok - Chinese
      { name: 'Veg Hakka Noodles', description: 'Stir-fried noodles with vegetables', price: 180, category: 'Chinese', restaurant: dragonWok._id, isVeg: true },
      { name: 'Chicken Fried Rice', description: 'Wok-tossed rice with chicken and eggs', price: 220, category: 'Chinese', restaurant: dragonWok._id, isVeg: false },
      { name: 'Manchurian (Gobi)', description: 'Crispy cauliflower in spicy sauce', price: 160, category: 'Chinese', restaurant: dragonWok._id, isVeg: true },
      { name: 'Chilli Chicken', description: 'Crispy chicken in hot chilli sauce', price: 260, category: 'Chinese', restaurant: dragonWok._id, isVeg: false },
      { name: 'Spring Rolls', description: 'Crispy veggie rolls with dipping sauce', price: 140, category: 'Snacks', restaurant: dragonWok._id, isVeg: true },
      { name: 'Hot and Sour Soup', description: 'Classic Chinese sour soup', price: 120, category: 'Lunch', restaurant: dragonWok._id, isVeg: false },
      { name: 'Prawn Dim Sum', description: 'Steamed prawn dumplings', price: 280, category: 'Snacks', restaurant: dragonWok._id, isVeg: false },

      // Burger Barn
      { name: 'Classic Beef Burger', description: 'Juicy beef patty with lettuce and tomato', price: 249, category: 'Burger', restaurant: burgerBarn._id, isVeg: false },
      { name: 'Crispy Chicken Burger', description: 'Fried chicken fillet with coleslaw', price: 219, category: 'Burger', restaurant: burgerBarn._id, isVeg: false },
      { name: 'Veggie Burger', description: 'Grilled veggie patty with avocado', price: 199, category: 'Burger', restaurant: burgerBarn._id, isVeg: true },
      { name: 'French Fries', description: 'Golden crispy fries with seasoning', price: 99, category: 'Snacks', restaurant: burgerBarn._id, isVeg: true },
      { name: 'Chocolate Milkshake', description: 'Thick creamy chocolate shake', price: 149, category: 'Beverages', restaurant: burgerBarn._id, isVeg: true },
      { name: 'Onion Rings', description: 'Beer-battered crispy onion rings', price: 119, category: 'Snacks', restaurant: burgerBarn._id, isVeg: true },
      { name: 'Double Patty Smash', description: 'Double smash patty with special sauce', price: 329, category: 'Burger', restaurant: burgerBarn._id, isVeg: false },
      { name: 'Cheese Burger', description: 'Classic burger with extra cheese', price: 229, category: 'Burger', restaurant: burgerBarn._id, isVeg: false },

      // Biryani House
      { name: 'Hyderabadi Chicken Biryani', description: 'Authentic dum biryani with raita', price: 280, category: 'Biryani', restaurant: biryaniHouse._id, isVeg: false },
      { name: 'Mutton Biryani', description: 'Slow-cooked mutton with aged basmati', price: 350, category: 'Biryani', restaurant: biryaniHouse._id, isVeg: false },
      { name: 'Veg Biryani', description: 'Fragrant rice with seasonal vegetables', price: 200, category: 'Biryani', restaurant: biryaniHouse._id, isVeg: true },
      { name: 'Prawn Biryani', description: 'Juicy prawns cooked in aromatic rice', price: 380, category: 'Biryani', restaurant: biryaniHouse._id, isVeg: false },
      { name: 'Shami Kebab', description: 'Minced meat patties with mint chutney', price: 160, category: 'Snacks', restaurant: biryaniHouse._id, isVeg: false },
      { name: 'Haleem', description: 'Slow-cooked wheat and meat porridge', price: 200, category: 'Dinner', restaurant: biryaniHouse._id, isVeg: false },
      { name: 'Double Ka Meetha', description: 'Hyderabadi bread pudding', price: 120, category: 'Desserts', restaurant: biryaniHouse._id, isVeg: true },
      { name: 'Raita', description: 'Chilled yogurt with cucumber', price: 60, category: 'Snacks', restaurant: biryaniHouse._id, isVeg: true },
      { name: 'Egg Biryani', description: 'Boiled eggs cooked in spiced rice', price: 220, category: 'Biryani', restaurant: biryaniHouse._id, isVeg: false },
      { name: 'Shorba', description: 'Spiced lamb soup', price: 130, category: 'Dinner', restaurant: biryaniHouse._id, isVeg: false },

      // Cross-category extras
      { name: 'Mango Ice Cream', description: 'Fresh mango frozen dessert', price: 90, category: 'Desserts', restaurant: dosaPalace._id, isVeg: true },
      { name: 'Protein Salad Bowl', description: 'Grilled chicken, quinoa, greens', price: 250, category: 'Diet', restaurant: burgerBarn._id, isVeg: false },
      { name: 'Green Detox Smoothie', description: 'Spinach, banana, almond milk blend', price: 150, category: 'Diet', restaurant: dosaPalace._id, isVeg: true },
      { name: 'Pani Puri', description: 'Crispy hollow puris with spiced water', price: 80, category: 'Street Food', restaurant: spiceGarden._id, isVeg: true },
      { name: 'Bhel Puri', description: 'Tangy puffed rice snack mix', price: 70, category: 'Street Food', restaurant: spiceGarden._id, isVeg: true },
    ];

    const createdItems = await MenuItem.create(menuItems);
    console.log(`Menu items created: ${createdItems.length}`);

    // ─── Coupons ─────────────────────────────────────────────────────────────────
    const now = new Date();
    const futureDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

    await Coupon.create([
      {
        code: 'WELCOME20',
        discount: 20,
        discountType: 'percentage',
        minOrder: 200,
        maxDiscount: 100,
        validFrom: now,
        validTo: futureDate,
        usageLimit: 500,
      },
      {
        code: 'FREEDEL',
        discount: 40,
        discountType: 'fixed',
        minOrder: 150,
        validFrom: now,
        validTo: futureDate,
        usageLimit: 300,
      },
      {
        code: 'TASTY50',
        discount: 50,
        discountType: 'percentage',
        minOrder: 300,
        maxDiscount: 100,
        validFrom: now,
        validTo: futureDate,
        usageLimit: 200,
      },
      {
        code: 'SAVE10',
        discount: 10,
        discountType: 'percentage',
        minOrder: 100,
        maxDiscount: 50,
        validFrom: now,
        validTo: futureDate,
        usageLimit: 1000,
      },
      {
        code: 'NEWUSER',
        discount: 30,
        discountType: 'percentage',
        minOrder: 250,
        maxDiscount: 150,
        validFrom: now,
        validTo: futureDate,
        usageLimit: 100,
      },
    ]);
    console.log('Coupons created');

    // ─── Sample Orders ────────────────────────────────────────────────────────────
    const butterChicken = createdItems.find((i) => i.name === 'Butter Chicken');
    const palakPaneer = createdItems.find((i) => i.name === 'Palak Paneer');
    const masalaDosa = createdItems.find((i) => i.name === 'Masala Dosa');
    const idliSambar = createdItems.find((i) => i.name === 'Idli Sambar');

    const order1 = await Order.create({
      user: regularUser._id,
      restaurant: spiceGarden._id,
      items: [
        { menuItem: butterChicken._id, name: butterChicken.name, price: butterChicken.price, quantity: 1 },
        { menuItem: palakPaneer._id, name: palakPaneer.name, price: palakPaneer.price, quantity: 1 },
      ],
      totalAmount: butterChicken.price + palakPaneer.price + 40,
      deliveryFee: 40,
      status: 'delivered',
      deliveryAddress: { street: '123 MG Road', city: 'Bangalore', state: 'Karnataka', zipCode: '560001' },
      paymentMethod: 'upi',
      paymentStatus: 'paid',
      deliveryBoy: deliveryUser._id,
      deliveryTimestamps: {
        confirmed: new Date(Date.now() - 3600000),
        preparing: new Date(Date.now() - 3000000),
        outForDelivery: new Date(Date.now() - 1800000),
        delivered: new Date(Date.now() - 600000),
      },
    });

    const order2 = await Order.create({
      user: regularUser._id,
      restaurant: dosaPalace._id,
      items: [
        { menuItem: masalaDosa._id, name: masalaDosa.name, price: masalaDosa.price, quantity: 2 },
        { menuItem: idliSambar._id, name: idliSambar.name, price: idliSambar.price, quantity: 1 },
      ],
      totalAmount: masalaDosa.price * 2 + idliSambar.price + 40,
      deliveryFee: 40,
      status: 'confirmed',
      deliveryAddress: { street: '123 MG Road', city: 'Bangalore', state: 'Karnataka', zipCode: '560001' },
      paymentMethod: 'cod',
      paymentStatus: 'pending',
    });

    await Payment.create([
      { order: order1._id, user: regularUser._id, amount: order1.totalAmount, method: 'upi', status: 'completed', transactionId: 'TXN123456789' },
      { order: order2._id, user: regularUser._id, amount: order2.totalAmount, method: 'cod', status: 'pending' },
    ]);
    console.log('Orders and payments created');

    // ─── Sample Reviews ───────────────────────────────────────────────────────────
    await Review.create([
      {
        user: regularUser._id,
        restaurant: spiceGarden._id,
        order: order1._id,
        rating: 5,
        comment: 'Absolutely delicious! The Butter Chicken was creamy and perfect.',
      },
    ]);
    console.log('Reviews created');

    console.log('\n✅ Seed completed successfully!');
    console.log('─────────────────────────────────────');
    console.log('Admin:    admin@tastyhome.com / admin123');
    console.log('User:     user@tastyhome.com / user123');
    console.log('Delivery: delivery1@tastyhome.com / delivery123');
    console.log('─────────────────────────────────────');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
