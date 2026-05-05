import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { ArticlesService, Article } from '../../../core/services/articles';
import { StockService } from '../../../core/services/stock';
import { UnitesService, Unite } from '../../../core/services/unites';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [FormsModule, DecimalPipe, DatePipe],
  templateUrl: './stock.html',
  styleUrl: './stock.scss',
})
export class Stock implements OnInit {
  articles: Article[] = [];
  stockRows: any[] = [];
  mouvements: any[] = [];

  selectedArticle: any = null;
  selectedMouvements: any[] = [];

  unites: Unite[] = [];

  loading = false;
  saving = false;
  search = '';

  page = 1;
  pageSize = 8;

  form = {
    typeMouvement: 'ENTREE' as 'ENTREE' | 'SORTIE' | 'INVENTAIRE',
    articleId: null as number | null,
    quantite: 1,
    uniteId: null as number | null,
    lieuStockageId: 1,
    zoneStockageId: 1,
    commentaire: '',
  };

  constructor(
    private articlesService: ArticlesService,
    private stockService: StockService,
    private unitesService: UnitesService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.load();
    this.loadRefs();
  }

  loadRefs() {
    this.unitesService.findAll().subscribe((res) => {
      this.unites = res ?? [];
    });
  }

  load() {
    this.loading = true;

    forkJoin({
      articles: this.articlesService.findAll(),
      mouvements: this.stockService.findAllMouvements(),
    }).subscribe({
      next: ({ articles, mouvements }) => {
        this.articles = articles ?? [];
        this.mouvements = mouvements ?? [];
        this.buildStockRows();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  buildStockRows() {
    this.stockRows = this.articles.map((article) => {
      const mouvementsArticle = this.mouvements.filter(
        (m) => m.article?.id === article.id,
      );

      let stock = 0;

      for (const m of mouvementsArticle) {
        const qte = Number(m.quantiteReference || 0);

        if (m.typeMouvement === 'ENTREE') stock += qte;
        if (m.typeMouvement === 'SORTIE') stock -= qte;
        if (m.typeMouvement === 'INVENTAIRE') stock = qte;
      }

      const seuil = Number(article.seuilMinimum || 0);

      return {
        article,
        stock,
        unite: article.unite,
        seuil,
        stockFaible: stock <= seuil,
        mouvements: mouvementsArticle,
      };
    });

    if (this.selectedArticle) {
      const row = this.stockRows.find(
        (r) => r.article.id === this.selectedArticle.article.id,
      );
      if (row) this.selectRow(row);
    }
  }

  filteredRows() {
    const q = this.search.toLowerCase();

    return this.stockRows.filter((r) => {
      const article = r.article;
      return (
        (article.nom || '').toLowerCase().includes(q) ||
        (article.reference || '').toLowerCase().includes(q) ||
        (article.famille?.nom || '').toLowerCase().includes(q)
      );
    });
  }

  paginatedRows() {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredRows().slice(start, start + this.pageSize);
  }

  totalPages() {
    return Math.max(1, Math.ceil(this.filteredRows().length / this.pageSize));
  }

  previousPage() {
    if (this.page > 1) this.page--;
  }

  nextPage() {
    if (this.page < this.totalPages()) this.page++;
  }

  onSearchChange() {
    this.page = 1;
  }

  selectRow(row: any) {
    this.selectedArticle = row;
    this.selectedMouvements = [...row.mouvements].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  openMouvementModal(row?: any) {
    this.form = {
      typeMouvement: 'ENTREE',
      articleId: row?.article?.id ?? null,
      quantite: 1,
      uniteId: row?.article?.unite?.id ?? null,
      lieuStockageId: 1,
      zoneStockageId: 1,
      commentaire: '',
    };
  }

  saveMouvement() {
    if (!this.form.articleId || !this.form.uniteId) {
      alert('Article et unité obligatoires');
      return;
    }

    this.saving = true;

    this.stockService
      .mouvement({
        typeMouvement: this.form.typeMouvement,
        articleId: Number(this.form.articleId),
        quantite: Number(this.form.quantite),
        uniteId: Number(this.form.uniteId),
        lieuStockageId: Number(this.form.lieuStockageId),
        zoneStockageId: Number(this.form.zoneStockageId),
        commentaire: this.form.commentaire,
      })
      .subscribe({
        next: () => {
          this.saving = false;
          this.load();

          const modalEl = document.getElementById('stockMouvementModal');
          const modal = (window as any).bootstrap?.Modal.getInstance(modalEl);
          modal?.hide();
        },
        error: (err) => {
          this.saving = false;
          console.error(err);
        },
      });
  }
}