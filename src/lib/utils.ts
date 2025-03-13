import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export class LocalStorageItem<T> {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  get(): T | null {
    const item = window.localStorage.getItem(this.key);
    return item ? JSON.parse(item) : null;
  }

  set(value: T) {
    window.localStorage.setItem(this.key, JSON.stringify(value));
  }

  remove() {
    window.localStorage.removeItem(this.key);
  }
}

export function formatedDate(date: string) {
  const formatedDate = new Date(date);

  return formatedDate.toLocaleString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
