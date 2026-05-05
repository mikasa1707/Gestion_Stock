import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Allergene, AllergenesService } from '../../core/services/allergenes';

@Component({
  selector: 'app-allergenes',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './allergenes.html',
  styleUrl: './allergenes.scss',
})
export class Allergenes implements OnInit {
  items: Allergene[] = [];
  form: Partial<Allergene> = this.emptyForm();
  selectedId: number | null = null;
  loading = false;
  saving = false;
  error = '';

  constructor(
    private service: AllergenesService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.load();
  }

  emptyForm(): Partial<Allergene> {
    return { nom: '', description: '', actif: true };
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

  openEditModal(item: Allergene) {
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

        const modalEl = document.getElementById('allergeneModal');
        const modal = (window as any).bootstrap?.Modal.getInstance(modalEl);
        modal?.hide();
      },
      error: () => {
        this.saving = false;
        this.error = 'Erreur lors de l’enregistrement';
      },
    });
  }

  toggleActif(item: Allergene) {
    this.service.update(item.id, { actif: !item.actif }).subscribe({
      next: () => (item.actif = !item.actif),
      error: () => (this.error = 'Erreur changement statut'),
    });
  }

  remove(item: Allergene) {
    if (!confirm(`Supprimer "${item.nom}" ?`)) return;

    this.service.delete(item.id).subscribe({
      next: () => this.load(),
      error: () => (this.error = 'Suppression impossible'),
    });
  }
}
