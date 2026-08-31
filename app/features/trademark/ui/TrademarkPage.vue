<script setup lang="ts">
import type { TrademarkPageData, TrademarkRequestType } from '@features/trademark/model/trademark-page.types'
import ButtonLink from '@shared/ui/buttons/ButtonLink.vue'
import ArrowMark from '@shared/ui/icons/ArrowMark.vue'

const props = defineProps<{ page: TrademarkPageData }>()

const submitting = reactive<Record<TrademarkRequestType, boolean>>({
  LICENSE: false,
  INFRINGEMENT: false,
})
const result = reactive<Record<TrademarkRequestType, { type: 'success' | 'error', text: string } | null>>({
  LICENSE: null,
  INFRINGEMENT: null,
})

async function submitRequest(event: Event, type: TrademarkRequestType) {
  const form = event.currentTarget as HTMLFormElement
  submitting[type] = true
  result[type] = null
  try {
    const body = new FormData(form)
    body.set('type', type)
    const response = await $fetch<{ success: true, requestNumber: string }>('/api/trademark-requests', {
      method: 'POST',
      body,
    })
    result[type] = {
      type: 'success',
      text: type === 'LICENSE'
        ? `${props.page.application.successText} Номер обращения: ${response.requestNumber}.`
        : `Сообщение зарегистрировано под номером ${response.requestNumber}.`,
    }
    form.reset()
  }
  catch {
    result[type] = {
      type: 'error',
      text: 'Не удалось отправить обращение. Проверьте обязательные поля и размер приложенных файлов.',
    }
  }
  finally {
    submitting[type] = false
  }
}

const ruleToneClass = {
  neutral: 'bg-surface text-text',
  accent: 'bg-text text-surface',
  warning: 'bg-accent text-text-on-accent',
} as const
</script>

