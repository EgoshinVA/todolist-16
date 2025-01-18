import s from './Page404.module.css'
import { Path } from "common/routing/router"
import { Link } from "react-router"

export const Page404 = () => {
  return (
    <>
      <h1 className={s.title}>404</h1>
      <h2 className={s.subTitle}>page not found</h2>

      <Link to={Path.Main}>На главную</Link>
    </>
  )
}