import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Restaurant from "@/lib/models/Restaurant";
import { memoryStore } from "@/lib/memory_store";

export async function GET() {
    try {
        await connectToDatabase();
        // Get the single active restaurant
        const settings = await Restaurant.findOne();
        if (settings) return NextResponse.json(settings);

        // If no restaurant exists (rare if seeded), return empty structure
        return NextResponse.json({ name: "Hazel Bites", currency: "EGP" });
    } catch (e) {
        console.warn("DB offline for settings fetch, using fallback");
    }
    return NextResponse.json(memoryStore.getSettings());
}

export async function PUT(request: Request) {
    let body;
    try {
        body = await request.json();
    } catch (e) {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    try {
        await connectToDatabase();

        // Find FIRST restaurant and update it (since we are single-tenant for now)
        // If we used findOneAndUpdate with a filter, it might miss if IDs don't match.
        const restaurant = await Restaurant.findOne();

        if (restaurant) {
            const updated = await Restaurant.findByIdAndUpdate(
                restaurant._id,
                body,
                { new: true }
            );
            return NextResponse.json(updated);
        } else {
            // Create if doesn't exist (fallback)
            const newRestaurant = await Restaurant.create({
                ...body,
                ownerId: "1" // Default
            });
            return NextResponse.json(newRestaurant);
        }

    } catch (e) {
        console.warn("DB offline for settings update, using fallback", e);
        const updated = memoryStore.updateSettings(body);
        return NextResponse.json(updated);
    }
}
