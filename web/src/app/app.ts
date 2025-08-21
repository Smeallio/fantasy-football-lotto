import { Component, computed, effect, signal } from '@angular/core';
import { MembersApi } from './services/members.api';
import { RouterOutlet } from '@angular/router';
import { LeagueMember } from './models/member';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('Maddswack 2025 Draft Lottery');

  members = signal<LeagueMember[]>([]);
  reveal = signal(false);
  currentPickNumber = signal<number | null>(null);
  currentPick = signal<LeagueMember | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  lottoPool: number[] = [];
  draftOrder: number[] = [];
  // reverseDraftOrder = [] as Array<number>;

  private byId = computed(() => new Map(this.members().map(member => [member.id, member])));

  constructor(private membersApi: MembersApi) {
    effect(() => {
      console.log('Members updated:', this.members());
    });
    this.refresh();
  }

  async refresh() {
    this.loading.set(true);
    this.error.set(null);
    try {
      this.members.set(await this.membersApi.getAllMembers());
      this.lottoPool = this.buildLotteryPool(this.members());
      console.log('Lottery Pool:', this.lottoPool);
    } catch (err: any) {
      this.error.set(err?.message ?? 'Failed to load league members');
    } finally {
      this.loading.set(false);
    }
  }

  buildLotteryPool(members: LeagueMember[]): Array<number> {
    return members.flatMap((member) => {
      return Array.from({ length: member.lotto_balls }, () => member.id);
    });
  }

  generateDraftOrder() {
    this.draftOrder = [];
    while (this.lottoPool.length) {
      const randomIndex = Math.floor(Math.random() * this.lottoPool.length);
      const pick = this.lottoPool[randomIndex];
      this.draftOrder.push(pick);
      this.lottoPool = this.lottoPool.filter(id => id !== pick);
      console.log(`Picked member ID: ${pick}`);
      console.log(`Remaining pool: ${this.lottoPool.length} members`);
    }
    console.log('Draft Order:', this.draftOrder);
  }

  async revealDraftOrder(delayMs = 3000) {
    if (this.reveal() || !this.draftOrder.length) return;
    this.reveal.set(true);
    let reverseDraftOrder = [...this.draftOrder].reverse();
    while (reverseDraftOrder.length) {
      const pickNumber = reverseDraftOrder.length;
      const id = reverseDraftOrder[0];
      const team = this.byId().get(id) ?? null;

    this.currentPickNumber.set(pickNumber);
    this.currentPick.set(team);
    reverseDraftOrder.shift()

    await new Promise(resolve => setTimeout(resolve, delayMs));
  }

  this.currentPickNumber.set(null);
  this.currentPick.set(null);
  this.reveal.set(false);
  }

}
