import { Component, effect, signal } from '@angular/core';
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
  loading = signal(false);
  error = signal<string | null>(null);

  lottoPool = [] as Array<number>;

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



}
