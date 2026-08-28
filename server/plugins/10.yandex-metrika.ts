const YANDEX_METRIKA_SCRIPT = `<script type="text/javascript">
    (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=112035140', 'ym');

    ym(112035140, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
</script>`

const YANDEX_METRIKA_NOSCRIPT = '<noscript><div><img src="https://mc.yandex.ru/watch/112035140" style="position:absolute; left:-9999px;" alt="" /></div></noscript>'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html, { event }) => {
    if (process.env.NODE_ENV !== 'production') return

    const path = event.path || '/'
    if (path === '/admin' || path.startsWith('/admin/')) return

    // Keep the official snippet intact in the server response. Rendering it
    // through useHead lets the bundler rewrite it, which can break tag checks.
    html.head.push(YANDEX_METRIKA_SCRIPT)
    html.bodyAppend.push(YANDEX_METRIKA_NOSCRIPT)
  })
})
