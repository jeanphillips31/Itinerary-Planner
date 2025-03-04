"use client"

import Itinerary from "@/components/itinerary";
import CreateItineraryDialog from "@/components/create-itinerary-dialog";
import { useEffect, useState } from 'react';
import {createApiClient } from "../../api/client";
import {ItineraryDto} from "../../api/dtos";


export default function Home() {

    let baseUrl = ""
    if (process.env.NEXT_PUBLIC_BASEURL) {
        baseUrl = process.env.NEXT_PUBLIC_BASEURL;
    }

    const client = createApiClient(baseUrl)


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