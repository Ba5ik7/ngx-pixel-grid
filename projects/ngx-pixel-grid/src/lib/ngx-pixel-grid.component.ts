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
  tooltipPortal = new ComponentPortal(NgxPixelGridTooltipComponent);

  @HostListener('window:resize')
  onResize() {
    const pixelGridSize = this.pixelGridService.getPixelGridSize(this.tilesMatrix, this.pixelGrid.gutter);
    this.pixelGridCanvas.nativeElement.width = pixelGridSize.width;
    this.pixelGridCanvas.nativeElement.height = pixelGridSize.height;
  }

  ngOnInit(): void {    
    const { pixelGrid, tilesMatrix } = this.pixelGridService.buildTilesMatrix();
    this.pixelGrid = pixelGrid;
    this.tilesMatrix = tilesMatrix;
  }

  ngAfterViewInit(): void {
    this.ctx = this.pixelGridCanvas.nativeElement.getContext('2d')!;
    const nativeElement = this.pixelGridCanvas.nativeElement;
    nativeElement.style.cursor = 'pointer';
    nativeElement.addEventListener('click', this.handleMouseClick);
    nativeElement.addEventListener('mousemove', this.handleMouseMove);
    nativeElement.addEventListener('mouseout', this.handleMouseOut);

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
    const rect = this.pixelGridCanvas.nativeElement.getBoundingClientRect();
    const tile = this.pixelGridService.whatTileIsMouseOver(this.tilesMatrix, rect, event);
    if (tile) this.tileClick.emit({ id: tile.id, href: tile.href ?? undefined });
  }

  currentTileBeingHovered: ITile | undefined;
  handleMouseMove = (event: MouseEvent) => {
    const rect = this.pixelGridCanvas.nativeElement.getBoundingClientRect();
    const tile = this.pixelGridService.whatTileIsMouseOver(this.tilesMatrix, rect, event);
    if (tile) {
      if (this.currentTileBeingHovered && this.currentTileBeingHovered.id === tile.id) return;
      if (this.tooltipRef) this.tooltipRef.detach();
      if (this.currentTileBeingHovered && this.currentTileBeingHovered.id !== tile.id) {
        this.currentTileBeingHovered.color = tile.color;
      }

      this.currentTileBeingHovered = tile;
      this.currentTileBeingHovered.color = tile.hoverColor;

      const positionStrategy = this.tooltipOverlay.position().global();
      positionStrategy.top(`${event.clientY + 15}px`).left(`${event.clientX + 15}px`);
      this.tooltipRef = this.tooltipOverlay.create({
        positionStrategy,
        hasBackdrop: false,
        scrollStrategy: this.tooltipOverlay.scrollStrategies.reposition()
      });

      const tooltipComponent = this.tooltipRef.attach(this.tooltipPortal);
      tooltipComponent.instance.text = tile.tooltipText ?? tile.id.toString();
    }
  }

  handleMouseOut = () => {
    if (this.currentTileBeingHovered) this.currentTileBeingHovered.color = this.pixelGridService.options.tileColor;
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