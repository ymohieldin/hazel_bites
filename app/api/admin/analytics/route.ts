import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Order from "@/lib/models/Order";
import { memoryStore } from "@/lib/memory_store";

export async function GET() {
    let dbStats = { totalOrders: 0, totalRevenue: 0 };
    let dbTopItems: any[] = [];

    // 1. Try fetching from MongoDB
    try {
        await connectToDatabase();

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const todayStats = await Order.aggregate([
            { $match: { createdAt: { $gte: startOfDay } } },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: "$totalAmount" },
                },
            },
        ]);
        if (todayStats.length > 0) dbStats = todayStats[0];

        dbTopItems = await Order.aggregate([
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.name",
                    count: { $sum: "$items.quantity" },
                    revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

    } catch (error) {
        console.warn("Analytics: DB connection failed or empty, falling back to memory store.");
    }

    // 2. Fetch from Memory Store (Demo Mode)
    const memoryOrders = memoryStore.getOrders();
    let memStats = { totalOrders: 0, totalRevenue: 0 };
    const memItemMap = new Map<string, { count: number, revenue: number }>();

    // Calculate Today's Stats from Memory
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    for (const order of memoryOrders) {
        // Filter for today (simple check)
        const orderDate = new Date(order.createdAt);
        if (orderDate >= startOfDay) {
            memStats.totalOrders += 1;
            memStats.totalRevenue += order.totalAmount;
        }

        // Aggregate Items (All Time)
        for (const item of order.items) {
            const current = memItemMap.get(item.name) || { count: 0, revenue: 0 };
            const itemRevenue = (item.price || 0) * (item.quantity || 1);
            memItemMap.set(item.name, {
                count: current.count + (item.quantity || 1),
                revenue: current.revenue + itemRevenue
            });
        }
    }

    // 3. Combine Data (Simple Strategy: Use Memory if DB is empty, otherwise prefer DB or Sum? 
    // Since this is a specialized case where one likely fails, let's Sum them to be safe)

    // Actually, usually it's one or the other. If DB is working, Memory is likely empty (unless hybrid). 
    // If DB is broken (0), Memory has data.
    // Summing is safest to cover "My DB saved 0 orders, but my memory saved 5".

    const finalStats = {
        totalOrders: dbStats.totalOrders + memStats.totalOrders,
        totalRevenue: dbStats.totalRevenue + memStats.totalRevenue
    };

    // Merge Top Items
    const finalItemsMap = new Map<string, { count: number, revenue: number }>();

    // Add DB items
    dbTopItems.forEach(item => {
        finalItemsMap.set(item._id, { count: item.count, revenue: item.revenue });
    });

    // Add Memory items
    memItemMap.forEach((val, key) => {
        const current = finalItemsMap.get(key) || { count: 0, revenue: 0 };
        finalItemsMap.set(key, {
            count: current.count + val.count,
            revenue: current.revenue + val.revenue
        });
    });

    // Convert map to array and sort
    const finalTopItems = Array.from(finalItemsMap.entries())
        .map(([name, stats]) => ({ _id: name, ...stats }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    return NextResponse.json({
        today: finalStats,
        topItems: finalTopItems
    });
}
