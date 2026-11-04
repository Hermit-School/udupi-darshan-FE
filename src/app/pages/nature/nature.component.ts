import { Component } from "@angular/core";
import { ExploreCollectionComponent } from "src/app/components/explore-collection/explore-collection.component";
@Component({
  standalone: true,
  imports: [ExploreCollectionComponent],
  selector: "app-nature",
  templateUrl: "./nature.component.html",
  styleUrls: ["./nature.component.scss"],
})
export class NatureComponent {}
