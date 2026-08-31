<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

/**
 * Shared CTA link for the public Nuxt site.
 *
 * Use this component for button-looking navigation actions built on NuxtLink:
 * header/footer CTAs, section "more" links, and compact in-page CTA links.
 * Do not use it for full-card links or decorative card arrows; those layouts
 * usually need local composition and positioning.
 *
 * Arrow modes:
 * - `badge`: compact arrow in an accent badge, replacing the removed ArrowText.vue.
 * - `mark`: standalone bracket arrow, matching ArrowMark.vue visual language.
 * - `none`: text-only CTA button.
 */
type ButtonLinkArrow = 'badge' | 'mark' | 'none'
type ButtonLinkSize = 'md' | 'header' | 'story'
type ButtonLinkVariant = 'flat' | 'border' | 'invert'

const props = withDefaults(defineProps<{
  to: RouteLocationRaw
  arrow?: ButtonLinkArrow
  size?: ButtonLinkSize
  variant?: ButtonLinkVariant
  desktopOnly?: boolean
  emphasis?: boolean
}>(), {
  arrow: 'badge',
  size: 'md',
  variant: 'border',
  desktopOnly: false,
  emphasis: false,
})

const displayClass = computed(() => props.desktopOnly ? 'hidden lg:inline-flex' : 'inline-flex')

const sizeClasses: Record<ButtonLinkSize, string> = {
  md: 'h-11 text-sm leading-4',
  header: 'h-[38px] text-[13px] leading-4 sm:h-10 sm:text-sm lg:text-base',
  story: 'h-[42px] text-base leading-4',
}

const variantClasses: Record<ButtonLinkVariant, string> = {
  flat: '',
  border: 'border border-accent',
  invert: 'border border-accent duration-200',
}

const weightClass = computed(() => props.emphasis ? 'font-bold tracking-[0.12em]' : 'font-normal tracking-normal')
const horizontalPaddingClass = computed(() => props.size === 'header' ? 'px-3 sm:px-4' : 'px-4')
const contentGapClass = computed(() => props.size === 'story' ? 'gap-3' : 'gap-2')

const buttonClasses = computed(() => [
  displayClass.value,
  'group items-center justify-center bg-accent font-sans uppercase text-text-on-accent no-underline transition-colors hover:bg-surface hover:text-accent focus-visible:bg-surface focus-visible:text-accent',
  sizeClasses[props.size],
  horizontalPaddingClass.value,
  variantClasses[props.variant],
  weightClass.value,
])
</script>

<template>
  <NuxtLink
    :to="to"
    :class="buttonClasses"
  >
    <span
      class="inline-flex h-full items-center justify-center"
      :class="contentGapClass"
    >
      <span class="inline-flex items-center justify-center">
        <slot />
      </span>
      <span
        v-if="arrow === 'badge'"
        aria-hidden="true"
        class="inline-flex h-[17px] w-[30px] shrink-0 items-center justify-center bg-accent text-text-on-accent transition-colors group-hover:bg-surface group-hover:text-accent group-focus-visible:bg-surface group-focus-visible:text-accent"
      >
        <span class="block size-full bg-current [-webkit-mask:url(/images/arrow-right-corner.svg)_center/contain_no-repeat] [mask:url(/images/arrow-right-corner.svg)_center/contain_no-repeat]" />
      </span>
      <span
        v-else-if="arrow === 'mark'"
        aria-hidden="true"
        class="inline-block h-[17px] w-[30px] shrink-0 bg-current [-webkit-mask:url(/images/arrow-right-corner.svg)_center/contain_no-repeat] [mask:url(/images/arrow-right-corner.svg)_center/contain_no-repeat]"
      />
    </span>
  </NuxtLink>
</template>
