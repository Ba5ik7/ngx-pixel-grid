import * as i0 from '@angular/core';
import { InjectionToken, Injectable, Optional, Inject, EventEmitter, Component, ChangeDetectionStrategy, Output, Input, ViewChild, ViewEncapsulation, NgModule } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import * as i2 from '@angular/cdk/overlay';

class Tile {
    constructor(id, isPixel, coordinates, sourceCoordinates, targetCoordinates, size, color, hoverColor, tooltipText) {
        this.id = id;
        this.isPixel = isPixel;
        this.coordinates = coordinates;
        this.sourceCoordinates = sourceCoordinates;
        this.targetCoordinates = targetCoordinates;
        this.size = size;
        this.color = color;
        this.hoverColor = hoverColor;
        this.tooltipText = tooltipText;
    }
}

class PixelGrid {
    constructor(rows, columns, gutter) {
        this.rows = rows;
        this.columns = columns;
        this.gutter = gutter;
        this.tiles = [];
    }
    buildTilesMatrix(tileSize, tileColor, tileHoverColor) {
        const tilesMatrix = [];
        for (let row = 0; row < this.rows; row++) {
            tilesMatrix[row] = [];
            for (let column = 0; column < this.columns; column++) {
                tilesMatrix[row][column] = new Tile((row * this.columns + column).toString(), false, {
                    x: (tileSize.width + this.gutter) * column,
                    y: (tileSize.height + this.gutter) * row
                }, { x: 0, y: 0 }, { x: 0, y: 0 }, tileSize, tileColor, tileHoverColor, `Tile ${row * this.columns + column}`);
                this.tiles.push(tilesMatrix[row][column]);
            }
        }
        return tilesMatrix;
    }
}

