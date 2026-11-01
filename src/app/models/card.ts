export interface Details {
  id: number;
  name: string;
  label: string;
  location: string;
  descr: string;
  keyPoints: string[];
  discover: string[];
  impInfo: string[];
  howToVisit: {
    byBike: string;
    byCar: string;
    byPublic: string;
  } | null;
  timings: string;
  category: string;
  dontMissThese: {
    name: string;
    description: string;
    imageUrl: string;
    link?: string;
  }[];
  images: string[];
  link: string;
  createdAt: string;
}
