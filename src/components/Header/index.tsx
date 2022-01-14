import  Link  from 'next/link'
import styles from './header.module.scss'

export default function Header() {
  return (
    <>
      <header className={styles.container}>
        

        <div className={styles.content}>
          <Link href="/">
            <a>
              <div className={styles.logo}>
                <img src="/images/logo.svg" alt="logo" />
                <p>techInovation</p><strong>.</strong>
              </div>
            </a>
          </Link>

        </div>
      </header>
    </>
  )
}
