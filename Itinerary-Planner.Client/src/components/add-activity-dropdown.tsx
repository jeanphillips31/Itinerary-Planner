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