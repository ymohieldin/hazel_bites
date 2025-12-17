# 📖 Hazel Bites User Manual

Welcome to **Hazel Bites**! This guide will show you how to use the app, whether you are a **Guest** ordering food or the **Admin** running the restaurant.

---

## 🍟 For Guests (Your Friends)

This is the "fun" part. Your friends will pretend to be customers at your restaurant.

### 1. Start an Order
*   **Scan a QR Code**: In a real restaurant, they would scan a printed code on the table.
*   **Test Link**: You can send them a direct link like this:
    > `https://hazel-bites.vercel.app/restaurant/1/table/5`
    *(This simulates sitting at Table #5)*

### 2. Browse & Order
*   **Explore the Menu**: Scroll through categories (Burgers, Pizza, Drinks) at the top.
*   **Customize**: Click any item (e.g., "Koshary") to add extras (like Spicy Sauce) or change quantity.
*   **Add to Cart**: Click the big price button to add it to your order.

### 3. Checkout
*   **View Cart**: Click the bottom bar to see your summary.
*   **Pay**:
    *   **Cash**: Keeps the order simple.
    *   **Online**: Simulates an online payment flow.
*   **Track Status**: After placing the order, you can watch the screen to see when the kitchen starts preparing your food!

---

## 👨‍🍳 For Admin (You)

You have full control over the restaurant. You can access the **Admin Dashboard** here:
> `https://hazel-bites.vercel.app/admin`

### 1. Menu Management
*   **Add Products**:
    *   Go to **Menu** in the sidebar.
    *   Click **"Add Product"**.
    *   **Upload Images**: You can upload real food photos!
    *   **Details**: Set name, price, category, and a description.
*   **Edit/Delete**: Click the pencil icon on any item to fix a typo or change a price.

### 2. Kitchen Display System (KDS)
This is what your chefs would see on a tablet in the kitchen.
*   **Go to**: `https://hazel-bites.vercel.app/dashboard/kitchen`
*   **Live Orders**: When a friend places an order, it pops up here *instantly*.
*   **Manage Status**:
    *   Tap **"Accept"** to start cooking (changes status to `Preparing`).
    *   Tap **"Ready"** when done (notifies the customer).
    *   Tap **"Complete"** to clear it from the board.

### 3. QR Code Generator
*   Go to **QR Codes** in the Admin sidebar.
*   **Generate**: Enter a table number (e.g., `10`) and click Generate.
*   **Print**: You can download or print these codes and stick them on real tables for the full experience!

### 4. Settings
*   **Reset Order Counter**: If you want to start fresh (Order #1) for a new day.
*   **Restaurant Info**: Change your restaurant name or tax ID.

---

## 🚀 Pro Tips for Testing
1.  **Open two windows**: Open the **Kitchen View** on your laptop and the **Customer View** on your phone.
2.  **Place an order on your phone**: Watch it appear instantly on your laptop screen!
3.  **Try "Demo Mode"**: Even if you don't have a database, the app remembers your orders as long as the server is running.
