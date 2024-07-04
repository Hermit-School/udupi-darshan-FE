export interface Story {
    id:number;
    title: string;
    author: string;
    content: string;
    image: string;
    content1?: string;
    relatedImages: string[];
    relatedContent: string[];
  cards: {
    id: number;
    image: string;
    title?: string;
    text: string;
  }[];
  }