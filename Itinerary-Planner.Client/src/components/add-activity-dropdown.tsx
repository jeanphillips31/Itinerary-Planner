import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import { Plane, Hotel, MapPin } from 'lucide-react';
import AddFlightsDialog from "@/components/add-flights-dialog";

export default function AddActivityDropdown() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="px-2 py-1 text-sm w-20">Add Item</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <AddFlightsDialog/>
                <DropdownMenuItem>
                    <Hotel /> Accommodation
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <MapPin /> Point of Interest
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}