import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-pixel-creator',
  template: `
  <div class="pixel-creator-container">
    <pixel-canvas></pixel-canvas>
  </div>`,
  styles: ['.pixel-grid-canvas-container { width: 100%; height: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgxPixelCreatorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

  }
}
