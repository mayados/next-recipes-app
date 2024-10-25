// Function to format the date
// package to install : "date-fns" avec npm
import { format } from "date-fns";

export function formatDate(date: Date): string{
    return format(new Date(date), "MMMM do, yyyy HH:mm") ?? "Date not available";
}