export default defineEventHandler(async (event) => {
  const index = await useStorage('assets:admin').getItem<string>('index.html')

  if (!index) {
    throw createError({ statusCode: 404, statusMessage: 'Admin build not found' })
  }

  setHeader(event, 'Content-Type', 'text/html; charset=utf-8')
  return index
})
