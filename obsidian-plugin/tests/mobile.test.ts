import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MobileOptimizer } from '../src/mobile';
import { Platform } from 'obsidian';

describe('MobileOptimizer', () => {
  beforeEach(() => {
    // Reset Platform mock before each test
    Platform.isMobile = false;
    window.innerWidth = 1024;
    window.innerHeight = 768;
  });

  describe('isMobile', () => {
    it('should return false on desktop', () => {
      Platform.isMobile = false;
      expect(MobileOptimizer.isMobile()).toBe(false);
    });

    it('should return true on mobile', () => {
      Platform.isMobile = true;
      expect(MobileOptimizer.isMobile()).toBe(true);
    });
  });

  describe('isTablet', () => {
    it('should return false on desktop', () => {
      Platform.isMobile = false;
      expect(MobileOptimizer.isTablet()).toBe(false);
    });

    it('should return false on phone (width < 768px)', () => {
      Platform.isMobile = true;
      window.innerWidth = 400;
      expect(MobileOptimizer.isTablet()).toBe(false);
    });

    it('should return true on tablet (width >= 768px)', () => {
      Platform.isMobile = true;
      window.innerWidth = 800;
      expect(MobileOptimizer.isTablet()).toBe(true);
    });
  });

  describe('getRenderDelay', () => {
    it('should return base delay on desktop', () => {
      Platform.isMobile = false;
      expect(MobileOptimizer.getRenderDelay(300)).toBe(300);
    });

    it('should increase delay on mobile phone', () => {
      Platform.isMobile = true;
      window.innerWidth = 400;
      const delay = MobileOptimizer.getRenderDelay(300);
      expect(delay).toBeGreaterThan(300);
      expect(delay).toBeLessThanOrEqual(500);
    });

    it('should return base delay on tablet', () => {
      Platform.isMobile = true;
      window.innerWidth = 800;
      expect(MobileOptimizer.getRenderDelay(300)).toBe(300);
    });

    it('should cap delay at 500ms', () => {
      Platform.isMobile = true;
      window.innerWidth = 400;
      expect(MobileOptimizer.getRenderDelay(400)).toBe(500);
    });
  });

  describe('getContainerClass', () => {
    it('should return desktop class on desktop', () => {
      Platform.isMobile = false;
      expect(MobileOptimizer.getContainerClass()).toBe('wiremd-desktop');
    });

    it('should return phone classes on mobile phone', () => {
      Platform.isMobile = true;
      window.innerWidth = 400;
      expect(MobileOptimizer.getContainerClass()).toBe('wiremd-mobile wiremd-phone');
    });

    it('should return tablet classes on tablet', () => {
      Platform.isMobile = true;
      window.innerWidth = 800;
      expect(MobileOptimizer.getContainerClass()).toBe('wiremd-mobile wiremd-tablet');
    });
  });

  describe('getFontSizeMultiplier', () => {
    it('should return 1.0 on desktop', () => {
      Platform.isMobile = false;
      expect(MobileOptimizer.getFontSizeMultiplier()).toBe(1.0);
    });

    it('should return 1.1 on phone', () => {
      Platform.isMobile = true;
      window.innerWidth = 400;
      expect(MobileOptimizer.getFontSizeMultiplier()).toBe(1.1);
    });

    it('should return 1.0 on tablet', () => {
      Platform.isMobile = true;
      window.innerWidth = 800;
      expect(MobileOptimizer.getFontSizeMultiplier()).toBe(1.0);
    });
  });

  describe('hasTouch', () => {
    it('should detect touch support from ontouchstart', () => {
      (window as any).ontouchstart = {};
      expect(MobileOptimizer.hasTouch()).toBe(true);
      delete (window as any).ontouchstart;
    });

    it('should detect touch support from maxTouchPoints', () => {
      navigator.maxTouchPoints = 1;
      expect(MobileOptimizer.hasTouch()).toBe(true);
    });

    it('should return false without touch support', () => {
      delete (window as any).ontouchstart;
      navigator.maxTouchPoints = 0;
      expect(MobileOptimizer.hasTouch()).toBe(false);
    });
  });

  describe('optimizeForMobile', () => {
    it('should not modify element on desktop', () => {
      Platform.isMobile = false;
      const el = document.createElement('div');
      const originalClassList = el.classList.length;

      MobileOptimizer.optimizeForMobile(el as any);

      expect(el.classList.length).toBe(originalClassList);
    });

    it('should add mobile class on mobile', () => {
      Platform.isMobile = true;
      const el = document.createElement('div');
      (el as any).addClass = vi.fn();

      MobileOptimizer.optimizeForMobile(el as any);

      expect((el as any).addClass).toHaveBeenCalledWith('wiremd-mobile-optimized');
    });

    it('should set overflow styles on mobile', () => {
      Platform.isMobile = true;
      const el = document.createElement('div');
      (el as any).addClass = vi.fn();

      MobileOptimizer.optimizeForMobile(el as any);

      expect(el.style.overflowX).toBe('auto');
    });
  });

  describe('addTouchInteractions', () => {
    it('should not add listeners without touch support', () => {
      delete (window as any).ontouchstart;
      navigator.maxTouchPoints = 0;

      const el = document.createElement('div');
      const addEventListenerSpy = vi.spyOn(el, 'addEventListener');

      MobileOptimizer.addTouchInteractions(el as any);

      expect(addEventListenerSpy).not.toHaveBeenCalled();
    });

    it('should add touch event listeners with touch support', () => {
      (window as any).ontouchstart = {};

      const el = document.createElement('div');
      const addEventListenerSpy = vi.spyOn(el, 'addEventListener');

      MobileOptimizer.addTouchInteractions(el as any);

      expect(addEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledWith('touchend', expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledWith('touchcancel', expect.any(Function));

      delete (window as any).ontouchstart;
    });
  });
});
