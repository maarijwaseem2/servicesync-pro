import { Wrench, Droplet, Wind, Sparkles, Hammer, Scissors, Plug, Paintbrush } from "lucide-react";

export const categories = [
  { id: "electrician", name: "Electrician", icon: Plug, color: "from-amber-400 to-orange-500", count: 24 },
  { id: "plumber", name: "Plumber", icon: Droplet, color: "from-sky-400 to-blue-600", count: 18 },
  { id: "ac", name: "AC Repair", icon: Wind, color: "from-cyan-400 to-teal-600", count: 12 },
  { id: "cleaning", name: "Cleaning", icon: Sparkles, color: "from-emerald-400 to-green-600", count: 32 },
  { id: "carpenter", name: "Carpenter", icon: Hammer, color: "from-amber-500 to-rose-500", count: 15 },
  { id: "tailor", name: "Tailor", icon: Scissors, color: "from-fuchsia-400 to-pink-600", count: 9 },
  { id: "appliance", name: "Appliance", icon: Wrench, color: "from-indigo-400 to-violet-600", count: 21 },
  { id: "painter", name: "Painter", icon: Paintbrush, color: "from-rose-400 to-red-600", count: 11 },
];

export const services = [
  { id: "1", name: "Home Electrical Wiring", category: "electrician", price: 49, rating: 4.9, reviews: 312, duration: "1-2 hrs", img: "⚡", desc: "Certified electricians for installations, repairs, and safety checks." },
  { id: "2", name: "Leak Repair & Pipe Fitting", category: "plumber", price: 39, rating: 4.8, reviews: 248, duration: "45-90 min", img: "🚿", desc: "Fast leak detection and pipe replacement by trusted plumbers." },
  { id: "3", name: "AC Service & Gas Refill", category: "ac", price: 59, rating: 4.7, reviews: 189, duration: "1-2 hrs", img: "❄️", desc: "Complete AC tune-up, deep cleaning, and gas refill." },
  { id: "4", name: "Deep Home Cleaning", category: "cleaning", price: 79, rating: 4.9, reviews: 502, duration: "3-4 hrs", img: "✨", desc: "Top-to-bottom sparkling clean for your entire home." },
  { id: "5", name: "Furniture Assembly", category: "carpenter", price: 35, rating: 4.6, reviews: 156, duration: "1 hr", img: "🪚", desc: "Skilled carpenters assemble, repair, or build custom furniture." },
  { id: "6", name: "Washing Machine Repair", category: "appliance", price: 45, rating: 4.7, reviews: 203, duration: "1-2 hrs", img: "🔧", desc: "Expert appliance technicians for all major brands." },
  { id: "7", name: "Custom Tailoring", category: "tailor", price: 25, rating: 4.8, reviews: 87, duration: "varies", img: "🧵", desc: "Alterations and custom stitching at your doorstep." },
  { id: "8", name: "Wall Painting", category: "painter", price: 120, rating: 4.8, reviews: 134, duration: "4-6 hrs", img: "🎨", desc: "Premium wall painting with eco-friendly paints." },
];

export const providers = [
  { id: "p1", name: "Ahmed Khan", category: "electrician", rating: 4.9, jobs: 412, area: "Downtown", verified: true, exp: "8 yrs", img: "👨🏽‍🔧" },
  { id: "p2", name: "Sara Malik", category: "cleaning", rating: 4.95, jobs: 678, area: "Westside", verified: true, exp: "5 yrs", img: "👩🏻‍🔧" },
  { id: "p3", name: "Omar Sheikh", category: "plumber", rating: 4.7, jobs: 289, area: "Northside", verified: true, exp: "10 yrs", img: "👨🏼‍🔧" },
  { id: "p4", name: "Fatima Noor", category: "ac", rating: 4.8, jobs: 198, area: "Eastside", verified: false, exp: "4 yrs", img: "👩🏽‍🔧" },
];

