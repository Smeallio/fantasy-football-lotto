import { Injectable } from '@angular/core';
import { supabase } from '../core/supabase-client';
import { LeagueMember } from '../models/member';

@Injectable({
  providedIn: 'root'
})
export class MembersApi {
    private readonly tableName = 'league-members';
    
    async getAllMembers(): Promise<LeagueMember[]> {
        const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .order('id', { ascending: true });
    
        if (error) {
        console.error('Error fetching members:', error);
        throw error;
        }
    
        return data || [];
    }
    }