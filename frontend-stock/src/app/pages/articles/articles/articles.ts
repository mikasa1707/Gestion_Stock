import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Article, ArticlesService } from '../../../core/services/articles';
import { ConditionnementsService } from '../../../core/services/conditionnements';
import { ToastrService } from 'ngx-toastr';

import { forkJoin } from 'rxjs';
import { Unite, UnitesService } from '../../../core/services/unites';
import { Famille, FamillesService } from '../../../core/services/familles';
import { Allergene, AllergenesService } from '../../../core/services/allergenes';
import {
  ArticleFournisseursService,
  ArticleFournisseur,
} from '../../../core/services/article-fournisseurs';
import { FournisseursService, Fournisseur } from '../../../core/services/fournisseurs';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './articles.html',
  styleUrl: './articles.scss',
})
export class Articles implements OnInit {
  articles: Article[] = [];
  loadingArticles = false;
  saving = false;
  error = '';
  search = '';
  page = 1;
  pageSize = 8;

  unites: Unite[] = [];
  familles: Famille[] = [];
  allergenes: Allergene[] = [];
  fournisseurs: Fournisseur[] = [];
  articleFournisseurs: ArticleFournisseur[] = [];

  articleFournisseurForm = {
    fournisseurId: null as number | null,
    prixAchat: 0,
    uniteId: null as number | null,
    referenceFournisseur: '',
    delaiLivraisonJours: null as number | null,
    fournisseurPrincipal: false,
    actif: true,
  };

  form: Article = this.emptyForm();
  selectedId: number | null = null;

  utilisationsFt: any[] = [];
  utilisationForm = {
    quantite: 1,
    uniteId: null as number | null,
  };

  articleTab: 'conditionnement' | 'fournisseurs' | 'utilisations' = 'conditionnement';

  constructor(
    private articlesService: ArticlesService,
    private toastr: ToastrService,
    private unitesService: UnitesService,
    private famillesService: FamillesService,
    private allergenesService: AllergenesService,
    private conditionnementsService: ConditionnementsService,
    private fournisseursService: FournisseursService,
    private articleFournisseursService: ArticleFournisseursService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadArticles();
    this.loadReferences();
  }

  filteredArticles() {
    if (!this.articles) return [];

    return this.articles.filter(
      (a) =>
        (a.nom || '').toLowerCase().includes((this.search || '').toLowerCase()) ||
        (a.reference || '').toLowerCase().includes((this.search || '').toLowerCase()),
    );
  }

  loadReferences() {
    forkJoin({
      unites: this.unitesService.findAll(),
      familles: this.famillesService.findAll(),
      allergenes: this.allergenesService.findAll(),
      fournisseurs: this.fournisseursService.findAll(),
    }).subscribe({
      next: (res) => {
        this.unites = res.unites.filter((u) => u.actif);
        this.familles = res.familles.filter((f) => f.type === 'ARTICLE');
        this.allergenes = res.allergenes.filter((a) => a.actif);
        this.fournisseurs = res.fournisseurs;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Erreur lors du chargement des listes';
      },
    });
  }

  emptyForm(): Article {
    return {
      reference: '',
      nom: '',
      description: '',
      uniteId: null,
      familleId: null,
      allergeneIds: [],
      prixAchat: 0,
      seuilMinimum: 0,
      uniteSeuilMinimumId: null,
      actif: true,
      quantiteAchat: 1,
      uniteAchatId: null,

      quantiteInventaire: 1,
      uniteInventaireId: null,

      quantiteFt: 1,
      uniteFtId: null,
    };
  }

  loadArticles() {
    console.log('LOAD ARTICLES CALLED');

    this.loadingArticles = true;

    this.articlesService.findAll().subscribe({
      next: (res) => {
        console.log('ARTICLES OK', res);

        this.articles = res;
        this.loadingArticles = false;

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('ARTICLES ERROR', err);
        this.loadingArticles = false;
        this.cdr.detectChanges();
      },
      complete: () => {
        console.log('ARTICLES COMPLETE');
      },
    });
  }

