import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/** 
 * Checks if function is running on client side to prevent errors when accessing things like localStorage, window or using router.
*/
export const isOnClient = () => typeof window !== "undefined"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}