const NGX_PIXEL_GRID_OPTIONS = new InjectionToken('NGX_PIXEL_GRID_OPTIONS');
const defaultOptions = {
    introAnimation: true,
    gutter: 1,
    rows: 100,
    columns: 100,
    tileSize: { width: 10, height: 10 },
    tileColor: 'rgb(140, 140, 140)',
    tileHoverColor: 'rgb(70, 70, 70)'
};
class NgxPixelGridService {
    constructor(options) {
        this.options = defaultOptions;
        options && Object.assign(this.options, options);
    }
    createCtx(tilesMatrix, canvas) {
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        const pixelGridSize = this.getPixelGridSize(tilesMatrix, this.options.gutter);
        canvas.width = pixelGridSize.width;
        canvas.height = pixelGridSize.height;
        canvas.style.cursor = 'pointer';
        return ctx;
    }
    buildTilesMatrix() {
        const { columns, rows, gutter, tileSize, tileColor, tileHoverColor } = this.options;
        const pixelGrid = new PixelGrid(columns, rows, gutter);
        const tilesMatrix = pixelGrid.buildTilesMatrix(tileSize, tileColor, tileHoverColor);
        return { pixelGrid, tilesMatrix };
    }
    getPixelGridSize(tilesMatrix, gutter) {
        const width = tilesMatrix[0].length * tilesMatrix[0][0].size.width + (tilesMatrix[0].length - 1) * gutter;
        const height = tilesMatrix.length * tilesMatrix[0][0].size.height + (tilesMatrix.length - 1) * gutter;
        return { width, height };
    }
    mergeTilesMatrix(tilesMatrix, tiles) {
        tiles.forEach((tile) => {
            const img = new Image();
            img.src = tile.base64;
            const tileCoordinates = tile.coordinates;
            const { x, y } = tileCoordinates;
            const _tile = tilesMatrix[x][y];
            Object.assign(_tile, {
                isPixel: true,
                img,
                color: 'rbg(0, 0, 0)',
                href: tile.href,
                tooltipText: tile.tooltipText
            });
        });
        return tilesMatrix;
    }
    whatTileIsMouseOver(tilesMatrix, rect, event) {
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        let returnTile;
        tilesMatrix.forEach((row) => {
            row.forEach((tile) => {
                if (x >= tile.coordinates.x && x <= tile.coordinates.x + tile.size.width &&
                    y >= tile.coordinates.y && y <= tile.coordinates.y + tile.size.height) {
                    returnTile = tile;
                }
            });
        });
        return returnTile;
    }
    phyllotaxisLayout(tiles, xOffset = 0, yOffset = 0, iOffset = 0) {
        // const theta = Math.PI * (6 - Math.sqrt(20));
        // const pointRadius = 7;
        const theta = Math.PI * (3 - Math.sqrt(10));
        const pointRadius = 5;
        tiles.forEach((tile, i) => {
            const index = (i + iOffset) % tiles.length;
            const phylloX = pointRadius * Math.sqrt(index) * Math.cos(index * theta);
            const phylloY = pointRadius * Math.sqrt(index) * Math.sin(index * theta);
            tile.coordinates.x = xOffset + phylloX - pointRadius;
            tile.coordinates.y = yOffset + phylloY - pointRadius;
            tile.size.width = 3;
            tile.size.height = 3;
            // tile.color = `hsla(300, ${~~(40 * Math.random() + 60)}%, ${~~(60 * Math.random() + 20)}%, 1)`;
        });
        return tiles;
    }
    gridLayout(tiles) {
        for (let row = 0; row < this.options.rows; row++) {
            for (let column = 0; column < this.options.columns; column++) {
                const tile = tiles[row * this.options.columns + column];
                tile.coordinates.x = column * (this.options.tileSize.width + this.options.gutter);
                tile.coordinates.y = row * (this.options.tileSize.height + this.options.gutter);
                tile.size.width = 9;
                tile.size.height = 9;
                // tile.color = this.options.tileColor;
            }
        }
        return tiles;
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
function getRandomArbitaryInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class NgxPixelGridComponent {
    constructor(ngZone, pixelGridService, tooltipOverlay) {
        this.ngZone = ngZone;
        this.pixelGridService = pixelGridService;
        this.tooltipOverlay = tooltipOverlay;
        this.tileClick = new EventEmitter();
        this.hasLoadedPixels = false;
        this.tooltipPortal = new ComponentPortal(NgxPixelGridTooltipComponent);
        this.timeDelta = 0.005 * .05;
        this.time = 0;
        this.handleMouseClick = (event) => {
            const rect = this.pixelGridCanvas.nativeElement.getBoundingClientRect();
            const tile = this.pixelGridService.whatTileIsMouseOver(this.tilesMatrix, rect, event);
            tile && this.tileClick.emit({ id: tile.id, href: tile.href ?? undefined });
        };
        this.handleMouseOut = () => {
            if (this.currentTileBeingHovered) {
                this.currentTileBeingHovered.color = this.pixelGridService.options.tileColor;
                this.currentTileBeingHovered = undefined;
            }
            this.tooltipRef.dispose?.();
        };
        this.handleMouseMove = (event) => {
            const rect = this.pixelGridCanvas.nativeElement.getBoundingClientRect();
            const tile = this.pixelGridService.whatTileIsMouseOver(this.tilesMatrix, rect, event);
            if (tile) {
                // Kind of tricky here, want to leave comment for future reference
                // We are just trying to swap out colors of the tile we are hovering on
                // So a refernce is made to the tile we are hovering on and the color is changed
                // If the tile that is currently being hovered on is the same as the tile we are hovering on, return
                if (this.currentTileBeingHovered && this.currentTileBeingHovered.id === tile.id)
                    return;
                // If the tooltip is open, close it
                // !@TODO - Should only detach if the new tile is on same tile group as the last
                if (this.tooltipRef)
                    this.tooltipRef.detach();
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
        };
    }
    set pixels(tiles) {
        if (!tiles || !tiles.length)
            return;
        this.hasLoadedPixels = true;
        requestAnimationFrame(() => {
            this.tilesMatrix = this.pixelGridService.mergeTilesMatrix(this.tilesMatrix, tiles);
        });
    }
    ngOnInit() {
        const { pixelGrid, tilesMatrix } = this.pixelGridService.buildTilesMatrix();
        this.pixelGrid = pixelGrid;
        this.tilesMatrix = tilesMatrix;
    }
    ngAfterViewInit() {
        const canvas = this.pixelGridCanvas.nativeElement;
        this.ctx = this.pixelGridService.createCtx(this.tilesMatrix, canvas);
        canvas.addEventListener('click', this.handleMouseClick);
        canvas.addEventListener('mousemove', this.handleMouseMove);
        canvas.addEventListener('mouseout', this.handleMouseOut);
        this.ngZone.runOutsideAngular(() => requestAnimationFrame(this.loop.bind(this)));
    }
    // switchLayout = true;
    loop(timestamp) {
        this.ctx.clearRect(0, 0, this.pixelGridCanvas.nativeElement.width, this.pixelGridCanvas.nativeElement.height);
        // this.time += this.timeDelta;
        this.time += (Math.sin(this.time) < 0 ? .3 : Math.cos(this.time) > 0.5 ? 0.3 : 0.8) * this.timeDelta;
        if (this.time > 1) {
            this.time = 0;
            // this.switchLayout = !this.switchLayout;
        }
        this.pixelGrid.tiles.forEach(tile => {
            tile.sourceCoordinates.x = tile.coordinates.x;
            tile.sourceCoordinates.y = tile.coordinates.y;
        });
        let tiles = this.pixelGrid.tiles;
        if (this.hasLoadedPixels) {
            tiles = this.pixelGridService.gridLayout(this.pixelGrid.tiles);
        }
        else {
            tiles = this.pixelGridService.phyllotaxisLayout(this.pixelGrid.tiles, this.pixelGridCanvas.nativeElement.width * .5, this.pixelGridCanvas.nativeElement.height * .5);
        }
        tiles.forEach(tile => {
            tile.targetCoordinates.x = tile.coordinates.x;
            tile.targetCoordinates.y = tile.coordinates.y;
            tile.coordinates.x = tile.sourceCoordinates.x * (1 - this.time) + tile.targetCoordinates.x * this.time;
            tile.coordinates.y = tile.sourceCoordinates.y * (1 - this.time) + tile.targetCoordinates.y * this.time;
            if (tile.isPixel) {
                this.ctx.drawImage(tile.img, tile.coordinates.x, tile.coordinates.y, tile.size.width + 1, tile.size.height + 1);
            }
            else {
                this.ctx.fillStyle = tile.color;
                this.ctx.fillRect(tile.coordinates.x, tile.coordinates.y, tile.size.width, tile.size.height);
            }
        });
        requestAnimationFrame(this.loop.bind(this));
    }
}
NgxPixelGridComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: NgxPixelGridComponent, deps: [{ token: i0.NgZone }, { token: NgxPixelGridService }, { token: i2.Overlay }], target: i0.ɵɵFactoryTarget.Component });
NgxPixelGridComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.12", type: NgxPixelGridComponent, selector: "ngx-pixel-grid", inputs: { pixels: "pixels" }, outputs: { tileClick: "tileClick" }, viewQueries: [{ propertyName: "pixelGridCanvasContatiner", first: true, predicate: ["pixelGridCanvasContatiner"], descendants: true }, { propertyName: "pixelGridCanvas", first: true, predicate: ["pixelGridCanvas"], descendants: true }], ngImport: i0, template: `
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
            }] } });
class NgxPixelGridTooltipComponent {
}
NgxPixelGridTooltipComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: NgxPixelGridTooltipComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
NgxPixelGridTooltipComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.12", type: NgxPixelGridTooltipComponent, selector: "ngx-pixel-grid-tooltip", inputs: { text: "text" }, ngImport: i0, template: `<div class="tooltip"><div class="tooltip-content">{{text}}</div></div>`, isInline: true, styles: [".tooltip{background-color:#000;color:#fff;padding:5px 10px;border-radius:5px}\n"], encapsulation: i0.ViewEncapsulation.ShadowDom });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: NgxPixelGridTooltipComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-pixel-grid-tooltip', template: `<div class="tooltip"><div class="tooltip-content">{{text}}</div></div>`, encapsulation: ViewEncapsulation.ShadowDom, styles: [".tooltip{background-color:#000;color:#fff;padding:5px 10px;border-radius:5px}\n"] }]
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
