import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { AfterViewInit, ElementRef, EventEmitter, NgZone } from '@angular/core';
import { PixelGrid } from './classes/pixel-grid';
import { ITile, ITileClickEvent } from './interfaces/ngx-pixel-grid';
import { NgxPixelGridService } from './ngx-pixel-grid.service';
import * as i0 from "@angular/core";
export declare class NgxPixelGridComponent implements AfterViewInit {
    private ngZone;
    private pixelGridService;
    private tooltipOverlay;
    constructor(ngZone: NgZone, pixelGridService: NgxPixelGridService, tooltipOverlay: Overlay);
    tileClick: EventEmitter<ITileClickEvent>;
    set pixels(tiles: ITile[]);
    pixelGridCanvasContatiner: ElementRef<HTMLDivElement>;
    pixelGridCanvas: ElementRef<HTMLCanvasElement>;
    ctx: CanvasRenderingContext2D;
    pixelGrid: PixelGrid;
    tilesMatrix: ITile[][];
    tooltipRef: OverlayRef;
    tooltipPortal: ComponentPortal<NgxPixelGridTooltipComponent>;
    onResize(): void;
    ngAfterViewInit(): void;
    loop(): void;
    handleMouseClick: (event: MouseEvent) => void;
    currentTileBeingHovered: ITile | undefined;
    handleMouseMove: (event: MouseEvent) => void;
    handleMouseOut: () => void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxPixelGridComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgxPixelGridComponent, "ngx-pixel-grid", never, { "pixels": "pixels"; }, { "tileClick": "tileClick"; }, never, never, false>;
}
export declare class NgxPixelGridTooltipComponent {
    text: string;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxPixelGridTooltipComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgxPixelGridTooltipComponent, "ngx-pixel-grid-tooltip", never, { "text": "text"; }, {}, never, never, false>;
}
//# sourceMappingURL=ngx-pixel-grid.component.d.ts.map