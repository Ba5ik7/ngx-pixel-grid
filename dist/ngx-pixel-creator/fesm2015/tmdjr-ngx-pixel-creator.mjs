import * as i0 from '@angular/core';
import { Injectable, Component, NgModule } from '@angular/core';

class NgxPixelCreatorService {
    constructor() { }
}
NgxPixelCreatorService.ɵfac = function NgxPixelCreatorService_Factory(t) { return new (t || NgxPixelCreatorService)(); };
NgxPixelCreatorService.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: NgxPixelCreatorService, factory: NgxPixelCreatorService.ɵfac, providedIn: 'root' });
(function () {
    (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NgxPixelCreatorService, [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], function () { return []; }, null);
})();

class NgxPixelCreatorComponent {
    constructor() { }
    ngOnInit() {
    }
}
NgxPixelCreatorComponent.ɵfac = function NgxPixelCreatorComponent_Factory(t) { return new (t || NgxPixelCreatorComponent)(); };
NgxPixelCreatorComponent.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: NgxPixelCreatorComponent, selectors: [["ngx-pixel-creator"]], decls: 2, vars: 0, template: function NgxPixelCreatorComponent_Template(rf, ctx) {
        if (rf & 1) {
            i0.ɵɵelementStart(0, "p");
            i0.ɵɵtext(1, " ngx-pixel-creator works! ");
            i0.ɵɵelementEnd();
        }
    }, encapsulation: 2 });
(function () {
    (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NgxPixelCreatorComponent, [{
            type: Component,
            args: [{ selector: 'ngx-pixel-creator', template: `
    <p>
      ngx-pixel-creator works!
    </p>
  ` }]
        }], function () { return []; }, null);
})();

class NgxPixelCreatorModule {
}
NgxPixelCreatorModule.ɵfac = function NgxPixelCreatorModule_Factory(t) { return new (t || NgxPixelCreatorModule)(); };
NgxPixelCreatorModule.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: NgxPixelCreatorModule });
NgxPixelCreatorModule.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({});
(function () {
    (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NgxPixelCreatorModule, [{
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
        }], null, null);
})();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(NgxPixelCreatorModule, { declarations: [NgxPixelCreatorComponent], exports: [NgxPixelCreatorComponent] }); })();

/*
 * Public API Surface of ngx-pixel-creator
 */

/**
 * Generated bundle index. Do not edit.
 */

export { NgxPixelCreatorComponent, NgxPixelCreatorModule, NgxPixelCreatorService };
//# sourceMappingURL=tmdjr-ngx-pixel-creator.mjs.map
