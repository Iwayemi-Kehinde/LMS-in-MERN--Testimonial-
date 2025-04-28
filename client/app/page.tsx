"use client"
import React, {FC, useState} from "react"
import Heading from "./utils/Heading"
import Header from "./components/Header"

interface Props{}

const Page: FC<Props> = () => {
  const [open, setOpen] = React.useState(false)
  const [activeItem, setActiveItem] = React.useState(0)
  return (
   <div>
    <Heading title="Elearning"description="Developed by Iwayemi" keywords="Best e-learning plattform"/>
    <Header open={open} setOpen={setOpen} activeItem={activeItem}/>
   </div>
  )
}

export default Page 