import {ModeToggle} from "@/components/mode-toggle";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {SiGithub} from "@icons-pack/react-simple-icons"


export default function Navbar() {

    return (
        <header
            className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="hidden font-bold sm:inline-block">Itinerary Planner</span>
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-4">
                    <nav className="flex items-center space-x-2">
                        <ModeToggle/>
                        <Button variant="outline" size="icon" asChild><a href="https://github.com/jeanphillips31/Itinerary-Planner"><SiGithub /></a></Button>
                        <Button>Login</Button>
                    </nav>
                </div>
            </div>
        </header>
    )
}