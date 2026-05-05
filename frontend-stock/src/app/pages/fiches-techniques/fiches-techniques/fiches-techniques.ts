import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FichesTechniquesService } from '../../../core/services/fiches-techniques';
import { ArticlesService, Article } from '../../../core/services/articles';
import { UnitesService, Unite } from '../../../core/services/unites';
import { FamillesService, Famille } from '../../../core/services/familles';
import { ConditionnementsService } from '../../../core/services/conditionnements';
import { DecimalPipe } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-fiches-techniques',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  templateUrl: './fiches-techniques.html',
  styleUrl: './fiches-techniques.scss',
})
export class FichesTechniques implements OnInit {
  items: any[] = [];

  articles: Article[] = [];
  unites: Unite[] = [];
  familles: Famille[] = [];

  form: any = this.emptyForm();
  selectedId: number | null = null;

  loading = false;
  saving = false;

  compositions: any[] = [];
  compositionTemp: any[] = [];
  coutTotal = 0;
  conditionnementsProduits: any[] = [];

  selectedFt: any = null;
  selectedFtCompositions: any[] = [];
  selectedFtCout = 0;

  editingCompositionId: number | null = null;
  private compositionEditBackup: Record<number, any> = {};

  compositionForm = {
    type: 'ARTICLE' as 'ARTICLE' | 'FT',
    articleId: null as number | null,
    ficheTechniqueComposantId: null as number | null,
    conditionnementUtilisationId: null as number | null,
    quantite: 1,
  };

  searchFt = '';
  pageFt = 1;
  pageSizeFt = 8;

  constructor(
    private service: FichesTechniquesService,
    private articlesService: ArticlesService,
    private unitesService: UnitesService,
    private famillesService: FamillesService,
    private conditionnementsService: ConditionnementsService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.load();
    this.loadRefs();
  }

  emptyForm() {
    return {
      reference: '',
      nom: '',
      description: '',
      uniteId: null,
      familleId: null,
      prixVente: 0,
      seuilMinimum: 0,
      actif: true,
      uniteSeuilMinimumId: null,
    };
  }

  onUnitePrincipaleChange() {
    const uniteId = this.form.uniteId ? Number(this.form.uniteId) : null;
    this.form.uniteSeuilMinimumId = uniteId;
  }

