"use client"

import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {useCallback, useState} from "react";
import {OpenStreetMapProvider} from "leaflet-geosearch"
import {Command, CommandEmpty, CommandGroup, CommandList} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import {Button} from "@/components/ui/button";
import {TimePicker} from "@/components/time-picker/timer-picker";

export default function AddItemDialog() {
    const provider = new OpenStreetMapProvider();
    const [addressSearchIsOpen, setAddressSearchIsOpen] = useState(false);
    const [searchResults, setResults] = useState([])
    const [dialogIsOpen, setDialogIsOpen] = useState(false)
    const [location, setLocation] = useState("")
    const [query, setQuery] = useState("")
    const [date, setDate] = useState<Date>();
    const handleSubmit = async (e) => {
        e.preventDefault()
    }

    const handleInputChange = async (event) => {
        setQuery(event)
        if (event.length > 3)
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
    };

    const open = useCallback(() => setAddressSearchIsOpen(true), []);
    const close = useCallback(() => setAddressSearchIsOpen(false), []);

    return(
        <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="px-2 py-1 text-sm w-20">Add Item</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Activity</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                                value={location || query}
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
                                                                           setLocation(prediction.label)
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
                    <div className="space-y-2">
                        <Label className="font-bold">Activity Duration</Label>
                        <TimePicker date={date} setDate={setDate}/>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}