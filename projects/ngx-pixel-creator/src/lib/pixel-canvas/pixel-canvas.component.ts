import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'pixel-canvas',
  templateUrl: './pixel-canvas.component.html',
  styleUrls: ['./pixel-canvas.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PixelCanvasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
