import { GameState, Winner } from "@shared/types/Game";
import { SnekProcessor } from "./SnekProcessor";

export class TeamSnekProcessor extends SnekProcessor {
  private maxTurns: number;

  constructor(gameState: GameState) {
    super(gameState);
    this.maxTurns = gameState.setup.maxTurns || 100;
  }

  // Override calculateWinners to end game when maxTurns is reached
  protected calculateWinners(gameState: any): Winner[] {
    const currentTurnNumber = this.gameState.turns.length;
    
    // If maxTurns reached, end the game and calculate winners
    if (currentTurnNumber >= this.maxTurns) {
      return this.calculateSurvivalWinners(gameState);
    }

    // If only one team is alive, return the team as the winner
    const aliveTeams = this.getAliveTeams(gameState);
    if (aliveTeams.length === 1) {
      return this.calculateTeamWinners(aliveTeams[0], gameState);
    }
      
    // Otherwise, use parent logic (only end if 1 or fewer players alive)
    return super.calculateWinners(gameState);
  }

  private getAliveTeams(gameState: any): string[] {
    const aliveTeams = new Set<string>();
    
    gameState.newAlivePlayers.forEach((playerID: string) => {
      const player = this.gameSetup.gamePlayers.find(p => p.id === playerID);
      if (player && player.teamID) {
        aliveTeams.add(player.teamID);
      }
    });
    
    return Array.from(aliveTeams);
  }

  private calculateTeamWinners(teamID: string, gameState: any): Winner[] {
    const teamPlayers = this.gameSetup.gamePlayers.filter(player => player.teamID === teamID);
    
    return teamPlayers.map(player => ({
      playerID: player.id,
      score: gameState.newSnakes[player.id]?.length || 0,
      winningSquares: gameState.newSnakes[player.id] || [],
      teamID: teamID
    }));
  }
}
