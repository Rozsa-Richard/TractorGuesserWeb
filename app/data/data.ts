import { Vehicle } from "@/types/vehicle";
import vehicles from "../public/vehicles.json";

export const getVehicles = () : Vehicle[] => vehicles as Vehicle[];