  save() {
    this.saving = true;
    this.error = '';

    const payload: Article = {
      reference: this.form.reference,
      nom: this.form.nom,
      description: this.form.description,
      uniteId: Number(this.form.uniteId),
      familleId: this.form.familleId ? Number(this.form.familleId) : null,
      allergeneIds: this.form.allergeneIds ?? [],
      prixAchat: Number(this.form.prixAchat ?? 0),
      seuilMinimum: Number(this.form.seuilMinimum ?? 0),
      actif: this.form.actif ?? true,
    };

    const request = this.selectedId
      ? this.articlesService.update(this.selectedId, payload)
      : this.articlesService.create(payload);

    request.subscribe({
      next: (article: any) => {
        // ✅ récupère l'id correctement
        const articleId = this.selectedId ?? article.id;

        // ✅ upsert conditionnement
        this.conditionnementsService
          .upsert({
            articleId,
            type: 'ARTICLE',
            quantiteAchat: Number(this.form.quantiteAchat),
            uniteAchatId: Number(this.form.uniteAchatId),
            quantiteInventaire: Number(this.form.quantiteInventaire),
            uniteInventaireId: Number(this.form.uniteInventaireId),
            quantiteFt: Number(this.form.quantiteFt),
            uniteFtId: Number(this.form.uniteFtId),
            uniteSeuilMinimumId: this.form.uniteSeuilMinimumId
              ? Number(this.form.uniteSeuilMinimumId)
              : null,
          })
          .subscribe({
            next: (conditionnement: any) => {
              this.form.conditionnement = conditionnement;
              this.utilisationsFt =
                conditionnement.utilisations?.filter((u: any) => u.type === 'FT') ?? [];
              this.resetForm();
              this.loadArticles();
              this.toastr.success('Article + conditionnement enregistrés');
            },
            error: () => {
              this.toastr.error('Erreur conditionnement');
            },
          });

        this.saving = false;
        this.resetForm();
        this.loadArticles();

        const modalEl = document.getElementById('articleModal');
        const modal = (window as any).bootstrap?.Modal.getInstance(modalEl);
        modal?.hide();
      },

      error: () => {
        this.error = 'Erreur lors de l’enregistrement';
        this.saving = false;
      },
    });
  }

  edit(article: Article) {
    this.selectedId = article.id || null;
    this.form = { ...article };
  }

  remove(article: Article) {
    if (!article.id) return;

    if (!window.confirm(`Supprimer ${article.nom} ?`)) return;

    this.articlesService.delete(article.id).subscribe({
      next: () => {
        this.toastr.success('Supprimé');
        this.loadArticles();
      },
      error: () => this.toastr.error('Erreur suppression'),
    });
  }

  resetForm() {
    this.selectedId = null;
    this.form = this.emptyForm();
  }

  openCreateModal() {
    this.resetForm();
    this.utilisationsFt = [];
    this.articleFournisseurs = [];
    this.resetArticleFournisseurForm();
  }

  openEditModal(article: Article) {
    this.selectedId = article.id || null;

    const uniteArticleId = article.unite?.id ?? article.uniteId ?? null;

    this.form = {
      ...article,

      uniteId: uniteArticleId,
      familleId: article.famille?.id ?? null,
      allergeneIds: article.allergenes?.map((a) => a.id) ?? [],

      // conditionnement existant sinon valeur par défaut
      quantiteAchat: article.conditionnement?.quantiteAchat ?? 1,
      uniteAchatId: article.conditionnement?.uniteAchat?.id ?? uniteArticleId,

      quantiteInventaire: article.conditionnement?.quantiteInventaire ?? 1,
      uniteInventaireId: article.conditionnement?.uniteInventaire?.id ?? uniteArticleId,

      quantiteFt: article.conditionnement?.quantiteFt ?? 1,
      uniteFtId: article.conditionnement?.uniteFt?.id ?? uniteArticleId,

      uniteSeuilMinimumId: article.uniteSeuilMinimum?.id ?? article.unite?.id ?? null,
    };

    if (article.id) {
      this.loadArticleFournisseurs(article.id);
    }

    if (article.conditionnement?.id) {
      this.loadUtilisationsFt(article.conditionnement.id);
    } else {
      this.utilisationsFt = [];
    }
  }

  loadUtilisationsFt(conditionnementProduitId: number) {
    this.conditionnementsService
      .findUtilisationsByProduit(conditionnementProduitId)
      .subscribe((res) => {
        this.utilisationsFt = res.filter((u) => u.type === 'FT');
        this.cdr.detectChanges();
      });
  }

