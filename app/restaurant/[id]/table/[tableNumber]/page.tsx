import React from "react";
// We would import db connect and models here to fetch data server-side
// For now we will mock data to verify UI flow as requested by the Plan.
import { CategoryNav } from "@/components/menu/CategoryNav";
import { ProductCard } from "@/components/menu/ProductCard";
import { ProductModal } from "@/components/menu/ProductModal";
import { StickyCart } from "@/components/cart/StickyCart";
import { CallWaiter } from "@/components/menu/CallWaiter";
import { CartProvider } from "@/context/CartContext";
import { Utensils } from "lucide-react";

import { EGYPTIAN_MENU_DATA } from "@/lib/mock_data";

// Inner component to use hook contexts
import MenuPageClient from "@/components/menu/MenuPageClient";

export const dynamic = "force-dynamic";

export default async function MenuPage({ params }: { params: Promise<{ id: string; tableNumber: string }> }) {
    const { id, tableNumber } = await params;

    // We fetch data from the Database (MongoDB) if available, otherwise fallback to memory/mock
    const { default: connectToDatabase } = await import("@/lib/db");
    const { default: Product } = await import("@/lib/models/Product");
    const { default: Category } = await import("@/lib/models/Category");
    const { memoryStore } = await import("@/lib/memory_store");

    const { default: Restaurant } = await import("@/lib/models/Restaurant");

    let categories = [];
    let products = [];
    let restaurantName = "Hazel Bites";

    try {
        await connectToDatabase();

        // Dynamic Restaurant Fetch: Get the actual active restaurant
        const restaurant = await Restaurant.findOne().lean();
        restaurantName = restaurant?.name || "Hazel Bites";

        // MVP: Fetch ALL categories and products to prevent ID mismatch issues
        // Since we are single-tenant, this is safe and reliable.
        const cats = await Category.find({}).sort({ order: 1 }).lean();
        categories = JSON.parse(JSON.stringify(cats));

        const prods = await Product.find({}).lean();
        products = JSON.parse(JSON.stringify(prods));

    } catch (error) {
        console.error("Menu Fetch Error (using fallback):", error);
        // Only fallback if the Database Connection ITSELF failed completely
        categories = memoryStore.getCategories();
        products = memoryStore.getProducts();
    }

    return (
        <CartProvider>
            <div className="bg-gray-50 min-h-screen pb-24 flex flex-col">
                <main className="flex-1">
                    <MenuPageClient categories={categories} products={products} restaurantName={restaurantName} />
                </main>

                <footer className="py-6 text-center text-gray-400 text-xs font-medium">
                    Powered by Hazel Bites
                </footer>

                <StickyCart restaurantId={id} tableNumber={tableNumber} />
                {tableNumber !== 'pickup' && <CallWaiter tableNumber={tableNumber} />}
            </div>
        </CartProvider>
    );
}
