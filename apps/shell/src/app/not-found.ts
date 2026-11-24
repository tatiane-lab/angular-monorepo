import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent, StateMessageComponent } from '@nx-angular-monorepo/ui-components';

@Component({
  selector: 'app-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ButtonComponent, StateMessageComponent],
  template: `
    <ui-state-message icon="🧭" title="Página não encontrada" message="O endereço não existe neste app.">
      <a routerLink="/products"><ui-button>Ir para produtos</ui-button></a>
    </ui-state-message>
  `,
})
export class NotFound {}
