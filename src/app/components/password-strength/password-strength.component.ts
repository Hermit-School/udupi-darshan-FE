import { Component, Input } from '@angular/core';
import { passwordStrength } from '../../util/password-strength';

@Component({
  standalone: true,
  selector: 'app-password-strength',
  template: `<div class="strength" aria-live="polite" aria-atomic="true">
    <p>Estimated password strength: <strong>{{ result.label }}</strong></p>
    <meter min="0" max="4" low="2" high="3" optimum="4" [value]="result.score" [attr.aria-label]="'Estimated password strength: ' + result.label"></meter>
    <ul>@for (tip of result.suggestions; track tip) { <li>{{ tip }}</li> }</ul>
  </div>`,
  styles: [`.strength { margin: .25rem 0; } p { margin: 0 0 .3rem; } meter { width: 100%; height: 1rem; } ul { margin: .4rem 0; padding-left: 1.25rem; font-size: .9rem; }`]
})
export class PasswordStrengthComponent {
  @Input() password = '';
  get result() { return passwordStrength(this.password); }
}
