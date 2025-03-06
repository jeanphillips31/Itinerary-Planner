"use client"
import Image from "next/image";
import {format} from "date-fns";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import Link from "next/link";
import {ItineraryDto} from "../../api/api";

export default function Itinerary({ props }: { props: ItineraryDto }) {
    return (
        <Link href={"/itineraries/edit/" + props.id} passHref>
            <Card className="overflow-hidden cursor-pointer">
                <CardHeader className="p-0">
                    <div className="relative h-48">
                        <Image
                            src={props.imageUrl || ""}
                            alt={props.title || ""}
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                    <h2 className="text-lg font-semibold mb-2">{props.title}</h2>
                    <p className="text-sm text-muted-foreground">
                        {format(new Date(props.startDate || ""), "MMM d, yyyy")} - {format(new Date(props.endDate || ""), "MMM d, yyyy")}
                    </p>
                </CardContent>
                <div className="p-4">
                </div>
            </Card>
        </Link>
    );
}