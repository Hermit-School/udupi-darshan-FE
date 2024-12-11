export interface Story {
  id: number;
  title: string;
  submittedBy: string;
  content: string;
  images: string;
  createdAt: string;
  dontMissThese: {
    name: string;
    description: string;
    imageUrl: string;
    link?: string;
  }[];
}