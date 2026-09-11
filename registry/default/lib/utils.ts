/*
 * PROTOTYPE (#25) — port of coss ui's `registry/default/lib/utils.ts` @ e937bec (MIT surface).
 * This is the `utils` registry item the real port adds; it is the `cn` helper every
 * coss component imports.
 */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
