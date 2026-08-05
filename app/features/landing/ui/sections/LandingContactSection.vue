<script setup lang="ts">
import LandingContactForm from '@features/landing/ui/contact/LandingContactForm.vue'
import LandingContactText from '@features/landing/ui/contact/LandingContactText.vue'

defineProps<{
  ctaTitle: string
  formTitle: string
  formDescription: string
}>()

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

const form = reactive({ name: '', phone: '' })
const status = shallowRef<FormStatus>('idle')

const canSubmit = computed(
  () => form.name.trim().length >= 2 && form.phone.trim().length >= 5,
)

const onSubmit = async () => {
  if (!canSubmit.value || status.value === 'loading') return

  status.value = 'loading'
  try {
    await $fetch('/api/shooting-request', {
      method: 'POST',
      body: { name: form.name.trim(), phone: form.phone.trim() },
    })
    status.value = 'success'
    form.name = ''
    form.phone = ''
  } catch {
    status.value = 'error'
  }
}
</script>

<template>
  <section
    id="shooting"
    class="relative isolate overflow-hidden bg-accent text-text-on-accent"
  >
    <div class="mx-auto flex min-h-[600px] w-full max-w-[1920px] flex-col justify-between gap-14 px-6 pb-12 pt-7 lg:min-h-[888px] lg:flex-row lg:items-stretch lg:gap-10 lg:px-10 lg:py-10 xl:grid xl:grid-cols-[minmax(0,1fr)_471px] xl:content-stretch xl:items-stretch">
      <LandingContactText
        :cta-title="ctaTitle"
        :form-title="formTitle"
        :form-description="formDescription"
      />

      <LandingContactForm
        v-model:name="form.name"
        v-model:phone="form.phone"
        class="self-stretch"
        :status="status"
        @submit="onSubmit"
      />
    </div>
  </section>
</template>
