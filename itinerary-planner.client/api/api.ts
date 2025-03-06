import {z} from "zod";
import {createApiClient, schemas} from "./client";

export type ItineraryDto = z.infer<
    typeof schemas.ItineraryDto>

export type ActivityDto = z.infer<
    typeof schemas.ActivityDto>

let baseUrl = ""
if (process.env.NEXT_PUBLIC_BASEURL) {
    baseUrl = process.env.NEXT_PUBLIC_BASEURL;
}

export const client = createApiClient(baseUrl)