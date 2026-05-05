import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  LieuStockage,
  StockageService,
  ZoneStockage,
} from '../../core/services/stockage';

@Component({
  selector: 'app-stockage',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './stockage.html',
  styleUrl: './stockage.scss',
})
export class Stockage implements OnInit {
  lieux: LieuStockage[] = [];
  zones: ZoneStockage[] = [];

  loading = false;

  lieuForm = {
    nom: '',
    description: '',
    actif: true,
  };

  zoneForm = {
    nom: '',
    description: '',
    lieuStockageId: null as number | null,
    actif: true,
  };

  constructor(private service: StockageService,
    private cdr: ChangeDetectorRef,) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;

    this.service.findLieux().subscribe((lieux) => {
      this.lieux = lieux ?? [];
        this.cdr.detectChanges();

      this.service.findZones().subscribe((zones) => {
        this.zones = zones ?? [];
        this.loading = false;
        this.cdr.detectChanges();
      });
    });
  }

  saveLieu() {
    if (!this.lieuForm.nom.trim()) return;

    this.service.createLieu(this.lieuForm).subscribe(() => {
      this.lieuForm = { nom: '', description: '', actif: true };
      this.load();
    });
  }

  saveZone() {
    if (!this.zoneForm.nom.trim() || !this.zoneForm.lieuStockageId) return;

    this.service.createZone({
      nom: this.zoneForm.nom,
      description: this.zoneForm.description,
      lieuStockageId: Number(this.zoneForm.lieuStockageId),
      actif: this.zoneForm.actif,
    }).subscribe(() => {
      this.zoneForm = {
        nom: '',
        description: '',
        lieuStockageId: null,
        actif: true,
      };
      this.load();
    });
  }

  removeLieu(id: number) {
    if (!confirm('Supprimer ce lieu ?')) return;
    this.service.deleteLieu(id).subscribe(() => this.load());
  }

  removeZone(id: number) {
    if (!confirm('Supprimer cette zone ?')) return;
    this.service.deleteZone(id).subscribe(() => this.load());
  }
}