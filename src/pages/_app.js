import '@/styles/globals.css'
import '@/styles/event.css'
import '@/styles/calendar.css'

import Layout from '@/components/layout'

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
