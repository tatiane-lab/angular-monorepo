import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ui-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.ui-card--interactive]': 'interactive()' },
  template: `<ng-content />`,
  styles: `
    :host {
      display: block; background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius, 14px); overflow: hidden; box-shadow: var(--shadow-sm);
      transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
    }
    :host(.ui-card--interactive):hover {
      transform: translateY(-3px); box-shadow: var(--shadow-md); border-color: var(--accent);
    }
  `,
})
export class CardComponent {
  readonly interactive = input(false);
}
