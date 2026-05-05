import { Component } from '@angular/core';
import { Unites } from '../unites/unites';
import { Familles } from '../familles/familles';
import { Allergenes } from '../allergenes/allergenes';

@Component({
  selector: 'app-parametres',
  standalone: true,
  imports: [
    Unites,
    Familles,
    Allergenes,
  ],
  templateUrl: './parametres.html',
  styleUrl: './parametres.scss',
})
export class Parametres {
  activeTab: 'unites' | 'familles' | 'allergenes' = 'unites';

  setTab(tab: 'unites' | 'familles' | 'allergenes') {
    this.activeTab = tab;
  }
}