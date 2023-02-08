import { ChangeDetectionStrategy, Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./pixel-canvas/pixel-canvas.component";
export class NgxPixelCreatorComponent {
    constructor() { }
    ngOnInit() {
    }
}
NgxPixelCreatorComponent.ɵfac = function NgxPixelCreatorComponent_Factory(t) { return new (t || NgxPixelCreatorComponent)(); };
NgxPixelCreatorComponent.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: NgxPixelCreatorComponent, selectors: [["ngx-pixel-creator"]], decls: 2, vars: 0, consts: [[1, "pixel-creator-container"]], template: function NgxPixelCreatorComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelementStart(0, "div", 0);
        i0.ɵɵelement(1, "pixel-canvas");
        i0.ɵɵelementEnd();
    } }, dependencies: [i1.PixelCanvasComponent], styles: [".pixel-grid-canvas-container[_ngcontent-%COMP%]{width:100%;height:100%}"], changeDetection: 0 });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NgxPixelCreatorComponent, [{
        type: Component,
        args: [{ selector: 'ngx-pixel-creator', template: `
  <div class="pixel-creator-container">
    <pixel-canvas></pixel-canvas>
  </div>`, changeDetection: ChangeDetectionStrategy.OnPush, styles: [".pixel-grid-canvas-container{width:100%;height:100%}\n"] }]
    }], function () { return []; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXBpeGVsLWNyZWF0b3IuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LXBpeGVsLWNyZWF0b3Ivc3JjL2xpYi9uZ3gtcGl4ZWwtY3JlYXRvci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFNBQVMsRUFBVSxNQUFNLGVBQWUsQ0FBQzs7O0FBVzNFLE1BQU0sT0FBTyx3QkFBd0I7SUFFbkMsZ0JBQWdCLENBQUM7SUFFakIsUUFBUTtJQUVSLENBQUM7O2dHQU5VLHdCQUF3QjsyRUFBeEIsd0JBQXdCO1FBTm5DLDhCQUFxQztRQUNuQywrQkFBNkI7UUFDL0IsaUJBQU07O3VGQUlLLHdCQUF3QjtjQVRwQyxTQUFTOzJCQUNFLG1CQUFtQixZQUNuQjs7O1NBR0gsbUJBRVUsdUJBQXVCLENBQUMsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtcGl4ZWwtY3JlYXRvcicsXG4gIHRlbXBsYXRlOiBgXG4gIDxkaXYgY2xhc3M9XCJwaXhlbC1jcmVhdG9yLWNvbnRhaW5lclwiPlxuICAgIDxwaXhlbC1jYW52YXM+PC9waXhlbC1jYW52YXM+XG4gIDwvZGl2PmAsXG4gIHN0eWxlczogWycucGl4ZWwtZ3JpZC1jYW52YXMtY29udGFpbmVyIHsgd2lkdGg6IDEwMCU7IGhlaWdodDogMTAwJTsgfSddLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBOZ3hQaXhlbENyZWF0b3JDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIGNvbnN0cnVjdG9yKCkgeyB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG5cbiAgfVxufVxuIl19