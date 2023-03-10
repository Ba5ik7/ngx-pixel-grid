import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { PixelGrid } from './classes/pixel-grid';
import { ITile, ITileClickEvent } from './interfaces/ngx-pixel-grid';
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

  hasLoadedPixels = false;
  @Input() set pixels(tiles: ITile[]) {
    if (!tiles || !tiles.length) return;
    this.hasLoadedPixels = true;
    requestAnimationFrame(() => {
      this.tilesMatrix = this.pixelGridService.mergeTilesMatrix(this.tilesMatrix, tiles);
    });
  }

  // @ViewChild('pixelGridCanvasContatiner') pixelGridCanvasContatiner!: ElementRef<HTMLDivElement>;
  @ViewChild('pixelGridCanvas') pixelGridCanvas!: ElementRef<HTMLCanvasElement>;

  ctx!: CanvasRenderingContext2D;
  pixelGrid!: PixelGrid;
  tilesMatrix!: ITile[][];

  tooltipRef!: OverlayRef;
  tooltipPortal = new ComponentPortal(NgxPixelGridTooltipComponent);

  ngOnInit(): void {    
    const { pixelGrid, tilesMatrix } = this.pixelGridService.buildTilesMatrix();
    this.pixelGrid = pixelGrid;
    this.tilesMatrix = tilesMatrix;
  }

  ngAfterViewInit(): void {
    const canvas = this.pixelGridCanvas.nativeElement;
    this.ctx = this.pixelGridService.createCtx(this.tilesMatrix, canvas);
    canvas.addEventListener('click', this.handleMouseClick);
    canvas.addEventListener('mousemove', this.handleMouseMove);
    canvas.addEventListener('mouseout', this.handleMouseOut);
    
    this.ngZone.runOutsideAngular(() => requestAnimationFrame(this.loop.bind(this)));
  }
  

  // timeDelta = 0.005 * .05;
  // time = 0;
  // switchLayout = true;
  loop(timestamp: number): void {
    
    this.ctx.clearRect(0, 0, this.pixelGridCanvas.nativeElement.width, this.pixelGridCanvas.nativeElement.height);
    // this.time += this.timeDelta;
    // this.time += (Math.sin(this.time) < 0 ? .3 : Math.cos(this.time) > 0.5 ? 0.3 : 0.8) * this.timeDelta;
    
    // if (this.time > 1) {
    //   this.time = 0;
    //   // this.switchLayout = !this.switchLayout;
    // }
      
    // this.pixelGrid.tiles.forEach(tile => {
    //   tile.sourceCoordinates.x = tile.coordinates.x;
    //   tile.sourceCoordinates.y = tile.coordinates.y;
    // });


    // let tiles = this.pixelGridService.gridLayout(this.pixelGrid.tiles);
    // let tiles = this.pixelGrid.tiles;
    // if(this.hasLoadedPixels) {
    //   tiles = this.pixelGridService.gridLayout(this.pixelGrid.tiles);
    // } else {
    //   tiles = this.pixelGridService.phyllotaxisLayout(
    //     this.pixelGrid.tiles,
    //     this.pixelGridCanvas.nativeElement.width * .5,
    //     this.pixelGridCanvas.nativeElement.height * .5
    //   );
    // }

    this.pixelGrid.tiles.forEach(tile => {
    // tiles.forEach(tile => {
      // tile.targetCoordinates.x = tile.coordinates.x;
      // tile.targetCoordinates.y = tile.coordinates.y;
      // tile.coordinates.x = tile.sourceCoordinates.x * (1 - this.time) + tile.targetCoordinates.x * this.time;
      // tile.coordinates.y = tile.sourceCoordinates.y * (1 - this.time) + tile.targetCoordinates.y * this.time;
      if (tile.isPixel) {
        this.ctx.drawImage(tile.img!, tile.coordinates.x, tile.coordinates.y, tile.size.width + 1, tile.size.height + 1);
      } else {
        this.ctx.fillStyle = tile.color;
        this.ctx.fillRect(tile.coordinates.x, tile.coordinates.y, tile.size.width, tile.size.height);
      }
    });   
    requestAnimationFrame(this.loop.bind(this));
  }

  handleMouseClick = (event: MouseEvent) => {
    const rect = this.pixelGridCanvas.nativeElement.getBoundingClientRect();
    const tile = this.pixelGridService.whatTileIsMouseOver(this.tilesMatrix, rect, event);
    tile && this.tileClick.emit({ id: tile.id, href: tile.href ?? undefined });
  }

  handleMouseOut = () => {
    if (this.currentTileBeingHovered) {
      this.currentTileBeingHovered.color = this.pixelGridService.options.tileColor;
      this.currentTileBeingHovered = undefined;
    }
    this.tooltipRef.dispose?.();
  }

  currentTileBeingHovered: ITile | undefined;
  handleMouseMove = (event: MouseEvent) => {
    const rect = this.pixelGridCanvas.nativeElement.getBoundingClientRect();
    const tile = this.pixelGridService.whatTileIsMouseOver(this.tilesMatrix, rect, event);
    if (tile) {
      // Kind of tricky here, want to leave comment for future reference
      // We are just trying to swap out colors of the tile we are hovering on
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

      // Set the reference to the tile we are hovering on
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
  encapsulation: ViewEncapsulation.ShadowDom
})
export class NgxPixelGridTooltipComponent { @Input() text!: string; }
