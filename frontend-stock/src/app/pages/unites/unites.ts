import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UnitesService, Unite } from '../../core/services/unites';

@Component({
  selector: 'app-unites',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './unites.html',
  styleUrl: './unites.scss',
})
export class Unites implements OnInit {
  items: Unite[] = [];
  form: Partial<Unite> = this.emptyForm();
  selectedId: number | null = null;
  loading = false;
  saving = false;
  error = '';

  constructor(
    private service: UnitesService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.load();
  }

  emptyForm(): Partial<Unite> {
    return {
      code: '',
      libelle: '',
      actif: true,
    };
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

  openEditModal(item: Unite) {
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

        const modalEl = document.getElementById('uniteModal');
        const modal = (window as any).bootstrap?.Modal.getInstance(modalEl);
        modal?.hide();
      },
      error: () => {
        this.saving = false;
        this.error = 'Erreur lors de l’enregistrement';
      },
    });
  }

  toggleActif(item: Unite) {
    this.service.update(item.id, { actif: !item.actif }).subscribe({
      next: () => (item.actif = !item.actif),
      error: () => (this.error = 'Erreur changement statut'),
    });
  }

  remove(item: Unite) {
    if (!confirm(`Supprimer "${item.libelle}" ?`)) return;

    this.service.delete(item.id).subscribe({
      next: () => this.load(),
      error: () => (this.error = 'Suppression impossible'),
    });
  }
}
