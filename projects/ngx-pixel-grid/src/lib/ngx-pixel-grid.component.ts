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
    this.tilesMatrix.forEach(row => {
      row.forEach(tile => {
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

    requestAnimationFrame(() => this.loop());
  }

  handleMouseClick = (event: MouseEvent) => {
    const rect = this.pixelGridCanvas.nativeElement.getBoundingClientRect();
    const tile = this.pixelGridService.whatTileIsMouseOver(this.tilesMatrix, rect, event);
    if (tile) this.tileClick.emit({ id: tile.id, href: tile.href ?? undefined });
  }

  handleMouseOut = () => {
    if (this.currentTileBeingHovered) this.currentTileBeingHovered.color = this.pixelGridService.options.tileColor;
    if (this.tooltipRef) this.tooltipRef.dispose();
  }

  currentTileBeingHovered: ITile | undefined;
  handleMouseMove = (event: MouseEvent) => {
    const rect = this.pixelGridCanvas.nativeElement.getBoundingClientRect();
    const tile = this.pixelGridService.whatTileIsMouseOver(this.tilesMatrix, rect, event);
    if (tile) {
      // Kind of tricky here want to leave comment for future reference
      // We are just trying swap out colors of the tile we are hovering on
      // So a refernce is made to the tile we are hovering on and the color is changed
      // If the tile that is currently being hovered on is the same as the tile we are hovering on, return
      if (this.currentTileBeingHovered && this.currentTileBeingHovered.id === tile.id) return;
      // If the tooltip is open, close it
      // !@TODO - Should only detach if the new tile is on same tile group as the last
      if (this.tooltipRef) this.tooltipRef.detach();
      // If the tile that is currently being hovered on is different than the tile we are hovering on, 
      // we need to change the color back to the original color
      if (this.currentTileBeingHovered && this.currentTileBeingHovered.id !== tile.id) {
        this.currentTileBeingHovered.color = tile.color;
      }

      // Set the currentTileBeingHovered to the tile we are hovering on
      this.currentTileBeingHovered = tile;

      // Change the color of the tile we are hovering on to the hover color
      this.currentTileBeingHovered.color = tile.hoverColor;

      const positionStrategy = this.tooltipOverlay
      .position().global()
      .top(`${event.clientY + 15}px`)
      .left(`${event.clientX + 15}px`);

      this.tooltipRef = this.tooltipOverlay.create({
        positionStrategy,
        hasBackdrop: false,
        scrollStrategy: this.tooltipOverlay.scrollStrategies.close()
      });

      const tooltipComponent = this.tooltipRef.attach(this.tooltipPortal);
      tooltipComponent.instance.text = tile.tooltipText ?? tile.id.toString();
    }
  }
}

@Component({
  selector: 'ngx-pixel-grid-tooltip',
  template: `<div class="tooltip"><div class="tooltip-content">{{text}}</div></div>`,
  styles: [`.tooltip {  background-color: #000; color: #fff; padding: 5px 10px; border-radius: 5px; }`],
})
export class NgxPixelGridTooltipComponent { @Input() text!: string; }
