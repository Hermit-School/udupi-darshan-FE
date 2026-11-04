import { Component } from "@angular/core";
import { ExploreCollectionComponent } from "src/app/components/explore-collection/explore-collection.component";
@Component({
  standalone: true,
  imports: [ExploreCollectionComponent],
  selector: "app-culture",
  templateUrl: "./culture.component.html",
  styleUrls: ["./culture.component.scss"],
})
export class CultureComponent {}
