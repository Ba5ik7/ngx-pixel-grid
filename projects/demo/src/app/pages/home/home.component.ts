import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ITileClickEvent } from 'ngx-pixel-grid';
import { map } from 'rxjs';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(private homeService: HomeService, public dialog: MatDialog) { }

  pixels$ = this.homeService.pixels$
  .pipe(
    map((result) => {
      result.listPixelBlocks.items.forEach((item: any) => {
        item.coordinates = { x: item.i, y: item.j };
        item.tooltipText = item.hoverDisplay
      });
      return result.listPixelBlocks.items;
    })
  );

  loadPixels() {
    this.homeService.loadPixels();
  }

  tileClick(tileClickEvent: ITileClickEvent) {
    console.log(tileClickEvent.id);
    tileClickEvent.href ? 
      window.open(tileClickEvent.href, '_blank') :
      this.dialog.open(DialogOverviewExampleDialog, {
        data: tileClickEvent,
      }).afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
      });
    }
}


@Component({
  selector: 'dialog-overview-example-dialog',
  template: `
  <h1 mat-dialog-title>Hi tile {{data.id}}</h1>
  <div mat-dialog-actions>
    <button mat-button (click)="onNoClick()">No Thanks</button>
    <button mat-button [mat-dialog-close]="data.id" cdkFocusInitial>Ok</button>
  </div>
  `,
})
export class DialogOverviewExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ITileClickEvent,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}