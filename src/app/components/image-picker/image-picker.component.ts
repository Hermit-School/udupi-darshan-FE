import { Component, Input, Output, EventEmitter } from "@angular/core";
import { EditorPhoto } from "../../util/media-image";
import { validateStoryPhotos } from "../../util/story-photos";
@Component({
  standalone: true,
  selector: "app-image-picker",
  templateUrl: "./image-picker.component.html",
  styleUrls: ["./image-picker.component.scss"],
})
export class ImagePickerComponent {
  @Input() items: EditorPhoto[] = [];
  @Input() limit = 20;
  @Input() label = "Record photos";
  @Input() remainingUploads = 5;
  @Input() disabled = false;
  @Output() itemsChange = new EventEmitter<EditorPhoto[]>();
  validating = false;
  error = "";
  broken = new Set<string>();
  readonly helpId = "photos-" + crypto.randomUUID();
  async select(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    input.value = "";
    if (!files.length || this.disabled || this.validating) return;
    const replacing = this.limit === 1;
    const available =
      this.remainingUploads +
      (replacing ? this.items.filter((item) => item.file).length : 0);
    this.error = "";
    this.validating = true;
    try {
      if (files.length > available)
        throw new Error(
          "Upload up to 5 new photos per save, including related-place photos.",
        );
      await validateStoryPhotos(
        files,
        replacing ? 0 : this.items.length,
        this.limit,
      );
      const added: EditorPhoto[] = files.map((file) => {
        const id = crypto.randomUUID();
        return {
          id,
          source: "upload:" + id,
          preview: URL.createObjectURL(file),
          file,
        };
      });
      if (replacing)
        this.items
          .filter((item) => item.file)
          .forEach((item) => URL.revokeObjectURL(item.preview));
      this.itemsChange.emit(replacing ? added : [...this.items, ...added]);
    } catch (error) {
      this.error =
        error instanceof Error
          ? error.message
          : "These photos could not be read.";
    } finally {
      this.validating = false;
    }
  }
  remove(index: number) {
    if (this.disabled || this.validating) return;
    const item = this.items[index];
    if (item?.file) URL.revokeObjectURL(item.preview);
    this.itemsChange.emit(this.items.filter((_, i) => i !== index));
    this.error = "";
  }
  main(index: number) {
    if (this.disabled || this.validating) return;
    this.itemsChange.emit([
      this.items[index],
      ...this.items.filter((_, i) => i !== index),
    ]);
  }
}
