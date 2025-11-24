/**
 * Form Components Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { mockFigma } from './setup';
import * as FormComponents from '../src/lib/form-components';
import {
  simpleButtonAST,
  disabledButtonAST,
  inputAST,
  textareaAST,
  selectAST,
  checkboxAST,
  radioAST,
} from './fixtures';

describe('Form Components', () => {
  const mockLoadFont = async (family: string, style: string) => {
    await mockFigma.loadFontAsync({ family, style });
  };

  const mockConvertNode = async (node: any) => {
    return mockFigma.createText();
  };

  beforeEach(() => {
    mockFigma.loadFontAsync.mockResolvedValue(undefined);
  });

  describe('createButton', () => {
    it('should create a button frame with correct layout', async () => {
      const button = await FormComponents.createButton(
        simpleButtonAST,
        'sketch',
        mockLoadFont,
        mockConvertNode
      );

      expect(button.name).toBe('Button');
      expect(button.layoutMode).toBe('HORIZONTAL');
      expect(button.primaryAxisSizingMode).toBe('AUTO');
      expect(button.paddingLeft).toBe(24);
      expect(button.paddingRight).toBe(24);
      expect(mockFigma.createFrame).toHaveBeenCalled();
    });

    it('should apply primary variant styling', async () => {
      const button = await FormComponents.createButton(
        simpleButtonAST,
        'clean',
        mockLoadFont,
        mockConvertNode
      );

      expect(button.fills).toBeDefined();
      expect(button.fills.length).toBeGreaterThan(0);
    });

    it('should apply disabled state styling', async () => {
      const button = await FormComponents.createButton(
        disabledButtonAST,
        'clean',
        mockLoadFont,
        mockConvertNode
      );

      expect(button.fills).toBeDefined();
      // Disabled state should have gray fills
    });

    it('should load appropriate font', async () => {
      await FormComponents.createButton(
        simpleButtonAST,
        'clean',
        mockLoadFont,
        mockConvertNode
      );

      expect(mockFigma.loadFontAsync).toHaveBeenCalledWith({
        family: 'Inter',
        style: 'Regular',
      });
    });

    it('should create text child for button content', async () => {
      const button = await FormComponents.createButton(
        simpleButtonAST,
        'sketch',
        mockLoadFont,
        mockConvertNode
      );

      expect(mockFigma.createText).toHaveBeenCalled();
      expect(button.children.length).toBeGreaterThan(0);
    });
  });

  describe('createInput', () => {
    it('should create an input frame with correct dimensions', async () => {
      const input = await FormComponents.createInput(
        inputAST,
        'clean',
        mockLoadFont
      );

      expect(input.name).toBe('Input');
      expect(input.width).toBe(320);
      expect(input.height).toBe(44);
      expect(input.layoutMode).toBe('HORIZONTAL');
    });

    it('should have border styling', async () => {
      const input = await FormComponents.createInput(
        inputAST,
        'clean',
        mockLoadFont
      );

      expect(input.strokes).toBeDefined();
      expect(input.strokeWeight).toBeGreaterThan(0);
    });

    it('should display placeholder text', async () => {
      const input = await FormComponents.createInput(
        inputAST,
        'clean',
        mockLoadFont
      );

      expect(mockFigma.createText).toHaveBeenCalled();
      expect(input.children.length).toBe(1);
    });

    it('should apply corner radius', async () => {
      const input = await FormComponents.createInput(
        inputAST,
        'clean',
        mockLoadFont
      );

      expect(input.cornerRadius).toBeGreaterThanOrEqual(0);
    });
  });

  describe('createTextarea', () => {
    it('should create textarea with correct height based on rows', async () => {
      const textarea = await FormComponents.createTextarea(
        textareaAST,
        'clean',
        mockLoadFont
      );

      expect(textarea.name).toBe('Textarea');
      expect(textarea.height).toBeGreaterThan(44); // Taller than single input
      expect(textarea.layoutMode).toBe('VERTICAL');
    });

    it('should respect rows prop', async () => {
      const customRows = {
        ...textareaAST,
        props: { ...textareaAST.props, rows: 10 },
      };

      const textarea = await FormComponents.createTextarea(
        customRows,
        'clean',
        mockLoadFont
      );

      // Height should scale with rows
      expect(textarea.height).toBeGreaterThan(100);
    });
  });

  describe('createSelect', () => {
    it('should create select dropdown', async () => {
      const select = await FormComponents.createSelect(
        selectAST,
        'clean',
        mockLoadFont
      );

      expect(select.name).toBe('Select');
      expect(select.layoutMode).toBe('HORIZONTAL');
      expect(select.width).toBe(320);
    });

    it('should display selected option', async () => {
      const select = await FormComponents.createSelect(
        selectAST,
        'clean',
        mockLoadFont
      );

      expect(mockFigma.createText).toHaveBeenCalled();
      expect(select.children.length).toBeGreaterThan(0);
    });

    it('should include dropdown arrow', async () => {
      const select = await FormComponents.createSelect(
        selectAST,
        'clean',
        mockLoadFont
      );

      // Should have text for selected value + arrow
      expect(mockFigma.createText).toHaveBeenCalledTimes(2);
    });
  });

  describe('createCheckbox', () => {
    it('should create checkbox with box and label', async () => {
      const checkbox = await FormComponents.createCheckbox(
        checkboxAST,
        'clean',
        mockLoadFont,
        mockConvertNode
      );

      expect(checkbox.name).toBe('Checkbox');
      expect(checkbox.layoutMode).toBe('HORIZONTAL');
      expect(checkbox.itemSpacing).toBe(8);
    });

    it('should show checkmark when checked', async () => {
      const checkbox = await FormComponents.createCheckbox(
        checkboxAST,
        'clean',
        mockLoadFont,
        mockConvertNode
      );

      expect(mockFigma.createRectangle).toHaveBeenCalled();
      expect(mockFigma.createText).toHaveBeenCalled();
    });

    it('should not show checkmark when unchecked', async () => {
      const unchecked = {
        ...checkboxAST,
        checked: false,
      };

      const checkbox = await FormComponents.createCheckbox(
        unchecked,
        'clean',
        mockLoadFont,
        mockConvertNode
      );

      expect(mockFigma.createRectangle).toHaveBeenCalled();
    });
  });

  describe('createRadio', () => {
    it('should create radio button with circle', async () => {
      const radio = await FormComponents.createRadio(
        radioAST,
        'clean',
        mockLoadFont
      );

      expect(radio.name).toBe('Radio');
      expect(radio.layoutMode).toBe('HORIZONTAL');
      expect(mockFigma.createEllipse).toHaveBeenCalled();
    });

    it('should show inner circle when selected', async () => {
      const radio = await FormComponents.createRadio(
        radioAST,
        'clean',
        mockLoadFont
      );

      // Should create outer circle + inner circle when selected
      expect(mockFigma.createEllipse).toHaveBeenCalledTimes(2);
    });

    it('should only show outer circle when not selected', async () => {
      const unselected = {
        ...radioAST,
        selected: false,
      };

      const radio = await FormComponents.createRadio(
        unselected,
        'clean',
        mockLoadFont
      );

      // Only outer circle
      expect(mockFigma.createEllipse).toHaveBeenCalledTimes(1);
    });
  });

  describe('createRadioGroup', () => {
    it('should create vertical radio group by default', async () => {
      const radioGroup = {
        type: 'radio-group' as const,
        props: {},
        children: [radioAST],
      };

      const group = await FormComponents.createRadioGroup(
        radioGroup,
        'clean',
        mockConvertNode
      );

      expect(group.name).toBe('Radio Group');
      expect(group.layoutMode).toBe('VERTICAL');
    });

    it('should create horizontal radio group when inline', async () => {
      const radioGroup = {
        type: 'radio-group' as const,
        props: { inline: true },
        children: [radioAST],
      };

      const group = await FormComponents.createRadioGroup(
        radioGroup,
        'clean',
        mockConvertNode
      );

      expect(group.layoutMode).toBe('HORIZONTAL');
    });
  });
});
