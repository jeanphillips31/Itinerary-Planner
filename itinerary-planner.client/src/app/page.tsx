"use client"

import Itinerary from "@/components/itinerary";
import CreateItineraryDialog from "@/components/create-itinerary-dialog";
import { useEffect, useState } from 'react';
import {now} from "next-auth/client/_utils";

type CardData = {
    id: number
    title: string
    imageUrl: string
    startDate: Date
    endDate: Date
    activities: Record<string, Activity[]>; // Keyed by date
}

type Activity = {
    id: number
    name: string
    location: string
    lat: number
    long: number
}


export default function Home() {
    const [upcomingTrips, setUpcomingTrips] = useState<CardData[]>([]);
    const [pastTrips, setPastTrips] = useState<CardData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:3010/itineraries")
                const data = await response.json();
                const parsedData = data.map((item:any) => ({
                    ...item,
                    startDate: new Date(item.startDate),
                    endDate: new Date(item.endDate),
                }));

                const now = new Date();

                setUpcomingTrips(parsedData.filter(trip => now <= trip.endDate));
                setPastTrips(parsedData.filter(trip => now > trip.endDate));

            } catch(error) {
                console.log(error)
            }
        };
        fetchData();
    }, []);


  return (
    <div className="grid grid-rows-[20px_1fr_20px] min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 sm:items-start">
            <div className="flex justify-between items-center w-full">
                <h1 className="text-2xl font-bold">Upcoming Trips</h1>
                <CreateItineraryDialog/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 md:grid-cols-2 gap-6">
                {upcomingTrips.map((trips, index) => (
                    <Itinerary key={index} props={trips}/>
                ))}
            </div>
            <div className="flex justify-between items-center w-full">
                <h1 className="text-2xl font-bold">Past Trips</h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 md:grid-cols-2 gap-6">
                {pastTrips.map((trips, index) => (
                    <Itinerary key={index} props={trips}/>
                ))}
            </div>
        </main>
    </div>
  )
}