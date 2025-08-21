export interface LeagueMember {
    id: number;
    created_at: string;
    team_name: string;
    team_image: string | null;
    lotto_balls: number;
}

export type RevealedPick = {
    pickNumber: number;
    member: LeagueMember;
};