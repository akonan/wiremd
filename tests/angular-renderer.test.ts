import { describe, expect, it } from 'vitest';
import { render, renderArtifacts, renderToAngular } from '../src/index.js';
import { createFrameworkRendererAst } from './fixtures/render-fixtures.js';

describe('Angular Renderer', () => {
  it('renders split component artifacts with reactive forms by default', () => {
    const result = renderToAngular(createFrameworkRendererAst(), {
      componentName: 'ProfileForm',
    });
    const tsArtifact = result.artifacts.find((artifact) => artifact.filename.endsWith('.ts'));
    const htmlArtifact = result.artifacts.find((artifact) => artifact.filename.endsWith('.html'));
    const cssArtifact = result.artifacts.find((artifact) => artifact.filename.endsWith('.css'));

    expect(result.artifacts).toHaveLength(3);
    expect(tsArtifact?.filename).toBe('profile-form.component.ts');
    expect(tsArtifact?.content).toContain("selector: 'app-profile-form'");
    expect(tsArtifact?.content).toContain('standalone: true,');
    expect(tsArtifact?.content).toContain('imports: [CommonModule, ReactiveFormsModule],');
    expect(tsArtifact?.content).toContain('export class ProfileForm');
    expect(tsArtifact?.content).toContain('@Output() submitted = new EventEmitter<Record<string, unknown>>();');
    expect(tsArtifact?.content).toContain('@Output() buttonClick = new EventEmitter<string>();');
    expect(tsArtifact?.content).toContain('email: this.fb.control(\'\'),');
    expect(tsArtifact?.content).toContain('message: this.fb.control(\'Hello from wiremd\'),');
    expect(tsArtifact?.content).toContain('topic: this.fb.control(\'support\'),');
    expect(tsArtifact?.content).toContain('acceptTerms: this.fb.control(true),');
    expect(tsArtifact?.content).toContain('contactMethod: this.fb.control(\'email\'),');

    expect(htmlArtifact?.content).toContain('<form [formGroup]="form" class="wmd-form" (ngSubmit)="handleSubmit()">');
    expect(htmlArtifact?.content).toContain('[formControl]="form.controls.email"');
    expect(htmlArtifact?.content).toContain('[formControl]="form.controls.message"');
    expect(htmlArtifact?.content).toContain('[formControl]="form.controls.topic"');
    expect(htmlArtifact?.content).toContain('[formControl]="form.controls.acceptTerms"');
    expect(htmlArtifact?.content).toContain('[formControl]="form.controls.contactMethod"');
    expect(htmlArtifact?.content).toContain(`(click)="handleButtonClick('Cancel')"`);
    expect(htmlArtifact?.content).toContain('<nav class="wmd-nav">');
    expect(htmlArtifact?.content).toContain('style="--grid-columns: 2"');
    expect(htmlArtifact?.content).toContain('<table class="wmd-table">');

    expect(cssArtifact?.filename).toBe('profile-form.component.css');
    expect(cssArtifact?.content).toContain('.wmd-root');
  });

  it('supports inline styles and selector overrides through renderArtifacts()', () => {
    const result = renderArtifacts(createFrameworkRendererAst(), {
      format: 'angular',
      rendererOptions: {
        componentName: 'AdminPanel',
        selector: 'admin-panel',
        standalone: false,
        inlineStyles: true,
      },
    });
    const tsArtifact = result.artifacts.find((artifact) => artifact.filename.endsWith('.ts'));
    const htmlArtifact = result.artifacts.find((artifact) => artifact.filename.endsWith('.html'));

    expect(result.artifacts).toHaveLength(2);
    expect(result.artifacts.some((artifact) => artifact.filename.endsWith('.css'))).toBe(false);
    expect(tsArtifact?.filename).toBe('admin-panel.component.ts');
    expect(tsArtifact?.content).toContain("selector: 'admin-panel'");
    expect(tsArtifact?.content).toContain('styles: [`');
    expect(tsArtifact?.content).not.toContain('styleUrls:');
    expect(tsArtifact?.content).not.toContain('standalone: true,');
    expect(tsArtifact?.content).not.toContain('imports: [CommonModule, ReactiveFormsModule],');
    expect(htmlArtifact?.filename).toBe('admin-panel.component.html');
  });

  it('rejects multi-artifact renderers through render()', () => {
    expect(() => {
      render(createFrameworkRendererAst(), {
        format: 'angular',
      });
    }).toThrow(/Use renderArtifacts\(\) instead/);
  });
});
