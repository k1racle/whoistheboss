<script setup lang="ts">
import type { InterviewDetailResponse } from '@features/interviews/model/interview.types'
import { formatRussianDate } from '@shared/lib/date'
import { ROUTES } from '@shared/navigation'
import VideoFrame from '@shared/ui/media/VideoFrame.vue'
import TrustedRichText from '@shared/ui/page/TrustedRichText.vue'

const props = defineProps<InterviewDetailResponse>()

const hasVideo = computed(() => Boolean(props.interview.videoUrl || props.interview.videoFile))
</script>

<template>
 
</template>
