import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Famille, FamillesService } from '../../core/services/familles';

@Component({
  selector: 'app-familles',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './familles.html',
  styleUrl: './familles.scss',
})
export class Familles implements OnInit {
  items: Famille[] = [];
  form: Partial<Famille> = this.emptyForm();
  selectedId: number | null = null;
  loading = false;
  saving = false;
  error = '';

  constructor(
    private service: FamillesService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.load();
  }

  emptyForm(): Partial<Famille> {
    return { nom: '', type: 'ARTICLE', description: '', actif: true };
  }

  load() {
    this.loading = true;
    this.service.findAll().subscribe({
      next: (res) => {
        this.items = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Erreur lors du chargement';
        this.loading = false;
      },
    });
  }

  openCreateModal() {
    this.selectedId = null;
    this.form = this.emptyForm();
  }

  openEditModal(item: Famille) {
    this.selectedId = item.id;
    this.form = { ...item };
  }

  save() {
    this.saving = true;

    const request = this.selectedId
      ? this.service.update(this.selectedId, this.form)
      : this.service.create(this.form);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.load();

        const modalEl = document.getElementById('familleModal');
        const modal = (window as any).bootstrap?.Modal.getInstance(modalEl);
        modal?.hide();
      },
      error: () => {
        this.saving = false;
        this.error = 'Erreur lors de l’enregistrement';
      },
    });
  }

  toggleActif(item: Famille) {
    this.service.update(item.id, { actif: !item.actif }).subscribe({
      next: () => (item.actif = !item.actif),
      error: () => (this.error = 'Erreur changement statut'),
    });
  }

  remove(item: Famille) {
    if (!confirm(`Supprimer "${item.nom}" ?`)) return;

    this.service.delete(item.id).subscribe({
      next: () => this.load(),
      error: () => (this.error = 'Suppression impossible'),
    });
  }
}