  addUtilisationFt() {
    if (!this.selectedId) {
      alert('Enregistre d’abord l’article.');
      return;
    }

    if (!this.form.conditionnement?.id) {
      alert('Enregistre d’abord le conditionnement principal.');
      return;
    }

    if (!this.utilisationForm.uniteId) {
      alert('Choisis une unité.');
      return;
    }

    this.conditionnementsService
      .addUtilisation({
        conditionnementProduitId: this.form.conditionnement.id,
        quantite: Number(this.utilisationForm.quantite),
        uniteId: Number(this.utilisationForm.uniteId),
        type: 'FT',
        actif: true,
      })
      .subscribe(() => {
        this.utilisationForm = { quantite: 1, uniteId: null };
        this.loadUtilisationsFt(this.form.conditionnement!.id);
      });
  }

  deleteUtilisationFt(id: number) {
    this.conditionnementsService.deleteUtilisation(id).subscribe(() => {
      if (this.form.conditionnement?.id) {
        this.loadUtilisationsFt(this.form.conditionnement.id);
      }
    });
  }

  toggleAllergene(id: number, checked: boolean) {
    const ids = this.form.allergeneIds ?? [];

    if (checked) {
      this.form.allergeneIds = [...ids, id];
    } else {
      this.form.allergeneIds = ids.filter((x) => x !== id);
    }
  }

  hasAllergene(id: number): boolean {
    return this.form.allergeneIds?.includes(id) ?? false;
  }

  toggleActif(article: Article) {
    this.articlesService
      .update(article.id!, {
        actif: !article.actif,
      })
      .subscribe({
        next: () => {
          article.actif = !article.actif;
          this.toastr.success('Statut mis à jour');
        },
        error: () => this.toastr.error('Erreur'),
      });
  }

  paginatedArticles() {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredArticles().slice(start, start + this.pageSize);
  }

  totalPages() {
    return Math.ceil(this.filteredArticles().length / this.pageSize);
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
    }
  }

  nextPage() {
    if (this.page < this.totalPages()) {
      this.page++;
    }
  }

  onUnitePrincipaleChange() {
    const uniteId = this.form.uniteId ? Number(this.form.uniteId) : null;

    this.form.uniteSeuilMinimumId = uniteId;
    this.form.uniteAchatId = uniteId;
    this.form.uniteInventaireId = uniteId;
  }

  loadArticleFournisseurs(articleId: number) {
    this.articleFournisseursService.findByArticle(articleId).subscribe((res) => {
      this.articleFournisseurs = res ?? [];
    });
  }

  resetArticleFournisseurForm() {
    this.articleFournisseurForm = {
      fournisseurId: null,
      prixAchat: 0,
      uniteId: this.form.uniteId ?? null,
      referenceFournisseur: '',
      delaiLivraisonJours: null,
      fournisseurPrincipal: false,
      actif: true,
    };
  }

  addArticleFournisseur() {
    if (!this.selectedId) {
      alert('Enregistre d’abord l’article.');
      return;
    }

    if (!this.articleFournisseurForm.fournisseurId || !this.articleFournisseurForm.uniteId) {
      alert('Fournisseur et unité obligatoires.');
      return;
    }

    this.articleFournisseursService
      .create({
        articleId: this.selectedId,
        fournisseurId: Number(this.articleFournisseurForm.fournisseurId),
        prixAchat: Number(this.articleFournisseurForm.prixAchat),
        uniteId: Number(this.articleFournisseurForm.uniteId),
        referenceFournisseur: this.articleFournisseurForm.referenceFournisseur,
        delaiLivraisonJours: this.articleFournisseurForm.delaiLivraisonJours,
        fournisseurPrincipal: this.articleFournisseurForm.fournisseurPrincipal,
        actif: this.articleFournisseurForm.actif,
      })
      .subscribe(() => {
        this.loadArticleFournisseurs(this.selectedId!);
        this.resetArticleFournisseurForm();
      });
  }

  deleteArticleFournisseur(id: number) {
    this.articleFournisseursService.delete(id).subscribe(() => {
      this.loadArticleFournisseurs(this.selectedId!);
    });
  }
}
