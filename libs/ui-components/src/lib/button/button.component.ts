import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ui-button',
    '[attr.aria-busy]': 'loading()',
    '[class.ui-button--block]': 'block()',
  },
  template: `
    <button
      [type]="type()"
      [disabled]="disabled() || loading()"
      [class]="classes()"
      (click)="handleClick($event)"
    >
      @if (loading()) {
        <span class="spinner" aria-hidden="true"></span>
      }
      <ng-content />
    </button>
  `,
  styles: `
    :host { display: inline-block; }
    :host(.ui-button--block) { display: block; }
    :host(.ui-button--block) .btn { width: 100%; }
    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
      font: inherit; font-weight: 600; cursor: pointer; border: 1px solid transparent;
      border-radius: var(--radius-sm, 8px); transition: background 0.15s, transform 0.1s, border-color 0.15s;
    }
    .btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    .btn:active:not(:disabled) { transform: translateY(1px); }
    .btn:disabled { opacity: 0.55; cursor: not-allowed; }
    .btn--sm { padding: 0.35rem 0.7rem; font-size: 0.8rem; }
    .btn--md { padding: 0.6rem 1.1rem; font-size: 0.92rem; }
    .btn--lg { padding: 0.8rem 1.5rem; font-size: 1rem; }
    .btn--primary { background: var(--accent); color: #fff; }
    .btn--primary:hover:not(:disabled) { background: var(--accent-hover); }
    .btn--secondary { background: var(--surface-2); color: var(--text); border-color: var(--border); }
    .btn--secondary:hover:not(:disabled) { border-color: var(--accent); }
    .btn--danger { background: var(--danger); color: #fff; }
    .btn--ghost { background: transparent; color: var(--text); }
    .btn--ghost:hover:not(:disabled) { background: var(--surface-2); }
    .spinner {
      width: 1em; height: 1em; border-radius: 50%;
      border: 2px solid currentColor; border-right-color: transparent; animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `,
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly block = input(false);
  readonly clicked = output<MouseEvent>();

  protected readonly classes = computed(() => `btn btn--${this.variant()} btn--${this.size()}`);

  protected handleClick(event: MouseEvent): void {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit(event);
    }
  }
}
