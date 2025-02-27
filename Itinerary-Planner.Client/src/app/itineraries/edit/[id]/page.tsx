"use client"

import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import { eachDayOfInterval, format, parseISO } from "date-fns";
import { Card, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Map, Marker, Popup } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";
import {useTheme} from "next-themes";
import AddItemDialog from "@/components/add-item-dialogue";

export default function EditItinerary() {
    const { id } = useParams();
    const [itinerary, setItinerary] = useState(null);
    const [selectedActivities, setSelectedActivities] = useState({});
    const [viewStates, setViewStates] = useState({});

    const {theme} = useTheme()

    const handleActivityClick = (date, activity) => {
        setSelectedActivities((prev) => ({ ...prev, [date]: activity }));
        setViewStates(prev => ({ ...prev, [date]: {
                latitude: activity.lat,
                longitude: activity.long,
                zoom: 10
            } }));
    };

    useEffect(() => {
        if (id) {
            fetch(`http://localhost:3010/itinerary/${id}`)
                .then(res => res.json())
                .then(json => setItinerary(json))
                .catch(err => console.log(err));
        }
    }, [id]);

    useEffect(() => {
        if (itinerary) {
            const initialSelectedActivities = {};
            const initialViewStates = {};
            const allDates = eachDayOfInterval({
                start: parseISO(itinerary.startDate),
                end: parseISO(itinerary.endDate)
            });

            allDates.forEach((date) => {
                const formattedDate = format(date, 'yyyy-MM-dd');
                const activities = itinerary.activities[formattedDate] || [];
                if (activities.length > 0) {
                    initialSelectedActivities[formattedDate] = activities[0];
                    initialViewStates[formattedDate] = {
                        latitude: activities[0].lat,
                        longitude: activities[0].long,
                        zoom: 14
                    }
                } else {
                    initialViewStates[formattedDate] = {
                        latitude: -37.810272,
                        longitude: 144.962646,
                        zoom: 5
                    }
                }
            })
            setSelectedActivities(initialSelectedActivities)
            setViewStates(initialViewStates)
        }
    }, [itinerary]);

    if (!itinerary) {
        return <p>Loading...</p>;
    }

    const allDates = eachDayOfInterval({
        start: parseISO(itinerary.startDate),
        end: parseISO(itinerary.endDate)
    });

    return (
        <div className="grid min-h-screen gap-16 sm:p-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold">{itinerary.title}</h1>
                    <p className="text-lg ">
                        {format(parseISO(itinerary.startDate), "MMM d, yyyy")} - {format(parseISO(itinerary.endDate), "MMM d, yyyy")}
                    </p>
                </div>
                {itinerary.imageUrl && (
                    <img src={itinerary.imageUrl} alt={itinerary.title} className="w-32 h-32 object-cover rounded-md ml-4" />
                )}
            </div>
            <Separator className="my-2" />
            <div>
                <h2 className="text-2xl mb-5">Activities</h2>
                {allDates.map((date) => {
                    const formattedDate = format(date, 'yyyy-MM-dd');
                    const activities = itinerary.activities[formattedDate] || [];
                    const selectedActivity = selectedActivities[formattedDate];
                    const viewState = viewStates[formattedDate];

                    return (
                        <Card key={formattedDate} className="overflow-hidden mb-5">
                            <div className="grid grid-cols-4">
                                <div className="col-span-3 p-5">
                                    <CardHeader className="pt-2 pl-10">
                                        <div className="relative grid grid-cols-2 justify-between">
                                            <h3 className="text-2xl">{format(date, 'MMM d, yyyy')}</h3>
                                            <div className="flex justify-end w-full">
                                                <AddItemDialog/>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <Separator className="my-2" />
                                    <ScrollArea className="h-52">
                                        {activities.length > 0 ? (
                                            activities.map((activity) => {
                                                const isSelected = selectedActivity && selectedActivity.id === activity.id;
                                                return (
                                                    <Card key={"activity"+activity.id} className={`p-5 m-2 cursor-pointer ${isSelected ? `${theme === "light" ? "bg-gray-200" : "bg-gray-700" }` : ""}`} onClick={() => handleActivityClick(formattedDate, activity)}>
                                                        <h4 className="font-bold">{activity.name}</h4>
                                                        <p className="text-sm">{format(activity.startTime, "HH:mm") + "-" + format(activity.endTime, "HH:mm")}</p>
                                                        <p>{activity.location}</p>
                                                    </Card>
                                                )
                                            })
                                        ) : (
                                            <p>No activities planned.</p>
                                        )}
                                    </ScrollArea>
                                </div>
                                <div className="col-span-1">
                                    <Map
                                        reuseMaps
                                        {...viewState}
                                        onMove={evt => setViewStates(prev => ({ ...prev, [formattedDate]: evt.viewState }))}
                                        mapLib={maplibregl}
                                        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json">
                                        {
                                            activities.map((activity) => {
                                                return(
                                                    <div key={"map"+activity.id}>
                                                        <Marker longitude={activity.long} latitude={activity.lat} color="red">
                                                        </Marker>
                                                        <Popup longitude={activity.long} latitude={activity.lat} anchor={"top"} closeButton={false}>
                                                            <h4 className={`font-bold text-black`}>{activity.name}</h4>
                                                        </Popup>
                                                    </div>
                                                )
                                            })
                                        }
                                    </Map>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
