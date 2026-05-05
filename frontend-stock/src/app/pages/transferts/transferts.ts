import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TransfertsService } from '../../core/services/transfert';
import { ArticlesService, Article } from '../../core/services/articles';
import { UnitesService, Unite } from '../../core/services/unites';
import { LieuStockage, StockageService, ZoneStockage } from '../../core/services/stockage';

@Component({
  selector: 'app-transferts',
  standalone: true,
  imports: [FormsModule, DecimalPipe, DatePipe],
  templateUrl: './transferts.html',
  styleUrl: './transferts.scss',
})
export class Transferts implements OnInit {
  items: any[] = [];
  articles: Article[] = [];
  unites: Unite[] = [];
  lieux: LieuStockage[] = [];
  zones: ZoneStockage[] = [];

  selectedTransfert: any = null;
  selectedLignes: any[] = [];

  loading = false;
  saving = false;
  search = '';

  form = this.emptyForm();

  constructor(
    private service: TransfertsService,
    private articlesService: ArticlesService,
    private unitesService: UnitesService,
    private stockageService: StockageService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.load();
    this.loadRefs();
  }

  emptyForm() {
    return {
      reference: `TRF-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      commentaire: '',
      lignes: [
        {
          articleId: null as number | null,
          quantite: 1,
          uniteId: null as number | null,
          lieuSourceId: null as number | null,
          zoneSourceId: null as number | null,
          lieuDestinationId: null as number | null,
          zoneDestinationId: null as number | null,
        },
      ],
    };
  }

  load() {
    this.loading = true;

    this.service.findAll().subscribe({
      next: (res) => {
        this.items = res ?? [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  loadRefs() {
    this.articlesService.findAll().subscribe((res) => {
      this.articles = res ?? [];
      this.cdr.detectChanges();
    });
    this.unitesService.findAll().subscribe((res) => {
      this.unites = res ?? [];
      this.cdr.detectChanges();
    });
    this.stockageService.findLieux().subscribe((res) => {
      this.lieux = res ?? [];
      this.cdr.detectChanges();
    });
    this.stockageService.findZones().subscribe((res) => {
      this.zones = res ?? [];
      this.cdr.detectChanges();
    });
  }

  filteredItems() {
    const q = this.search.toLowerCase();

    return this.items.filter(
      (x) =>
        (x.reference || '').toLowerCase().includes(q) ||
        (x.commentaire || '').toLowerCase().includes(q),
    );
  }

  zonesByLieu(lieuId: number | null) {
    if (!lieuId) return [];
    return this.zones.filter((z) => z.lieuStockage?.id === Number(lieuId));
  }

  openCreateModal() {
    this.form = this.emptyForm();
  }

  addLigne() {
    this.form.lignes.push({
      articleId: null,
      quantite: 1,
      uniteId: null,
      lieuSourceId: null,
      zoneSourceId: null,
      lieuDestinationId: null,
      zoneDestinationId: null,
    });
  }

  removeLigne(index: number) {
    if (this.form.lignes.length === 1) return;
    this.form.lignes.splice(index, 1);
  }

  onArticleChange(ligne: any) {
    const article = this.articles.find((a) => a.id === Number(ligne.articleId));
    ligne.uniteId = article?.unite?.id ?? null;
  }

  onLieuSourceChange(ligne: any) {
    ligne.zoneSourceId = null;
  }

  onLieuDestinationChange(ligne: any) {
    ligne.zoneDestinationId = null;
  }

  selectTransfert(item: any) {
    this.selectedTransfert = item;
    this.selectedLignes = item.lignes ?? [];
  }

  save() {
    this.saving = true;

    const payload = {
      reference: this.form.reference,
      date: this.form.date,
      commentaire: this.form.commentaire,
      lignes: this.form.lignes.map((l) => ({
        articleId: Number(l.articleId),
        quantite: Number(l.quantite),
        uniteId: Number(l.uniteId),
        lieuSourceId: Number(l.lieuSourceId),
        zoneSourceId: Number(l.zoneSourceId),
        lieuDestinationId: Number(l.lieuDestinationId),
        zoneDestinationId: Number(l.zoneDestinationId),
      })),
    };

    this.service.create(payload).subscribe({
      next: () => {
        this.saving = false;
        this.load();

        const modalEl = document.getElementById('transfertModal');
        const modal = (window as any).bootstrap?.Modal.getInstance(modalEl);
        modal?.hide();
      },
      error: (err) => {
        this.saving = false;
        console.error(err);
      },
    });
  }

  remove(item: any) {
    if (!confirm(`Supprimer ${item.reference} ?`)) return;

    this.service.delete(item.id).subscribe(() => {
      this.load();
    });
  }
}
