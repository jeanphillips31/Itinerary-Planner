import {z} from "zod";
import {schemas} from "./client";

export type ItineraryDto = z.infer<
    typeof schemas.ItineraryDto>

export type ActivityDto = z.infer<
    typeof schemas.ActivityDto>
