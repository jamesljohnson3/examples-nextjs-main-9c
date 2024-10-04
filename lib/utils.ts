import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { replace } from "string-ts";
import { customAlphabet } from 'nanoid'
import { env } from "@/env.mjs";

export function truncate(str: string, length: number) {
  return str.length > length ? `${str.substring(0, length)}...` : str
}
export function absoluteUrl(path: string) {
  return `${env.NEXT_PUBLIC_APP_URL}${path}`;
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export function unslugify(str: string) {
  return replace(str, /-/g, " ");
}

export const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  7
) // 7-character random string


