import Link from "next/link";
import {Calendar, House, List, SignIn, SignOut, User, X} from "phosphor-react";
import {useState} from "react";
import {signIn, signOut, useSession} from "next-auth/react";

const Header: React.FC<{ title: string }> = ({title}) => {
  const {data: session} = useSession()
  const [open, setOpen] = useState(false)
  return (
    <div className="sticky top-0">
      {open && (
        <div className="min-h-screen">
          <header className="w-full py-5 flex items-center justify-center shadow border-b bg-white px-5">
            <Link href="/">
              <a className="flex-1 font-bold text-xl">Eventos</a>
            </Link>
            <button onClick={() => setOpen(false)} className="w-full flex justify-end">
              <X size={32}/>
            </button>
          </header>
          <nav>
            <ul>
              <li>
                <Link href="/">
                  <a
                    className="bg-white p-4 text-2xl flex items-center gap-2"
                    onClick={() => setOpen(false)}
                  >
                    <House size={24}/>
                    <span>Eventos</span>
                  </a>
                </Link>
              </li>
              {session === null ? (
                <li>
                  <Link href='/api/auth/signin'>
                    <a
                      className="bg-white p-4 text-2xl flex items-center gap-2"
                      onClick={(e) => {
                        e.preventDefault()
                        signIn()
                      }}>
                      <SignIn size={24}/>
                      <span>Entrar</span>
                    </a>
                  </Link>
                </li>
              ) : (
                <>
                  <li className="bg-white p-4 text-2xl flex items-center gap-2">
                    <User size={24}/>
                    <span>{session.user?.name}</span>
                  </li>
                  <li>
                    <Link href="/events">
                      <a className="bg-white p-4 text-2xl flex items-center gap-2"
                         onClick={() => setOpen(false)}
                      >
                        <Calendar size={24}/>
                        <span>Meus eventos</span>
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/api/auth/signout">
                      <a
                        className="bg-white p-4 text-2xl flex items-center gap-2"
                        onClick={(e) => {
                          e.preventDefault()
                          signOut()
                        }}>
                        <SignOut size={24}/>
                        <span>Sair</span>
                      </a>
                    </Link>
                  </li>
                </>
              )
              }
            </ul>
          </nav>
        </div>
      )}
      <header className="w-full py-5 flex items-center justify-center shadow border-b bg-white px-5">
        <div className="flex-1 flex justify-center">
          <span className="font-bold text-xl">{title}</span>
        </div>
        <button type="button" onClick={() => setOpen(true)}>
          <List size={32}/>
        </button>
      </header>
    </div>
  )
}

export default Header
