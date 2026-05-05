import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InventairesService } from '../../core/services/inventaires';
import { ArticlesService, Article } from '../../core/services/articles';
import { UnitesService, Unite } from '../../core/services/unites';

@Component({
  selector: 'app-inventaires',
  standalone: true,
  imports: [FormsModule, DecimalPipe, DatePipe],
  templateUrl: './inventaires.html',
  styleUrl: './inventaires.scss',
})
export class Inventaires implements OnInit {
  items: any[] = [];
  articles: Article[] = [];
  unites: Unite[] = [];

  selectedInventaire: any = null;
  selectedLignes: any[] = [];

  loading = false;
  saving = false;
  search = '';

  form = this.emptyForm();

  constructor(
    private service: InventairesService,
    private articlesService: ArticlesService,
    private unitesService: UnitesService,
    private cdr: ChangeDetectorRef,
    
  ) {}

  ngOnInit() {
    this.load();
    this.loadRefs();
  }

  emptyForm() {
    return {
      reference: `INV-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      commentaire: '',
      lignes: [
        {
          articleId: null as number | null,
          quantiteComptee: 0,
          uniteId: null as number | null,
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
      error: () => (this.loading = false),
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
  }

  filteredItems() {
    const q = this.search.toLowerCase();

    return this.items.filter(
      (x) =>
        (x.reference || '').toLowerCase().includes(q) ||
        (x.commentaire || '').toLowerCase().includes(q),
    );
  }

  openCreateModal() {
    this.form = this.emptyForm();
  }

  addLigne() {
    this.form.lignes.push({
      articleId: null,
      quantiteComptee: 0,
      uniteId: null,
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

  selectInventaire(item: any) {
    this.selectedInventaire = item;
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
        quantiteComptee: Number(l.quantiteComptee),
        uniteId: Number(l.uniteId),
      })),
    };

    this.service.create(payload).subscribe({
      next: () => {
        this.saving = false;
        this.load();

        const modalEl = document.getElementById('inventaireModal');
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
