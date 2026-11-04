import { Component } from "@angular/core";
import { ExploreCollectionComponent } from "src/app/components/explore-collection/explore-collection.component";
@Component({
  standalone: true,
  imports: [ExploreCollectionComponent],
  selector: "app-food",
  templateUrl: "./food.component.html",
  styleUrls: ["./food.component.scss"],
})
export class FoodComponent {}
