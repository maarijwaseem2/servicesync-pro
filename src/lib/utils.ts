import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Capitalize the first letter of each word in a name */
export function capitalizeName(name?: string | null): string {
  if (!name) return "";
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function getServiceImage(title: string, categoryName = ""): string {
  const t = (title + " " + categoryName).toLowerCase();
  if (t.includes("ac") || t.includes("air condition")) return "/assets/ac-repairing.jfif";
  if (t.includes("geyser") || t.includes("water heater")) return "/assets/geyser.jfif";
  if (t.includes("water tank") || t.includes("tank")) return "/assets/water-tank.jfif";
  if (t.includes("fan")) return "/assets/fan-fiiting.jfif";
  if (t.includes("electric") || t.includes("wiring") || t.includes("switch")) return "/assets/electric.jfif";
  if (t.includes("pipe") || t.includes("plumb") || t.includes("tap") || t.includes("leak")) return "/assets/pipe-fitting.jfif";
  if (t.includes("washing machine") || t.includes("laundry")) return "/assets/washing-machine-repair.png";
  if (t.includes("fridge") || t.includes("refrig")) return "/assets/refrigetar.jfif";
  if (t.includes("microwave") || t.includes("oven")) return "/assets/microwave.jfif";
  if (t.includes("door") || t.includes("window") || t.includes("carpent")) return "/assets/door-and-window.jfif";
  if (t.includes("furniture") || t.includes("assembl") || t.includes("sofa repair")) return "/assets/furniture-assembly.png";
  if (t.includes("sofa") || t.includes("carpet") || t.includes("upholst")) return "/assets/sofa-carpet.jfif";
  if (t.includes("kitchen")) return "/assets/kitchen-cleaning.jfif";
  if (t.includes("paint") || t.includes("wall")) return "/assets/wall-painting.png";
  if (t.includes("tailor") || t.includes("stitch") || t.includes("cloth") || t.includes("dress")) return "/assets/custom-tailoring.png";
  if (t.includes("makeup") || t.includes("bridal") || t.includes("party look")) return "/assets/party-makeup.jfif";
  if (t.includes("groom") || t.includes("barber") || t.includes("hair cut") || t.includes("shav")) return "/assets/grooming-men.jfif";
  if (t.includes("deep clean") || t.includes("home clean") || t.includes("house clean")) return "/assets/deep-cleaning.jfif";
  if (t.includes("clean")) return "/assets/deep-cleaning.jfif";
  return "/assets/deep-cleaning.jfif";
}
