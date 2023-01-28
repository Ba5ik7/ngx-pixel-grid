import * as i0 from '@angular/core';
import { InjectionToken, Injectable, Optional, Inject, EventEmitter, Component, ChangeDetectionStrategy, Output, Input, ViewChild, HostListener, NgModule } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import * as i2 from '@angular/cdk/overlay';

const NGX_PIXEL_GRID_OPTIONS = new InjectionToken('NGX_PIXEL_GRID_OPTIONS');
class NgxPixelGridService {
    constructor(options) {
        this.introAnimation = true;
        this.rows = 100;
        this.columns = 100;
        this.gutter = 1;
        this.tileSize = { width: 10, height: 10 };
        this.tileColor = 'rgb(255, 255, 255)';
        this.tileHoverColor = 'rgb(0, 0, 0)';
        if (options) {
            this.introAnimation = options.introAnimation;
            this.rows = options.rows;
            this.columns = options.columns;
            this.gutter = options.gutter;
            this.tileSize = options.tileSize;
            this.tileColor = options.tileColor;
            this.tileHoverColor = options.tileHoverColor;
        }
    }
    mergeTilesMatrix(tilesMatrix, tiles) {
        tiles.forEach((tile) => {
            const tileCoordinates = tile.coordinates;
            const y = tileCoordinates.y;
            const x = tileCoordinates.x;
            tilesMatrix[x][y].isPixel = true;
            tilesMatrix[x][y].img = tile.img;
            tilesMatrix[x][y].color = 'rbg(0, 0, 0)';
            tilesMatrix[x][y].href = tile.href;
            tilesMatrix[x][y].tooltipText = tile.tooltipText;
        });
        return tilesMatrix;
    }
}
NgxPixelGridService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: NgxPixelGridService, deps: [{ token: NGX_PIXEL_GRID_OPTIONS, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
NgxPixelGridService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: NgxPixelGridService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: NgxPixelGridService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [NGX_PIXEL_GRID_OPTIONS]
                }] }]; } });

class PixelGrid {
    constructor(rows, columns, gutter) {
        this.rows = rows;
        this.columns = columns;
        this.gutter = gutter;
    }
    buildTilesMatrix(tileSize, tileColor, tileHoverColor) {
        const tilesMatrix = [];
        for (let row = 0; row < this.rows; row++) {
            tilesMatrix[row] = [];
            for (let column = 0; column < this.columns; column++) {
                tilesMatrix[row][column] = {
                    id: (row * this.columns + column).toString(),
                    isPixel: false,
                    coordinates: {
                        x: (tileSize.width + this.gutter) * column,
                        y: (tileSize.height + this.gutter) * row
                    },
                    size: tileSize,
                    color: tileColor,
                    hoverColor: tileHoverColor,
                    tooltipText: `Tile ${row * this.columns + column}`
                };
            }
        }
        return tilesMatrix;
    }
}

