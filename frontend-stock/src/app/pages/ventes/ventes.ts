import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { VentesService } from '../../core/services/ventes';
import { FichesTechniquesService } from '../../core/services/fiches-techniques';

@Component({
  selector: 'app-ventes',
  standalone: true,
  imports: [FormsModule, DecimalPipe, DatePipe],
  templateUrl: './ventes.html',
  styleUrl: './ventes.scss',
})
export class Ventes implements OnInit {
  items: any[] = [];
  fichesTechniques: any[] = [];

  selectedVente: any = null;
  selectedLignes: any[] = [];

  loading = false;
  saving = false;
  search = '';

  importFile: File | null = null;

  form = this.emptyForm();

  constructor(
    private service: VentesService,
    private fichesTechniquesService: FichesTechniquesService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.load();
    this.loadRefs();
  }

  emptyForm() {
    return {
      reference: `VTE-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      client: '',
      commentaire: '',
      lignes: [
        {
          ficheTechniqueId: null as number | null,
          quantite: 1,
          prixUnitaire: 0,
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
    this.fichesTechniquesService.findAll().subscribe((res) => {
      this.fichesTechniques = res ?? [];
        this.cdr.detectChanges();
    });
  }

  filteredItems() {
    const q = this.search.toLowerCase();

    return this.items.filter(
      (x) =>
        (x.reference || '').toLowerCase().includes(q) ||
        (x.client || '').toLowerCase().includes(q),
    );
  }

  openCreateModal() {
    this.form = this.emptyForm();
  }

  addLigne() {
    this.form.lignes.push({
      ficheTechniqueId: null,
      quantite: 1,
      prixUnitaire: 0,
    });
  }

  removeLigne(index: number) {
    if (this.form.lignes.length === 1) return;
    this.form.lignes.splice(index, 1);
  }

  onFtChange(ligne: any) {
    const ft = this.fichesTechniques.find(
      (f) => f.id === Number(ligne.ficheTechniqueId),
    );

    ligne.prixUnitaire = Number(ft?.prixVente ?? 0);
  }

  montantLigne(ligne: any) {
    return Number(ligne.quantite || 0) * Number(ligne.prixUnitaire || 0);
  }

  totalVente() {
    return this.form.lignes.reduce(
      (total, ligne) => total + this.montantLigne(ligne),
      0,
    );
  }

  selectVente(item: any) {
    this.selectedVente = item;
    this.selectedLignes = item.lignes ?? [];
  }

  save() {
    this.saving = true;

    const payload = {
      reference: this.form.reference,
      date: this.form.date,
      client: this.form.client,
      commentaire: this.form.commentaire,
      lignes: this.form.lignes.map((l) => ({
        ficheTechniqueId: Number(l.ficheTechniqueId),
        quantite: Number(l.quantite),
        prixUnitaire: Number(l.prixUnitaire),
      })),
    };

    this.service.create(payload).subscribe({
      next: () => {
        this.saving = false;
        this.load();

        const modalEl = document.getElementById('venteModal');
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

  onImportFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.importFile = input.files?.[0] ?? null;
  }

  previewImport() {
    if (!this.importFile) {
      alert('Choisis un fichier avant import.');
      return;
    }

    alert(
      `Import prévu plus tard : ${this.importFile.name}. Prochaine étape : parsing CSV/Excel.`,
    );
  }
}