  load() {
    this.loading = true;

    this.service.findAll().subscribe((res) => {
      this.items = res;
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  loadRefs() {
    this.articlesService.findAll().subscribe((r) => {
      this.articles = r;
      this.cdr.detectChanges();
    });

    this.unitesService.findAll().subscribe((r) => {
      this.unites = r;
      this.cdr.detectChanges();
    });

    this.famillesService.findAll().subscribe((r) => {
      this.familles = r.filter((f) => f.type === 'FICHE_TECHNIQUE');
      this.cdr.detectChanges();
    });

    this.conditionnementsService.findAllProduits().subscribe((res) => {
      this.conditionnementsProduits = res;
      this.cdr.detectChanges();
    });
  }

  openCreateModal() {
    this.selectedId = null;
    this.form = this.emptyForm();
    this.compositions = [];
    this.coutTotal = 0;
    this.editingCompositionId = null;
  }

  openEditModal(item: any) {
    this.selectedId = item.id;
    this.editingCompositionId = null;

    this.form = {
      ...item,
      uniteId: item.unite?.id ?? null,
      familleId: item.famille?.id ?? null,
      prixVente: Number(item.prixVente ?? 0),
      seuilMinimum: Number(item.seuilMinimum ?? 0),
      actif: item.actif ?? true,
      uniteSeuilMinimumId: item.uniteSeuilMinimum?.id ?? item.unite?.id ?? null,
    };

    this.loadCompositions(item.id);
    this.loadCout(item.id);
  }

  loadCompositions(ftId: number) {
    this.service.getCompositions(ftId).subscribe({
      next: (res: any[]) => {
        this.compositions = res ?? [];
        this.hydraterCoutsFt(this.compositions);
      },
    });
  }

  loadCout(ficheTechniqueId: number) {
    this.service.calculerCout(ficheTechniqueId).subscribe({
      next: (res) => {
        this.coutTotal = Number(res.coutTotal || 0);
        this.cdr.detectChanges();
      },
    });
  }

  save() {
    this.saving = true;

    const payload = {
      reference: this.form.reference,
      nom: this.form.nom,
      description: this.form.description ?? '',
      uniteId: Number(this.form.uniteId),
      familleId: this.form.familleId ? Number(this.form.familleId) : null,
      prixVente: Number(this.form.prixVente ?? 0),
      seuilMinimum: Number(this.form.seuilMinimum ?? 0),
      actif: this.form.actif ?? true,
      uniteSeuilMinimumId: this.form.uniteSeuilMinimumId
        ? Number(this.form.uniteSeuilMinimumId)
        : null,
    };

    const req = this.selectedId
      ? this.service.update(this.selectedId, payload as any)
      : this.service.create(payload as any);

    req.subscribe({
      next: (savedFt: any) => {
        this.saving = false;
        this.load();

        if (this.selectedId) {
          this.selectedFt = {
            ...this.selectedFt,
            ...savedFt,
            prixVente: Number(savedFt.prixVente ?? payload.prixVente),
          };

          this.recalculerCompositionLocale();
        }

        const modalEl = document.getElementById('ftModal');
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
    if (!confirm('Supprimer ?')) return;
    this.service.delete(item.id).subscribe(() => this.load());
  }

  addComposition() {
    const conditionnementUtilisationId = Number(this.compositionForm.conditionnementUtilisationId);

    if (!this.selectedId) {
      alert('Enregistre d’abord la fiche technique.');
      return;
    }

    if (this.compositionForm.quantite <= 0) {
      alert('La quantité doit être supérieure à 0.');
      return;
    }

    if (this.compositionForm.type === 'ARTICLE' && !this.compositionForm.articleId) {
      alert('Choisis un article.');
      return;
    }

    if (this.compositionForm.type === 'FT' && !this.compositionForm.ficheTechniqueComposantId) {
      alert('Choisis une fiche technique.');
      return;
    }

    if (!conditionnementUtilisationId || Number.isNaN(conditionnementUtilisationId)) {
      alert('Choisis un conditionnement');
      return;
    }

    const payload = {
      ficheTechniqueId: this.selectedId,
      articleId:
        this.compositionForm.type === 'ARTICLE' ? Number(this.compositionForm.articleId) : null,
      ficheTechniqueComposantId:
        this.compositionForm.type === 'FT'
          ? Number(this.compositionForm.ficheTechniqueComposantId)
          : null,
      quantite: Number(this.compositionForm.quantite),
      conditionnementUtilisationId,
    };

    this.service.addComposition(payload).subscribe(() => {
      this.resetCompositionForm();
      this.loadCompositions(this.selectedId!);
      this.loadCout(this.selectedId!);
      this.refreshSelectedFtIfNeeded();
    });
  }

  get marge(): number {
    return Number(this.form.prixVente || 0) - Number(this.coutTotal || 0);
  }

  get tauxMarge(): number {
    const prixVente = Number(this.form.prixVente || 0);
    const cout = Number(this.coutTotal || 0);

    if (prixVente === 0) return 0;

    return ((prixVente - cout) / prixVente) * 100;
  }

  deleteComposition(id: number) {
    this.service.deleteComposition(id).subscribe({
      next: () => {
        this.loadCompositions(this.selectedId!);
        this.loadCout(this.selectedId!);
        this.refreshSelectedFtIfNeeded();
      },
    });
  }

  ajouterLigneTemp() {
    if (!this.compositionForm.quantite || this.compositionForm.quantite <= 0) {
      alert('Quantité obligatoire');
      return;
    }

    const utilisationId = Number(this.compositionForm.conditionnementUtilisationId);

    if (!utilisationId || Number.isNaN(utilisationId)) {
      alert('Choisis une utilisation');
      return;
    }

    const article = this.articles.find((a) => a.id === Number(this.compositionForm.articleId));
    const ft = this.items.find(
      (f) => f.id === Number(this.compositionForm.ficheTechniqueComposantId),
    );
    const utilisation = this.utilisationsDisponibles().find((u: any) => u.id === utilisationId);

    const cout = this.calculerCoutTemp(utilisation, article);

    this.compositionTemp.push({
      type: this.compositionForm.type,
      articleId:
        this.compositionForm.type === 'ARTICLE' ? Number(this.compositionForm.articleId) : null,
      ficheTechniqueComposantId:
        this.compositionForm.type === 'FT'
          ? Number(this.compositionForm.ficheTechniqueComposantId)
          : null,
      nom: this.compositionForm.type === 'ARTICLE' ? article?.nom : ft?.nom,
      quantite: Number(this.compositionForm.quantite),
      conditionnementUtilisationId: utilisationId,
      utilisationLabel: `${Number(utilisation?.quantite || 0).toFixed(2)} ${utilisation?.unite?.code || ''}`,
      cout,
    });

    this.resetCompositionForm();
  }

  supprimerLigneTemp(index: number) {
    this.compositionTemp.splice(index, 1);
  }

  calculerCoutTemp(utilisation: any, article?: Article): number {
    if (!article || !utilisation) return 0;

    const prixAchat = Number(article.prixAchat || 0);
    const uniteAchat =
      article.conditionnement?.uniteAchat ?? utilisation?.conditionnementProduit?.uniteAchat;
    const uniteUtilisation = utilisation.unite;

    const facteurAchat = Number(uniteAchat?.facteurReference || 1);
    const facteurUtilisation = Number(uniteUtilisation?.facteurReference || 1);
    const quantiteUtilisation = Number(utilisation.quantite || 0);
    const multiplicateur = Number(this.compositionForm.quantite || 1);

    const quantiteConvertie = (quantiteUtilisation * facteurUtilisation) / facteurAchat;

    return prixAchat * quantiteConvertie * multiplicateur;
  }

  enregistrerCompositionsTemp() {
    if (!this.selectedId) return;

    const requests = this.compositionTemp.map((ligne) =>
      this.service.addComposition({
        ficheTechniqueId: this.selectedId!,
        articleId: ligne.articleId,
        ficheTechniqueComposantId: ligne.ficheTechniqueComposantId,
        conditionnementUtilisationId: ligne.conditionnementUtilisationId,
        quantite: Number(ligne.quantite),
      }),
    );

    if (requests.length === 0) return;

    forkJoin(requests).subscribe({
      next: () => {
        this.compositionTemp = [];
        this.loadCompositions(this.selectedId!);
        this.loadCout(this.selectedId!);
        this.refreshSelectedFtIfNeeded();

        const modalEl = document.getElementById('compositionModal');
        const modal = (window as any).bootstrap?.Modal.getInstance(modalEl);
        modal?.hide();
      },
    });
  }

  conditionnementsDisponibles() {
    if (this.compositionForm.type === 'ARTICLE') {
      return this.conditionnementsProduits.filter(
        (c) => c.article?.id === Number(this.compositionForm.articleId),
      );
    }

    return this.conditionnementsProduits.filter(
      (c) => c.ficheTechnique?.id === Number(this.compositionForm.ficheTechniqueComposantId),
    );
  }

  utilisationsDisponibles() {
    const produit = this.conditionnementsProduits.find((c) => {
      if (this.compositionForm.type === 'ARTICLE') {
        return c.article?.id === Number(this.compositionForm.articleId);
      }

      return c.ficheTechnique?.id === Number(this.compositionForm.ficheTechniqueComposantId);
    });

    return produit?.utilisations?.filter((u: any) => u.type === 'FT' && u.actif) ?? [];
  }

  utilisationsPourLigne(ligne: any) {
    const produit = this.conditionnementsProduits.find((c) => {
      if (ligne.article) {
        return c.article?.id === Number(ligne.article.id);
      }

      return c.ficheTechnique?.id === Number(ligne.ficheTechniqueComposant?.id);
    });

    return produit?.utilisations?.filter((u: any) => u.type === 'FT' && u.actif) ?? [];
  }

  get coutTempTotal(): number {
    return this.compositionTemp.reduce((total, ligne) => total + Number(ligne.cout || 0), 0);
  }

  calculerCoutLigne(ligne: any): number {
    if (!ligne.conditionnementUtilisation) return 0;

    const multiplicateur = Number(ligne.quantite || 1);

    if (ligne.article) {
      const utilisation = ligne.conditionnementUtilisation;

      const prixAchat = Number(ligne.article.prixAchat || 0);
      const uniteAchat = utilisation?.conditionnementProduit?.uniteAchat;
      const uniteUtilisation = utilisation?.unite;

      const quantiteUtilisation = Number(utilisation?.quantite || 0);
      const facteurAchat = Number(uniteAchat?.facteurReference || 1);
      const facteurUtilisation = Number(uniteUtilisation?.facteurReference || 1);

      const quantiteConvertie = (quantiteUtilisation * facteurUtilisation) / facteurAchat;

      return prixAchat * quantiteConvertie * multiplicateur;
    }

    if (ligne.ficheTechniqueComposant) {
      const coutFt = Number(ligne.ficheTechniqueComposant.coutTotal || 0);
      return coutFt * multiplicateur;
    }

    return 0;
  }

  private hydraterCoutsFt(lignes: any[]) {
    const requests = lignes
      .filter((ligne) => ligne.ficheTechniqueComposant?.id)
      .map((ligne) => this.service.calculerCout(ligne.ficheTechniqueComposant.id));

    if (requests.length === 0) {
      this.recalculerCompositionLocale();
      return;
    }

    forkJoin(requests).subscribe({
      next: (results: any[]) => {
        let index = 0;

        for (const ligne of lignes) {
          if (ligne.ficheTechniqueComposant?.id) {
            ligne.ficheTechniqueComposant.coutTotal = Number(results[index]?.coutTotal || 0);
            index++;
          }
        }

        this.recalculerCompositionLocale();
        this.cdr.detectChanges();
      },
    });
  }

  get margeFt(): number {
    if (!this.selectedFt) return 0;

    const prixVente = Number(this.selectedFt.prixVente || 0);

    if (prixVente === 0) return 0;

    return ((prixVente - Number(this.selectedFtCout || 0)) / prixVente) * 100;
  }

  selectFt(item: any) {
    this.selectedFt = item;
    this.refreshSelectedFtIfNeeded();
  }

  editComposition(ligne: any) {
    this.editingCompositionId = ligne.id;

    this.compositionEditBackup[ligne.id] = {
      quantite: Number(ligne.quantite || 1),
      conditionnementUtilisation: ligne.conditionnementUtilisation,
      conditionnementUtilisationIdEdit: ligne.conditionnementUtilisation?.id ?? null,
    };

    ligne.conditionnementUtilisationIdEdit = ligne.conditionnementUtilisation?.id ?? null;
  }

  cancelEditComposition(ligne?: any) {
    if (ligne && this.compositionEditBackup[ligne.id]) {
      const backup = this.compositionEditBackup[ligne.id];

      ligne.quantite = backup.quantite;
      ligne.conditionnementUtilisation = backup.conditionnementUtilisation;
      ligne.conditionnementUtilisationIdEdit = backup.conditionnementUtilisationIdEdit;

      delete this.compositionEditBackup[ligne.id];
      this.recalculerCompositionLocale();
    }

    this.editingCompositionId = null;
  }

  onCompositionUtilisationChange(ligne: any) {
    const utilisationId = Number(ligne.conditionnementUtilisationIdEdit);
    const utilisation = this.utilisationsPourLigne(ligne).find((u: any) => u.id === utilisationId);

    if (utilisation) {
      ligne.conditionnementUtilisation = utilisation;
    }

    this.recalculerCompositionLocale();
  }

  saveComposition(ligne: any) {
    const conditionnementUtilisationId = Number(
      ligne.conditionnementUtilisationIdEdit ?? ligne.conditionnementUtilisation?.id,
    );

    this.service
      .updateComposition(ligne.id, {
        quantite: Number(ligne.quantite),
        conditionnementUtilisationId,
      })
      .subscribe({
        next: () => {
          this.editingCompositionId = null;
          delete this.compositionEditBackup[ligne.id];

          this.recalculerCompositionLocale();
          this.loadCout(this.selectedId!);
          this.refreshSelectedFtIfNeeded();
        },
        error: (err) => console.error(err),
      });
  }

  recalculerCompositionLocale() {
    let total = 0;

    this.compositions = this.compositions.map((ligne) => {
      const coutLigne = this.calculerCoutLigne(ligne);
      total += coutLigne;

      return {
        ...ligne,
        coutLigne,
      };
    });

    this.coutTotal = total;
    this.cdr.detectChanges();
  }

  private refreshSelectedFtIfNeeded() {
    if (!this.selectedFt?.id) return;

    this.service.getCompositions(this.selectedFt.id).subscribe({
      next: (res: any[]) => {
        this.selectedFtCompositions = res ?? [];

        const requests = this.selectedFtCompositions
          .filter((ligne) => ligne.ficheTechniqueComposant?.id)
          .map((ligne) => this.service.calculerCout(ligne.ficheTechniqueComposant.id));

        if (requests.length === 0) {
          this.selectedFtCompositions = this.selectedFtCompositions.map((ligne) => ({
            ...ligne,
            coutLigne: this.calculerCoutLigne(ligne),
          }));
          this.cdr.detectChanges();
          return;
        }

        forkJoin(requests).subscribe({
          next: (results: any[]) => {
            let index = 0;

            this.selectedFtCompositions = this.selectedFtCompositions.map((ligne) => {
              if (ligne.ficheTechniqueComposant?.id) {
                ligne.ficheTechniqueComposant.coutTotal = Number(results[index]?.coutTotal || 0);
                index++;
              }

              return {
                ...ligne,
                coutLigne: this.calculerCoutLigne(ligne),
              };
            });

            this.cdr.detectChanges();
          },
        });
      },
    });

    this.service.calculerCout(this.selectedFt.id).subscribe({
      next: (res) => {
        this.selectedFtCout = Number(res.coutTotal || 0);
        this.cdr.detectChanges();
      },
    });
  }

  private resetCompositionForm() {
    this.compositionForm = {
      type: 'ARTICLE',
      articleId: null,
      ficheTechniqueComposantId: null,
      conditionnementUtilisationId: null,
      quantite: 1,
    };
  }

  filteredFts() {
    const q = (this.searchFt || '').toLowerCase();

    return this.items.filter(
      (x) =>
        (x.nom || '').toLowerCase().includes(q) ||
        (x.reference || '').toLowerCase().includes(q) ||
        (x.famille?.nom || '').toLowerCase().includes(q),
    );
  }

  paginatedFts() {
    const start = (this.pageFt - 1) * this.pageSizeFt;
    return this.filteredFts().slice(start, start + this.pageSizeFt);
  }

  totalPagesFt() {
    return Math.max(1, Math.ceil(this.filteredFts().length / this.pageSizeFt));
  }

  previousPageFt() {
    if (this.pageFt > 1) this.pageFt--;
  }

  nextPageFt() {
    if (this.pageFt < this.totalPagesFt()) this.pageFt++;
  }

  onSearchFtChange() {
    this.pageFt = 1;
  }
}
