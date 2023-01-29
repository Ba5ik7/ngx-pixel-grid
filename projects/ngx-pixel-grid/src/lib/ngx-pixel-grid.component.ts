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
import { ISize, ITile, ITileClickEvent } from './interfaces/ngx-pixel-grid';
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
  
  @Output() tileClick = new EventEmitter<ITileClickEvent>();

  @Input() set pixels(tiles: ITile[]) {
    if (!tiles || !tiles.length) return;
    this.tilesMatrix = this.pixelGridService.mergeTilesMatrix(
      this.tilesMatrix,
      tiles
    );
  }

  @ViewChild('pixelGridCanvasContatiner') pixelGridCanvasContatiner!: ElementRef<HTMLDivElement>;
  @ViewChild('pixelGridCanvas') pixelGridCanvas!: ElementRef<HTMLCanvasElement>;

  ctx!: CanvasRenderingContext2D;
  pixelGrid!: PixelGrid;
  tilesMatrix!: ITile[][];

  tooltipRef!: OverlayRef;

  @HostListener('window:resize')
  onResize() {
    const pixelGridSize = this.pixelGridService
      .getPixelGridSize(this.tilesMatrix, this.pixelGrid.gutter);
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
    this.tilesMatrix = this.pixelGrid.buildTilesMatrix(
      this.pixelGridService.tileSize,
      this.pixelGridService.tileColor,
      this.pixelGridService.tileHoverColor
    );

    this.onResize();
    this.ngZone.runOutsideAngular(() => this.loop());
  }
  
  loop() {
    
    // this.ctx.save();
    // this.ctx.clearRect(0, 0, this.pixelGridCanvas.nativeElement.width, this.pixelGridCanvas.nativeElement.height);

    this.tilesMatrix.forEach(row => {
      row.forEach(tile => {
        // If the tile is a pixel, then paint base64 image to the ctx
        if (tile.isPixel) {
          const img = new Image();
          img.src = tile.img!;
          this.ctx.drawImage(img, tile.coordinates.x, tile.coordinates.y, tile.size.width + 1, tile.size.height + 1);
        } else {
          this.ctx.fillStyle = tile.color;
          this.ctx.fillRect(tile.coordinates.x, tile.coordinates.y, tile.size.width, tile.size.height);
        }
      });
    });

    // this.ctx.restore();
    requestAnimationFrame(() => this.loop());
  }

  handleMouseClick = (event: MouseEvent) => {
    const tile = this.pixelGridService.whatTileIsMouseOver(event, this.tilesMatrix, event);
    if (tile) this.tileClick.emit({ id: tile.id, href: tile.href ?? undefined });
  }

  currentTileBeingHovered: ITile | undefined;
  tooltipPortal = new ComponentPortal(NgxPixelGridTooltipComponent);
  handleMouseMove = (event: MouseEvent) => {
    const rect = this.pixelGridCanvas.nativeElement.getBoundingClientRect();
    const tile = this.pixelGridService.whatTileIsMouseOver(this.tilesMatrix, rect, event);
    if (tile) {
      // If the tile is the same as the one being hovered, do nothing
      if (this.currentTileBeingHovered && this.currentTileBeingHovered.id === tile.id) return;
      // If there is a tile being hovered, reset its color
      if (this.currentTileBeingHovered && this.currentTileBeingHovered.id !== tile.id) {
        this.currentTileBeingHovered.color = tile.color;
      }
      // If there is a tooltip being shown, destroy it
      if (this.tooltipRef) this.tooltipRef.detach();
      
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
      const tooltipComponent = this.tooltipRef.attach(this.tooltipPortal);
      tooltipComponent.instance.text = tile.tooltipText ?? tile.id.toString();
    }
  }

  handleMouseOut = () => {
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