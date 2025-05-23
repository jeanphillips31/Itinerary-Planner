"use client"

import Itinerary from "@/components/itinerary";
import CreateItineraryDialog from "@/components/create-itinerary-dialog";
import { useEffect, useState } from 'react';
import {ItineraryDto, client} from "../../api/api";


export default function Home() {
    const [upcomingTrips, setUpcomingTrips] = useState<ItineraryDto[]>([]);
    const [pastTrips, setPastTrips] = useState<ItineraryDto[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: ItineraryDto[] = await client.getItineraries();
                const now = new Date();

                setUpcomingTrips(response.filter(trip => now <= new Date(trip.endDate || "")));
                setPastTrips(response.filter(trip => now > new Date(trip.endDate || "")));

            } catch(error) {
                console.log(error)
            }
        };
        fetchData();
    }, []);

    const addItinerary = (newItinerary: ItineraryDto) => {
        const now = new Date();
        if (now <= new Date(newItinerary.endDate || ""))
        {
            setUpcomingTrips((upcoming) => [...upcoming, newItinerary]);
        }
        else
        {
            setPastTrips((past) => [...past, newItinerary]);
        }
    }


  return (
    <div className="grid grid-rows-[20px_1fr_20px] min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 sm:items-start">
            <div className="flex justify-between items-center w-full">
                <h1 className="text-2xl font-bold">Upcoming Trips</h1>
                <CreateItineraryDialog onAddItinerary={addItinerary} />
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