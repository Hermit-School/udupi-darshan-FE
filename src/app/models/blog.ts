export interface Blog {
  id: number;
  title: string;
  content: string;
  content1?: string;
  image: string;
  relatedImages: string[];
  relatedContent: string[];
  cards: {
    id: number;
    image: string;
    title?: string;
    text: string;
  }[];
}
