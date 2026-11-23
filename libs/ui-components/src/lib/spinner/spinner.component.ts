import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ui-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'status', '[attr.aria-label]': 'label()', '[style.--size]': 'size()' },
  template: `<span class="ring"></span>`,
  styles: `
    :host { display: inline-flex; }
    .ring {
      width: calc(var(--size, 24) * 1px); height: calc(var(--size, 24) * 1px); border-radius: 50%;
      border: 3px solid var(--border); border-top-color: var(--accent); animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `,
})
export class SpinnerComponent {
  readonly size = input(24);
  readonly label = input('Carregando');
}
