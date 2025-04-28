"use client"

import Link from "next/link"
import React, { FC } from "react"
import NavItems from "../utils/NavItems"
import { ThemeSwitcher } from "../utils/ThemeSwitcher"
import { MiOutlineMenuAlt3 } from "react-icons/hi"

type Props = {
  open: boolean,
  setOpen: (open: boolean) => void,
  activeItem: number
}

const Header: FC<Props> = (props) => {
  const [active, setActive] = React.useState(false)
  const [openSidebar, setOpenSidebar] = React.useState(false)
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 85) {
        setActive(true)
      } else {
        setActive(false)
      }
    })
  }
  const handleClose = (e:any) => {
    if(e.target.id === "screen") {
      {
        setOpenSidebar(false)
      }
    }
  }
  return (
    <div className="w-full relative">
      <div className={`${active
        ? "bg-white dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffff1c] shadow-xl transition duration-500"
        : "w-full border-b dark:border-[#ffffff1c] h-[80px] z-[80] dark:shadow"
        }`}>
        <div className="w-[95%] 800px:w-[92%] m-auto py-2 h-full">
          <div className="w-full h-[80px]">
            <div className="w-full h-[80px] flex items-center justify-between p-3">
              <div>
                <Link href={"/"} className={`text-[25px] font-[500] text-white`}>
                  E_LEARNING
                </Link>
              </div>
              <div className="flex items-center">
                <NavItems activeItem={props.activeItem} isMobile={false} />
                <ThemeSwitcher />
                <div className="800px:hidden">
                  {/* only for mobile */}
                  <div className="800px:hidden">
                    <MiOutlineMenuAlt3 size={25} className="cursor-pointer dark:text-white text-black" onClick={() => setOpenSidebar(true)} />
                  </div>
                  <MiOutlineUserCircle size={25} className={"cursor-pointer dark:text-white text-black"} onClick={() => props.setOpen(true)}/>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Mobile Navbar */}
        {
          openSidebar && (
            <div className="fixed w-full h-screen top-0 left-0 z-[9999] dark:bg-[unset] bg-[#00000024]" onClick={handleClose} id="screen">
              <div className="w-[70%] fixed z-[9999999] h-screen bg-white dark:bg-slate-900 dark:bg-opacity-90 top-0 right-0">
                <NavItems activeItem={props.activeItem} isMobile={true} />
                <MiOutlineUserCircle size={25} className="cursor-pointer ml-5 my-2 text-black dark:text-white" onClick={() => props.setOpen(true)}/>
              </div> 
              <br />
              <br />
              <p className="text-[16px] px-2 pl-5 text-black dark:text-white">
                Copyright 2025
              </p>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Header 