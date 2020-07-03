import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Countries } from '../interfaces/countries.enum';
import { SquadNumber } from '../interfaces/squadNumber.enum';
import { PlayerService } from '../services/player.service';
import { TeamService } from '../services/team.service';
import { take } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { Player } from '../interfaces/player';

@Component({
  selector: 'app-player-dialog',
  templateUrl: './player-dialog.component.html',
  styleUrls: ['./player-dialog.component.scss'],
})
export class PlayerDialogComponent implements OnInit {
  @Input() public player: Player;
  @Output() closeDialog: EventEmitter<boolean> = new EventEmitter();

  private team;
  public countries = Object.keys(Countries).map((key) => ({
    label: key,
    key: Countries[key],
  }));

  // public squadNumber = Object.keys(SquadNumber).slice(
  //   Object.keys(SquadNumber).length / 2
  // );
  public squadNumber = Object.keys(SquadNumber).map((key) => ({
    label: key,
    key: SquadNumber[key],
  }));

  constructor(
    private playerService: PlayerService,
    private teamService: TeamService
  ) {}

  ngOnInit(): void {
    this.teamService
      .getTeams()
      .pipe(take(1))
      .subscribe((teams) => {
        if (teams.length > 0) {
          this.team = teams[0];
        }
      });
  }

  private newPlayer(playerFormValue) {
    const key = this.playerService.addPlayer(playerFormValue);
    const playerFormValueKey = {
      ...playerFormValue,
      key,
    };
    const formattedTeam = {
      ...this.team,
      players: [
        ...(this.team.players ? this.team.players : []),
        playerFormValueKey,
      ],
    };
    this.teamService.editTeam(formattedTeam);
  }

  private editPlayer(playerFormValue) {
    const playerFormValueWithKey = {
      ...playerFormValue,
      $key: this.player.$key,
    };
    const playerFormValueWithFormattedKey = {
      ...playerFormValue,
      key: this.player.$key,
    };
    delete playerFormValueWithFormattedKey.$key;
    const moddifiedPlayers = this.team.players
      ? this.team.players.map((player) => {
          return player.key === this.player.$key
            ? playerFormValueWithFormattedKey
            : player;
        })
      : this.team.players;

    const formattedTeam = {
      ...this.team,
      players: [
        ...(moddifiedPlayers
          ? moddifiedPlayers
          : [playerFormValueWithFormattedKey]),
      ],
    };
    this.playerService.editPlayer(playerFormValueWithKey);
    this.teamService.editTeam(formattedTeam);
  }

  onSubmit(playerForm: NgForm) {
    const playerFormValue = { ...playerForm.value };
    if (playerForm.valid) {
      playerFormValue.leftFooted =
        playerFormValue.leftFooted === '' ? false : playerFormValue.leftFooted;
    }
    if (this.player) {
      this.editPlayer(playerFormValue);
    } else {
      this.newPlayer(playerFormValue);
    }
    window.location.replace('#');
  }

  onClose() {
    this.closeDialog.emit(true);
  }
}
