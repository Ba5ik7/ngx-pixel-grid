# Ngx-Pixel-Grid

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.1.

## Development Setup

Run `npm run start:ngx-pixel-grid` to build the `ngx-pixel-module`. The application will automatically rebuild if you change any of the source files.

Run `npm run build:demo` for a demo of the module on a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

The demo application loads the `ngx-pixel-grid.module.ts` into the `home.module.ts`.

```
  "scripts": {
    "build:demo": "ng build demo --configuration production",
    "build:ngx-pixel-grid": "ng build ngx-pixel-grid --configuration production",
    "publish:ngx-pixel-grid": "cd dist/ngx-pixel-grid && npm publish",
    "start:demo": "ng serve demo --open",
    "start:ngx-pixel-grid": "ng build ngx-pixel-grid --watch --configuration development"
  },
```