export async function triggerRevalidation(tag: string) {
  const res = await fetch(`/revalidate?secret=${process.env.REVALIDATION_SECRET}&tag=${tag}`, {
    method: 'POST',
  })

  if (!res.ok) {
    throw new Error(`Failed to revalidate tag: ${tag}`)
  }

  return res.json()
}
