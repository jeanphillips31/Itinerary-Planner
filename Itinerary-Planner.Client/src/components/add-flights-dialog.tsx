import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Plane} from "lucide-react";
import {DropdownMenu, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useState} from "react";
import {OpenStreetMapProvider} from "leaflet-geosearch"

export default function AddFlightsDialog() {
    const provider = new OpenStreetMapProvider();
    const [searchResults, setResults] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [departureAirport, setDepartureAirport] = useState("")
    const [query, setQuery] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
    }

    const handleInputChange = async (event) => {
        setQuery(event.target.value)
        if (event.target.value.length > 3)
        {
            const results = await provider.search({ query });
            setResults(results)
        }
    }

    return(
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Plane /> Flights
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Flight Details</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Label htmlFor="departureLocation">
                        Departure Airport
                    </Label>
                    <DropdownMenu>
                        <DropdownMenuTrigger
                    </DropdownMenu>
                    <Input
                        id="departureAirport"
                        value={query}
                        onChange={handleInputChange}
                        placeholder="Enter Departure Airport"
                        required
                    />
                </form>
                <div>
                    {searchResults.map(item => <p>{item.label}</p>)}
                </div>
            </DialogContent>
        </Dialog>
)
}