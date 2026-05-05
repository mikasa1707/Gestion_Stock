import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Fournisseur, FournisseursService } from '../../core/services/fournisseurs';

@Component({
  selector: 'app-fournisseurs',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './fournisseurs.html',
  styleUrl: './fournisseurs.scss',
})
export class Fournisseurs implements OnInit {
  items: Fournisseur[] = [];
  search = '';
  loading = false;
  saving = false;
  selectedId: number | null = null;

  form: Fournisseur = this.emptyForm();

  constructor(private service: FournisseursService,
      private cdr: ChangeDetectorRef,) {}

  ngOnInit() {
    this.load();
  }

  emptyForm(): Fournisseur {
    return {
      nom: '',
      contact: '',
      telephone: '',
      email: '',
      adresse: '',
      actif: true,
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

  filteredItems() {
    const q = this.search.toLowerCase();

    return this.items.filter(
      (x) =>
        (x.nom || '').toLowerCase().includes(q) ||
        (x.telephone || '').toLowerCase().includes(q) ||
        (x.email || '').toLowerCase().includes(q),
    );
  }

  openCreateModal() {
    this.selectedId = null;
    this.form = this.emptyForm();
  }

  openEditModal(item: Fournisseur) {
    this.selectedId = item.id ?? null;
    this.form = { ...item };
  }

  save() {
    this.saving = true;

    const payload: Fournisseur = {
      nom: this.form.nom,
      contact: this.form.contact ?? '',
      telephone: this.form.telephone ?? '',
      email: this.form.email ?? '',
      adresse: this.form.adresse ?? '',
      actif: this.form.actif ?? true,
    };

    const req = this.selectedId
      ? this.service.update(this.selectedId, payload)
      : this.service.create(payload);

    req.subscribe({
      next: () => {
        this.saving = false;
        this.load();

        const modalEl = document.getElementById('fournisseurModal');
        const modal = (window as any).bootstrap?.Modal.getInstance(modalEl);
        modal?.hide();
      },
      error: (err) => {
        this.saving = false;
        console.error(err);
      },
    });
  }

  remove(item: Fournisseur) {
    if (!item.id) return;
    if (!confirm(`Supprimer ${item.nom} ?`)) return;

    this.service.delete(item.id).subscribe(() => this.load());
  }
}
