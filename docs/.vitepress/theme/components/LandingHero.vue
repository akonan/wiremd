<script setup lang="ts"></script>

<template>
  <section class="lp-hero">
    <div class="lp-hero__left">
      <p class="lp-pipeline">Idea → <strong>wiremd</strong> → Claude Design → Code</p>
      <h1 class="lp-hero__headline">The missing layer.</h1>
      <p class="lp-hero__sub">Not a design tool. Not a dev tool. The thing that connects them.</p>
      <p class="lp-hero__body">
        The universal grammar that humans, designers, and AI all speak —
        a markdown DSL your PM writes, your LLM reads, Claude Design consumes, and Claude Code ships.
      </p>
      <div class="lp-hero__ctas">
        <a href="/wiremd/guide/overview.html" class="lp-cta lp-cta--primary">Get Started →</a>
        <a href="/wiremd/editor/" class="lp-cta lp-cta--secondary" target="_blank" rel="noopener">Open Editor</a>
      </div>
    </div>

    <div class="lp-hero__right">
      <svg viewBox="0 0 400 300" class="lp-hub-svg" aria-hidden="true">
        <!-- lines from center box edges to satellite nodes -->
        <line x1="200" y1="118" x2="200" y2="56"  class="lp-hub-line" />
        <line x1="140" y1="150" x2="110" y2="150" class="lp-hub-line" />
        <line x1="260" y1="150" x2="290" y2="150" class="lp-hub-line" />
        <line x1="200" y1="182" x2="200" y2="244" class="lp-hub-line" />

        <!-- Your Idea (top) -->
        <rect x="130" y="20" width="140" height="36" rx="6" class="lp-hub-node" />
        <text x="200" y="43" text-anchor="middle" class="lp-hub-node-text">Your Idea</text>

        <!-- Claude / LLM (left) -->
        <rect x="10"  y="132" width="100" height="36" rx="6" class="lp-hub-node" />
        <text x="60"  y="155" text-anchor="middle" class="lp-hub-node-text">Claude / LLM</text>

        <!-- Claude Design (right) -->
        <rect x="290" y="132" width="100" height="36" rx="6" class="lp-hub-node" />
        <text x="340" y="155" text-anchor="middle" class="lp-hub-node-text">Claude Design</text>

        <!-- Claude Code (bottom) -->
        <rect x="120" y="244" width="160" height="36" rx="6" class="lp-hub-node" />
        <text x="200" y="267" text-anchor="middle" class="lp-hub-node-text">Claude Code</text>

        <!-- wiremd center -->
        <rect x="140" y="118" width="120" height="64" rx="10" class="lp-hub-center" />
        <text x="200" y="146" text-anchor="middle" class="lp-hub-center-name">wiremd</text>
        <text x="200" y="165" text-anchor="middle" class="lp-hub-center-tag">the missing layer</text>
      </svg>
    </div>
  </section>
</template>
