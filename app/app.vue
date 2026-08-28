<script setup lang="ts">
if (!import.meta.dev) {
  useHead({
    script: [
      {
        key: 'yandex-metrika',
        type: 'text/javascript',
        innerHTML: `(function(m,e,t,r,i,k,a){
          m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
        })(window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=112035140','ym');
        ym(112035140,'init',{ssr:true,webvisor:true,clickmap:true,ecommerce:'dataLayer',referrer:document.referrer,url:location.href,accurateTrackBounce:true,trackLinks:true});`,
      },
    ],
    noscript: [
      {
        innerHTML:
          '<div><img src="https://mc.yandex.ru/watch/112035140" style="position:absolute; left:-9999px;" alt="" /></div>',
      },
    ],
  })
}
</script>

<template>
  <NuxtLoadingIndicator color="var(--color-accent)" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
