"use client"
import React from 'react'

interface Props {}

const Header: React.FC<Props> = () => {
  const [active, setActive] = React.useState(false)
  if(typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if(window.scrollY > 85) {
        setActive(true)
      } else {
        setActive(false)
      }
    })
  }
  return (
    <div className="text-2xl">
      Hi
    </div>
  )
}

export default Header