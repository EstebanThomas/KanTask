import '../../styles/globals.css'
import { Inter, Merriweather } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const merriweather = Merriweather({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-merriweather' })

export const metadata = {
  title: "KanTask",
  description: "Project manager with kanban",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`}>
      <body className='bg-bg'>
        {children}
      </body>
    </html>
  );
}