class NgxPixelGridComponent {
    constructor(ngZone, pixelGridService, tooltipOverlay) {
        this.ngZone = ngZone;
        this.pixelGridService = pixelGridService;
        this.tooltipOverlay = tooltipOverlay;
        this.tileClick = new EventEmitter();
        this.handleMouseClick = (event) => {
            const tile = this.whatTileIsMouseOver(event);
            if (tile)
                this.tileClick.emit({ id: tile.id, href: tile.href ?? undefined });
        };
        this.tooltipPortal = new ComponentPortal(NgxPixelGridTooltipComponent);
        this.handleMouseMove = (event) => {
            const tile = this.whatTileIsMouseOver(event);
            if (tile) {
                // If the tile is the same as the one being hovered, do nothing
                if (this.currentTileBeingHovered && this.currentTileBeingHovered.id === tile.id)
                    return;
                // If there is a tile being hovered, reset its color
                if (this.currentTileBeingHovered && this.currentTileBeingHovered.id !== tile.id) {
                    this.currentTileBeingHovered.color = tile.color;
                }
                // If there is a tooltip being shown, destroy it
                if (this.tooltipRef)
                    this.tooltipRef.detach();
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
        };
        this.handleMouseOut = () => {
            // Clean up
            if (this.currentTileBeingHovered)
                this.currentTileBeingHovered.color = this.pixelGridService.tileColor;
            if (this.tooltipRef)
                this.tooltipRef.dispose();
        };
    }
    set pixels(tiles) {
        if (!tiles || !tiles.length)
            return;
        this.pixelGridTilesMatrix = this.pixelGridService.mergeTilesMatrix(this.pixelGridTilesMatrix, tiles);
    }
    onResize() {
        const pixelGridSize = this.getPixelGridSize(this.pixelGridTilesMatrix, this.pixelGrid.gutter);
        this.pixelGridCanvas.nativeElement.width = pixelGridSize.width;
        this.pixelGridCanvas.nativeElement.height = pixelGridSize.height;
    }
    ngAfterViewInit() {
        this.ctx = this.pixelGridCanvas.nativeElement.getContext('2d');
        this.pixelGridCanvasContatiner.nativeElement.style.cursor = 'pointer';
        this.pixelGridCanvas.nativeElement.addEventListener('click', this.handleMouseClick);
        this.pixelGridCanvas.nativeElement.addEventListener('mousemove', this.handleMouseMove);
        this.pixelGridCanvas.nativeElement.addEventListener('mouseout', this.handleMouseOut);
        this.pixelGrid = new PixelGrid(this.pixelGridService.columns, this.pixelGridService.rows, this.pixelGridService.gutter);
        this.pixelGridTilesMatrix = this.pixelGrid.buildTilesMatrix(this.pixelGridService.tileSize, this.pixelGridService.tileColor, this.pixelGridService.tileHoverColor);
        this.onResize();
        this.ngZone.runOutsideAngular(() => this.loop());
    }
    loop() {
        this.pixelGridTilesMatrix.forEach(row => {
            row.forEach(tile => {
                // If the tile is a pixel, then paint base64 image to the ctx
                if (tile.isPixel) {
                    const img = new Image();
                    img.src = tile.img;
                    this.ctx.drawImage(img, tile.coordinates.x, tile.coordinates.y, tile.size.width + 1, tile.size.height + 1);
                    return;
                }
                else {
                    this.ctx.fillStyle = tile.color;
                    this.ctx.fillRect(tile.coordinates.x, tile.coordinates.y, tile.size.width, tile.size.height);
                }
            });
        });
        requestAnimationFrame(() => this.loop());
    }
    getPixelGridSize(pixelGridTilesMatrix, gutter) {
        const width = pixelGridTilesMatrix[0].length * pixelGridTilesMatrix[0][0].size.width + (pixelGridTilesMatrix[0].length - 1) * gutter;
        const height = pixelGridTilesMatrix.length * pixelGridTilesMatrix[0][0].size.height + (pixelGridTilesMatrix.length - 1) * gutter;
        return { width, height };
    }
    whatTileIsMouseOver(event) {
        const rect = this.pixelGridCanvas.nativeElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        let returnTile = undefined;
        for (let i = 0; i < this.pixelGridTilesMatrix.length; i++) {
            for (let j = 0; j < this.pixelGridTilesMatrix[i].length; j++) {
                const tile = this.pixelGridTilesMatrix[i][j];
                if (x >= tile.coordinates.x && x <= tile.coordinates.x + tile.size.width &&
                    y >= tile.coordinates.y && y <= tile.coordinates.y + tile.size.height) {
                    returnTile = tile;
                }
            }
        }
        return returnTile;
    }
}
NgxPixelGridComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: NgxPixelGridComponent, deps: [{ token: i0.NgZone }, { token: NgxPixelGridService }, { token: i2.Overlay }], target: i0.ɵɵFactoryTarget.Component });
NgxPixelGridComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.12", type: NgxPixelGridComponent, selector: "ngx-pixel-grid", inputs: { pixels: "pixels" }, outputs: { tileClick: "tileClick" }, host: { listeners: { "window:resize": "onResize()" } }, viewQueries: [{ propertyName: "pixelGridCanvasContatiner", first: true, predicate: ["pixelGridCanvasContatiner"], descendants: true }, { propertyName: "pixelGridCanvas", first: true, predicate: ["pixelGridCanvas"], descendants: true }], ngImport: i0, template: `
  <div #pixelGridCanvasContatiner class="pixel-grid-canvas-container">
    <canvas #pixelGridCanvas></canvas>
  </div>`, isInline: true, styles: [".pixel-grid-canvas-container{width:100%;height:100%}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: NgxPixelGridComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-pixel-grid', template: `
  <div #pixelGridCanvasContatiner class="pixel-grid-canvas-container">
    <canvas #pixelGridCanvas></canvas>
  </div>`, changeDetection: ChangeDetectionStrategy.OnPush, styles: [".pixel-grid-canvas-container{width:100%;height:100%}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.NgZone }, { type: NgxPixelGridService }, { type: i2.Overlay }]; }, propDecorators: { tileClick: [{
                type: Output
            }], pixels: [{
                type: Input
            }], pixelGridCanvasContatiner: [{
                type: ViewChild,
                args: ['pixelGridCanvasContatiner']
            }], pixelGridCanvas: [{
                type: ViewChild,
                args: ['pixelGridCanvas']
            }], onResize: [{
                type: HostListener,
                args: ['window:resize']
            }] } });
class NgxPixelGridTooltipComponent {
}
NgxPixelGridTooltipComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: NgxPixelGridTooltipComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
NgxPixelGridTooltipComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.12", type: NgxPixelGridTooltipComponent, selector: "ngx-pixel-grid-tooltip", inputs: { text: "text" }, ngImport: i0, template: `<div class="tooltip"><div class="tooltip-content">{{text}}</div></div>`, isInline: true, styles: [":host,.tooltip{pointer-events:none}.tooltip{background-color:#000;color:#fff;padding:5px 10px;border-radius:5px}\n"] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: NgxPixelGridTooltipComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-pixel-grid-tooltip', template: `<div class="tooltip"><div class="tooltip-content">{{text}}</div></div>`, styles: [":host,.tooltip{pointer-events:none}.tooltip{background-color:#000;color:#fff;padding:5px 10px;border-radius:5px}\n"] }]
        }], propDecorators: { text: [{
                type: Input
            }] } });

class NgxPixelGridModule {
}
NgxPixelGridModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: NgxPixelGridModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NgxPixelGridModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.12", ngImport: i0, type: NgxPixelGridModule, declarations: [NgxPixelGridComponent], exports: [NgxPixelGridComponent] });
NgxPixelGridModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: NgxPixelGridModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: NgxPixelGridModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        NgxPixelGridComponent
                    ],
                    imports: [],
                    exports: [
                        NgxPixelGridComponent
                    ]
                }]
        }] });

/*
 * Public API Surface of ngx-pixel-grid
 */

/**
 * Generated bundle index. Do not edit.
 */

export { NGX_PIXEL_GRID_OPTIONS, NgxPixelGridComponent, NgxPixelGridModule, NgxPixelGridService, NgxPixelGridTooltipComponent };
//# sourceMappingURL=tmdjr-ngx-pixel-grid.mjs.map
