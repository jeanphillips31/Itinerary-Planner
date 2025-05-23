﻿"use client"

import {useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Calendar as CalendarComponent} from "@/components/ui/calendar"
import {Calendar} from "lucide-react";
import {addDays, format} from "date-fns"
import {DateRange} from "react-day-picker"
import {client, ItineraryDto} from "../../api/api";

export default function CreateItineraryDialog({ onAddItinerary }) {
    const [isOpen, setIsOpen] = useState(false)
    const [itineraryName, setItineraryName] = useState("")
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 2),
    })

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedImage(file)

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            // If no file selected, reset both states
            setSelectedImage(null);
            setImagePreviewUrl(null);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        //handle form submission
        try {
            let uploadedImageUrl = ""
            if(selectedImage)
            {
                const formData = new FormData()
                formData.append('file', selectedImage || "");
                const response = await fetch("https://localhost:7063/upload-image", {
                    method: "POST",
                    body: formData,
                })
                if (response.ok) {
                    const data = await response.json()
                    uploadedImageUrl = data
                }
            }
            let itinerary: ItineraryDto = {
                title: itineraryName,
                startDate: dateRange?.from?.toISOString(),
                endDate: dateRange?.to?.toISOString(),
                userId: 1,
                imageUrl: uploadedImageUrl
            }
            itinerary.id = await client.postAdd(itinerary);
            onAddItinerary(itinerary)
        } catch(error)
        {
            console.error(error)
        }
        setItineraryName("")
        setSelectedImage(null)
        setImagePreviewUrl(null);
        setDateRange({
            from: new Date(),
            to: addDays(new Date(), 2),
        })
        setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Create New</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Itinerary</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="itineraryName">
                            Itinerary Title
                        </Label>
                        <Input
                        id="itineraryName"
                        value={itineraryName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setItineraryName(e.target.value)}
                        placeholder="Enter itinerary Name"
                        required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="image">Select Display Image</Label>
                        <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="file:mr-4" />
                        { imagePreviewUrl && (
                            <div className="mt-2">
                                <img
                                src={imagePreviewUrl}
                                alt={"Selected Image"}
                                className={"max-w-full rounded-md h-auto"}/>
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label>Select Date Range</Label>
                        <Popover modal={true}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left front-normal">
                                    <Calendar className="mr-2 h-4 w-4"/>
                                    {dateRange?.from ? (
                                        dateRange.to ? (
                                            <>
                                                {format(dateRange.from, "LL dd, y")} -{" "}
                                                {format(dateRange.to, "LL dd, y")}
                                            </>
                                        ) : (
                                            format(dateRange.from, "LL dd, yy")
                                        )
                                    ) : (
                                        <span>Pick a date range</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <CalendarComponent mode="range" selected={dateRange} onSelect={setDateRange}
                                                   initialFocus numberOfMonths={2} defaultMonth={dateRange?.from}/>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Create Itinerary</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}