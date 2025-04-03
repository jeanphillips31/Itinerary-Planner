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
import {ActivityDto, ItineraryDto} from "../../../../../api/api";
import {createApiClient} from "../../../../../api/client";
import {Button} from "@/components/ui/button";
import {MdDelete, MdEdit} from "react-icons/md";

export default function EditItinerary() {
    let baseUrl = ""
    if (process.env.NEXT_PUBLIC_BASEURL) {
        baseUrl = process.env.NEXT_PUBLIC_BASEURL;
    }

    const client = createApiClient(baseUrl)


    const { id } = useParams();
    const [itinerary, setItinerary] = useState<ItineraryDto | null>(null);
    const [selectedActivities, setSelectedActivities] = useState({});
    const [viewStates, setViewStates] = useState({});

    const {theme} = useTheme()

    const handleActivityClick = (date:string, activity:ActivityDto) => {
        setSelectedActivities((prev) => ({ ...prev, [date]: activity }));
        setViewStates(prev => ({ ...prev, [date]: {
                latitude: activity.latitude,
                longitude: activity.longitude,
                zoom: 10
            } }));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (id) {
                    let itineraryId = 0
                    if (typeof id === "string") {
                        itineraryId = parseInt(id)
                    }
                    const response: ItineraryDto = await client.getItineraryItineraryId({params: {itineraryId:itineraryId }});
                    setItinerary(response);
                }
            } catch(error) {
                console.log(error)
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (itinerary) {
            const initialSelectedActivities = {};
            const initialViewStates = {};
            const allDates = eachDayOfInterval({
                start: parseISO(itinerary.startDate || ""),
                end: parseISO(itinerary.endDate || "")
            });

            allDates.forEach((date) => {
                const formattedDate = format(date, 'yyyy-MM-dd');
                // @ts-ignore
                const activities:ActivityDto[] = itinerary.activities?.filter((activity) => {
                    return format(activity.date, "yyyy-MM-dd") === formattedDate
                }) || [];
                if (activities.length > 0) {
                    // @ts-ignore
                    initialSelectedActivities[formattedDate] = activities[0];
                    // @ts-ignore
                    initialViewStates[formattedDate] = {
                        latitude: activities[0].latitude,
                        longitude: activities[0].longitude,
                        zoom: 14
                    }
                } else {
                    // @ts-ignore
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
        start: parseISO(itinerary.startDate || ""),
        end: parseISO(itinerary.endDate || "")
    });

    const addActivity = (newActivity: ActivityDto) => {
        setItinerary(prevItinerary => ({
            ...prevItinerary,
            activities: [...prevItinerary.activities, newActivity]}));
    }

    const updateActivity = (updatedActivity: ActivityDto) => {
        const updatedActivities = itinerary.activities?.map((activity) => {
            if (activity.id === updatedActivity.id) {
                return {...activity, ...updatedActivity};
            }
            return activity
        })
        setItinerary(prevItinerary => ({
            ...prevItinerary,
            activities: updatedActivities}));
    }

    return (
        <div className="grid min-h-screen gap-16 sm:p-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold">{itinerary.title}</h1>
                    <p className="text-lg ">
                        {format(parseISO(itinerary.startDate || ""), "MMM d, yyyy")} - {format(parseISO(itinerary.endDate || ""), "MMM d, yyyy")}
                    </p>
                </div>
                {itinerary.imageUrl && (
                    <img src={itinerary.imageUrl} alt={itinerary.title || ""} className="w-32 h-32 object-cover rounded-md ml-4" />
                )}
            </div>
            <Separator className="my-2" />
            <div>
                <h2 className="text-2xl mb-5">Activities</h2>
                {allDates.map((date) => {
                    const formattedDate = format(date, 'yyyy-MM-dd');
                    // @ts-ignore
                    const activities:ActivityDto[] = itinerary.activities?.filter((activity) => {
                        return format(activity.date, "yyyy-MM-dd") === formattedDate
                    }) || [];
                    // @ts-ignore
                    const selectedActivity = selectedActivities[formattedDate];
                    // @ts-ignore
                    const viewState = viewStates[formattedDate];

                    return (
                        <Card key={formattedDate} className="overflow-hidden mb-5">
                            <div className="grid grid-cols-4">
                                <div className="col-span-3 p-5">
                                    <CardHeader className="pt-2 pl-10">
                                        <div className="relative grid grid-cols-2 justify-between">
                                            <h3 className="text-2xl">{format(date, 'MMM d, yyyy')}</h3>
                                            <div className="flex justify-end w-full">
                                                <AddItemDialog onAddActivity={addActivity}
                                                               itineraryId={itinerary.id}
                                                               activityDate={date}
                                                               activityDto={null}
                                                               onUpdateActivity={updateActivity}
                                                               triggerButton={<Button variant="outline" className="px-2 py-1 text-sm w-20">Add Item</Button>}/>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <Separator className="my-2" />
                                    <ScrollArea className="h-52">
                                        {activities.length > 0 ? (
                                            activities.map((activity:ActivityDto) => {
                                                const isSelected = selectedActivity && selectedActivity.id === activity.id;
                                                return (
                                                    <Card key={"activity"+activity.id}
                                                          className={`p-5 m-2 cursor-pointer ${isSelected ? `${theme === "light" ? "bg-gray-200" : "bg-gray-700" }` : ""}`}
                                                          onClick={() => handleActivityClick(formattedDate, activity)}>
                                                        <div className={"flex flex-row justify-between"}>
                                                            <div>
                                                                <h4 className="font-bold">{activity.name}</h4>
                                                                <p className="text-sm">{format(activity.startTime || "", "HH:mm") + "-" + format(activity.endTime || "", "HH:mm")}</p>
                                                                <p>{activity.location}</p>
                                                            </div>
                                                            <div>
                                                                <AddItemDialog onAddActivity={addActivity}
                                                                               itineraryId={itinerary.id}
                                                                               activityDate={date}
                                                                               activityDto={activity}
                                                                               onUpdateActivity={updateActivity}
                                                                               triggerButton={
                                                                                <Button
                                                                                   className={"mr-2"}
                                                                                   variant={"outline"}
                                                                                   size={"icon"}>
                                                                                   <MdEdit/>
                                                                                </Button>}/>
                                                                <Button
                                                                    variant={"outline"}
                                                                    size={"icon"}>
                                                                    <MdDelete/>
                                                                </Button>
                                                            </div>
                                                        </div>

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
                                            activities.map((activity:ActivityDto) => {
                                                return(
                                                    <div key={"map"+activity.id}>
                                                        <Marker longitude={activity.longitude || 0} latitude={activity.latitude || 0} color="red">
                                                        </Marker>
                                                        <Popup longitude={activity.longitude  || 0} latitude={activity.latitude  || 0} anchor={"top"} closeButton={false}>
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
