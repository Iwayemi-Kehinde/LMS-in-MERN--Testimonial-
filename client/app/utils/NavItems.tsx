import Link from "next/link"
import React, { FC } from "react"

type Props = {
  activeItem: number,
  isMobile: boolean
}

const navItemsData = [
  {
    name: "Home",
    url: "/"
  },
  {
    name: "Courses",
    url: "/courses"
  },
  {
    name: "About",
    url: "/about"
  },
  {
    name: "policy",
    url: "/policy"
  },
  {
    name: "FAQ",
    url: "/faq"
  },
]

const NavItems: FC<Props> = (props: Props) => {
  return (
    <div>
      <div className="hidden 800px:flex">
        {
          navItemsData.map((i, index) => (
            <Link href={i.url} key={index} passHref>
              <span className={`${props.activeItem === index ? "dark:text-[#37a39a] text-[crimson]" : "dark:text-white text-black"} text-[18px] px-6 font-[400]`}>{i.name}</span>
            </Link>
          ))
        }
      </div>
      {
        props.isMobile && (
          <div className="800px:hidden mt-5">
            <div className="w-full text-center py-6">
              <Link href={"/"} passHref>
                <span className="text-[25px] font-[500] text-black dark:text-white">E_LEARNING</span>
              </Link>
            </div>
            {
              navItemsData.map((i, index) => (
                <Link href={i.url} key={index}>
                  <a className={`${props.activeItem === index ? "dark:text-[#37a39a] text-[crimson]" : "dark:text-white text-black"} text-[18px] px-6 font-[400]`}>{i.name}</a>
                </Link>
              ))
            }
          </div>
        )
      }
    </div>
  )
}

export default NavItems