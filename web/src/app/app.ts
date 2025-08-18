import { Component, effect, signal } from '@angular/core';
import { MembersApi } from './services/members.api';
import { RouterOutlet } from '@angular/router';
import { LeagueMember } from './models/member';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgIf, NgFor, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Maddswack 2025 Draft Lottery');

  members = signal<LeagueMember[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

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
    } catch (err: any) {
      this.error.set(err?.message ?? "Failed to load league members");
    } finally {
      this.loading.set(false);
    } 
  }
}
