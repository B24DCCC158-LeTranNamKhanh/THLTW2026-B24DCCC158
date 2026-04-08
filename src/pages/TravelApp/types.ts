export interface Destination {
  id: number;
  name: string;
  location?: string;
  type: string;
  rating?: number;
  price: number;
  visitTime?: number;
  costFood: number;
  costAccomm: number;
  costTransport: number;
  image?: string;
  desc?: string;
}

export interface ItineraryItem extends Destination {
  itId: number;
  day: number;
}

export const getTravelInfo = (locA?: string, locB?: string) => {
  if (!locA || !locB || locA === locB) return { time: 0, cost: 0 };
  
  // Mock distance logic (determinstic based on string length)
  const time = 2 + (Math.abs(locA.length - locB.length) % 5);
  const cost = time * 100000; // 100k per hour
  
  return { time, cost };
};
