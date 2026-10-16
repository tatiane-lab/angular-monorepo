import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses',
    '[attr.aria-disabled]': 'disabled || loading',
    '[attr.aria-busy]': 'loading',
  },
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="buttonClasses"
      (click)="handleClick($event)"
    >
      <span *ngIf="loading" class="spinner" aria-hidden="true"></span>
      <ng-content />
    </button>
  `,
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'ghost' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Output() clicked = new EventEmitter<MouseEvent>();

  get buttonClasses(): string {
    return [
      'btn',
      `btn--${this.variant}`,
      `btn--${this.size}`,
      this.loading ? 'btn--loading' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  get hostClasses(): string {
    return 'ui-button';
  }

  handleClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }
}
