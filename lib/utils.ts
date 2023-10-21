import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function randomId() {
  // return a random string of 5 numbers from '00000' to '99999'
  return Math.random().toString().substring(2, 7)
}