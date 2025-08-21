import { Component, computed, effect, signal } from '@angular/core';
import { MembersApi } from './services/members.api';
import { RouterOutlet } from '@angular/router';
import { LeagueMember, RevealedPick } from './models/member';

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
  loading = signal(false);
  error = signal<string | null>(null);

  running = signal(false);
  revealedPicks = signal<RevealedPick[]>([]);

  lottoPool: number[] = [];
  draftOrder: number[] = [];

  private byId = computed(
    () => new Map(this.members().map((member) => [member.id, member]))
  );

  constructor(private membersApi: MembersApi) {
    this.refresh();
  }

  async refresh() {
    this.loading.set(true);
    this.error.set(null);
    try {
      this.members.set(await this.membersApi.getAllMembers());
      this.lottoPool = this.buildLotteryPool(this.members());
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

  async generateDraftOrder(delayMs = 3000) {
    if (this.running() || this.loading() || !this.members().length) return;

    this.running.set(true);
    this.revealedPicks.set([]);

    let pool = this.buildLotteryPool(this.members());

    this.draftOrder = [];

    while (pool.length) {
      const randomIndex = Math.floor(Math.random() * pool.length);
      const pick = pool[randomIndex];
      this.draftOrder.push(pick);
      pool = pool.filter((id) => id !== pick);
    }

    let reverseDraftOrder = [...this.draftOrder].reverse();

    while (reverseDraftOrder.length) {
      const pickNumber = reverseDraftOrder.length;
      const id = reverseDraftOrder[0];
      const team = this.byId().get(id) ?? null;
      if (team) {
        this.revealedPicks.update((picks) => [...picks, { pickNumber, member: team }]);
      }
      reverseDraftOrder.shift();
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    this.running.set(false);
  }

  reset() {
    this.running.set(false);
    this.revealedPicks.set([]);
    this.draftOrder = [];
    this.lottoPool = this.buildLotteryPool(this.members());
    this.error.set(null);
    console.log('Reset complete');
  }
}