export type BookingStatus = "Pending" | "Accepted" | "In Progress" | "Completed" | "Cancelled";
export const bookings: { id: string; service: string; provider: string; date: string; time: string; address: string; status: BookingStatus; price: number; payment: "Cash" | "Online"; }[] = [
  { id: "BK-2041", service: "AC Service & Gas Refill", provider: "Fatima Noor", date: "May 4, 2026", time: "10:00 AM", address: "12 Garden Lane, Apt 4B", status: "Accepted", price: 59, payment: "Online" },
  { id: "BK-2039", service: "Deep Home Cleaning", provider: "Sara Malik", date: "May 6, 2026", time: "2:00 PM", address: "12 Garden Lane, Apt 4B", status: "Pending", price: 79, payment: "Cash" },
  { id: "BK-2031", service: "Leak Repair & Pipe Fitting", provider: "Omar Sheikh", date: "Apr 28, 2026", time: "11:30 AM", address: "12 Garden Lane, Apt 4B", status: "Completed", price: 39, payment: "Online" },
  { id: "BK-2025", service: "Home Electrical Wiring", provider: "Ahmed Khan", date: "Apr 22, 2026", time: "9:00 AM", address: "12 Garden Lane, Apt 4B", status: "Cancelled", price: 49, payment: "Cash" },
];

export const reviews = [
  { id: "r1", customer: "Hina A.", provider: "Sara Malik", service: "Deep Home Cleaning", rating: 5, text: "Spotless work, on time, and very professional. Booking was 2 minutes!", date: "Apr 30, 2026" },
  { id: "r2", customer: "Bilal R.", provider: "Ahmed Khan", service: "Electrical Wiring", rating: 5, text: "Fixed our wiring issue same day. Fair price too.", date: "Apr 28, 2026" },
  { id: "r3", customer: "Ayesha K.", provider: "Omar Sheikh", service: "Leak Repair", rating: 4, text: "Very knowledgeable plumber. Highly recommend.", date: "Apr 26, 2026" },
];

// CRM
export type LeadStage = "New" | "Contacted" | "Qualified" | "Proposal" | "Won" | "Lost";
export const leadSources = ["Website", "Referral", "Cold call", "Social", "Event", "Ads"];
export const leads = [
  { id: "L-1024", name: "Acme Corp", contact: "Jane Cooper", email: "jane@acme.co", phone: "+1 555 0101", source: "Website", stage: "Qualified" as LeadStage, value: 12000, owner: "You", lastActivity: "2h ago", nextFollowUp: "Tomorrow 10:00" },
  { id: "L-1023", name: "BrightLabs", contact: "Cody Fisher", email: "cody@brightlabs.io", phone: "+1 555 0102", source: "Referral", stage: "Proposal" as LeadStage, value: 24500, owner: "You", lastActivity: "1d ago", nextFollowUp: "May 3, 14:00" },
  { id: "L-1022", name: "Northwind", contact: "Esther Howard", email: "e.howard@nw.com", phone: "+1 555 0103", source: "Ads", stage: "New" as LeadStage, value: 5400, owner: "Sam", lastActivity: "Just now", nextFollowUp: "Today 16:00" },
  { id: "L-1021", name: "Kappa Studio", contact: "Robert Fox", email: "rob@kappa.studio", phone: "+1 555 0104", source: "Social", stage: "Contacted" as LeadStage, value: 8200, owner: "You", lastActivity: "3h ago", nextFollowUp: "May 2, 11:30" },
  { id: "L-1020", name: "Globex", contact: "Jenny Wilson", email: "jenny@globex.co", phone: "+1 555 0105", source: "Cold call", stage: "Won" as LeadStage, value: 31000, owner: "Sam", lastActivity: "5d ago", nextFollowUp: "—" },
  { id: "L-1019", name: "Initech", contact: "Wade Warren", email: "wade@initech.io", phone: "+1 555 0106", source: "Event", stage: "Lost" as LeadStage, value: 4000, owner: "You", lastActivity: "8d ago", nextFollowUp: "—" },
];
