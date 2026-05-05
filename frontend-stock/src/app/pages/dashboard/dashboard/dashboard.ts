import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { DashboardService } from '../../../core/services/dashboard';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DecimalPipe, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  loading = false;

  cards = {
    nombreArticles: 0,
    nombreFichesTechniques: 0,
    nombreVentesJour: 0,
    nombreVentesMois: 0,
    totalVentesJour: 0,
    totalVentesMois: 0,
    coutMatiere: 0,
  };

  stockFaible: any[] = [];
  derniersMouvements: any[] = [];
  ventesParJour: any[] = [];
  ventesParFt: any[] = [];
  historiqueVentesFt: any[] = [];
  selectedFtId: number | null = null;

  constructor(
    private service: DashboardService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;

    this.service.getStats().subscribe({
      next: (res) => {
        this.cards = res?.cards ?? this.cards;
        this.stockFaible = res?.stockFaible ?? [];
        this.derniersMouvements = res?.derniersMouvements ?? [];
        this.ventesParJour = res?.ventesParJour ?? [];
        this.ventesParFt = res?.ventesParFt ?? [];
        this.historiqueVentesFt = res?.historiqueVentesFt ?? [];
        this.selectedFtId = this.ventesParFt[0]?.ftId ?? null;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  maxVenteJour() {
    return Math.max(...this.ventesParJour.map((v) => Number(v.total || 0)), 1);
  }

  barWidth(total: number) {
    return `${(Number(total || 0) / this.maxVenteJour()) * 100}%`;
  }

  get ventesFtFiltrees() {
    if (!this.selectedFtId) return this.historiqueVentesFt;

    return this.historiqueVentesFt.filter((x) => Number(x.ftId) === Number(this.selectedFtId));
  }

  selectFtSlice(ftId: number) {
    this.selectedFtId = ftId;
  }

  get totalVentesFt() {
    return this.ventesParFt.reduce((sum, x) => sum + Number(x.total || 0), 0);
  }

  donutOffset(index: number): number {
    const total = this.totalVentesFt || 1;

    return this.ventesParFt
      .slice(0, index)
      .reduce((sum, x) => sum + (Number(x.total || 0) / total) * 100, 0);
  }

  donutValue(item: any): number {
    const total = this.totalVentesFt || 1;
    return (Number(item.total || 0) / total) * 100;
  }
}