<template>
  <article class="bg-bg text-text">
    <section class="relative min-h-[calc(100svh-4rem)] overflow-hidden border-b border-border px-4 pb-10 pt-12 sm:px-6 sm:pb-14 lg:px-10 lg:pb-16 lg:pt-16">
      <div class="mx-auto grid min-h-[calc(100svh-10rem)] w-full max-w-[1920px] content-between gap-16">
        <div class="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,32rem)] lg:gap-16">
          <div>
            <p class="font-sans text-sm uppercase leading-4 text-accent sm:text-base">
              {{ page.hero.eyebrow }}
            </p>
            <h1 class="mt-6 whitespace-pre-line font-display text-[clamp(3.25rem,9.6vw,11.5rem)] font-black uppercase leading-[0.78] tracking-[-0.045em] [overflow-wrap:anywhere]">
              {{ page.hero.title }}
            </h1>
          </div>
          <div class="lg:pt-8">
            <p class="whitespace-pre-line font-display text-[clamp(1.75rem,3.3vw,3.5rem)] font-black uppercase leading-[0.86] tracking-[-0.03em]">
              {{ page.hero.subtitle }}
            </p>
            <p class="mt-7 max-w-[48rem] whitespace-pre-line font-sans text-base leading-5 sm:text-lg sm:leading-6">
              {{ page.hero.intro }}
            </p>
          </div>
        </div>

        <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div class="flex flex-wrap gap-3">
            <ButtonLink to="#license-request" variant="flat" arrow="mark">
              {{ page.hero.primaryButton }}
            </ButtonLink>
            <a
              v-if="page.registration.certificateUrl"
              :href="page.registration.certificateUrl"
              target="_blank"
              rel="noopener"
              class="inline-flex h-11 items-center gap-2 border border-text px-4 font-sans text-sm uppercase leading-4 transition-colors hover:border-accent hover:text-accent"
            >
              {{ page.hero.certificateButton }}
              <ArrowMark class="h-[17px] w-[30px]" />
            </a>
            <ButtonLink to="#report-violation" variant="border" arrow="mark">
              {{ page.hero.reportButton }}
            </ButtonLink>
          </div>
          <p aria-hidden="true" class="font-display text-[clamp(4rem,11vw,12rem)] font-black leading-[0.7] tracking-[-0.05em] text-accent">
            1177775
          </p>
        </div>
      </div>
    </section>

    <nav class="sticky top-[64px] z-30 overflow-x-auto border-b border-border bg-bg/95 px-4 backdrop-blur sm:px-6 lg:top-[72px] lg:px-10" aria-label="Разделы страницы">
      <div class="mx-auto flex w-max min-w-full max-w-[1920px] gap-8 py-4 font-sans text-xs uppercase leading-4 sm:text-sm">
        <a href="#passport" class="hover:text-accent">Паспорт</a>
        <a href="#protection" class="hover:text-accent">Объём охраны</a>
        <a href="#rules" class="hover:text-accent">Правила</a>
        <a href="#licensing" class="hover:text-accent">Лицензирование</a>
        <a href="#report-violation" class="hover:text-accent">Нарушения</a>
        <a href="#faq" class="hover:text-accent">FAQ</a>
        <a href="#contacts" class="hover:text-accent">Контакты</a>
      </div>
    </nav>

    <section id="passport" class="scroll-mt-32 px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-28">
      <div class="mx-auto grid w-full max-w-[1920px] gap-10 lg:grid-cols-[minmax(16rem,0.7fr)_minmax(0,1.3fr)] lg:gap-16">
        <div>
          <p class="font-sans text-sm uppercase leading-4 text-accent">01 / Паспорт</p>
          <h2 class="mt-5 font-display text-[clamp(2.75rem,7vw,8rem)] font-black uppercase leading-[0.82] tracking-[-0.04em]">
            {{ page.registration.title }}
          </h2>
        </div>
        <div class="border-t border-text">
          <dl>
            <div v-for="row in page.registration.rows" :key="`${row.label}-${row.value}`" class="grid gap-2 border-b border-border py-4 sm:grid-cols-2 sm:gap-8">
              <dt class="font-sans text-sm uppercase leading-4 text-text-muted">{{ row.label }}</dt>
              <dd class="font-sans text-base leading-5 sm:text-lg">{{ row.value }}</dd>
            </div>
          </dl>
          <div class="mt-8 flex flex-wrap gap-3">
            <a v-if="page.registration.certificateUrl" :href="page.registration.certificateUrl" target="_blank" rel="noopener" class="inline-flex min-h-11 items-center gap-2 bg-accent px-4 font-sans text-sm uppercase text-white hover:bg-text">
              Скачать свидетельство <ArrowMark class="h-[17px] w-[30px]" />
            </a>
            <a v-if="page.registration.appendixUrl" :href="page.registration.appendixUrl" target="_blank" rel="noopener" class="inline-flex min-h-11 items-center gap-2 border border-text px-4 font-sans text-sm uppercase hover:border-accent hover:text-accent">
              Скачать приложение <ArrowMark class="h-[17px] w-[30px]" />
            </a>
          </div>
        </div>
      </div>
    </section>

    <section id="protection" class="scroll-mt-32 bg-surface px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-28">
      <div class="mx-auto w-full max-w-[1920px]">
        <div class="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <p class="font-sans text-sm uppercase leading-4 text-accent">02 / Объём правовой охраны</p>
            <h2 class="mt-5 max-w-[13ch] font-display text-[clamp(2.75rem,7vw,8rem)] font-black uppercase leading-[0.82] tracking-[-0.04em]">
              {{ page.protection.title }}
            </h2>
          </div>
          <p class="max-w-[52rem] whitespace-pre-line font-sans text-base leading-6 sm:text-xl sm:leading-7 lg:pt-8">
            {{ page.protection.intro }}
          </p>
        </div>

        <div class="mt-12 border-t border-text sm:mt-16">
          <details v-for="(item, index) in page.protection.classes" :key="item.number" class="group border-b border-border" :open="index === 0">
            <summary class="grid cursor-pointer list-none items-start gap-4 py-5 marker:hidden sm:grid-cols-[5rem_minmax(0,1fr)_2rem] sm:py-7">
              <span class="font-display text-4xl font-black leading-none text-accent sm:text-5xl">{{ item.number }}</span>
              <span>
                <strong class="block font-display text-[clamp(1.8rem,4vw,4.5rem)] font-black uppercase leading-[0.86] tracking-[-0.035em]">{{ item.title }}</strong>
                <span class="mt-3 block max-w-[75ch] font-sans text-sm leading-5 text-text-muted sm:text-base sm:leading-6">{{ item.summary }}</span>
              </span>
              <span class="text-3xl transition-transform group-open:rotate-45">+</span>
            </summary>
            <div class="pb-8 sm:pl-[6rem] sm:pr-12">
              <p v-if="item.officialText" class="max-w-[110ch] whitespace-pre-line font-sans text-sm leading-5 sm:text-base sm:leading-6">
                {{ item.officialText }}
              </p>
              <p v-else class="font-sans text-sm leading-5 text-text-muted">
                Полный перечень будет опубликован после загрузки официального приложения.
              </p>
            </div>
          </details>
        </div>
          <p class="mt-8 max-w-[100ch] whitespace-pre-line border-l-4 border-accent pl-5 font-sans text-sm leading-5 sm:text-base sm:leading-6">
          {{ page.protection.notice }}
        </p>
      </div>
    </section>

    <section id="rules" class="scroll-mt-32 px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-28">
      <div class="mx-auto w-full max-w-[1920px]">
        <p class="font-sans text-sm uppercase leading-4 text-accent">03 / Правила использования</p>
        <h2 class="mt-5 max-w-[14ch] font-display text-[clamp(3rem,8vw,9rem)] font-black uppercase leading-[0.8] tracking-[-0.045em]">
          Упоминание — не лицензия
        </h2>
        <div class="mt-12 grid gap-4 lg:grid-cols-2 xl:mt-16">
          <section v-for="rule in page.rules" :id="rule.id" :key="rule.id" class="flex min-h-[34rem] flex-col p-5 sm:p-7 lg:p-9" :class="ruleToneClass[rule.tone]">
            <p class="font-sans text-xs uppercase leading-4 opacity-70 sm:text-sm">{{ rule.eyebrow }}</p>
            <h3 class="mt-5 max-w-[18ch] font-display text-[clamp(2.25rem,5vw,5.5rem)] font-black uppercase leading-[0.84] tracking-[-0.035em]">{{ rule.title }}</h3>
            <p class="mt-8 max-w-[70ch] whitespace-pre-line font-sans text-base leading-5 sm:text-lg sm:leading-6">{{ rule.intro }}</p>
            <ul class="mt-7 grid gap-3 font-sans text-sm leading-5 sm:text-base sm:leading-6">
              <li v-for="point in rule.points" :key="point" class="grid grid-cols-[1rem_1fr] gap-2"><span aria-hidden="true">■</span><span>{{ point }}</span></li>
            </ul>
            <p v-if="rule.note" class="mt-auto whitespace-pre-line border-t border-current/30 pt-6 font-sans text-sm font-bold leading-5 sm:text-base">{{ rule.note }}</p>
          </section>
        </div>
      </div>
    </section>

    <section id="licensing" class="scroll-mt-32 bg-text px-4 py-16 text-surface sm:px-6 sm:py-20 lg:px-10 lg:py-28">
      <div class="mx-auto w-full max-w-[1920px]">
        <div class="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p class="font-sans text-sm uppercase leading-4 text-accent">04 / Лицензирование</p>
            <h2 class="mt-5 max-w-[12ch] font-display text-[clamp(3rem,8vw,9rem)] font-black uppercase leading-[0.8] tracking-[-0.045em]">{{ page.licensing.title }}</h2>
          </div>
          <div class="lg:pt-8">
            <p class="max-w-[52rem] whitespace-pre-line font-sans text-base leading-6 sm:text-xl sm:leading-7">{{ page.licensing.intro }}</p>
            <div class="mt-8 flex flex-wrap gap-2">
              <span v-for="point in page.licensing.points" :key="point" class="border border-surface/30 px-3 py-2 font-sans text-xs uppercase leading-4 sm:text-sm">{{ point }}</span>
            </div>
          </div>
        </div>
        <h3 class="mt-20 font-display text-[clamp(2.5rem,6vw,6.5rem)] font-black uppercase leading-[0.84] tracking-[-0.04em]">{{ page.licensing.processTitle }}</h3>
        <ol class="mt-8 border-t border-surface/30">
          <li v-for="step in page.licensing.steps" :key="step.number" class="grid gap-4 border-b border-surface/30 py-6 sm:grid-cols-[5rem_minmax(12rem,0.7fr)_minmax(0,1fr)] sm:gap-8">
            <span class="font-display text-5xl font-black leading-none text-accent">{{ step.number }}</span>
            <strong class="font-display text-3xl font-black uppercase leading-[0.9]">{{ step.title }}</strong>
            <p class="max-w-[70ch] whitespace-pre-line font-sans text-sm leading-5 text-surface/80 sm:text-base sm:leading-6">{{ step.text }}</p>
          </li>
        </ol>
        <p class="mt-8 max-w-[100ch] whitespace-pre-line border-l-4 border-accent pl-5 font-sans text-sm leading-5 sm:text-base sm:leading-6">{{ page.licensing.disclaimer }}</p>
      </div>
    </section>

    <section class="bg-accent px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-10 lg:py-28">
      <div class="mx-auto grid w-full max-w-[1920px] gap-10 lg:grid-cols-2 lg:gap-16">
        <h2 class="max-w-[12ch] font-display text-[clamp(3rem,7vw,8rem)] font-black uppercase leading-[0.8] tracking-[-0.045em]">{{ page.quality.title }}</h2>
        <div>
          <p class="max-w-[60ch] whitespace-pre-line font-sans text-base leading-6 sm:text-xl sm:leading-7">{{ page.quality.text }}</p>
          <ul class="mt-8 grid gap-3 font-sans text-sm leading-5 sm:text-base sm:leading-6">
            <li v-for="point in page.quality.points" :key="point" class="border-t border-white/35 pt-3">{{ point }}</li>
          </ul>
        </div>
      </div>
    </section>

    <section id="license-request" class="scroll-mt-32 px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-28">
      <div class="mx-auto grid w-full max-w-[1920px] gap-12 lg:grid-cols-[minmax(18rem,0.7fr)_minmax(0,1.3fr)] lg:gap-16">
        <div>
          <p class="font-sans text-sm uppercase leading-4 text-accent">05 / Заявка</p>
          <h2 class="mt-5 max-w-[12ch] font-display text-[clamp(3rem,7vw,8rem)] font-black uppercase leading-[0.8] tracking-[-0.045em]">{{ page.application.title }}</h2>
          <p class="mt-8 max-w-[45ch] whitespace-pre-line font-sans text-base leading-6 sm:text-lg">{{ page.application.intro }}</p>
        </div>
        <form class="grid gap-8" enctype="multipart/form-data" @submit="submitRequest($event, 'LICENSE')">
          <fieldset class="grid gap-4 sm:grid-cols-2">
            <legend class="mb-5 font-display text-3xl font-black uppercase">Заявитель и контакт</legend>
            <label class="grid gap-2 font-sans text-sm"><span>Полное наименование или ФИО *</span><input name="applicantName" required maxlength="200" class="min-h-12 border border-border bg-surface px-3"></label>
            <label class="grid gap-2 font-sans text-sm"><span>Организация</span><input name="organization" maxlength="200" class="min-h-12 border border-border bg-surface px-3"></label>
            <label class="grid gap-2 font-sans text-sm"><span>ИНН</span><input name="inn" maxlength="20" class="min-h-12 border border-border bg-surface px-3"></label>
            <label class="grid gap-2 font-sans text-sm"><span>ОГРН / ОГРНИП</span><input name="ogrn" maxlength="20" class="min-h-12 border border-border bg-surface px-3"></label>
            <label class="grid gap-2 font-sans text-sm"><span>Контактное лицо *</span><input name="contactName" required maxlength="160" class="min-h-12 border border-border bg-surface px-3"></label>
            <label class="grid gap-2 font-sans text-sm"><span>Должность</span><input name="position" maxlength="120" class="min-h-12 border border-border bg-surface px-3"></label>
            <label class="grid gap-2 font-sans text-sm"><span>Корпоративная почта *</span><input name="email" type="email" required maxlength="254" class="min-h-12 border border-border bg-surface px-3"></label>
            <label class="grid gap-2 font-sans text-sm"><span>Телефон *</span><input name="phone" type="tel" required maxlength="40" class="min-h-12 border border-border bg-surface px-3"></label>
          </fieldset>

          <fieldset class="grid gap-4 sm:grid-cols-2">
            <legend class="mb-5 font-display text-3xl font-black uppercase">Проект и использование</legend>
            <label class="grid gap-2 font-sans text-sm"><span>Название проекта *</span><input name="projectName" required maxlength="200" class="min-h-12 border border-border bg-surface px-3"></label>
            <label class="grid gap-2 font-sans text-sm"><span>Сайт проекта</span><input name="projectWebsite" type="url" maxlength="500" class="min-h-12 border border-border bg-surface px-3"></label>
            <label class="grid gap-2 font-sans text-sm sm:col-span-2"><span>Описание, цель и аудитория *</span><textarea name="projectDescription" required maxlength="5000" rows="5" class="border border-border bg-surface p-3" /></label>
            <label class="grid gap-2 font-sans text-sm sm:col-span-2"><span>Предполагаемый способ использования *</span><textarea name="useDescription" required maxlength="5000" rows="5" class="border border-border bg-surface p-3" /></label>
            <label class="grid gap-2 font-sans text-sm"><span>Территория</span><input name="territory" maxlength="300" class="min-h-12 border border-border bg-surface px-3"></label>
            <label class="grid gap-2 font-sans text-sm"><span>Предполагаемый срок</span><input name="term" maxlength="200" class="min-h-12 border border-border bg-surface px-3"></label>
            <label class="grid gap-2 font-sans text-sm sm:col-span-2"><span>Домены, аккаунты и рекламные носители</span><textarea name="channels" maxlength="4000" rows="4" class="border border-border bg-surface p-3" /></label>
            <label class="grid gap-2 font-sans text-sm"><span>Использование уже начато?</span><select name="useStarted" class="min-h-12 border border-border bg-surface px-3"><option value="NO">Нет</option><option value="YES">Да</option></select></label>
            <label class="grid gap-2 font-sans text-sm"><span>Дата предполагаемого запуска</span><input name="launchDate" type="date" class="min-h-12 border border-border bg-surface px-3"></label>
          </fieldset>

          <label class="grid gap-2 font-sans text-sm"><span>Презентация и макеты — до 5 файлов PDF, JPG, PNG или WebP</span><input name="files" type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp" multiple class="min-h-12 border border-border bg-surface p-3"></label>
          <input name="websiteUrl" tabindex="-1" autocomplete="off" class="hidden" aria-hidden="true">

          <div class="grid gap-3 border-t border-border pt-6 font-sans text-sm leading-5">
            <label class="flex gap-3"><input type="checkbox" name="truthConfirmed" required class="mt-1 size-4 shrink-0"><span>Подтверждаю достоверность сведений и право действовать от имени заявителя.</span></label>
            <label class="flex gap-3"><input type="checkbox" name="noAutomaticRightConfirmed" required class="mt-1 size-4 shrink-0"><span>Понимаю, что заявка, переписка, переговоры и оплата сами по себе не предоставляют право использования товарного знака.</span></label>
            <label class="flex gap-3"><input type="checkbox" name="noUseBeforeActivationConfirmed" required class="mt-1 size-4 shrink-0"><span>Обязуюсь не начинать лицензионное использование до договора, государственной регистрации и уведомления об активации.</span></label>
            <label class="flex gap-3"><input type="checkbox" name="currentUseDisclosed" required class="mt-1 size-4 shrink-0"><span>Сообщил все известные случаи уже начавшегося использования обозначения.</span></label>
            <label class="flex gap-3"><input type="checkbox" name="privacyConfirmed" required class="mt-1 size-4 shrink-0"><span>Согласен на обработку персональных данных и коммуникацию по заявке.</span></label>
          </div>
          <p v-if="result.LICENSE" class="border-l-4 p-4 font-sans text-sm" :class="result.LICENSE.type === 'success' ? 'border-text bg-surface' : 'border-accent bg-surface text-accent'">{{ result.LICENSE.text }}</p>
          <button type="submit" :disabled="submitting.LICENSE" class="inline-flex min-h-12 w-fit items-center gap-3 bg-accent px-5 font-sans text-sm uppercase text-white transition-colors hover:bg-text disabled:opacity-50">
            {{ submitting.LICENSE ? 'Отправка…' : page.hero.primaryButton }} <ArrowMark class="h-[17px] w-[30px]" />
          </button>
        </form>
      </div>
    </section>

    <section id="report-violation" class="scroll-mt-32 bg-surface px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-28">
      <div class="mx-auto grid w-full max-w-[1920px] gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p class="font-sans text-sm uppercase leading-4 text-accent">06 / Возможное нарушение</p>
          <h2 class="mt-5 max-w-[12ch] font-display text-[clamp(3rem,7vw,8rem)] font-black uppercase leading-[0.8] tracking-[-0.045em]">{{ page.violation.title }}</h2>
          <p class="mt-8 max-w-[52ch] whitespace-pre-line font-sans text-base leading-6 sm:text-lg">{{ page.violation.text }}</p>
          <ul class="mt-8 grid gap-3 font-sans text-sm leading-5 sm:text-base">
            <li v-for="item in page.violation.requirements" :key="item" class="grid grid-cols-[1rem_1fr] gap-2"><span aria-hidden="true" class="text-accent">■</span><span>{{ item }}</span></li>
          </ul>
        </div>
        <form class="grid content-start gap-4" enctype="multipart/form-data" @submit="submitRequest($event, 'INFRINGEMENT')">
          <label class="grid gap-2 font-sans text-sm"><span>Ваше имя *</span><input name="applicantName" required maxlength="200" class="min-h-12 border border-border bg-bg px-3"></label>
          <div class="grid gap-4 sm:grid-cols-2">
            <label class="grid gap-2 font-sans text-sm"><span>Электронная почта *</span><input name="email" type="email" required maxlength="254" class="min-h-12 border border-border bg-bg px-3"></label>
            <label class="grid gap-2 font-sans text-sm"><span>Телефон</span><input name="phone" type="tel" maxlength="40" class="min-h-12 border border-border bg-bg px-3"></label>
          </div>
          <label class="grid gap-2 font-sans text-sm"><span>Ссылка или точный адрес объекта *</span><input name="objectUrl" required maxlength="1000" class="min-h-12 border border-border bg-bg px-3"></label>
          <label class="grid gap-2 font-sans text-sm"><span>Дата и время обнаружения</span><input name="discoveredAt" type="datetime-local" class="min-h-12 border border-border bg-bg px-3"></label>
          <label class="grid gap-2 font-sans text-sm"><span>Описание товаров, услуг и обстоятельств *</span><textarea name="description" required maxlength="6000" rows="7" class="border border-border bg-bg p-3" /></label>
          <label class="grid gap-2 font-sans text-sm"><span>Доказательства — до 5 файлов PDF, JPG, PNG или WebP</span><input name="files" type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp" multiple class="min-h-12 border border-border bg-bg p-3"></label>
          <input name="websiteUrl" tabindex="-1" autocomplete="off" class="hidden" aria-hidden="true">
          <label class="flex gap-3 font-sans text-sm leading-5"><input type="checkbox" name="privacyConfirmed" required class="mt-1 size-4 shrink-0"><span>Согласен на обработку персональных данных и коммуникацию по обращению.</span></label>
          <p class="whitespace-pre-line font-sans text-xs leading-4 text-text-muted">{{ page.violation.disclaimer }}</p>
          <p v-if="result.INFRINGEMENT" class="border-l-4 p-4 font-sans text-sm" :class="result.INFRINGEMENT.type === 'success' ? 'border-text bg-bg' : 'border-accent bg-bg text-accent'">{{ result.INFRINGEMENT.text }}</p>
          <button type="submit" :disabled="submitting.INFRINGEMENT" class="inline-flex min-h-12 w-fit items-center gap-3 bg-text px-5 font-sans text-sm uppercase text-white transition-colors hover:bg-accent disabled:opacity-50">
            {{ submitting.INFRINGEMENT ? 'Отправка…' : page.violation.button }} <ArrowMark class="h-[17px] w-[30px]" />
          </button>
        </form>
      </div>
    </section>

    <section id="faq" class="scroll-mt-32 px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-28">
      <div class="mx-auto w-full max-w-[1920px]">
        <p class="font-sans text-sm uppercase leading-4 text-accent">07 / Вопросы</p>
        <h2 class="mt-5 font-display text-[clamp(3rem,8vw,9rem)] font-black uppercase leading-[0.8] tracking-[-0.045em]">{{ page.faqTitle }}</h2>
        <div class="mt-12 border-t border-text">
          <details v-for="item in page.faqItems" :key="item.question" class="group border-b border-border">
            <summary class="grid cursor-pointer list-none grid-cols-[minmax(0,1fr)_2rem] gap-6 py-5 font-display text-[clamp(1.7rem,4vw,4rem)] font-black uppercase leading-[0.88] marker:hidden sm:py-7">
              <span>{{ item.question }}</span><span class="text-right transition-transform group-open:rotate-45">+</span>
            </summary>
            <p class="max-w-[75ch] whitespace-pre-line pb-7 font-sans text-base leading-6 sm:text-lg sm:leading-7">{{ item.answer }}</p>
          </details>
        </div>
      </div>
    </section>

    <section id="contacts" class="scroll-mt-32 border-t border-border px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-28">
      <div class="mx-auto grid w-full max-w-[1920px] gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p class="font-sans text-sm uppercase leading-4 text-accent">08 / Контакты</p>
          <h2 class="mt-5 max-w-[12ch] font-display text-[clamp(3rem,7vw,8rem)] font-black uppercase leading-[0.8] tracking-[-0.045em]">{{ page.contacts.title }}</h2>
        </div>
        <div class="grid content-start gap-4 border-t border-text pt-5 font-sans text-base leading-6 sm:text-lg">
          <p><span class="text-text-muted">Правообладатель:</span> {{ page.contacts.rightsHolder }}</p>
          <p v-if="page.contacts.ogrn"><span class="text-text-muted">ОГРН:</span> {{ page.contacts.ogrn }}</p>
          <p v-if="page.contacts.inn"><span class="text-text-muted">ИНН:</span> {{ page.contacts.inn }}</p>
          <p><span class="text-text-muted">Юридический адрес:</span> {{ page.contacts.legalAddress }}</p>
          <p v-if="page.contacts.postalAddress"><span class="text-text-muted">Почтовый адрес:</span> {{ page.contacts.postalAddress }}</p>
          <a v-if="page.contacts.licenseEmail" :href="`mailto:${page.contacts.licenseEmail}`" class="hover:text-accent">Заявки: {{ page.contacts.licenseEmail }}</a>
          <a v-if="page.contacts.violationEmail" :href="`mailto:${page.contacts.violationEmail}`" class="hover:text-accent">Нарушения: {{ page.contacts.violationEmail }}</a>
          <a v-if="page.contacts.phone" :href="`tel:${page.contacts.phone.replace(/[^+\d]/g, '')}`" class="hover:text-accent">{{ page.contacts.phone }}</a>
          <p class="mt-6 whitespace-pre-line border-l-4 border-accent pl-5 text-sm leading-5 sm:text-base sm:leading-6">{{ page.contacts.disclaimer }}</p>
          <p class="mt-3 text-xs uppercase leading-4 text-text-muted">Последнее обновление: {{ page.lastUpdated }}</p>
        </div>
      </div>
    </section>
  </article>
</template>
