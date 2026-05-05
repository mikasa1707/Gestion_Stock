import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe, DatePipe } from '@angular/common';

import { AchatsService } from '../../../core/services/achats';
import { ArticlesService, Article } from '../../../core/services/articles';
import { UnitesService, Unite } from '../../../core/services/unites';
import {
  ArticleFournisseursService,
  ArticleFournisseur,
} from '../../../core/services/article-fournisseurs';
import { Fournisseur, FournisseursService } from '../../../core/services/fournisseurs';

@Component({
  selector: 'app-achats',
  standalone: true,
  imports: [FormsModule, DecimalPipe, DatePipe],
  templateUrl: './achats.html',
  styleUrl: './achats.scss',
})
export class Achats implements OnInit {
  achats: any[] = [];
  articles: Article[] = [];
  unites: Unite[] = [];
  articleFournisseurs: ArticleFournisseur[] = [];
  fournisseurs: Fournisseur[] = [];

  selectedAchat: any = null;
  selectedLignes: any[] = [];

  loading = false;
  saving = false;
  search = '';

  page = 1;
  pageSize = 8;

  form = this.emptyForm();

  constructor(
    private achatsService: AchatsService,
    private articlesService: ArticlesService,
    private unitesService: UnitesService,
    private articleFournisseursService: ArticleFournisseursService,
    private fournisseursService: FournisseursService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.load();
    this.loadRefs();
  }

  emptyForm() {
    return {
      reference: `ACH-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      fournisseur: '',
      fournisseurId: null as number | null,
      commentaire: '',
      lignes: [
        {
          articleId: null as number | null,
          quantite: 1,
          uniteId: null as number | null,
          prixUnitaire: 0,
          articleFournisseurId: null as number | null,
        },
      ],
    };
  }

  articlesPourFournisseur() {
    if (!this.form.fournisseurId) return [];

    const idsArticles = this.articleFournisseurs
      .filter((af) => af.fournisseur?.id === Number(this.form.fournisseurId) && af.actif)
      .map((af) => af.article?.id);

    return this.articles.filter((a) => idsArticles.includes(a.id));
  }

  onFournisseurAchatChange() {
    this.form.lignes = [
      {
        articleId: null,
        articleFournisseurId: null,
        quantite: 1,
        uniteId: null,
        prixUnitaire: 0,
      },
    ];
  }

  load() {
    this.loading = true;

    this.achatsService.findAll().subscribe({
      next: (res) => {
        this.achats = res ?? [];
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

    this.articleFournisseursService.findAll().subscribe((res) => {
      this.articleFournisseurs = res ?? [];
      this.cdr.detectChanges();
    });

    this.fournisseursService.findAll().subscribe((res) => {
      this.fournisseurs = res ?? [];
      this.cdr.detectChanges();
    });
  }

  filteredAchats() {
    const q = this.search.toLowerCase();

    return this.achats.filter(
      (a) =>
        (a.reference || '').toLowerCase().includes(q) ||
        (a.fournisseur || '').toLowerCase().includes(q),
    );
  }

  addLigne() {
    this.form.lignes.push({
      articleId: null,
      articleFournisseurId: null,
      quantite: 1,
      uniteId: null,
      prixUnitaire: 0,
    });
  }

  removeLigne(index: number) {
    if (this.form.lignes.length === 1) return;
    this.form.lignes.splice(index, 1);
  }

  onArticleChange(ligne: any) {
    if (!this.form.fournisseurId || !ligne.articleId) return;

    const af = this.articleFournisseurs.find(
      (x) =>
        x.article?.id === Number(ligne.articleId) &&
        x.fournisseur?.id === Number(this.form.fournisseurId) &&
        x.actif,
    );

    const article = this.articles.find((a) => a.id === Number(ligne.articleId));

    ligne.articleFournisseurId = af?.id ?? null;
    ligne.prixUnitaire = Number(af?.prixAchat ?? article?.prixAchat ?? 0);
    ligne.uniteId = af?.unite?.id ?? article?.unite?.id ?? null;
  }

  onArticleFournisseurChange(ligne: any) {
    const af = this.articleFournisseurs.find((x) => x.id === Number(ligne.articleFournisseurId));

    if (!af) return;

    ligne.prixUnitaire = Number(af.prixAchat || 0);
    ligne.uniteId = af.unite?.id ?? null;
  }

  montantLigne(ligne: any) {
    return Number(ligne.quantite || 0) * Number(ligne.prixUnitaire || 0);
  }

  totalAchat() {
    return this.form.lignes.reduce((total, ligne) => total + this.montantLigne(ligne), 0);
  }

  openCreateModal() {
    this.form = this.emptyForm();
  }

  save() {
    this.saving = true;

    const payload = {
      reference: this.form.reference,
      date: this.form.date,
      fournisseurId: this.form.fournisseurId ? Number(this.form.fournisseurId) : null,
      commentaire: this.form.commentaire,
      lignes: this.form.lignes.map((l) => ({
        articleId: Number(l.articleId),
        articleFournisseurId: l.articleFournisseurId ? Number(l.articleFournisseurId) : null,
        quantite: Number(l.quantite),
        uniteId: Number(l.uniteId),
        prixUnitaire: Number(l.prixUnitaire),
      })),
    };

    this.achatsService.create(payload).subscribe({
      next: () => {
        this.saving = false;
        this.load();
        this.selectedAchat = null;
        this.selectedLignes = [];

        const modalEl = document.getElementById('achatModal');
        const modal = (window as any).bootstrap?.Modal.getInstance(modalEl);
        modal?.hide();
      },
      error: (err) => {
        this.saving = false;
        console.error(err);
      },
    });
  }

  remove(achat: any) {
    if (!confirm(`Supprimer ${achat.reference} ?`)) return;

    this.achatsService.delete(achat.id).subscribe(() => {
      this.load();
    });
  }

  selectAchat(achat: any) {
    console.log(achat)
    this.selectedAchat = achat;
    this.selectedLignes = achat.lignes ?? [];
  }

  paginatedAchats() {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredAchats().slice(start, start + this.pageSize);
  }

  totalPages() {
    return Math.max(1, Math.ceil(this.filteredAchats().length / this.pageSize));
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

  fournisseursPourArticle(articleId: number | null) {
    if (!articleId) return [];

    return this.articleFournisseurs.filter(
      (af) => af.article?.id === Number(articleId) && af.actif,
    );
  }
}
