
export interface Details {
  id : number;
  title : string;
  category : string;
  subCategory : string;
  thumbnail : string;
  images : string[];
  desc : string;
  tips : string[];
  best_time_to_visit : string;
  how_to_visit : {
    by_car : string;
    by_public : string;
    by_bike :string;

  }
} 
// export interface how_to_visit {
// by_car : string;
// by_public : string;
// by_bike :string;
// }