import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Reusable empty / error message block. Project action buttons as content. */
@Component({
  selector: 'ui-state-message',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.data-kind]': 'kind()', '[attr.role]': 'kind() === "error" ? "alert" : "status"' },
  template: `
    <div class="icon" aria-hidden="true">{{ kind() === 'error' ? '⚠️' : icon() }}</div>
    <h3>{{ title() }}</h3>
    @if (message()) {
      <p>{{ message() }}</p>
    }
    <div class="actions"><ng-content /></div>
  `,
  styles: `
    :host {
      display: flex; flex-direction: column; align-items: center; text-align: center; gap: 0.4rem;
      padding: 3rem 1.5rem; border: 1px dashed var(--border); border-radius: var(--radius, 14px);
      background: var(--surface);
    }
    :host([data-kind='error']) { border-color: var(--danger); }
    .icon { font-size: 2.2rem; }
    h3 { margin: 0; font-size: 1.1rem; }
    p { margin: 0; color: var(--text-muted); max-width: 40ch; }
    .actions { margin-top: 0.8rem; display: flex; gap: 0.5rem; }
  `,
})
export class StateMessageComponent {
  readonly kind = input<'empty' | 'error'>('empty');
  readonly icon = input('🔎');
  readonly title = input.required<string>();
  readonly message = input('');
}
