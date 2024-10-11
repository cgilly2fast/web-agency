// 'use client'
// import { Domain } from '@/payload-types'
// import { PaginatedDocs } from 'payload'
// import React from 'react'
// import { useState } from 'react'
// import { useEffect } from 'react'
// import { useMemo } from 'react'

// interface LogoProps {
//   logoMap: Record<string, string>
//   darkModeLogoMap: Record<string, string>
// }

// const LogoClient: React.FC<any> = () => {
//   const [hostname, setHostname] = useState<string>('')
//   const [logo, setLogo] = useState<string>('')
//   const [logoMap, setLogoMap] = useState<Record<string, string>>({})
//   const [darkModeLogo, setDarkModeLogo] = useState<string>('')

//   // useEffect(() => {
//   //   setHostname(window.location.hostname)
//   //   console.log(window.location.hostname, logo)
//   // }, [])

//   useMemo(() => {
//     async function getDomainInfo() {
//       const res = await fetch(
//         'http://localhost:3000/api/domains?depth=1&draft=false&locale=undefined&limit=333',
//         {
//           headers: {
//             Authorization: `users API-Key 476165bd-d304-4e5c-b1cb-cde748c5ff7b`,
//           },
//         },
//       )
//       const data = (await res.json()) as PaginatedDocs<Domain>

//       for (let i = 0; i < data.docs.length; i++) {
//         const doc = data.docs[i]!
//         if (doc.logo && typeof doc.logo !== 'string') {
//           const map = { ...logoMap }
//           map[doc.name] = doc?.logo.url!
//           setLogoMap(map)
//           // setDarkModeLogo(doc.logo.url!)
//         }

//         // if (doc.logoDarkMode && typeof doc.logoDarkMode !== 'string') {
//         //   setDarkModeLogo(doc.logoDarkMode.url!)
//         // }
//       }
//     }

//     getDomainInfo()
//   }, [])

//   // useEffect(() => {
//   //   async function getDomainInfo() {
//   //     const res = await fetch(
//   //       'http://localhost:3000/api/domains?depth=1&draft=false&locale=undefined&limit=1&where[name][equals]=firmleads.io',
//   //       {
//   //         headers: {
//   //           Authorization: `users API-Key 476165bd-d304-4e5c-b1cb-cde748c5ff7b`,
//   //         },
//   //       },
//   //     )
//   //     const data = (await res.json()) as PaginatedDocs<Domain>

//   //     const doc = data.docs[0]
//   //     if (!doc) return

//   //     if (doc.logo && typeof doc.logo !== 'string') {
//   //       setLogo(doc.logo.url!)
//   //       setDarkModeLogo(doc.logo.url!)
//   //     }

//   //     if (doc.logoDarkMode && typeof doc.logoDarkMode !== 'string') {
//   //       setDarkModeLogo(doc.logoDarkMode.url!)
//   //     }
//   //   }

//   //   getDomainInfo()
//   // }, [window.location.hostname])

//   console.log(logoMap, darkModeLogo)
//   return (
//     <img
//       style={{
//         maxHeight: '200px',
//         maxWidth: '480px',
//         margin: 'auto',
//         objectFit: 'cover',
//       }}
//       src={'http://localhost:3000'}
//       alt="yas"
//       width={200}
//       height={200}
//     />
//   )
// }

// export default LogoClient

// // Function to trigger revalidation
// // export async function revalidateImageUrls() {
// //   // Trigger server-side revalidation
// //   await fetch('/api/revalidate-image-urls', {
// //     method: 'POST',
// //     headers: {
// //       'Content-Type': 'application/json',
// //     },
// //     body: JSON.stringify({ secret: process.env.REVALIDATION_SECRET }),
// //   })

// //   // Update client-side cache
// //   await mutate('/api/image-urls')
// // }
