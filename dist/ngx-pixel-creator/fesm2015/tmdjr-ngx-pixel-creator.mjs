import * as i0 from '@angular/core';
import { Injectable, Component, NgModule } from '@angular/core';

class NgxPixelCreatorService {
    constructor() { }
}
NgxPixelCreatorService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: NgxPixelCreatorService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
NgxPixelCreatorService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: NgxPixelCreatorService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: NgxPixelCreatorService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });

class NgxPixelCreatorComponent {
    constructor() { }
    ngOnInit() {
    }
}
NgxPixelCreatorComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: NgxPixelCreatorComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
NgxPixelCreatorComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.12", type: NgxPixelCreatorComponent, selector: "ngx-pixel-creator", ngImport: i0, template: `
    <p>
      ngx-pixel-creator works!
    </p>
  `, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: NgxPixelCreatorComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-pixel-creator', template: `
    <p>
      ngx-pixel-creator works!
    </p>
  ` }]
        }], ctorParameters: function () { return []; } });

class NgxPixelCreatorModule {
}
NgxPixelCreatorModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: NgxPixelCreatorModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NgxPixelCreatorModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.12", ngImport: i0, type: NgxPixelCreatorModule, declarations: [NgxPixelCreatorComponent], exports: [NgxPixelCreatorComponent] });
NgxPixelCreatorModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: NgxPixelCreatorModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: NgxPixelCreatorModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        NgxPixelCreatorComponent
                    ],
                    imports: [],
                    exports: [
                        NgxPixelCreatorComponent
                    ]
                }]
        }] });

/*
 * Public API Surface of ngx-pixel-creator
 */

/**
 * Generated bundle index. Do not edit.
 */

export { NgxPixelCreatorComponent, NgxPixelCreatorModule, NgxPixelCreatorService };
//# sourceMappingURL=tmdjr-ngx-pixel-creator.mjs.map
