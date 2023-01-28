import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  NgZone,
  Output,
  ViewChild
} from '@angular/core';
import { PixelGrid } from './classes/pixel-grid';
import { ISize, ITile } from './interfaces/ngx-pixel-grid';
import { NgxPixelGridService } from './ngx-pixel-grid.service';

@Component({
  selector: 'ngx-pixel-grid',
  template: `
  <div #pixelGridCanvasContatiner class="pixel-grid-canvas-container">
    <canvas #pixelGridCanvas></canvas>
  </div>`,
  styles: ['.pixel-grid-canvas-container { width: 100%; height: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgxPixelGridComponent implements AfterViewInit {

  constructor(
    private ngZone: NgZone,
    private pixelGridService: NgxPixelGridService,
    private tooltipOverlay: Overlay
  ) { }
  
  @Output() tileClick = new EventEmitter<string>();

  @Input() set pixels(tiles: ITile[]) {
    if (!tiles || !tiles.length) return;
    this.pixelGridTilesMatrix = this.pixelGridService.mergeTilesMatrix(
      this.pixelGridTilesMatrix,
      tiles
    );
  }

  @ViewChild('pixelGridCanvasContatiner') pixelGridCanvasContatiner!: ElementRef<HTMLDivElement>;
  @ViewChild('pixelGridCanvas') pixelGridCanvas!: ElementRef<HTMLCanvasElement>;

  ctx!: CanvasRenderingContext2D;
  pixelGrid!: PixelGrid;
  pixelGridTilesMatrix!: ITile[][];

  tooltipRef!: OverlayRef;

  @HostListener('window:resize')
  onResize() {
    const pixelGridSize = this.getPixelGridSize(this.pixelGridTilesMatrix, this.pixelGrid.gutter);
    this.pixelGridCanvas.nativeElement.width = pixelGridSize.width;
    this.pixelGridCanvas.nativeElement.height = pixelGridSize.height;
  }

  ngAfterViewInit(): void {
    this.ctx = this.pixelGridCanvas.nativeElement.getContext('2d')!;

    this.pixelGridCanvasContatiner.nativeElement.style.cursor = 'pointer';
    this.pixelGridCanvas.nativeElement.addEventListener('click', this.handleMouseClick);
    this.pixelGridCanvas.nativeElement.addEventListener('mousemove', this.handleMouseMove);
    this.pixelGridCanvas.nativeElement.addEventListener('mouseout', this.handleMouseOut);

    this.pixelGrid = new PixelGrid(
      this.pixelGridService.columns,
      this.pixelGridService.rows,
      this.pixelGridService.gutter
    );
    this.pixelGridTilesMatrix = this.pixelGrid.buildTilesMatrix(
      this.pixelGridService.tileSize,
      this.pixelGridService.tileColor,
      this.pixelGridService.tileHoverColor
    );

    this.onResize();
    this.ngZone.runOutsideAngular(() => this.loop());
  }
  
  loop() {
    this.pixelGridTilesMatrix.forEach(row => {
      row.forEach(tile => {
        // If the tile is a pixel, then paint base64 image to the ctx
        if (tile.isPixel) {
          const img = new Image();
          img.src = tile.img!;
          this.ctx.drawImage(img, tile.coordinates.x, tile.coordinates.y, tile.size.width + 1, tile.size.height + 1);
          return;
        } else {
          this.ctx.fillStyle = tile.color;
          this.ctx.fillRect(tile.coordinates.x, tile.coordinates.y, tile.size.width, tile.size.height);
        }
      });
    });
    requestAnimationFrame(() => this.loop());
  }

  getPixelGridSize(pixelGridTilesMatrix: ITile[][], gutter: number): ISize {
    const width = pixelGridTilesMatrix[0].length * pixelGridTilesMatrix[0][0].size.width + (pixelGridTilesMatrix[0].length - 1) * gutter;
    const height = pixelGridTilesMatrix.length * pixelGridTilesMatrix[0][0].size.height + (pixelGridTilesMatrix.length - 1) * gutter;
    return { width, height };
  }

  whatTileIsMouseOver(event: MouseEvent): ITile | undefined {
    const rect = this.pixelGridCanvas.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    let returnTile = undefined;
    for(let i = 0; i < this.pixelGridTilesMatrix.length; i++) {
      for(let j = 0; j < this.pixelGridTilesMatrix[i].length; j++) {
        const tile = this.pixelGridTilesMatrix[i][j];
        if (x >= tile.coordinates.x && x <= tile.coordinates.x + tile.size.width &&
          y >= tile.coordinates.y && y <= tile.coordinates.y + tile.size.height) {
            returnTile = tile;
          }
      }
    }
    return returnTile;
  }

  handleMouseClick = (event: MouseEvent) => {
    const tile = this.whatTileIsMouseOver(event);
    if (tile) this.tileClick.emit(tile.id);
  }

  currentTileBeingHovered: ITile | undefined;
  handleMouseMove = (event: MouseEvent) => {
    const tile = this.whatTileIsMouseOver(event);
    if (tile) {
      // If the tile is the same as the one being hovered, do nothing
      if (this.currentTileBeingHovered && this.currentTileBeingHovered.id === tile.id) return;
      // If there is a tile being hovered, reset its color
      if (this.currentTileBeingHovered && this.currentTileBeingHovered.id !== tile.id) {
        this.currentTileBeingHovered.color = tile.color;
      }
      // If there is a tooltip being shown, destroy it
      if (this.tooltipRef) {
        this.tooltipRef.dispose();
      }
      // Set the new tile being hovered
      this.currentTileBeingHovered = tile;
      this.currentTileBeingHovered.color = tile.hoverColor;

      // Create the tooltip strategy
      const positionStrategy = this.tooltipOverlay.position().global();
      positionStrategy.top(`${event.clientY + 15}px`).left(`${event.clientX + 15}px`);
      this.tooltipRef = this.tooltipOverlay.create({
        positionStrategy,
        hasBackdrop: false,
        scrollStrategy: this.tooltipOverlay.scrollStrategies.reposition()
      });

      // Create the tooltip component
      const tooltipPortal = new ComponentPortal(NgxPixelGridTooltipComponent);
      const tooltipComponent = this.tooltipRef.attach(tooltipPortal);
      tooltipComponent.instance.text = tile.id.toString();
    }
  }

  handleMouseOut = () => {
    // Clean up
    if (this.currentTileBeingHovered) this.currentTileBeingHovered.color = this.pixelGridService.tileColor;
    if (this.tooltipRef) this.tooltipRef.dispose();
  }
}


@Component({
  selector: 'ngx-pixel-grid-tooltip',
  template: `<div class="tooltip"><div class="tooltip-content">{{text}}</div></div>`,
  styles: [`
    :host, .tooltip { pointer-events: none; }
    .tooltip { 
      background-color: #000;
      color: #fff;
      padding: 5px 10px;
      border-radius: 5px;
     }
  `],
})
export class NgxPixelGridTooltipComponent {
  @Input() text!: string;
}