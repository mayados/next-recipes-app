// Function to format the date
// package to install : "date-fns" avec npm
import { format } from "date-fns";

export function formatDate(date: Date): string{
    return format(new Date(date), "MMMM do, yyyy HH:mm") ?? "Date not available";
}

// Determine the user's role from the session data
export function checkUserRole(session) {
    if (
      !session ||
      !session.user ||
      !session.user.organizationMemberships ||
      session.user.organizationMemberships.length === 0
    ) {
      return null; // Return null if the user is not a basic member
    }
  
    const organizationMemberships = session.user.organizationMemberships;
  
    // Loop through all organization memberships
    for (const membership of organizationMemberships) {
      if (membership.role) {
        return membership.role.toLowerCase(); // Return the role in lowercase if it exists
      }
    }
  
    return null; // Return null if no role is found in the memberships
  }
  