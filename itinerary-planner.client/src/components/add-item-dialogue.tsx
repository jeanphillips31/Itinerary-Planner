"use client"

import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import React, {useCallback, useEffect, useState} from "react";
import {OpenStreetMapProvider} from "leaflet-geosearch"
import {Command, CommandEmpty, CommandGroup, CommandList} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import {Button} from "@/components/ui/button";
import {TimePicker} from "@/components/time-picker/timer-picker";
import {Input} from "@/components/ui/input";
import {ActivityDto, client} from "../../api/api";
import {parseISO} from "date-fns";

type Props = {
    onAddActivity: (activity: ActivityDto) => void;
    onUpdateActivity: (activity: ActivityDto) => void;
    itineraryId: number | undefined;
    activityDate: Date;
    activityDto: ActivityDto | null;
    triggerButton: React.ReactNode;
}

export default function AddItemDialog(props:Props) {
    const provider = new OpenStreetMapProvider();
    const [addressSearchIsOpen, setAddressSearchIsOpen] = useState(false);
    const [searchResults, setResults] = useState([])
    const [dialogIsOpen, setDialogIsOpen] = useState(false)
    const [location, setLocation] = useState({})
    const [locationText, setLocationText] = useState("")
    const [query, setQuery] = useState("")
    const [startTime, setStartTime] = useState<Date>();
    const [endTime, setEndTime] = useState<Date>();
    const [activityTitle, setActivityTitle] = useState<string>("");

    const handleSubmit = async (e) => {
        e.preventDefault()
        //handle form submission

        try {
            let activity:ActivityDto = {
                name: activityTitle,
                date: props.activityDate.toISOString(),
                location: locationText,
                latitude: location.y,
                longitude: location.x,
                startTime: startTime?.toISOString(),
                endTime: endTime?.toISOString()
            }

            if(props.activityDto == null){
                // new activity
                activity.id = await client.postAddActivity(activity, {queries: {itineraryId: props.itineraryId}});
                props.onAddActivity(activity);
            }
            else {
                // updating activity
                if(location == null){
                    activity.latitude = props.activityDto.latitude;
                    activity.longitude = props.activityDto.longitude;
                }
                await client.putUpdateActivityActivityId(activity, {params: {activityId: props.activityDto.id}})
            }


        } catch(error)
        {
            console.error(error)
        }
        setResults([])
        setLocation([])
        setLocationText("")
        setQuery("")
        setStartTime(undefined)
        setEndTime(undefined)
        setActivityTitle("")
        setDialogIsOpen(false)
    }

    const handleInputChange = async (event) => {
        setQuery(event)
        if (query.length > 3)
        {
            setAddressSearchIsOpen(true)
            const results = await provider.search({ query });
            const filteredResults = results.filter((item, index, self) =>
                index === self.findIndex((t) => t.x === item.x && t.y === item.y))
            setResults(filteredResults)
        }
    }
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Escape") {
            close();
        }
        if (event.key === "Backspace" && locationText) {
            setLocationText("")
        }
    };

    const open = useCallback(() => setAddressSearchIsOpen(true), []);
    const close = useCallback(() => setAddressSearchIsOpen(false), []);

    useEffect(() => {
        if (props.activityDto != null) {
            setLocationText(props.activityDto.location || "")
            setStartTime(parseISO(props.activityDto.startTime))
            setEndTime(parseISO(props.activityDto.endTime))
            setActivityTitle(props.activityDto.name || "")
        }
    }, [props.activityDto])

    return(
        <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
            <DialogTrigger asChild>
                {props.triggerButton}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Activity</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="activityTitle" className="font-bold">
                            Activity Title
                        </Label>
                        <Input
                            id="activityTitle"
                            value={activityTitle}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setActivityTitle(e.target.value)}
                            placeholder="Enter Activity Title"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="item" className="font-bold">
                            Location
                        </Label>
                        <Command
                            shouldFilter={false}
                            onKeyDown={handleKeyDown}
                            className="overflow-visible h-min">
                            <div
                                className="flex w-full items-center justify-between rounded-lg border bg-background ring-offset-background text-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                                <CommandPrimitive.Input
                                    value={locationText || query}
                                    onValueChange={handleInputChange}
                                    onBlur={close}
                                    placeholder={"Enter Address"}
                                    className="w-full p-3 rounded-lg outline-none"/>
                            </div>
                            {addressSearchIsOpen && (
                                <div className="relative animate-in fade-in-0 zoom-in-95 h-auto">
                                    <CommandList>
                                        <div className="absolute top-1.5 z-50 w-full">
                                            <CommandGroup
                                                className="relative h-auto z-50 min-w-[8rem] overflow-hidden rounded-md border shadow-md bg-background">
                                                {searchResults.map(prediction =>
                                                    <CommandPrimitive.Item value={prediction}
                                                                           className="flex select-text flex-col cursor-pointer gap-0.5 h-max p-2 px-3 rounded-md aria-selected:bg-accent aria-selected:text-accent-foreground hover:bg-accent hover:text-accent-foreground items-start"
                                                                           key={prediction.x + prediction.y}
                                                                           onMouseDown={(e) => e.preventDefault()}
                                                                           onSelect={() => {
                                                                               setQuery("")
                                                                               setAddressSearchIsOpen(false)
                                                                               setLocationText(prediction.label)
                                                                               setLocation(prediction)
                                                                           }}>
                                                        {prediction.label}
                                                    </CommandPrimitive.Item>)}
                                                <CommandEmpty>
                                                    <div className="py-4 flex items-center justify-center">
                                                        {query === "" ? "Please enter an address"
                                                            : "No address found"}
                                                    </div>
                                                </CommandEmpty>
                                            </CommandGroup>
                                        </div>
                                    </CommandList>
                                </div>
                            )}
                        </Command>
                    </div>
                    <div className="space-y-2">
                        <Label className="font-bold">Activity Start Time</Label>
                        <TimePicker date={startTime} setDate={setStartTime}/>
                    </div>
                    <div className="space-y-2">
                        <Label className="font-bold">Activity End Time</Label>
                        <TimePicker date={endTime} setDate={setEndTime}/>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setDialogIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Create Activity</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}