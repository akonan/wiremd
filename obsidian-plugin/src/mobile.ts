import { Platform } from "obsidian";

export class MobileOptimizer {
	/**
	 * Check if running on mobile platform
	 */
	static isMobile(): boolean {
		return Platform.isMobile;
	}

	/**
	 * Check if running on tablet (mobile but with larger screen)
	 */
	static isTablet(): boolean {
		if (!Platform.isMobile) {
			return false;
		}
		// Simple heuristic: tablets usually have width > 768px
		return window.innerWidth >= 768;
	}

	/**
	 * Get appropriate render delay for platform
	 */
	static getRenderDelay(baseDelay: number): number {
		// On mobile, increase delay slightly to reduce performance impact
		if (this.isMobile() && !this.isTablet()) {
			return Math.min(baseDelay * 1.5, 500);
		}
		return baseDelay;
	}

	/**
	 * Get appropriate container class for platform
	 */
	static getContainerClass(): string {
		if (this.isMobile()) {
			return this.isTablet() ? 'wiremd-mobile wiremd-tablet' : 'wiremd-mobile wiremd-phone';
		}
		return 'wiremd-desktop';
	}

	/**
	 * Optimize preview element for mobile
	 */
	static optimizeForMobile(el: HTMLElement): void {
		if (!this.isMobile()) {
			return;
		}

		// Add mobile-specific classes
		el.addClass('wiremd-mobile-optimized');

		// Enable horizontal scrolling with momentum
		el.style.overflowX = 'auto';
		// @ts-ignore - webkit-specific property
		el.style.webkitOverflowScrolling = 'touch';

		// Adjust for viewport
		const maxWidth = window.innerWidth - 40; // Account for padding
		el.style.maxWidth = `${maxWidth}px`;

		// Make touch targets larger
		const badge = el.querySelector('.wiremd-style-badge');
		if (badge instanceof HTMLElement) {
			badge.style.minHeight = '44px';
			badge.style.minWidth = '44px';
			badge.style.display = 'flex';
			badge.style.alignItems = 'center';
			badge.style.justifyContent = 'center';
		}
	}

	/**
	 * Handle mobile-specific style selector positioning
	 */
	static positionStyleSelector(selector: HTMLElement, container: HTMLElement): void {
		if (!this.isMobile()) {
			return;
		}

		// On mobile, position selector to fit viewport
		const rect = container.getBoundingClientRect();
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;

		// Position below container if there's space, otherwise above
		const spaceBelow = viewportHeight - rect.bottom;
		const spaceAbove = rect.top;

		if (spaceBelow > 300) {
			selector.style.top = `${rect.height + 8}px`;
		} else if (spaceAbove > 300) {
			selector.style.bottom = `${rect.height + 8}px`;
			selector.style.top = 'auto';
		} else {
			// Not enough space, make it full-width at bottom of viewport
			selector.style.position = 'fixed';
			selector.style.bottom = '0';
			selector.style.left = '0';
			selector.style.right = '0';
			selector.style.top = 'auto';
			selector.style.width = '100%';
			selector.style.maxHeight = '50vh';
			selector.style.borderRadius = '12px 12px 0 0';
		}
	}

	/**
	 * Get appropriate font size multiplier for mobile
	 */
	static getFontSizeMultiplier(): number {
		if (!this.isMobile()) {
			return 1.0;
		}

		// On phones, slightly increase font size for readability
		if (!this.isTablet()) {
			return 1.1;
		}

		return 1.0;
	}

	/**
	 * Check if device has touch support
	 */
	static hasTouch(): boolean {
		return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
	}

	/**
	 * Add touch-friendly interactions to element
	 */
	static addTouchInteractions(el: HTMLElement): void {
		if (!this.hasTouch()) {
			return;
		}

		// Add active state on touch
		el.addEventListener('touchstart', () => {
			el.addClass('wiremd-touch-active');
		});

		el.addEventListener('touchend', () => {
			setTimeout(() => {
				el.removeClass('wiremd-touch-active');
			}, 150);
		});

		el.addEventListener('touchcancel', () => {
			el.removeClass('wiremd-touch-active');
		});
	}
}
