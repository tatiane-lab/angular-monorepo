import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'ui-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.data-tone]': 'tone()' },
  template: `<ng-content />`,
  styles: `
    :host {
      display: inline-flex; align-items: center; padding: 0.15rem 0.6rem; border-radius: 999px;
      font-size: 0.72rem; font-weight: 600; letter-spacing: 0.02em;
      background: var(--surface-2); color: var(--text-muted);
    }
    :host([data-tone='accent']) { background: var(--accent-soft); color: var(--accent); }
    :host([data-tone='success']) { background: var(--success-soft); color: var(--success); }
    :host([data-tone='warning']) { background: var(--warning-soft); color: var(--warning); }
    :host([data-tone='danger']) { background: var(--danger-soft); color: var(--danger); }
  `,
})
export class BadgeComponent {
  readonly tone = input<BadgeTone>('neutral');
}
